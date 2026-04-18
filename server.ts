import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config for Database ID
const firebaseConfigPath = path.join(__dirname, 'firebase-applet-config.json');
let firebaseConfig: any = {};
if (fs.existsSync(firebaseConfigPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
}

// Initialize Firebase Admin
let db: any = null;
const CUSTOM_PROJECT_ID = 'company-eb0bf'; // User provided project ID

try {
  let app: admin.app.App;
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: CUSTOM_PROJECT_ID
      });
    } else {
      // Default initialization uses the provisioned project
      app = admin.initializeApp();
    }
  } else {
    app = admin.apps[0]!;
  }
  
  // Use specific database ID if provided in config, otherwise use standard firestore
  db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
    
} catch (error) {
  console.error('Firebase Admin initialization error. For custom projects, ensure FIREBASE_SERVICE_ACCOUNT is set in secrets.', error);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Endpoints
  app.post('/api/contact', async (req, res) => {
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
          createdAt: FieldValue.serverTimestamp()
        });
      }

      // 2. Send Email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"ASRVTech Website" <${process.env.SMTP_USER}>`,
        to: process.env.COMPANY_EMAIL || 'anibeshsingh2@gmail.com',
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

      res.status(200).json({ success: true, message: 'Request submitted successfully' });
    } catch (error) {
      console.error('Submission error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
