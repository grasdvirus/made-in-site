
import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/lib/firebase';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

// --- Firebase Admin Initialization ---
// This ensures that Firebase is initialized only once.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must be formatted correctly.
        // In your environment variables, replace all newline characters `\n` with `\\n`.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error in API route:', error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();


// --- The main API handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getProducts(req, res);
  }

  if (req.method === 'POST') {
    return updateProducts(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}


// --- GET Products ---
async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productsCol = db.collection('products');
    const productSnapshot = await productsCol.orderBy('name').get();
    const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    res.status(200).json(productList);
  } catch (error) {
    console.error('API Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products from Firestore' });
  }
}


// --- POST (Update) Products ---
async function updateProducts(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verify Authentication
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }
  const token = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Forbidden: User is not an admin' });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }

  // 2. Perform the update
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ message: 'Bad Request: "products" must be an array.' });
  }
  
  const batch = db.batch();
  const productsRef = db.collection('products');

  try {
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
    
    return res.status(200).json({ message: 'Products updated successfully' });

  } catch (error) {
    console.error('Error updating products in Firestore (API):', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: `Failed to update products in Firestore: ${errorMessage}` });
  }
}
