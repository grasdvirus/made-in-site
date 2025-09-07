
'use client';

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
import React, { useState, useEffect } from 'react';
import { ProductDetailsClient } from "./product-details-client";
import { notFound, useParams } from "next/navigation";
import type { Product } from "@/app/admin/page";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const categoryNames: { [key: string]: string } = {
  femmes: "Femmes",
  hommes: "Hommes",
  montres: "Montres",
  sacs: "Sacs",
  uncategorized: "Non classé"
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(fetchedProduct);

          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('category', '==', fetchedProduct.category));
          const snapshot = await getDocs(q);
          const related = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
            .filter(p => p.id !== fetchedProduct.id);
          setRelatedProducts(related);

        } else {
          setProduct(null); 
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  
  if (!product) {
    notFound();
  }
  
  const categoryName = categoryNames[product.category] || "Catégorie";

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
            <BreadcrumbLink href={`/products/${product.category}`}>
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
    
