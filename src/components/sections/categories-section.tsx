
'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/app/admin/products/page';

interface CategorySetting {
    id: string;
    name: string;
    slug: string;
    image: string; // URL de l'image
    hint: string;
    href: string;
}

const CategoryCard = ({ image, name, hint, href }: { image: string, name: string, hint: string, href: string }) => (
    <Link href={href} className="group relative overflow-hidden rounded-xl aspect-[4/5] block">
        <Image src={image} alt={`Catégorie ${name}`} fill className="object-cover transition-transform group-hover:scale-110 duration-500" data-ai-hint={hint} />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <p className="absolute bottom-4 left-4 text-white text-xl font-semibold font-headline">{name}</p>
    </Link>
);

export function CategoriesSection() {
    const [activeCategories, setActiveCategories] = useState<CategorySetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCategories, setTotalCategories] = useState(0);


    useEffect(() => {
        const fetchAndFilterCategories = async () => {
            setIsLoading(true);
            try {
                const categoriesRef = collection(db, 'categories');
                const categoriesSnapshot = await getDocs(query(categoriesRef));
                const allCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setTotalCategories(allCategories.length);

                const filteredCategories: CategorySetting[] = [];

                for (const cat of allCategories) {
                    const productsRef = collection(db, 'products');
                    const q = query(productsRef, where('category', '==', cat.slug), limit(1));
                    const productSnapshot = await getDocs(q);

                    if (!productSnapshot.empty) {
                        const product = productSnapshot.docs[0].data() as Product;
                        filteredCategories.push({
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            image: product.imageUrl || `https://picsum.photos/seed/${cat.slug}/400/500`,
                            hint: product.hint || `${cat.name} fashion`,
                            href: `/products/${cat.slug}`
                        });
                    }
                }
                
                setActiveCategories(filteredCategories);

            } catch (error) {
                console.error("Error fetching categories:", error);
                setActiveCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndFilterCategories();
    }, []);

    const visibleCategories = activeCategories.slice(0, 4);

    return (
        <section className="py-12 px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                <h3 className="text-4xl font-bold font-headline">DÉCOUVREZ<br />NOS CATÉGORIES</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                    <p className="text-muted-foreground max-w-sm">Explorez nos collections, conçues pour vous apporter les dernières tendances et des styles intemporels.</p>
                    <Button asChild variant="outline" className="flex-shrink-0 rounded-full hidden sm:inline-flex">
                         <Link href="/products">
                            {totalCategories > 4 ? `Voir les ${totalCategories} catégories` : 'Toutes les catégories'}
                        </Link>
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : activeCategories.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleCategories.map(cat => <CategoryCard key={cat.id} {...cat} />)}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-16">Aucune catégorie avec des produits à afficher pour le moment.</p>
            )}
           
            <Button asChild variant="outline" className="sm:hidden block mt-6 w-full rounded-full">
                 <Link href="/products">
                    {totalCategories > 4 ? `Voir les ${totalCategories} catégories` : 'Toutes les catégories'}
                </Link>
            </Button>
        </section>
    );
};
