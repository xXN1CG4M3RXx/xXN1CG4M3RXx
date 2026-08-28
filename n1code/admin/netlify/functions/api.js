import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// 1. Health-check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Admin Netlify serverless API is fully active!",
    timestamp: new Date().toISOString()
  });
});

// 2. Reply endpoint (Used by Admin Panel Inbox)
router.post('/reply', async (req, res) => {
  try {
    const { toEmail, subject, message } = req.body;
    
    if (!toEmail || !message) {
      return res.status(400).json({ error: "Missing required fields (toEmail, message)" });
    }

    // Validate email format and prevent multiple emails (comma separated)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    // Basic authorization check (e.g. check for a secret token set in Netlify env)
    const authHeader = req.headers.authorization;
    if (process.env.API_SECRET && authHeader !== `Bearer ${process.env.API_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "RESEND_API_KEY is not configured in Netlify environment variables" });
    }

    const { data, error: resendError } = await resend.emails.send({
      from: 'info@n1code.dev',
      to: toEmail,
      subject: subject || "Reply to your inquiry",
      text: message,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return res.status(500).json({ error: resendError.message || JSON.stringify(resendError) });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Resend reply exception:", error);
    res.status(500).json({ error: error.message || "Failed to send reply email" });
  }
});

// Prefix configurations for local dev server redirects and Netlify functions routing
app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

export const handler = serverless(app);
