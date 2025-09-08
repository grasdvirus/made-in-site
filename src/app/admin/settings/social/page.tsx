
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
import { Facebook, Instagram, MessageSquare, Phone } from 'lucide-react'; // Assuming a generic icon for TikTok

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2859 3333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" {...props}><path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-458 249-458 522 0 341 230 594 523 594 294 0 524-253 524-594v-1031c0-38 3-75 10-112h524v1031c0 341 230 594 523 594 294 0 524-253 524-594v-532c-266-26-499 61-770 225V0z"/></svg>
)

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.2-26.7l-7-4.1-67.6 17.7 17.9-65.8-4.4-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
)

interface SocialSettings {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
}

export default function SocialSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<SocialSettings>({
        facebook: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
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
                    tiktok: data.tiktok || '',
                    whatsapp: data.whatsapp || '',
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
                        <label htmlFor="facebook" className='flex items-center gap-2'><Facebook className='w-4 h-4'/>Facebook</label>
                        <Input id="facebook" name="facebook" value={settings.facebook} onChange={handleInputChange} placeholder="https://facebook.com/votrepage"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="instagram" className='flex items-center gap-2'><Instagram className='w-4 h-4'/>Instagram</label>
                        <Input id="instagram" name="instagram" value={settings.instagram} onChange={handleInputChange} placeholder="https://instagram.com/votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="tiktok" className='flex items-center gap-2'><TikTokIcon className='w-4 h-4 fill-current'/>TikTok</label>
                        <Input id="tiktok" name="tiktok" value={settings.tiktok} onChange={handleInputChange} placeholder="https://tiktok.com/@votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="whatsapp" className='flex items-center gap-2'><WhatsAppIcon className='w-4 h-4 fill-current'/>WhatsApp</label>
                        <Input id="whatsapp" name="whatsapp" value={settings.whatsapp} onChange={handleInputChange} placeholder="https://wa.me/225xxxxxxxxxx"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
