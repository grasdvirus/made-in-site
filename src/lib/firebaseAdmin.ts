
import * as admin from 'firebase-admin';

// Singleton pattern to ensure Firebase Admin is initialized only once.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Use application default credentials if running in Google Cloud environment
      credential: admin.credential.applicationDefault(),
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
    