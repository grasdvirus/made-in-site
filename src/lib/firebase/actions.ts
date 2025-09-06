'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  hint: z.string().optional(),
});

export type State = {
  errors?: {
    name?: string[];
    price?: string[];
    description?: string[];
    category?: string[];
    image?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function addProduct(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    description: formData.get('description'),
    category: formData.get('category'),
    hint: formData.get('hint'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides.',
    };
  }

  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return {
        errors: { image: ['Une image est requise.'] },
        message: 'Une image est requise.'
    };
  }

  try {
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Add product to Firestore
    await addDoc(collection(db, 'products'), {
      ...validatedFields.data,
      imageUrl,
      hint: validatedFields.data.hint || validatedFields.data.name.toLowerCase().split(' ').slice(0, 2).join(' '),
    });

    // Revalidate paths to show the new product
    revalidatePath('/admin');
    revalidatePath(`/products/${validatedFields.data.category}`);
    revalidatePath('/products');
    
    return { message: 'Produit ajouté avec succès !' };
  } catch (e: any) {
    console.error('Error adding product:', e);
    return { 
        errors: { server: [e.message] },
        message: "Erreur du serveur : impossible d'ajouter le produit." 
    };
  }
}
