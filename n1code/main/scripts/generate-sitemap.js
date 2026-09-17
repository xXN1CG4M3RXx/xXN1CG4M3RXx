import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

async function generateSitemap() {
  console.log("Starting Sitemap generation...");
  
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase API key missing in environment. Skipping sitemap generation.");
    process.exit(0);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const buildDate = new Date().toISOString();

  try {
    // 1. Fetch site URL from SEO settings
    const seoDoc = await getDoc(doc(db, "settings", "seo"));
    let siteUrl = seoDoc.exists() && seoDoc.data().siteUrl 
      ? seoDoc.data().siteUrl.trim() 
      : "";

    if (!siteUrl) {
      console.warn("No 'Site URL' defined in SEO settings. Skipping sitemap generation to prevent invalid relative URLs.");
      process.exit(0);
    }
    
    // Ensure siteUrl doesn't end with slash
    siteUrl = siteUrl.replace(/\/$/, '');

    // 2. Fetch individual page update times
    const fetchModTime = async (docId) => {
      try {
        const snap = await getDoc(doc(db, "settings", docId));
        if (snap.exists() && snap.data().updatedAt) {
          return snap.data().updatedAt;
        }
      } catch(e) {
        // Ignore
      }
      return buildDate; // fallback
    };

    const routes = [
      {
        path: '',
        changefreq: 'daily',
        priority: '1.0',
        docRef: 'profile'
      },
      {
        path: '/projects',
        changefreq: 'weekly',
        priority: '0.8',
        docRef: 'projects'
      },
      {
        path: '/skills',
        changefreq: 'monthly',
        priority: '0.7',
        docRef: 'skills'
      },
      {
        path: '/setup',
        changefreq: 'monthly',
        priority: '0.7',
        docRef: 'setup'
      },
      {
        path: '/interests',
        changefreq: 'weekly',
        priority: '0.8',
        docRef: 'interests'
      },
      {
        path: '/contact',
        changefreq: 'yearly',
        priority: '0.5',
        docRef: null
      }
    ];

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const route of routes) {
      const lastmod = route.docRef ? await fetchModTime(route.docRef) : buildDate;
      
      sitemapXml += `  <url>\n`;
      sitemapXml += `    <loc>${siteUrl}${route.path}</loc>\n`;
      sitemapXml += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemapXml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemapXml += `    <priority>${route.priority}</priority>\n`;
      sitemapXml += `  </url>\n`;
    }

    sitemapXml += `</urlset>`;

    // 3. Write to dist folder
    const distPath = path.resolve(__dirname, '../dist');
    if (!fs.existsSync(distPath)) {
      console.error("dist folder not found! Ensure this script runs after 'vite build'.");
      process.exit(1);
    }

    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapXml);
    console.log("Successfully generated sitemap.xml!");
    
  } catch (err) {
    console.error("Error during sitemap generation:", err);
    process.exit(1);
  }
  
  process.exit(0);
}

generateSitemap();
