
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, PlusCircle, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface PaymentMethod {
    id: string;
    name: string;
    details: string;
    recipient: string;
    iconColor?: string;
}

export default function PaymentSettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'paymentMethods');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setMethods(docSnap.data().methods || []);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Impossible de charger les méthodes. ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!loading) {
            if (user?.email !== ADMIN_EMAIL) {
                toast({
                    title: 'Accès non autorisé',
                    description: "Vous devez être administrateur pour accéder à cette page.",
                    variant: 'destructive',
                });
                router.push('/');
            } else {
                fetchSettings();
            }
        }
    }, [user, loading, router, fetchSettings, toast]);

    const handleInputChange = (id: string, field: keyof PaymentMethod, value: string) => {
        setMethods(prev =>
            prev.map(method =>
                method.id === id ? { ...method, [field]: value } : method
            )
        );
    };

    const handleAddNewMethod = () => {
        const newMethod: PaymentMethod = {
            id: `method_${Date.now()}`,
            name: 'Nouveau Service',
            details: '',
            recipient: '',
            iconColor: '#FFA500' // Default orange color
        };
        setMethods(prev => [...prev, newMethod]);
    };

    const handleRemoveMethod = (id: string) => {
        setMethods(prev => prev.filter(method => method.id !== id));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'settings', 'paymentMethods');
            await setDoc(docRef, { methods }, { merge: true });
            toast({
                title: 'Succès',
                description: 'Les méthodes de paiement ont été enregistrées.'
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
                <h2 className="text-3xl font-bold tracking-tight">Réglages des Méthodes de Paiement</h2>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Méthodes de Paiement Manuel</CardTitle>
                    <CardDescription>
                        Gérez les informations que vos clients voient sur la page de paiement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {methods.map((method, index) => (
                        <div key={method.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Méthode {index + 1}</h3>
                                <Button variant="destructive" size="icon" onClick={() => handleRemoveMethod(method.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor={`name-${method.id}`}>Nom du service</label>
                                    <Input
                                        id={`name-${method.id}`}
                                        value={method.name}
                                        onChange={(e) => handleInputChange(method.id, 'name', e.target.value)}
                                        placeholder="Ex: Orange Money"
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <label htmlFor={`details-${method.id}`}>Numéro / Contact</label>
                                    <Input
                                        id={`details-${method.id}`}
                                        value={method.details}
                                        onChange={(e) => handleInputChange(method.id, 'details', e.target.value)}
                                        placeholder="Ex: +225 0102030405"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`recipient-${method.id}`}>Nom du destinataire (Optionnel)</label>
                                    <Input
                                        id={`recipient-${method.id}`}
                                        value={method.recipient}
                                        onChange={(e) => handleInputChange(method.id, 'recipient', e.target.value)}
                                        placeholder="Ex: John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`iconColor-${method.id}`}>Couleur de l'icône</label>
                                    <Input
                                        id={`iconColor-${method.id}`}
                                        type="color"
                                        value={method.iconColor}
                                        onChange={(e) => handleInputChange(method.id, 'iconColor', e.target.value)}
                                        className="p-1 h-10 w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={handleAddNewMethod}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une méthode
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
