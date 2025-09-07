
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
 * This is meant to be called from a server-side context (like an API route).
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
