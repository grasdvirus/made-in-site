
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/lib/firebase';

// Cette fonction garantit que Firebase est initialisé une seule fois.
if (!admin.apps.length) {
  try {
    // Utiliser les identifiants du projet pour une initialisation plus robuste
    admin.initializeApp({
      // No credentials provided, relying on Application Default Credentials
      // or other environment configurations for authentication.
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // Lancer une erreur plus spécifique pour faciliter le débogage.
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
