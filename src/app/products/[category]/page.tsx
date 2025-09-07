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
import React from "react";
import { getProductsByCategory, Product } from "@/lib/products";
import { db } from "@/lib/firebaseAdmin";

const categoryNames: { [key:string]: string } = {
    femmes: "Femmes",
    hommes: "Hommes",
    montres: "Montres",
    sacs: "Sacs",
    uncategorized: "Non classé"
}

// Re-add getProductsByCategory to use the admin SDK for build-time generation
async function getProductsForCategory(category: string): Promise<Product[]> {
    const productsCol = db.collection('products');
    const snapshot = await productsCol.where('category', '==', category).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
}

export async function generateStaticParams() {
    const categories = ['femmes', 'hommes', 'montres', 'sacs'];
    return categories.map(category => ({
        category: category
    }));
}


export default async function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;
    const categoryProducts = await getProductsForCategory(category);
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
                        <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-4xl font-bold tracking-tight font-headline mb-8">{categoryName}</h1>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
                {categoryProducts.map((product) => (
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
        </div>
    )
}
