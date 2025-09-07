// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '@/lib/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = await getProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error('API Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products from database.' });
  }
}
