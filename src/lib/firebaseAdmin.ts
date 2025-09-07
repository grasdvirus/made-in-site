import * as admin from 'firebase-admin';
import { serviceAccount } from './firebase'; // Importer la configuration centralisée

export function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  // Vérifier que les informations du compte de service sont présentes
  if (
    !serviceAccount.projectId ||
    !serviceAccount.clientEmail ||
    !serviceAccount.privateKey
  ) {
    // Ne pas initialiser si les informations sont manquantes
    console.error("Firebase Admin Initialization Error: Service account details are missing.");
    // Retourner une instance non initialisée pour éviter un plantage complet,
    // mais les appels échoueront avec une erreur claire.
    return admin;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    // Cette erreur est attendue sur le client, où les variables d'env ne sont pas disponibles.
    // Ne pas logger d'erreur si elle est déjà initialisée.
    if (!/already exists/u.test(error.message)) {
      console.error('Firebase Admin Initialization Error:', error.stack);
    }
  }

  return admin;
}
