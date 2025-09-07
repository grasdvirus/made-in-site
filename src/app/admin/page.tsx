
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
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';


// Hardcoded admin email
const ADMIN_EMAIL = 'grasdvirus@gmail.com';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x500/EFEFEF/333333?text=Image';

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // States for the "Add/Edit Product" Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
        const productsCol = collection(db, 'products');
        const q = query(productsCol, orderBy('name'));
        const productSnapshot = await getDocs(q);
        const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
        setProducts(productList);
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
    if (!currentProduct || !currentProduct.id || !currentProduct.name || !currentProduct.category) {
        toast({ variant: 'destructive', title: 'Champs requis', description: 'Le nom et la catégorie sont obligatoires.' });
        return;
    }

    setIsSaving(true);
    try {
        const productData = {
            name: currentProduct.name,
            price: currentProduct.price || 0,
            description: currentProduct.description || '',
            category: currentProduct.category,
            imageUrl: currentProduct.imageUrl || DEFAULT_PRODUCT_IMAGE,
            hint: currentProduct.hint || '',
        };

        const docRef = doc(db, 'products', currentProduct.id);
        await setDoc(docRef, productData, { merge: true });

        toast({
            title: "Succès",
            description: `Le produit "${productData.name}" a été enregistré.`,
        });

        await fetchProducts(); // Refresh data from server
        setIsDialogOpen(false); // Close dialog on success

    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: `Échec de l'enregistrement du produit : ${error.message}`,
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


  const handleDeleteProduct = async (productId: string) => {
    if (!user || user.email !== ADMIN_EMAIL) {
      toast({ variant: "destructive", title: "Erreur", description: "Authentification requise." });
      return;
    }

    setIsSaving(true);
    try {
        const docRef = doc(db, 'products', productId);
        await deleteDoc(docRef);
        toast({ title: 'Produit Supprimé', description: 'Le produit a été supprimé de la base de données.' });
        await fetchProducts(); // Refresh list
    } catch (error: any) {
        console.error("Delete error:", error);
        toast({ variant: "destructive", title: "Erreur de suppression", description: error.message });
    } finally {
        setIsSaving(false);
        setProductToDelete(null); // Close confirmation dialog
    }
  };


  if (loading || (!user && !isLoading)) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Produits</h2>
          
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
                                      <Button variant="destructive" size="sm" onClick={() => setProductToDelete(product)}>
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
                Remplissez les détails ci-dessous. Cliquez sur "Enregistrer" pour sauvegarder.
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
            <Button type="button" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Confirmation Dialog for Delete */}
       <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
             <Button variant="secondary" onClick={() => setProductToDelete(null)}>Annuler</Button>
             <Button variant="destructive" onClick={() => productToDelete && handleDeleteProduct(productToDelete.id)} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
