// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// Cette variable stocke l'instance de l'application pour éviter les réinitialisations.
let app: admin.app.App;

if (!admin.apps.length) {
  try {
    // Initialise l'application Firebase Admin si elle ne l'est pas déjà.
    // Cette méthode est robuste pour les environnements serverless comme Next.js.
    app = admin.initializeApp({
      // Dans l'environnement Firebase Studio, les credentials sont automatiquement
      // fournis via les variables d'environnement.
      // Vous n'avez pas besoin de configurer un `credential` manuellement.
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'made-in-site',
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
} else {
  // Si l'application est déjà initialisée, récupère l'instance existante.
  app = admin.app();
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
