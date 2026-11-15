import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Contact from './models/Contact.js';

// ============================================================================
// 1. ENVIRONMENT & CONFIGURATION
// ============================================================================
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

// ============================================================================
// 2. DATABASE CONNECTION & RESILIENT FALLBACK
// ============================================================================
let isDbConnected = false;

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    isDbConnected = true;
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn('MongoDB connection warning:', err.message);
    console.warn('Running in database-fallback mode. Submissions will be logged to console.');
  });

mongoose.connection.on('connected', () => { isDbConnected = true; });
mongoose.connection.on('disconnected', () => { isDbConnected = false; });

// ============================================================================
// 3. MIDDLEWARE PIPELINE
// ============================================================================
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Development request logger
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ============================================================================
// 4. REST API ROUTES
// ============================================================================

/**
 * GET /api/health - Service health and database status
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/contact - Project inquiries from ContactModal
 * Features honeypot anti-spam check, sanitization, validation, and offline logging fallback.
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, project, company } = req.body;

    // Honeypot check: silently accept and discard bot submissions
    if (company) {
      return res.status(200).json({ success: true, message: 'Message received.' });
    }

    // Input validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }
    if (!project || typeof project !== 'string' || !project.trim()) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    const trimmedName = name.trim().slice(0, 80);
    const trimmedEmail = email.trim().toLowerCase().slice(0, 120);
    const trimmedProject = project.trim().slice(0, 1500);
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Persist to MongoDB or log to console in fallback mode
    if (isDbConnected) {
      const contactDoc = new Contact({
        name: trimmedName,
        email: trimmedEmail,
        project: trimmedProject,
        ip: clientIp,
        userAgent,
      });
      await contactDoc.save();
    } else {
      console.log('New Contact Submission (DB Offline Fallback):', {
        name: trimmedName,
        email: trimmedEmail,
        project: trimmedProject,
        timestamp: new Date().toISOString(),
      });
    }

    // Email dispatch (supports Resend API key or Nodemailer SMTP)
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'asad.sumon05@gmail.com';
    let emailSent = false;
    const emailUser = process.env.EMAIL_USER || 'asad.sumon05@gmail.com';
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="margin-top: 0; color: #111;">New Project Enquiry</h2>
        <p style="margin: 8px 0;"><strong>Name:</strong> ${trimmedName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="margin: 8px 0; font-weight: bold;">Project Details:</p>
        <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6; color: #333;">${trimmedProject}</div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="font-size: 12px; color: #888; margin-bottom: 0;">Sent from your Portfolio contact modal.</p>
      </div>
    `;

    // 1. Try Resend API if RESEND_API_KEY is provided
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>',
            to: [recipientEmail],
            reply_to: trimmedEmail,
            subject: `New project enquiry from ${trimmedName}`,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
        } else {
          const errData = await resendRes.json().catch(() => ({}));
          console.error('Resend API error:', errData);
        }
      } catch (resendErr) {
        console.error('Failed to dispatch email via Resend:', resendErr);
      }
    }

    // 2. Fallback to Nodemailer if SMTP/EMAIL_PASS is provided
    if (!emailSent && emailPass) {
      try {
        const transporter = nodemailer.createTransport(
          process.env.SMTP_HOST
            ? {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                  user: process.env.SMTP_USER || emailUser,
                  pass: emailPass,
                },
              }
            : {
                service: 'gmail',
                auth: {
                  user: emailUser,
                  pass: emailPass,
                },
              }
        );

        await transporter.sendMail({
          from: `"Portfolio Contact" <${emailUser}>`,
          to: recipientEmail,
          replyTo: `${trimmedName} <${trimmedEmail}>`,
          subject: `New project enquiry from ${trimmedName}`,
          text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\nProject details:\n${trimmedProject}`,
          html: emailHtml,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error('Failed to dispatch email via Nodemailer:', mailErr);
      }
    }

    if (!emailSent && !process.env.RESEND_API_KEY && !emailPass) {
      console.warn('Neither RESEND_API_KEY nor EMAIL_PASS is set. Direct email notification not active.');
    }

    return res.status(201).json({
      success: true,
      emailSent,
      message: `Thank you, ${trimmedName}. Your message has been received!`,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your message.',
    });
  }
});

// ============================================================================
// 5. STATIC ASSETS & CLIENT-SIDE SPA ROUTING
// ============================================================================
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// SPA catch-all fallback: allows /home, /work, /my-story navigation without 404s
app.use((_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('API Server Running. Frontend build in /client/dist.');
    }
  });
});

// ============================================================================
// 6. SERVER INITIALIZATION & PORT RETRY
// ============================================================================
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 MERN Portfolio Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use, retrying on port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
