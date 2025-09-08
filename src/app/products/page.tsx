

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
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/admin/products/page";


interface CategoryWithImage {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    hint: string;
}
  
export default function ProductsPage() {
    const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoriesAndImages = async () => {
            setIsLoading(true);
            try {
                const categoriesCol = collection(db, 'categories');
                const q = query(categoriesCol, orderBy('name'));
                const categoriesSnapshot = await getDocs(q);
                
                const categoryListPromises = categoriesSnapshot.docs.map(async (doc) => {
                    const category = { id: doc.id, ...doc.data() };
                    
                    // Fetch one product from this category to get an image
                    const productsRef = collection(db, 'products');
                    const productQuery = query(productsRef, where('category', '==', category.slug), limit(1));
                    const productSnapshot = await getDocs(productQuery);
                    
                    let imageUrl = `https://picsum.photos/seed/${category.slug}/800/600`;
                    let hint = `${category.name} fashion`;

                    if (!productSnapshot.empty) {
                        const product = productSnapshot.docs[0].data() as Product;
                        imageUrl = product.imageUrl;
                        hint = product.hint || hint;
                    }

                    return {
                        id: category.id,
                        name: category.name as string,
                        slug: category.slug as string,
                        imageUrl,
                        hint,
                    };
                });

                const resolvedCategories = await Promise.all(categoryListPromises);
                setCategoriesWithImages(resolvedCategories);

            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoriesAndImages();
    }, []);

    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-24">
        <div>
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
                    Nos Collections
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Parcourez nos collections phares et trouvez votre style.
                </p>
            </div>
            <div className="mt-12">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : categoriesWithImages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">Aucune catégorie n'a été configurée.</p>
                ) : (
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {categoriesWithImages.map((category) => (
                            <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/3">
                                <Link href={`/products/${category.slug}`}>
                                    <div className="p-1">
                                        <Card className="overflow-hidden">
                                            <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                                <Image 
                                                    src={category.imageUrl} 
                                                    alt={category.name} 
                                                    fill 
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    data-ai-hint={category.hint} 
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

        <div>
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
                    Toutes les Catégories
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Explorez en profondeur et découvrez la perle rare.
                </p>
            </div>
            <div className="mt-12">
                 {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : categoriesWithImages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">Aucune catégorie n'a été configurée.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoriesWithImages.map((category) => (
                            <Card key={category.id} className="group overflow-hidden">
                                <CardContent className="p-0">
                                    <Link href={`/products/${category.slug}`} className="block">
                                        <div className="relative aspect-square">
                                             <Image 
                                                src={category.imageUrl} 
                                                alt={category.name} 
                                                fill 
                                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                                data-ai-hint={category.hint} 
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4 flex justify-between items-center bg-card">
                                        <h3 className="font-headline text-xl font-semibold">{category.name}</h3>
                                        <Button asChild variant="secondary" size="sm">
                                            <Link href={`/products/${category.slug}`}>
                                                Découvrir
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }
