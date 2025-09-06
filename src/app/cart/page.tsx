import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

// Données factices pour le panier
const cartItems = [
  { id: 1, name: "COMPLET HAUT ET PANTALON", price: 24000, quantity: 1, image: "https://picsum.photos/400/500?random=12", hint: "fitted blazer" },
  { id: 2, name: "Robe d'été florale", price: 79.99, quantity: 2, image: "https://picsum.photos/400/600?random=11", hint: "floral dress" },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shipping = 5000;
const total = subtotal + shipping;

export default function CartPage() {
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
                {cartItems.length > 0 ? cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        data-ai-hint={item.hint}
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground">{item.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          className="h-8 w-12 text-center border-0 bg-transparent"
                          readOnly
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : <p>Votre panier est vide.</p>}
              </CardContent>
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
                  <span>{shipping.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
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
