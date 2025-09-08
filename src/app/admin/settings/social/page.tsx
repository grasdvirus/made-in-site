
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Link2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface SocialSettings {
    facebook: string;
    instagram: string;
}

export default function SocialSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<SocialSettings>({
        facebook: '',
        instagram: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'socialLinks');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    facebook: data.facebook || '',
                    instagram: data.instagram || '',
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

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'socialLinks');
            await setDoc(docRef, settings, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les liens des réseaux sociaux ont été enregistrés.'
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
                <h2 className="text-3xl font-bold tracking-tight">Réglages des Réseaux Sociaux</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liens des profils</CardTitle>
                    <CardDescription>
                        Entrez ici les URL complètes de vos pages de réseaux sociaux. Elles apparaîtront dans le pied de page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="facebook" className='flex items-center gap-2'><Link2 className='w-4 h-4'/>Facebook</label>
                        <Input id="facebook" name="facebook" value={settings.facebook} onChange={handleInputChange} placeholder="https://facebook.com/votrepage"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="instagram" className='flex items-center gap-2'><Link2 className='w-4 h-4'/>Instagram</label>
                        <Input id="instagram" name="instagram" value={settings.instagram} onChange={handleInputChange} placeholder="https://instagram.com/votreprofil"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    