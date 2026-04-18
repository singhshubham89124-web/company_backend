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

// Constants
const PORT = process.env.PORT || 8080;
const CUSTOM_PROJECT_ID = 'company-eb0bf';

console.log(`[BOOT] Initializing ASRVTech Server on port ${PORT}...`);

// --- FIREBASE INITIALIZATION ---
let db: any = null;

function initFirebase() {
  try {
    if (admin.apps.length > 0) return;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('[FIREBASE] Using service account from Environment Variables.');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: CUSTOM_PROJECT_ID
      });
    } else {
      console.warn('[FIREBASE] No service account found in ENV. Checking for local file...');
      const localKeyPath = path.join(__dirname, 'backend', 'service-account.json');
      if (fs.existsSync(localKeyPath)) {
        const localKey = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(localKey),
          projectId: CUSTOM_PROJECT_ID
        });
        console.log('[FIREBASE] Initialized from local service-account.json.');
      } else {
        console.error('[FIREBASE] CRITICAL: No service account found. Database writes will fail.');
      }
    }

    if (admin.apps.length > 0) {
      db = getFirestore();
      console.log('[FIREBASE] Firestore client ready.');
    }
  } catch (err) {
    console.error('[FIREBASE] Initialization error:', err);
  }
}

// --- SERVER SETUP ---
async function mountServer() {
  const app = express();
  app.use(express.json());

  // Health and Logging
  app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() }));
  
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });

  // --- API ROUTES ---
  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, address, service, message } = req.body;
    console.log(`[CONTACT] New submission from ${email}`);

    if (!name || !email || !service) {
      return res.status(400).json({ error: 'Name, Email, and Service are required.' });
    }

    try {
      // 1. Database
      if (db) {
        await db.collection('service_requests').add({
          name, email, phone, address, service, message,
          createdAt: FieldValue.serverTimestamp(),
          source: 'NodeJS-Backend'
        });
        console.log('[CONTACT] Data saved to Firestore.');
      }

      // 2. Email
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

        await transporter.sendMail({
          from: `"ASRVTech Support" <${process.env.SMTP_USER}>`,
          to: process.env.COMPANY_EMAIL || 'singhshubham29392@gmail.com',
          subject: `Request: ${service} from ${name}`,
          html: `
            <h2>New Project Signal</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });
        console.log('[CONTACT] Notification email sent.');
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error('[CONTACT] Processing error:', err);
      res.status(500).json({ error: 'Internal system error.' });
    }
  });

  // --- FRONTEND INTEGRATION ---
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    console.log('[SERVER] Development mode: Loading Vite Middleware.');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[SERVER] Production mode: Serving static assets.');
    // When running from dist-server/server.js, the dist folder is one level up
    const distPath = path.resolve(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    } else {
      console.error('[SERVER] CRITICAL: /dist folder missing. Run build first.');
      app.get('*', (req, res) => res.status(500).send('Production build missing. Please check build logs.'));
    }
  }

  // --- LISTEN ---
  app.listen(PORT, () => {
    console.log(`[READY] Server operational at port ${PORT}`);
    initFirebase();
  });
}

mountServer().catch(err => {
  console.error('[FATAL] Server failed to start:', err);
  process.exit(1);
});
