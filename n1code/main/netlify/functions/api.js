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

    const { data, error: resendError } = await resend.emails.send({
      from: 'Contact Form <no-reply@n1code.dev>',
      to: 'inbox@n1code.dev',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      reply_to: email,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return res.status(500).json({ error: resendError.message || JSON.stringify(resendError) });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Resend exception:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
});

// 3. Reply endpoint (Used by Admin Panel Inbox)
router.post('/reply', async (req, res) => {
  try {
    const { toEmail, subject, message } = req.body;
    
    if (!toEmail || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error: resendError } = await resend.emails.send({
      from: 'info@n1code.dev', // User explicitly requested info@n1code.dev for replies
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

// 4. Steam API proxy endpoint
router.get('/steam', async (req, res) => {
  try {
    const { steamId } = req.query;
    if (!steamId) {
      return res.status(400).json({ error: "Missing steamId" });
    }

    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "STEAM_API_KEY not configured" });
    }

    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data.response.games || []);
  } catch (error) {
    console.error("Steam API proxy error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch Steam data" });
  }
});

// Prefix configurations for local dev server redirects and Netlify functions routing
app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

export const handler = serverless(app);
