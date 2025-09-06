
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Star, Truck, ImageIcon, LayoutGrid, Info, MessageSquare, Settings, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProducts, Product } from '@/lib/products'; // Changement ici

// Hardcoded admin email
const ADMIN_EMAIL = 'grasdvirus@gmail.com';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  
  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Les produits sont maintenant chargés localement
    const allProducts = getProducts();
    setProducts(allProducts);

    const byCategory = allProducts.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);
    setProductsByCategory(byCategory);
  }, []);


  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement...</p>
      </div>
    );
  }
  
  if (user.email !== ADMIN_EMAIL) {
    // Or a redirect, this prevents a flash of content.
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
            <TabsTrigger value="products"><Tag className="mr-2 h-4 w-4" />Produits</TabsTrigger>
            <TabsTrigger value="reviews"><Star className="mr-2 h-4 w-4" />Avis</TabsTrigger>
            <TabsTrigger value="orders"><Truck className="mr-2 h-4 w-4" />Commandes</TabsTrigger>
            <TabsTrigger value="slides"><ImageIcon className="mr-2 h-4 w-4" />Diapositives</TabsTrigger>
            <TabsTrigger value="bento"><LayoutGrid className="mr-2 h-4 w-4" />Bento Grid</TabsTrigger>
            <TabsTrigger value="collections"><LayoutGrid className="mr-2 h-4 w-4" />Collections</TabsTrigger>
            <TabsTrigger value="infos"><Info className="mr-2 h-4 w-4" />Infos</TabsTrigger>
            <TabsTrigger value="banner"><Info className="mr-2 h-4 w-4" />Bandeau</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="mr-2 h-4 w-4" />Messages</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Paramètres</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Gestion des Produits</CardTitle>
                    <CardDescription>
                        Modifiez les produits directement dans le fichier `/src/lib/products.ts`.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" disabled>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nouvelle Catégorie
                    </Button>
                    <Button disabled>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un produit
                    </Button>
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.keys(productsByCategory).length === 0 ? (
                        <p className="text-muted-foreground text-center p-8">Aucun produit trouvé dans /src/lib/products.ts.</p>
                    ) : (
                        Object.keys(productsByCategory).map((category) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold my-4 capitalize">{category}</h3>
                                {productsByCategory[category].map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                                        <span className="font-medium">{product.name}</span>
                                        <Button variant="ghost" size="icon" disabled>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="reviews">
            <p className="text-muted-foreground p-4">La gestion des avis sera bientôt disponible ici.</p>
        </TabsContent>
        <TabsContent value="orders">
            <p className="text-muted-foreground p-4">La gestion des commandes sera bientôt disponible ici.</p>
        </TabsContent>
        {/* Add other tab contents here */}
      </Tabs>
    </div>
  );
}
