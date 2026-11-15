export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, project, company } = req.body || {};

    // Honeypot anti-spam check
    if (company) {
      return res.status(200).json({ success: true, message: 'Message received.' });
    }

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
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Persist inquiry to MongoDB if configured
    if (process.env.MONGODB_URI) {
      try {
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        }
        const Contact =
          mongoose.models.Contact ||
          mongoose.model(
            'Contact',
            new mongoose.Schema(
              {
                name: { type: String, required: true },
                email: { type: String, required: true },
                project: { type: String, required: true },
                ip: { type: String },
                userAgent: { type: String },
              },
              { timestamps: true }
            )
          );

        await Contact.create({
          name: trimmedName,
          email: trimmedEmail,
          project: trimmedProject,
          ip: clientIp,
          userAgent,
        });
      } catch (dbErr) {
        console.warn('MongoDB connection/save warning:', dbErr.message);
      }
    } else {
      console.log('Contact inquiry received (Vercel serverless):', {
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
        const nodemailer = (await import('nodemailer')).default;
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
    console.error('API Contact error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your message.',
    });
  }
}
