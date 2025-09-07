// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors in hot-reloading environments
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // In the Firebase Studio environment, credentials are automatically
      // provided via environment variables.
      // You do not need to configure a `credential` manually.
      projectId: process.env.GCLOUD_PROJECT || 'made-in-site',
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
