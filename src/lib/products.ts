
'use server'

import { db } from './firebaseAdmin';

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

    