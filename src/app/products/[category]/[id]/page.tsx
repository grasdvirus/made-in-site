

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
import { notFound, useParams, useRouter } from "next/navigation";
import type { Product } from "@/app/admin/products/page";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState("Catégorie");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id || !categorySlug) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(fetchedProduct);

          // Fetch category name
          const categoriesRef = collection(db, 'categories');
          const catQuery = query(categoriesRef, where('slug', '==', categorySlug));
          const catSnapshot = await getDocs(catQuery);
          if (!catSnapshot.empty) {
              setCategoryName(catSnapshot.docs[0].data().name);
          }

          // Fetch related products
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('category', '==', fetchedProduct.category), where('__name__', '!=', fetchedProduct.id));
          const snapshot = await getDocs(q);
          const related = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product));
            
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
  }, [id, categorySlug]);

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
  

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <Breadcrumb>
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
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>


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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}
