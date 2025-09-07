
'use server'

import { db, auth } from './firebaseAdmin';
import type { Product } from '@/app/admin/page';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

// This is a Server Action to get all products
export async function getProducts(): Promise<Product[]> {
    try {
        const productsCol = db.collection('products');
        const productSnapshot = await productsCol.get();
        const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
        return productList;
    } catch (error) {
        console.error('Server Action Error fetching products:', error);
        // In a real app, you'd want more robust error handling here
        // For now, we return an empty array to prevent the client from crashing
        return [];
    }
}


// This is a Server Action to update all products
export async function updateProducts(products: Product[], token: string | null): Promise<{ success: boolean; message: string }> {
    if (!token) {
        return { success: false, message: 'Unauthorized: Missing token' };
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        if (decodedToken.email !== ADMIN_EMAIL) {
            return { success: false, message: 'Forbidden: User is not an admin' };
        }
    } catch (error) {
        console.error("Token verification error:", error);
        return { success: false, message: 'Unauthorized: Invalid or expired token' };
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

        // 2. Add all new documents from the client state
        products.forEach((product) => {
            const { id, name, price, description, category, imageUrl, hint } = product;
             if (!id || !name || typeof price !== 'number') {
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
        
        return { success: true, message: 'Products updated successfully' };

    } catch (error) {
        console.error('Error updating products in Firestore:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, message: `Failed to update products in Firestore: ${errorMessage}` };
    }
}
    