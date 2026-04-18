import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- STARTING ASRVTECH SERVER ---');

// Initialize Firebase Admin Safely
let db: any = null;
const CUSTOM_PROJECT_ID = 'company-eb0bf';

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('Initializing Firebase with FIREBASE_SERVICE_ACCOUNT env var...');
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: CUSTOM_PROJECT_ID
        });
        console.log('Firebase Admin initialized successfully.');
      } catch (parseError) {
        console.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is valid JSON.', parseError);
      }
    } else {
      console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT not found in environment. Database features will be disabled.');
      // Initialize with default for local dev if file exists
      const saPath = path.join(__dirname, 'backend', 'service-account.json');
      if (fs.existsSync(saPath)) {
          const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
          admin.initializeApp({
            credential: admin.credential.cert(sa),
            projectId: CUSTOM_PROJECT_ID
          });
          console.log('Firebase initialized using local file.');
      }
    }
  }
  
  if (admin.apps.length) {
      db = getFirestore();
  }
} catch (error) {
  console.error('Firebase Admin initialization total failure:', error);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8080; // Standardize for common hosts

  app.use(express.json());

  // Health Check for Railway
  app.get('/health', (req, res) => res.status(200).send('OK'));

  // API Endpoints
  app.post('/api/contact', async (req, res) => {
    console.log('Received contact form request:', req.body.email);
    const { name, email, phone, address, service, message } = req.body;

    if (!name || !email || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // 1. Save to Firestore
      if (db) {
        await db.collection('service_requests').add({
          name,
          email,
          phone,
          address,
          service,
          message,
          createdAt: FieldValue.serverTimestamp(),
          source: 'Node.js Backend'
        });
        console.log('Saved to Firestore.');
      }

      // 2. Send Email
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
    
          const mailOptions = {
            from: `"ASRVTech Website" <${process.env.SMTP_USER}>`,
            to: process.env.COMPANY_EMAIL || 'singhshubham29392@gmail.com',
            subject: `New Service Request from ${name}`,
            html: `
              <h3>New Service Request</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Address:</strong> ${address || 'N/A'}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Message:</strong> ${message || 'No message provided'}</p>
            `,
          };
    
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully.');
      } else {
          console.warn('SMTP credentials missing. Email skipped.');
      }

      res.status(200).json({ success: true, message: 'Request submitted successfully' });
    } catch (error) {
      console.error('Submission error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Decide Production vs Development logic
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    console.log('Running in DEVELOPMENT mode with Vite Middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running in PRODUCTION mode. Serving static files from /dist...');
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.error('CRITICAL ERROR: /dist folder not found! Make sure "npm run build" finished successfully.');
        app.get('*', (req, res) => res.status(500).send('Production folder (dist) not found. Check build logs.'));
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- SERVER READY ON PORT ${PORT} ---`);
    console.log(`URL: http://asrvtech.up.railway.app (or localhost:${PORT})`);
  });
}

startServer().catch(err => {
    console.error('FAILED TO START SERVER:', err);
    process.exit(1);
});
