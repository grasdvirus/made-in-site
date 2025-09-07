
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/lib/firebase';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Use the project-specific details from the client config
      // and rely on Application Default Credentials for authentication.
      // This is a more robust way to initialize in various cloud environments.
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
