
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface AboutSettings {
    story: string;
    mission: string;
}

export default function AboutSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<AboutSettings>({
        story: '',
        mission: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'aboutPage');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    story: data.story || '',
                    mission: data.mission || '',
                });
            } else {
                 setSettings({
                    story: "Fondée en 2024, EzyRetail a commencé avec une vision simple : rendre la mode de luxe accessible et personnelle. Nous avons vu une opportunité de combiner la technologie avec le stylisme personnel pour créer une expérience de magasinage unique. Partis d'une petite boutique, nous sommes maintenant une plateforme en ligne florissante, au service des passionnés de mode du monde entier. Notre engagement envers la qualité, le style et l'innovation reste au cœur de tout ce que nous faisons.",
                    mission: "Notre mission est de vous donner les moyens d'exprimer votre individualité à travers la mode. Nous croyons que le style est une forme d'expression de soi, et nous nous efforçons de fournir des sélections qui répondent à tous les goûts et à toutes les occasions. Avec notre guide de style alimenté par l'IA, nous allons au-delà de la simple vente de vêtements ; nous vous aidons à découvrir et à affiner votre style personnel, en veillant à ce que vous vous sentiez confiant et inspiré chaque jour."
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

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'aboutPage');
            await setDoc(docRef, settings, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les informations de la page "À Propos" ont été enregistrées.'
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
                <h2 className="text-3xl font-bold tracking-tight">Réglages de la Page "À Propos"</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contenu Textuel</CardTitle>
                    <CardDescription>
                        Modifiez ici les textes qui apparaissent sur la page "À Propos". L'image est gérée automatiquement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="story">Notre Histoire</label>
                        <Textarea id="story" name="story" value={settings.story} onChange={handleInputChange} rows={8}/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="mission">Notre Mission</label>
                        <Textarea id="mission" name="mission" value={settings.mission} onChange={handleInputChange} rows={8}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    