
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { ProductDetailsClient } from "./product-details-client";
import { notFound } from "next/navigation";
import type { Product } from "@/app/admin/page";
import * as admin from 'firebase-admin';

// --- Firebase Admin Initialization ---
if (!admin.apps.length) {
  try {
    const serviceAccount: admin.ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.stack);
  }
}

const db = admin.firestore();

const categoryNames: { [key: string]: string } = {
  femmes: "Femmes",
  hommes: "Hommes",
  montres: "Montres",
  sacs: "Sacs",
  uncategorized: "Non classé"
};


// Server-side data fetching functions
async function getProducts(): Promise<Product[]> {
    const productsCol = db.collection('products');
    const productSnapshot = await productsCol.get();
    return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

async function getProduct(id: string): Promise<Product | null> {
    const docRef = db.collection('products').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
}

async function getProductsByCategory(category: string): Promise<Product[]> {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.where('category', '==', category).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}


// This function fetches data at build time
export async function generateStaticParams() {
    try {
        const products = await getProducts();
        return products.map(product => ({
            category: product.category,
            id: product.id,
        }));
    } catch (error) {
        console.error("Failed to generate static params:", error);
        return [];
    }
}


export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { category, id } = params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }
  
  const relatedProducts = (await getProductsByCategory(category)).filter((p) => p.id !== product.id);
  const categoryName = categoryNames[category] || "Catégorie";

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Produits</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products/${category}`}>
              {categoryName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetailsClient product={product} />

      <div className="mt-24">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Vous pourriez aussi aimer</h2>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
            {relatedProducts.map((relatedProduct) => (
                <CarouselItem key={relatedProduct.id} className="md:basis-1/2 lg:basis-1/4">
                    <Link href={`/products/${relatedProduct.category}/${relatedProduct.id}`}>
                        <Card className="overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image src={relatedProduct.imageUrl} alt={relatedProduct.name} fill className="object-cover w-full h-auto transition-transform group-hover:scale-110" data-ai-hint={relatedProduct.hint} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                                    <p className="text-muted-foreground">{relatedProduct.price.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
    
