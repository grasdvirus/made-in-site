
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2, Save } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface CategorySetting {
    id: string;
    name: string;
    hint: string;
    href: string;
    image: string; // URL de l'image par défaut/générée
}

export default function HomeSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [categories, setCategories] = useState<CategorySetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'homePage');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setCategories(data.categories || []);
            } else {
                setCategories([]); // Initialiser avec un tableau vide si le document n'existe pas
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Impossible de charger les paramètres. ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!loading && user?.email === ADMIN_EMAIL) {
            fetchSettings();
        } else if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
            toast({
                title: 'Accès non autorisé',
                description: "Vous devez être administrateur pour accéder à cette page.",
                variant: 'destructive',
            });
            router.push('/');
        }
    }, [user, loading, router, fetchSettings, toast]);

    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newCategories = [...categories];
        (newCategories[index] as any)[name] = value;
        setCategories(newCategories);
    };

    const addCategory = () => {
        const newId = `cat_${Date.now()}`;
        setCategories([...categories, { 
            id: newId, 
            name: '', 
            hint: '', 
            href: '/products/', 
            image: `https://picsum.photos/400/500?random=${newId}` // Image par défaut
        }]);
    };

    const removeCategory = (index: number) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'homePage');
            await setDoc(docRef, { categories }, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les paramètres de la page d\'accueil ont été enregistrés.'
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de l'enregistrement des paramètres : ${error.message}`,
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading || isLoading) {
        return (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
      }

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Réglages de l'Accueil</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Section Catégories (Accueil & Découvrir)</CardTitle>
                    <CardDescription>
                        Gérez les catégories affichées sur la page d'accueil. L'image est définie automatiquement mais peut être surchargée si nécessaire.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {categories.map((category, index) => (
                        <div key={category.id} className="p-4 border rounded-lg relative space-y-4">
                           <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => removeCategory(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                           </Button>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Nom de la Catégorie</label>
                                    <Input
                                        name="name"
                                        value={category.name}
                                        onChange={(e) => handleCategoryChange(index, e)}
                                        placeholder="Ex: Femmes"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Lien de Destination</label>
                                    <Input
                                        name="href"
                                        value={category.href}
                                        onChange={(e) => handleCategoryChange(index, e)}
                                        placeholder="/products/femmes"
                                    />
                                </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                    <label className="text-sm font-medium">Indice IA (pour l'image)</label>
                                    <Input
                                        name="hint"
                                        value={category.hint}
                                        onChange={(e) => handleCategoryChange(index, e)}
                                        placeholder="Ex: woman fashion"
                                    />
                               </div>
                               <div>
                                    <label className="text-sm font-medium">URL de l'image (optionnel)</label>
                                    <Input
                                        name="image"
                                        value={category.image}
                                        onChange={(e) => handleCategoryChange(index, e)}
                                        placeholder="URL directe de l'image"
                                    />
                               </div>
                           </div>
                        </div>
                    ))}
                    <Button onClick={addCategory} variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une catégorie
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
