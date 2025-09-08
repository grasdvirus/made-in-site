
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { WalletCards, Diamond, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', phone: '', email: '', address: '', notes: '' });

  const shipping = 5000;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCustomerInfo(prev => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez renseigner votre nom complet, votre numéro de téléphone et votre adresse de livraison.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
        const orderData = {
            customer: customerInfo,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            shipping,
            total,
            itemCount,
            status: 'Nouvelle',
            createdAt: new Date()
        };

        await addDoc(collection(db, 'orders'), orderData);
        
        toast({
            title: "Commande soumise !",
            description: "Merci pour votre commande. Nous vous contacterons bientôt pour confirmer.",
        });
        clearCart();
        router.push('/');

    } catch (error: any) {
        console.error("Order submission error: ", error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: `Impossible de soumettre la commande. ${error.message}`,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <WalletCards className="h-6 w-6" />
                  <CardTitle>Paiement Manuel</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Pour finaliser votre commande, veuillez effectuer un transfert
                  via l'un des services ci-dessous.
                </p>
                <div>
                  <p className="font-semibold mb-2">
                    Veuillez envoyer le montant total de <span className="text-primary font-bold">{total.toLocaleString('fr-FR')} FCFA</span> à l'un des
                    contacts suivants :
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Diamond className="h-4 w-4 text-orange-500" />
                      <span>
                        Orange Money : +225 07 08 22 56 82 (Nom: N'guia Achi
                        Nadege)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Diamond className="h-4 w-4 text-blue-500" />
                      <span>WAVE : +225 05 03 65 48 86</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Diamond className="h-4 w-4 text-blue-500" />
                      <span>WAVE : +225 07 08 22 56 82</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Après le paiement, veuillez remplir et soumettre le formulaire avec
                  vos informations de livraison. Nous vous contacterons pour
                  confirmer.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="fullName">Nom complet</label>
                  <Input id="fullName" placeholder="Prénom et Nom" value={customerInfo.fullName} onChange={handleInputChange} required/>
                </div>
                <div>
                  <label htmlFor="phone">Numéro de téléphone</label>
                  <Input id="phone" placeholder="Pour la confirmation de la commande" value={customerInfo.phone} onChange={handleInputChange} required />
                </div>
                 <div>
                  <label htmlFor="address">Adresse de livraison</label>
                  <Input id="address" placeholder="Ex: Cocody Angré 7ème tranche" value={customerInfo.address} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="email">Email (Optionnel)</label>
                  <Input id="email" type="email" value={customerInfo.email} onChange={handleInputChange}/>
                </div>
                 <div>
                  <label htmlFor="notes">Notes de commande (Optionnel)</label>
                  <Textarea id="notes" placeholder="Instructions spéciales pour la livraison..." value={customerInfo.notes} onChange={handleInputChange} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length > 0 ? (
                  items.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={item.hint}
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">Votre panier est vide.</p>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{shipping.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full mt-8" size="lg" disabled={items.length === 0 || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                'Soumettre la commande'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

    