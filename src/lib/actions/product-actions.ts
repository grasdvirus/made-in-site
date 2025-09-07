
'use server'

import * as admin from 'firebase-admin';
import type { Product } from '@/app/admin/page';
import { revalidatePath } from 'next/cache';

// --- Firebase Admin Initialization ---
// This function ensures that Firebase is initialized only once.
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const serviceAccount: admin.ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.stack);
    // Throw an error that the client can understand
    throw new Error('Échec de l\'initialisation du serveur Firebase.');
  }
}

// --- GET Products ---
export async function getProducts(): Promise<{ success: boolean; data?: Product[]; error?: string; }> {
  try {
    initializeFirebaseAdmin();
    const db = admin.firestore();
    const productsCol = db.collection('products');
    const productSnapshot = await productsCol.orderBy('name').get();
    const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
    return { success: true, data: productList };
  } catch (error: any) {
    console.error('Action Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products from Firestore: ' + error.message };
  }
}


// --- POST (Update) Products ---
export async function updateProducts(products: Product[]): Promise<{ success: boolean; message?: string; error?: string; }> {
  try {
      initializeFirebaseAdmin();
      const db = admin.firestore();

      if (!Array.isArray(products)) {
          return { success: false, error: 'Bad Request: "products" must be an array.' };
      }
      
      const batch = db.batch();
      const productsRef = db.collection('products');
      
      // Delete all existing documents
      const snapshot = await productsRef.get();
      if (!snapshot.empty) {
          snapshot.docs.forEach((doc) => {
              batch.delete(doc.ref);
          });
      }
      
      // Add all new documents from the client state
      products.forEach((product: any) => {
          if (!product.id || !product.name) { return; } 
          const docRef = productsRef.doc(product.id);
          const { id, ...productData } = product; 
          batch.set(docRef, productData);
      });
      
      // Commit the batch
      await batch.commit();

      // Revalidate paths to clear cache and show updated data
      revalidatePath('/admin');
      revalidatePath('/products', 'layout');
      
      return { success: true, message: 'Products updated successfully' };

  } catch (error: any) {
      console.error('Action Error updating products:', error);
      return { success: false, error: `Failed to update products in Firestore: ${error.message}` };
  }
}
