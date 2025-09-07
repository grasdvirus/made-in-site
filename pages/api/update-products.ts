// pages/api/update-products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin'; // Use server-side admin SDK
import { Product } from '@/lib/products';
import { getAuth } from 'firebase-admin/auth';

// Hardcoded admin email
const ADMIN_EMAIL = 'grasdvirus@gmail.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; error?: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // --- Authentication and Authorization ---
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    if (decodedToken.email !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Forbidden: User is not an admin' });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
  // --- End Auth ---

  const { products } = req.body as { products: Product[] };

  if (!Array.isArray(products)) {
    return res.status(400).json({ success: false, error: 'Invalid data format' });
  }

  const batch = db.batch();
  const productsRef = db.collection('products');

  try {
    // 1. Delete all existing documents in the collection
    const snapshot = await productsRef.get();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 2. Add all new documents from the request
    products.forEach((product) => {
      const docRef = productsRef.doc(product.id);
      batch.set(docRef, {
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          imageUrl: product.imageUrl,
          hint: product.hint || ''
      });
    });

    // 3. Commit the batch
    await batch.commit();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ success: false, error: 'Failed to update products in Firestore' });
  }
}
