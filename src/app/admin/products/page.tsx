
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Upload, Loader2, Save, GripVertical } from 'lucide-react';
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x500/EFEFEF/333333?text=Image';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string; 
    hint?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

function ProductForm({ product: initialProduct, categories, onSave, isSaving, isUploading, onImageUpload }: {
    product: Partial<Product>;
    categories: Category[];
    onSave: (product: Partial<Product>) => void;
    isSaving: boolean;
    isUploading: boolean;
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    const [product, setProduct] = useState(initialProduct);

    useEffect(() => {
        setProduct(initialProduct);
    }, [initialProduct]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProduct(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };
  
    const handleCategoryChange = (value: string) => {
      setProduct(prev => ({...prev, category: value as Product['category']}));
    }

    return (
        <div className="grid gap-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor={`name-${product.id}`}>Nom du produit</label>
                    <Input id={`name-${product.id}`} name="name" value={product.name || ''} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <label htmlFor={`price-${product.id}`}>Prix (FCFA)</label>
                    <Input id={`price-${product.id}`} name="price" type="number" value={product.price || 0} onChange={handleInputChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label htmlFor={`category-${product.id}`}>Catégorie</label>
                    <Select name="category" value={product.category || ''} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <label htmlFor={`hint-${product.id}`}>Hint (IA)</label>
                    <Input id={`hint-${product.id}`} name="hint" value={product.hint || ''} onChange={handleInputChange} placeholder="Ex: 'red dress'"/>
                </div>
            </div>
           
            <div className="space-y-2">
              <label htmlFor={`description-${product.id}`}>Description</label>
              <Textarea id={`description-${product.id}`} name="description" value={product.description || ''} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <label>Image</label>
              <div className="flex items-center gap-4">
                <Image src={product.imageUrl || DEFAULT_PRODUCT_IMAGE} alt="Aperçu" width={64} height={64} className="rounded-md object-cover bg-muted" />
                <Button asChild variant="outline">
                  <label htmlFor={`image-upload-${product.id}`} className="cursor-pointer flex items-center">
                    { isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Upload className="h-4 w-4 mr-2" /> }
                    Changer
                    <Input id={`image-upload-${product.id}`} type="file" accept="image/*" className="sr-only" onChange={onImageUpload} disabled={isUploading}/>
                  </label>
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => onSave(product)} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Enregistrer
                </Button>
            </div>
          </div>
    )
}


export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // For accordion
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  const fetchProductsAndCategories = useCallback(async () => {
    setIsLoading(true);
    try {
        const categoriesCol = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(query(categoriesCol, orderBy('name')));
        const categoryList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        setCategories(categoryList);
        
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(query(productsCol, orderBy('name')));
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(productList);

    } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur", description: `Impossible de charger les données. ${error.message}` });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!loading) {
        if (!user || user.email !== ADMIN_EMAIL) {
            toast({ title: 'Accès non autorisé', description: "Vous devez être administrateur pour accéder à cette page.", variant: 'destructive' });
            router.push('/');
        } else {
            fetchProductsAndCategories();
        }
    }
  }, [user, loading, router, fetchProductsAndCategories, toast]);
  
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!productData.id || !productData.name || !productData.category) {
        toast({ variant: 'destructive', title: 'Champs requis', description: 'Le nom et la catégorie sont obligatoires.' });
        return;
    }

    setIsSaving(true);
    try {
        const finalProductData = {
            name: productData.name,
            price: productData.price || 0,
            description: productData.description || '',
            category: productData.category,
            imageUrl: productData.imageUrl || DEFAULT_PRODUCT_IMAGE,
            hint: productData.hint || '',
        };

        const docRef = doc(db, 'products', productData.id);
        await setDoc(docRef, finalProductData, { merge: true });

        toast({ title: "Succès", description: `Le produit "${finalProductData.name}" a été enregistré.` });
        
        setEditingProductId(null); // Close accordion
        setNewProduct({}); // Clear new product form
        await fetchProductsAndCategories(); // Refresh data

    } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur", description: `Échec de l'enregistrement: ${error.message}` });
    } finally {
        setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, productId: string | null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error((await response.json()).error || 'Échec du téléversement');
      
      const { url } = await response.json();

      if (productId === 'new') {
        setNewProduct(prev => ({ ...prev, imageUrl: url }));
      } else {
        const productToUpdate = products.find(p => p.id === productId);
        if (productToUpdate) {
            const updatedProduct = {...productToUpdate, imageUrl: url };
            const docRef = doc(db, 'products', productId!);
            await setDoc(docRef, { imageUrl: url }, { merge: true });
            setProducts(products.map(p => p.id === productId ? updatedProduct : p));
        }
      }
      toast({ title: 'Image téléversée.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erreur de téléversement', description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsSaving(true);
    try {
        await deleteDoc(doc(db, 'products', productId));
        toast({ title: 'Produit Supprimé' });
        await fetchProductsAndCategories();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur de suppression", description: error.message });
    } finally {
        setIsSaving(false);
        setProductToDelete(null);
    }
  };

  const handleAddNewClick = () => {
    setNewProduct({
        id: `prod_${Date.now()}`,
        name: '',
        price: 0,
        description: '',
        category: categories.length > 0 ? categories[0].slug : '',
        imageUrl: DEFAULT_PRODUCT_IMAGE,
    });
    setEditingProductId('new');
  };

  if (loading || (!user && !isLoading)) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Produits</h2>
           <Button onClick={handleAddNewClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
          </Button>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Liste des produits ({products.length})</CardTitle>
              <CardDescription>
                  Cliquez sur un produit pour le modifier.
              </CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                  <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <Accordion type="single" collapsible value={editingProductId || ""} onValueChange={setEditingProductId}>
                    {/* Add New Product Form */}
                    {newProduct.id && (
                        <AccordionItem value="new" className="border-primary border-2 rounded-lg mb-2">
                             <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex items-center gap-4 text-primary">
                                    <PlusCircle className="h-5 w-5" />
                                    <span className="font-semibold text-lg">Ajouter un nouveau produit</span>
                                </div>
                             </AccordionTrigger>
                             <AccordionContent>
                                <ProductForm 
                                    product={newProduct}
                                    categories={categories}
                                    onSave={handleSaveProduct}
                                    isSaving={isSaving}
                                    isUploading={isUploading}
                                    onImageUpload={(e) => handleImageUpload(e, 'new')}
                                />
                             </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Existing Products List */}
                    {products.map((product) => (
                        <AccordionItem value={product.id} key={product.id}>
                            <div className="flex items-center justify-between w-full p-4">
                                <AccordionTrigger className="p-0 hover:no-underline flex-1">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-muted-foreground"/>
                                        <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover bg-muted" />
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-sm text-muted-foreground">{categories.find(c=>c.slug === product.category)?.name} - {product.price.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                </AccordionTrigger>
                                <div className="flex items-center gap-2 pl-4">
                                    <Button variant="ghost" size="icon" className="hover:bg-destructive/10" onClick={() => setProductToDelete(product)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <AccordionContent>
                                <ProductForm 
                                    product={product}
                                    categories={categories}
                                    onSave={handleSaveProduct}
                                    isSaving={isSaving}
                                    isUploading={isUploading}
                                    onImageUpload={(e) => handleImageUpload(e, product.id)}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             )}
          </CardContent>
      </Card>
      
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
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    