
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/app/admin/products/page';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface DiscoverProduct {
    id: string;
    name: string;
    image: string;
    hint: string;
    href: string;
    width: number;
    height: number;
}

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

export default function DiscoverPage() {
  const [discoverProducts, setDiscoverProducts] = useState<DiscoverProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const productsRef = collection(db, 'products');
            const productSnapshot = await getDocs(query(productsRef));
            const allProducts = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            
            const shuffledProducts = shuffleArray(allProducts);

            const productList = shuffledProducts.map(product => {
                const height = Math.floor(Math.random() * (600 - 400 + 1) + 400);
                return {
                    id: product.id,
                    name: product.name,
                    image: product.imageUrl,
                    hint: product.hint || "fashion product",
                    href: `/products/${product.category}/${product.id}`,
                    width: 400,
                    height: height
                };
            });

            setDiscoverProducts(productList);
        } catch (error) {
            console.error("Error fetching products for discover page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Découvrez nos styles
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Inspirez-vous de notre collection. Une nouvelle sélection à chaque visite.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
                {discoverProducts.map((product) => (
                    <Link href={product.href} key={product.id}>
                        <Card className="overflow-hidden group break-inside-avoid">
                            <CardContent className="p-0">
                                <div className="relative overflow-hidden">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        width={product.width} 
                                        height={product.height} 
                                        className="object-cover w-full h-auto transition-transform group-hover:scale-110" 
                                        data-ai-hint={product.hint} 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
