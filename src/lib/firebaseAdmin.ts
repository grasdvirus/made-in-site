
import * as admin from 'firebase-admin';

// This function ensures Firebase is initialized only once.
if (!admin.apps.length) {
  try {
    // In Google Cloud environments (like App Hosting), the credentials are automatically discovered.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.GCLOUD_PROJECT || 'made-in-site',
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // Throw a more specific error to make debugging easier.
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
