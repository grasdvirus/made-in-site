
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface HeroSettings {
    title: string;
    subtitle: string;
    promoText: string;
    imageUrl: string;
}

export default function HomeSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<HeroSettings>({
        title: '',
        subtitle: '',
        promoText: '',
        imageUrl: '',
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
                    imageUrl: data.hero?.imageUrl || 'https://picsum.photos/1400/500'
                });
            } else {
                 setSettings({
                    title: 'SOLDES DU BLACK FRIDAY',
                    subtitle: '20 Nov - 30 Nov',
                    promoText: 'Réduction de 40%* sur tous les produits.',
                    imageUrl: 'https://picsum.photos/1400/500'
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
        if (!file) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).error || 'Échec du téléversement');
            
            const { url } = await response.json();

            setSettings(prev => ({ ...prev, imageUrl: url }));
            toast({ title: 'Image mise à jour. N\'oubliez pas d\'enregistrer les modifications.' });

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur de téléversement', description: error.message });
        } finally {
            setIsSaving(false);
        }
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

            <Card>
                <CardHeader>
                    <CardTitle>Contenu de la Bannière Principale (Hero Section)</CardTitle>
                    <CardDescription>
                        Modifiez ici les textes et l'image de la grande bannière sur la page d'accueil.
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
                    <div className="space-y-4">
                        <label htmlFor="imageUrl">Image de fond</label>
                        <div className="flex items-center gap-4">
                            <Image src={settings.imageUrl || 'https://placehold.co/400x500/EFEFEF/333333?text=Image'} alt="Aperçu de la bannière" width={100} height={50} className="rounded-md object-cover bg-muted" />
                            <div className="flex-grow">
                                <Input id="imageUrl" name="imageUrl" value={settings.imageUrl} onChange={handleInputChange} placeholder="https://... ou téléversez une image"/>
                            </div>
                            <Button asChild variant="outline">
                                <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Téléverser
                                    <Input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload}/>
                                </label>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
