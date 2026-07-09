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

async function injectSeo() {
  console.log("Starting SEO injection into index.html...");
  
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase API key missing in environment. Skipping SEO injection.");
    process.exit(0);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const docRef = doc(db, "settings", "seo");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const seoData = docSnap.data();
      
      const indexPath = path.resolve(__dirname, '../dist/index.html');
      if (!fs.existsSync(indexPath)) {
        console.error("dist/index.html not found! Ensure this script runs after 'vite build'.");
        process.exit(1);
      }

      let html = fs.readFileSync(indexPath, 'utf-8');
      
      if (seoData.title) {
        html = html.replace(/<title>(.*?)<\/title>/, `<title>${seoData.title}</title>`);
      }
      
      let metaTags = '';
      if (seoData.title) metaTags += `\n    <meta property="og:title" content="${seoData.title}">`;
      if (seoData.description) {
        metaTags += `\n    <meta name="description" content="${seoData.description}">`;
        metaTags += `\n    <meta property="og:description" content="${seoData.description}">`;
      }
      if (seoData.ogImage) {
        metaTags += `\n    <meta property="og:image" content="${seoData.ogImage}">`;
        metaTags += `\n    <meta name="twitter:card" content="summary_large_image">`;
        metaTags += `\n    <meta name="twitter:image" content="${seoData.ogImage}">`;
      }
      if (seoData.themeColor) {
        metaTags += `\n    <meta name="theme-color" content="${seoData.themeColor}">`;
      }

      html = html.replace('<!-- SEO_INJECT -->', metaTags.trim());
      
      fs.writeFileSync(indexPath, html);
      console.log("Successfully injected SEO metadata!");
    } else {
      console.log("No SEO settings found in Firebase. Proceeding with default tags.");
    }
  } catch (err) {
    console.error("Error during SEO injection:", err);
    process.exit(1);
  }
  
  process.exit(0);
}

injectSeo();
