
'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

interface Category {
    id: string;
    name: string;
    slug: string;
}
  
export default function ProductsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const categoriesCol = collection(db, 'categories');
                const q = query(categoriesCol, orderBy('name'));
                const categoriesSnapshot = await getDocs(q);
                const categoryList = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Category[];
                setCategories(categoryList);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            Nos Produits
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Parcourez nos collections et trouvez votre style.
          </p>
        </div>
  
        <div className="mt-12">
            {isLoading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : categories.length === 0 ? (
                <p className="text-center text-muted-foreground py-16">Aucune catégorie n'a été configurée.</p>
            ) : (
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                    {categories.map((category) => (
                        <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/3">
                            <Link href={`/products/${category.slug}`}>
                                <div className="p-1">
                                    <Card className="overflow-hidden">
                                        <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                            <Image 
                                                src={`https://picsum.photos/seed/${category.slug}/800/600`} 
                                                alt={category.name} 
                                                fill 
                                                className="object-cover" 
                                                data-ai-hint={`${category.name} fashion`} 
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <span className="text-2xl font-semibold text-white font-headline">{category.name.toUpperCase()}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="block" />
                    <CarouselNext className="block" />
                </Carousel>
            )}
        </div>
      </div>
    );
  }

