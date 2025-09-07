// @/lib/products.ts

import { db } from './firebaseAdmin'; // Use admin SDK on server-side
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

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
 * This function is intended for server-side API routes.
 */
export async function getProducts(): Promise<Product[]> {
    const productsCol = db.collection('products');
    const productSnapshot = await productsCol.get();
    const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
    return productList;
}

/**
 * Fetches a single product by its ID from Firestore using the Admin SDK.
 * This function is intended for server-side API routes.
 * @param id The ID of the product to fetch.
 */
export async function getProduct(id: string): Promise<Product | null> {
    const docRef = db.collection('products').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
        return null;
    }
}


/**
 * Fetches all products for a specific category from Firestore.
 * This function reads all products and then filters, suitable for server-side rendering.
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    // For server components, we fetch all and filter.
    // This avoids complex queries and leverages caching if all products are fetched once.
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const allProducts = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
    
    return allProducts.filter(p => p.category === category);
}