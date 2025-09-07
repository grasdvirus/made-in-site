// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// This is a server-side only file.

// **IMPORTANT**: This configuration relies on Application Default Credentials (ADC).
// In Firebase Studio's environment, these credentials are automatically provided.
// You do NOT need to download a service account key file.

const firebaseAdminConfig = {
  // projectId is automatically inferred from the environment
};

if (!admin.apps.length) {
    try {
        admin.initializeApp(firebaseAdminConfig);
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}


const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
