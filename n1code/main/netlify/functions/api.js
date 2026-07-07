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
    message: "Netlify serverless API is fully active!",
    timestamp: new Date().toISOString()
  });
});

// 2. Contact form endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Resend sandbox default
      to: ['delivered@resend.dev'], // Send to sandbox inbox or user's email if verified
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Prefix configurations for local dev server redirects and Netlify functions routing
app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

export const handler = serverless(app);
