import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="py-16 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest mb-2 font-headline">EZY•RETAIL</h1>
          <p className="text-muted-foreground text-sm">Où vous créez votre propre style.</p>
        </div>
        <div>
          <h5 className="font-bold mb-4">BOUTIQUE</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/products/hommes" className="hover:text-foreground">Mode Homme</Link></li>
            <li><Link href="/products/femmes" className="hover:text-foreground">Mode Femme</Link></li>
            <li><Link href="/products/sacs" className="hover:text-foreground">Sacs</Link></li>
            <li><Link href="/products/montres" className="hover:text-foreground">Montres</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">SUPPORT</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-foreground">Retourner un produit</Link></li>
            <li><Link href="/contact" className="hover-text-foreground">Politique de remboursement</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Suivre une commande</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Nous contacter</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">À PROPOS</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">Qui nous sommes</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Politique de retour et de remboursement</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Politique de confidentialité</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">T&C</Link></li>
          </ul>
        </div>
      </div>
      <div className="py-6 px-6 md:px-10 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <Link href="/contact" className="hover:text-foreground">Politique de confidentialité</Link>
          <Link href="/contact" className="hover:text-foreground">Conditions de service</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-foreground"><Facebook className="h-5 w-5" /></Link>
          <Link href="#" className="hover:text-foreground"><Instagram className="h-5 w-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
