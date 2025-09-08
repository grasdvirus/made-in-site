
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, User, MapPin, Phone, Hash } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ADMIN_EMAIL = 'grasdvirus@gmail.com';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customer: {
        fullName: string;
        phone: string;
        email?: string;
        address: string;
        notes?: string;
    };
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    itemCount: number;
    status: 'Nouvelle' | 'Confirmée' | 'Expédiée' | 'Terminée' | 'Annulée';
    createdAt: { seconds: number; nanoseconds: number; };
}

export default function AdminOrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const ordersCol = collection(db, 'orders');
            const q = query(ordersCol, orderBy('createdAt', 'desc'));
            const ordersSnapshot = await getDocs(q);
            const orderList = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            setOrders(orderList);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Impossible de charger les commandes. ${error.message}`,
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
                fetchOrders();
            }
        }
    }, [user, loading, router, fetchOrders, toast]);
    
    const handleStatusChange = async (orderId: string, status: Order['status']) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status });
            toast({ title: 'Statut mis à jour' });
            fetchOrders();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: `Échec de la mise à jour du statut: ${error.message}` });
        }
    };
    
    const getStatusVariant = (status: Order['status']) => {
        switch(status) {
            case 'Nouvelle': return 'default';
            case 'Confirmée': return 'secondary';
            case 'Expédiée': return 'secondary';
            case 'Terminée': return 'secondary';
            case 'Annulée': return 'destructive';
            default: return 'outline';
        }
    }

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
                <h2 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h2>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Liste des commandes ({orders.length})</CardTitle>
                    <CardDescription>Cliquez sur une commande pour voir les détails.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : orders.length === 0 ? (
                        <p className="text-muted-foreground text-center p-8">Aucune commande trouvée.</p>
                    ) : (
                         <Accordion type="single" collapsible>
                            {orders.map(order => (
                                <AccordionItem value={order.id} key={order.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-4 items-center">
                                            <div className="flex items-center gap-4 text-left">
                                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                                <div>
                                                    <p className="font-medium">{order.customer.fullName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR')} - {order.total.toLocaleString('fr-FR')} FCFA
                                                    </p>
                                                </div>
                                            </div>
                                             <div className="text-right">
                                                <p className="text-sm text-muted-foreground">ID: {order.id.slice(0, 8)}...</p>
                                             </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 bg-muted/30">
                                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-1 space-y-4">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5"/> Client</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2 text-sm">
                                                        <p className="font-semibold">{order.customer.fullName}</p>
                                                        <p className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4"/>{order.customer.phone}</p>
                                                        {order.customer.email && <p className="text-muted-foreground">{order.customer.email}</p>}
                                                        <p className="flex items-center gap-2 pt-2 text-muted-foreground"><MapPin className="w-4 h-4"/>{order.customer.address}</p>
                                                        {order.customer.notes && <p className="pt-2 italic text-muted-foreground border-t mt-2">"{order.customer.notes}"</p>}
                                                    </CardContent>
                                                </Card>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Statut</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Changer le statut" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                                                                <SelectItem value="Confirmée">Confirmée</SelectItem>
                                                                <SelectItem value="Expédiée">Expédiée</SelectItem>
                                                                <SelectItem value="Terminée">Terminée</SelectItem>
                                                                <SelectItem value="Annulée">Annulée</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                             <div className="lg:col-span-2">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg flex items-center gap-2"><Package className="w-5 h-5"/>Produits ({order.itemCount})</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            {order.items.map(item => (
                                                                <div key={item.id} className="flex justify-between items-center text-sm">
                                                                    <div>
                                                                        <p className="font-medium">{item.name}</p>
                                                                        <p className="text-muted-foreground">Qté: {item.quantity}</p>
                                                                    </div>
                                                                    <p>{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
                                                                </div>
                                                            ))}
                                                            <Separator/>
                                                            <div className="space-y-2 font-medium">
                                                                <div className="flex justify-between"><span>Sous-total:</span><span>{order.subtotal.toLocaleString('fr-FR')} FCFA</span></div>
                                                                <div className="flex justify-between"><span>Livraison:</span><span>{order.shipping.toLocaleString('fr-FR')} FCFA</span></div>
                                                                <div className="flex justify-between text-lg"><span>Total:</span><span>{order.total.toLocaleString('fr-FR')} FCFA</span></div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                       </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    