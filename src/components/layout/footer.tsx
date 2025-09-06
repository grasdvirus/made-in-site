import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="py-16 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest mb-2 font-headline">EZY•RETAIL</h1>
          <p className="text-muted-foreground text-sm">Where you create your own style.</p>
        </div>
        <div>
          <h5 className="font-bold mb-4">SHOP</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Men's Fashion</Link></li>
            <li><Link href="#" className="hover:text-foreground">Women's Fashion</Link></li>
            <li><Link href="#" className="hover:text-foreground">Kid's Fashion</Link></li>
            <li><Link href="#" className="hover:text-foreground">Our Collections</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">SUPPORT</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Return a product</Link></li>
            <li><Link href="#" className="hover:text-foreground">Refund Policy</Link></li>
            <li><Link href="#" className="hover:text-foreground">Track an order</Link></li>
            <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">ABOUT US</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Who we are</Link></li>
            <li><Link href="#" className="hover:text-foreground">Return & Refund Policy</Link></li>
            <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-foreground">T&C</Link></li>
          </ul>
        </div>
      </div>
      <div className="py-6 px-6 md:px-10 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground">Terms of Service</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-foreground"><Facebook className="h-5 w-5" /></Link>
          <Link href="#" className="hover:text-foreground"><Instagram className="h-5 w-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
