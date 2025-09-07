// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin'; // Utilise l'instance Admin SDK corrigée
import type { Product } from '@/lib/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const productsCol = db.collection('products');
    const productSnapshot = await productsCol.get();
    const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
    
    return res.status(200).json(productList);
  } catch (error) {
    console.error('API Error fetching products:', error);
    // Fournit une erreur plus détaillée en développement
    return res.status(500).json({ 
        error: 'Failed to fetch products from database.',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
