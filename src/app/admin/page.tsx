
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// Hardcoded admin email
const ADMIN_EMAIL = 'grasdvirus@gmail.com';
const DEFAULT_PRODUCT_IMAGE = '/placeholder.svg';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'femmes' | 'hommes' | 'montres' | 'sacs' | 'uncategorized';
    imageUrl: string; 
    hint?: string;
}


export default function AdminPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // States for the "Add/Edit Product" Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/admin/products');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Le serveur a renvoyé une réponse invalide.' }));
            throw new Error(errorData.message || 'Une erreur est survenue lors de la récupération des produits.');
        }
        const data = await response.json();
        setProducts(data);
    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: `Impossible de charger les produits. ${error.message}`,
        });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);


  // Initial data fetch
  useEffect(() => {
    if (!loading) {
        if (!user || user.email !== ADMIN_EMAIL) {
            toast({
                title: 'Accès non autorisé',
                description: "Vous devez être administrateur pour accéder à cette page.",
                variant: 'destructive',
            });
            router.push('/');
        } else {
            fetchProducts();
        }
    }
  }, [user, loading, router, fetchProducts, toast]);
  
  // Re-organize products by category whenever products state changes
  useEffect(() => {
    const byCategory = products.reduce((acc, product) => {
        const category = product.category || 'uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);
    setProductsByCategory(byCategory);
  }, [products]);

  const handleSaveChanges = async () => {
    const token = await getToken();
    if (!token) {
        toast({ variant: "destructive", title: "Erreur", description: "Authentification requise." });
        return;
    }
    
    setIsSaving(true);
    try {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ products })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Une erreur inconnue est survenue.");
        }

        toast({
            title: "Succès",
            description: "Les produits ont été enregistrés avec succès.",
        });
        await fetchProducts(); // Refresh data from server
    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: `Échec de l'enregistrement des produits : ${error.message}`,
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleOpenDialog = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setCurrentProduct({ ...product });
    } else {
      setEditingProduct(null);
      setCurrentProduct({
        id: `prod_${Date.now()}`,
        name: '',
        price: 0,
        description: '',
        category: 'femmes',
        imageUrl: DEFAULT_PRODUCT_IMAGE,
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleDialogInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleCategoryChange = (value: string) => {
    setCurrentProduct(prev => ({...prev, category: value as Product['category']}));
  }


  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec du téléversement');
      }

      const { url } = await response.json();
      setCurrentProduct(prev => ({ ...prev, imageUrl: url }));
      toast({ title: 'Image téléversée avec succès.' });

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erreur de téléversement', description: error.message });
    } finally {
      setIsUploading(false);
    }
  };


  const handleSaveProduct = () => {
    if (!currentProduct.name || !currentProduct.category) {
        toast({ variant: 'destructive', title: 'Champs requis', description: 'Le nom et la catégorie sont obligatoires.' });
        return;
    }

    if (editingProduct) {
      // Update existing product in local state
      setProducts(products.map(p => p.id === editingProduct.id ? (currentProduct as Product) : p));
    } else {
      // Add new product to local state
      setProducts([...products, currentProduct as Product]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: 'Produit supprimé localement.', description: "N'oubliez pas d'enregistrer les modifications." });
  }


  if (loading || (!user && !isLoading)) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Produits</h2>
          <Button onClick={handleSaveChanges} disabled={isSaving || isLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enregistrer les modifications
          </Button>
      </div>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Produits</CardTitle>
              <CardDescription>
                  Ajoutez, modifiez et supprimez les produits de votre boutique.
              </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
          </Button>
          </CardHeader>
          <CardContent className="space-y-4">
              {isLoading ? (
                  <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : Object.keys(productsByCategory).length === 0 ? (
                  <p className="text-muted-foreground text-center p-8">Aucun produit trouvé. Ajoutez votre premier produit !</p>
              ) : (
                  Object.keys(productsByCategory).sort().map((category) => (
                      <div key={category}>
                          <h3 className="text-lg font-semibold my-4 capitalize">{category}</h3>
                          <div className="border rounded-lg">
                            {productsByCategory[category].map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                    <div className="flex items-center gap-4">
                                      <Image 
                                        src={product.imageUrl || DEFAULT_PRODUCT_IMAGE} 
                                        alt={product.name} 
                                        width={40} 
                                        height={40} 
                                        className="rounded-md object-cover bg-muted"
                                      />
                                      <span className="font-medium">{product.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Modifier
                                      </Button>
                                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Supprimer
                                      </Button>
                                    </div>
                                </div>
                            ))}
                          </div>
                      </div>
                  ))
              )}
          </CardContent>
      </Card>
      
      {/* Dialog for Add/Edit Product */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</DialogTitle>
            <DialogDescription>
                Remplissez les détails ci-dessous. Les modifications sont locales jusqu'à ce que vous enregistriez.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Nom</label>
              <Input id="name" name="name" value={currentProduct.name || ''} onChange={handleDialogInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">Prix (FCFA)</label>
              <Input id="price" name="price" type="number" value={currentProduct.price || 0} onChange={handleDialogInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">Catégorie</label>
               <Select name="category" value={currentProduct.category || 'femmes'} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="femmes">Femmes</SelectItem>
                    <SelectItem value="hommes">Hommes</SelectItem>
                    <SelectItem value="montres">Montres</SelectItem>
                    <SelectItem value="sacs">Sacs</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">Description</label>
              <Textarea id="description" name="description" value={currentProduct.description || ''} onChange={handleDialogInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Image</label>
              <div className="col-span-3 flex items-center gap-4">
                <Image src={currentProduct.imageUrl || DEFAULT_PRODUCT_IMAGE} alt="Aperçu" width={64} height={64} className="rounded-md object-cover bg-muted" />
                <Button asChild variant="outline">
                  <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                    { isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Upload className="h-4 w-4 mr-2" /> }
                    Changer
                    <Input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={isUploading}/>
                  </label>
                </Button>
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="hint" className="text-right">Hint (IA)</label>
              <Input id="hint" name="hint" value={currentProduct.hint || ''} onChange={handleDialogInputChange} className="col-span-3" placeholder="Ex: 'red dress'"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveProduct}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
