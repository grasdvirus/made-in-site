
import { ShippingIcon, ReturnIcon, RefundIcon } from '@/components/icons';

export function BenefitsSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
                <ShippingIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">LIVRAISON GRATUITE</h4>
                <p className="text-primary-foreground/80">Livraison gratuite pour les achats de plus de cinq produits.</p>
            </div>
            <div>
                <ReturnIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">RETOURS SOUS 7 JOURS</h4>
                <p className="text-primary-foreground/80">Pas satisfait ? Vous avez 7 jours pour retourner le produit.</p>
            </div>
            <div>
                <RefundIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">REMBOURSEMENTS EN 1 JOUR</h4>
                <p className="text-primary-foreground/80">Obtenez un remboursement le jour même où nous recevons le produit.</p>
            </div>
        </div>
    </section>
  );
}
