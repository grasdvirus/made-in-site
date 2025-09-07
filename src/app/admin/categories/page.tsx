
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, query, orderBy } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminCategoriesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchCategories = useCallback(async () => {
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
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Impossible de charger les catégories. ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

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
                fetchCategories();
            }
        }
    }, [user, loading, router, fetchCategories, toast]);

    const createSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast({ variant: 'destructive', title: 'Nom requis', description: 'Le nom de la catégorie ne peut pas être vide.' });
            return;
        }

        setIsSaving(true);
        try {
            const slug = createSlug(newCategoryName);
            const newCategory: Category = {
                id: `cat_${Date.now()}`,
                name: newCategoryName.trim(),
                slug: slug,
            };

            const docRef = doc(db, 'categories', newCategory.id);
            await setDoc(docRef, newCategory);

            toast({
                title: "Succès",
                description: `La catégorie "${newCategory.name}" a été ajoutée.`,
            });

            setNewCategoryName('');
            await fetchCategories(); // Refresh data

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de l'ajout de la catégorie : ${error.message}`,
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDeleteCategory = async (categoryId: string) => {
        setIsSaving(true);
        try {
            await deleteDoc(doc(db, 'categories', categoryId));
            toast({ title: 'Catégorie Supprimée' });
            await fetchCategories();
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de la suppression : ${error.message}`,
            });
        } finally {
            setIsSaving(false);
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
                <h2 className="text-3xl font-bold tracking-tight">Gestion des Catégories</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Nouvelle Catégorie</CardTitle>
                        <CardDescription>Ajoutez une nouvelle catégorie de produits.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="category-name">Nom de la catégorie</label>
                            <Input
                                id="category-name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Ex: Femmes"
                            />
                        </div>
                        <Button onClick={handleAddCategory} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Ajouter la catégorie
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Catégories Existantes</CardTitle>
                        <CardDescription>Liste de toutes les catégories actuelles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : categories.length === 0 ? (
                            <p className="text-muted-foreground text-center p-8">Aucune catégorie trouvée.</p>
                        ) : (
                            <div className="border rounded-lg">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                        <div>
                                            <p className="font-medium">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground">slug: {cat.slug}</p>
                                        </div>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            disabled={isSaving}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
