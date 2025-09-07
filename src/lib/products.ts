
'use server'

import { db } from './firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'femmes' | 'hommes' | 'montres' | 'sacs' | 'uncategorized';
    imageUrl: string; 
    hint?: string;
    width?: number;
    height?: number;
}

/**
 * Fetches all products directly from Firestore using the Admin SDK.
 * This is a server action.
 */
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
        console.error("Error in getProducts:", error);
        // In a real app, you might want to handle this more gracefully
        throw new Error("Failed to fetch products from database.");
    }
}

/**
 * Fetches a single product by its ID from Firestore using the Admin SDK.
 * This function is intended for server-side rendering.
 * @param id The ID of the product to fetch.
 */
export async function getProduct(id: string): Promise<Product | null> {
    try {
        const docRef = db.collection('products').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error in getProduct(${id}):`, error);
        return null;
    }
}


/**
 * Fetches all products for a specific category from Firestore using the Admin SDK.
 * This function is used for server-side rendering of category pages.
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.where('category', '==', category).get();
        
        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch(error) {
        console.error(`Error in getProductsByCategory(${category}):`, error);
        return [];
    }
}

/**
 * Replaces all products in the database with a new list.
 * This is a server action protected for admin use.
 */
export async function updateProducts(products: Product[], idToken: string) {
    // --- Authentication and Authorization ---
    if (!idToken) {
        throw new Error('Unauthorized: No token provided');
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        if (decodedToken.email !== ADMIN_EMAIL) {
        throw new Error('Forbidden: User is not an admin');
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error('Unauthorized: Invalid token');
    }
    // --- End Auth ---

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

    } catch (error) {
        console.error('Error updating products:', error);
        throw new Error('Failed to update products in Firestore');
    }
}
