
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, Trash2, PlusCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';
const MAX_IMAGES = 10;

interface HeroSettings {
    title: string;
    subtitle: string;
    promoText: string;
    imageUrls: string[];
}

export default function HomeSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<HeroSettings>({
        title: '',
        subtitle: '',
        promoText: '',
        imageUrls: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'homePage');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    title: data.hero?.title || 'SOLDES DU BLACK FRIDAY',
                    subtitle: data.hero?.subtitle || '20 Nov - 30 Nov',
                    promoText: data.hero?.promoText || 'Réduction de 40%* sur tous les produits.',
                    imageUrls: data.hero?.imageUrls || ['https://picsum.photos/1400/500']
                });
            } else {
                 setSettings({
                    title: 'SOLDES DU BLACK FRIDAY',
                    subtitle: '20 Nov - 30 Nov',
                    promoText: 'Réduction de 40%* sur tous les produits.',
                    imageUrls: ['https://picsum.photos/1400/500']
                });
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };
    
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || settings.imageUrls.length >= MAX_IMAGES) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).error || 'Échec du téléversement');
            
            const { url } = await response.json();

            setSettings(prev => ({ ...prev, imageUrls: [...prev.imageUrls, url] }));
            toast({ title: 'Image ajoutée. N\'oubliez pas d\'enregistrer les modifications.' });

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur de téléversement', description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setSettings(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'homePage');
            await setDoc(docRef, { hero: settings }, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les paramètres de la bannière d\'accueil ont été enregistrés.'
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de l'enregistrement : ${error.message}`,
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
                <h2 className="text-3xl font-bold tracking-tight">Réglages de la Bannière d'Accueil</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Contenu de la Bannière</CardTitle>
                        <CardDescription>
                            Modifiez ici les textes qui apparaissent sur la bannière.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title">Titre Principal</label>
                            <Input id="title" name="title" value={settings.title} onChange={handleInputChange} placeholder="Ex: SOLDES D'ÉTÉ"/>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subtitle">Sous-titre / Dates</label>
                            <Input id="subtitle" name="subtitle" value={settings.subtitle} onChange={handleInputChange} placeholder="Ex: 1er au 31 juillet"/>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="promoText">Texte Promotionnel</label>
                            <Input id="promoText" name="promoText" value={settings.promoText} onChange={handleInputChange} placeholder="Ex: Jusqu'à -50% sur une sélection"/>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Images de la Bannière ({settings.imageUrls.length}/{MAX_IMAGES})</CardTitle>
                        <CardDescription>
                            Gérez les images qui s'affichent aléatoirement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {settings.imageUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-video">
                                    <Image src={url} alt={`Bannière ${index + 1}`} fill className="rounded-md object-cover bg-muted"/>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(index)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                             {settings.imageUrls.length < MAX_IMAGES && (
                                <Button asChild variant="outline" className="aspect-video w-full h-full flex-col gap-2 cursor-pointer">
                                    <label htmlFor="image-upload">
                                        <PlusCircle className="h-6 w-6"/>
                                        <span className="text-xs">Ajouter</span>
                                        <Input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={isSaving}/>
                                    </label>
                                </Button>
                             )}
                        </div>
                        {isSaving && <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Téléversement en cours...</div>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
