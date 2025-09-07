
import * as admin from 'firebase-admin';

// Check if the environment variable for service account is set
if (!process.env.SERVICE_ACCOUNT) {
  // In a local or non-Google environment, you might use a JSON file.
  // In Google Cloud environments (like App Hosting), the credentials are automatically discovered.
  // This log helps diagnose if the credential source is the issue.
  console.log("SERVICE_ACCOUNT environment variable not set. Relying on Application Default Credentials.");
}

// This function ensures Firebase is initialized only once.
function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  try {
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

  return admin;
}

// Export the function that provides the initialized admin instance.
export const adminInstance = getFirebaseAdmin();
export const db = adminInstance.firestore();
export const auth = adminInstance.auth();
export const storage = adminInstance.storage();
