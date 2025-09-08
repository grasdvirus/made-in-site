
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User, Briefcase, Mail, Phone, Link2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface SignatureSettings {
    fullName: string;
    bio: string;
    email: string;
    phone: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
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
        githubUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'signature');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSettings(docSnap.data() as SignatureSettings);
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
                        <label htmlFor="linkedinUrl" className="flex items-center gap-2"><svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></g></svg>LinkedIn</Link>
                        <Input id="linkedinUrl" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/votreprofil"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="githubUrl" className="flex items-center gap-2"><svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-23.3 2.6-57.9 0 0 21.9-7 72.1 25.6 20.9-6.2 43.7-9.4 66.5-9.4 22.8 0 45.7 3.1 66.5 9.4 50.2-32.6 72.1-25.6 72.1-25.6 13.7 34.7 5.2 51.4 2.6 57.9 16 17.6 23.6 31.4 23.6 58.9 0 96.5-56.4 104.2-112.6 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>GitHub</label>
                        <Input id="githubUrl" name="githubUrl" value={settings.githubUrl} onChange={handleInputChange} placeholder="https://github.com/votreprofil"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
