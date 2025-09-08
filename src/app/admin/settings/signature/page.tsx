
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User, Briefcase, Mail, Phone, Link2, Instagram, Youtube } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2859 3333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" {...props}><path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-458 249-458 522 0 341 230 594 523 594 294 0 524-253 524-594v-1031c0-38 3-75 10-112h524v1031c0 341 230 594 523 594 294 0 524-253 524-594v-532c-266-26-499 61-770 225V0z"/></svg>
)

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.2-26.7l-7-4.1-67.6 17.7 17.9-65.8-4.4-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
)

interface SignatureSettings {
    fullName: string;
    bio: string;
    email: string;
    phone: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    instagramUrl: string;
    whatsappUrl: string;
    tiktokUrl: string;
    youtubeUrl: string;
}

export default function SignatureSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [settings, setSettings] = useState<SignatureSettings>({
        fullName: '',
        bio: '',
        email: '',
        phone: '',
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        instagramUrl: '',
        whatsappUrl: '',
        tiktokUrl: '',
        youtubeUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'signature');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSettings({
                    fullName: data.fullName || '',
                    bio: data.bio || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    portfolioUrl: data.portfolioUrl || '',
                    linkedinUrl: data.linkedinUrl || '',
                    githubUrl: data.githubUrl || '',
                    instagramUrl: data.instagramUrl || '',
                    whatsappUrl: data.whatsappUrl || '',
                    tiktokUrl: data.tiktokUrl || '',
                    youtubeUrl: data.youtubeUrl || ''
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'signature');
            await setDoc(docRef, settings, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les informations de la page signature ont été enregistrées.'
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
                <h2 className="text-3xl font-bold tracking-tight">Réglages de la Page Signature</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vos Informations Personnelles</CardTitle>
                    <CardDescription>
                        Ces informations seront affichées sur la page "Signet par Cristan".
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <label htmlFor="fullName" className="flex items-center gap-2"><User className="w-4 h-4" />Nom Complet</label>
                        <Input id="fullName" name="fullName" value={settings.fullName} onChange={handleInputChange} placeholder="Ex: John Doe"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="bio" className="flex items-center gap-2"><Briefcase className="w-4 h-4" />Biographie Courte</label>
                        <Textarea id="bio" name="bio" value={settings.bio} onChange={handleInputChange} placeholder="Ex: Développeur Web Full-Stack & Designer UI/UX" rows={3}/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" />Email de Contact</label>
                        <Input id="email" name="email" value={settings.email} onChange={handleInputChange} placeholder="contact@example.com"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4" />Téléphone</label>
                        <Input id="phone" name="phone" value={settings.phone} onChange={handleInputChange} placeholder="+1 23 456 7890"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="portfolioUrl" className="flex items-center gap-2"><Link2 className="w-4 h-4" />URL du Portfolio</label>
                        <Input id="portfolioUrl" name="portfolioUrl" value={settings.portfolioUrl} onChange={handleInputChange} placeholder="https://mon-portfolio.com"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="linkedinUrl" className="flex items-center gap-2"><svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>LinkedIn</label>
                        <Input id="linkedinUrl" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="githubUrl" className="flex items-center gap-2"><svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-23.3 2.6-57.9 0 0 21.9-7 72.1 25.6 20.9-6.2 43.7-9.4 66.5-9.4 22.8 0 45.7 3.1 66.5 9.4 50.2-32.6 72.1-25.6 72.1-25.6 13.7 34.7 5.2 51.4 2.6 57.9 16 17.6 23.6 31.4 23.6 58.9 0 96.5-56.4 104.2-112.6 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>GitHub</label>
                        <Input id="githubUrl" name="githubUrl" value={settings.githubUrl} onChange={handleInputChange} placeholder="https://github.com/votreprofil"/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="instagramUrl" className="flex items-center gap-2"><Instagram className="w-4 h-4" />Instagram</label>
                        <Input id="instagramUrl" name="instagramUrl" value={settings.instagramUrl} onChange={handleInputChange} placeholder="https://instagram.com/votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="whatsappUrl" className="flex items-center gap-2"><WhatsAppIcon className="w-4 h-4 fill-current"/>WhatsApp</label>
                        <Input id="whatsappUrl" name="whatsappUrl" value={settings.whatsappUrl} onChange={handleInputChange} placeholder="https://wa.me/1234567890"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="tiktokUrl" className="flex items-center gap-2"><TikTokIcon className="w-4 h-4 fill-current"/>TikTok</label>
                        <Input id="tiktokUrl" name="tiktokUrl" value={settings.tiktokUrl} onChange={handleInputChange} placeholder="https://tiktok.com/@votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="youtubeUrl" className="flex items-center gap-2"><Youtube className="w-4 h-4"/>YouTube</label>
                        <Input id="youtubeUrl" name="youtubeUrl" value={settings.youtubeUrl} onChange={handleInputChange} placeholder="https://youtube.com/c/votrechaine"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    