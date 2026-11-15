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

    // If MongoDB URI is configured in Vercel environment variables, persist it
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

    return res.status(201).json({
      success: true,
      message: `Thank you, ${trimmedName}. Your message has been received!`,
    });
  } catch (error) {
    console.error('API Contact error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your message.',
    });
  }
}
