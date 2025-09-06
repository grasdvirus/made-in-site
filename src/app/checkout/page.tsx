import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { WalletCards, Diamond } from "lucide-react";

export default function CheckoutPage() {
  const subtotal = 24000;
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
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
                  Veuillez envoyer le montant total de votre commande à l'un des
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
                <Input id="fullName" placeholder="Prénom et Nom" />
              </div>
              <div>
                <label htmlFor="phone">Numéro de téléphone</label>
                <Input id="phone" placeholder="Pour la confirmation de la commande" />
              </div>
              <div>
                <label htmlFor="email">Email (Optionnel)</label>
                <Input id="email" type="email" />
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src="https://picsum.photos/80/80?random=12"
                    alt="COMPLET HAUT ET PANTALON"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    data-ai-hint="fitted blazer"
                  />
                  <div>
                    <p className="font-semibold">COMPLET HAUT ET PANTALON</p>
                    <p className="text-sm text-muted-foreground">Qté: 1</p>
                  </div>
                </div>
                <p className="font-semibold">{subtotal.toLocaleString('fr-FR')} FCFA</p>
              </div>
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

          <Button className="w-full mt-8" size="lg">
            Soumettre la commande
          </Button>
        </div>
      </div>
    </div>
  );
}
