
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart.tsx";

export default function CartPage() {
  const { items, updateItemQuantity, removeItem, clearCart, subtotal, total, itemCount } = useCart();
  
  // Free shipping if 5 or more items in cart
  const shipping = itemCount >= 5 ? 0 : 5000;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl mb-8">
          Votre Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                {items.length > 0 ? items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link href={`/products/${item.category}/${item.id}`}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                          data-ai-hint={item.hint}
                        />
                      </Link>
                      <div>
                        <Link href={`/products/${item.category}/${item.id}`} className="hover:underline">
                            <h3 className="font-semibold">{item.name}</h3>
                        </Link>
                        <p className="text-muted-foreground">{item.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          className="h-8 w-12 text-center border-0 bg-transparent"
                          readOnly
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : <p>Votre panier est vide.</p>}
              </CardContent>
               {items.length > 0 && (
                 <CardFooter className="justify-end">
                    <Button variant="outline" onClick={clearCart}>Vider le panier</Button>
                 </CardFooter>
               )}
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuit' : `${shipping.toLocaleString('fr-FR')} FCFA`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{(total + shipping).toLocaleString('fr-FR')} FCFA</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" disabled={items.length === 0}>
                  <Link href="/checkout">Passer au paiement</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
