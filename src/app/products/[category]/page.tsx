
'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/app/admin/products/page";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";


export default function CategoryPage() {
    const params = useParams();
    const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState("Catégorie");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categorySlug) return;
            setIsLoading(true);
            try {
                // Fetch category name
                const categoriesRef = collection(db, 'categories');
                const catQuery = query(categoriesRef, where('slug', '==', categorySlug));
                const catSnapshot = await getDocs(catQuery);
                if (!catSnapshot.empty) {
                    setCategoryName(catSnapshot.docs[0].data().name);
                }

                // Fetch products
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where('category', '==', categorySlug));
                const snapshot = await getDocs(q);
                
                if (snapshot.empty) {
                    setProducts([]);
                } else {
                    const productList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Product[];
                    setProducts(productList);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categorySlug]);


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
                        <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-4xl font-bold tracking-tight font-headline mb-8">{categoryName}</h1>

            {isLoading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <p className="text-center text-muted-foreground py-16">Aucun produit trouvé dans cette catégorie.</p>
            ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
                    {products.map((product) => (
                         <Link key={product.id} href={`/products/${product.category}/${product.id}`} className="block">
                            <Card className="overflow-hidden group break-inside-avoid">
                                <CardContent className="p-0">
                                    <div className="relative overflow-hidden aspect-[4/5]">
                                        <Image 
                                          src={product.imageUrl} 
                                          alt={product.name}
                                          fill
                                          className="object-cover w-full h-auto transition-transform group-hover:scale-110" 
                                          data-ai-hint={product.hint || ''} 
                                        />
                                    </div>
                                    <div className="p-4 bg-background/50">
                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                        <p className="text-muted-foreground">{product.price.toLocaleString('fr-FR')} FCFA</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
    
