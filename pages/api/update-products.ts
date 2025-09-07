
// pages/api/update-products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db, auth } from '@/lib/firebaseAdmin';
import type { Product } from '@/app/admin/page';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authorization.split('Bearer ')[1];
    
    try {
        const decodedToken = await auth.verifyIdToken(token);
        if (decodedToken.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Forbidden: User is not an admin' });
        }
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    const { products } = req.body as { products: Product[] };

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Bad Request: products must be an array.' });
    }

    const batch = db.batch();
    const productsRef = db.collection('products');

    try {
        // 1. Delete all existing documents
        const snapshot = await productsRef.get();
        if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
        }

        // 2. Add all new documents
        products.forEach((product) => {
            // Ensure product has all necessary fields and correct types
            const { id, name, price, description, category, imageUrl, hint } = product;
            if (!id || !name || typeof price !== 'number') {
                // Skip invalid product data
                console.warn('Skipping invalid product data:', product);
                return;
            }
            const docRef = productsRef.doc(product.id);
            batch.set(docRef, {
                name: name || '',
                price: price || 0,
                description: description || '',
                category: category || 'uncategorized',
                imageUrl: imageUrl || '',
                hint: hint || ''
            });
        });

        // 3. Commit the batch
        await batch.commit();
        
        return res.status(200).json({ message: 'Products updated successfully' });

    } catch (error) {
        console.error('Error updating products in Firestore:', error);
        return res.status(500).json({ error: 'Failed to update products in Firestore' });
    }
}

    