import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
dotenv.config();

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

// Prefix configurations for local dev server redirects and Netlify functions routing
app.use('/.netlify/functions/api', router);
app.use('/api', router);
app.use('/', router);

export const handler = serverless(app);
