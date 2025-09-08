
'use client'

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2859 3333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" {...props}><path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-458 249-458 522 0 341 230 594 523 594 294 0 524-253 524-594v-1031c0-38 3-75 10-112h524v1031c0 341 230 594 523 594 294 0 524-253 524-594v-532c-266-26-499 61-770 225V0z"/></svg>
)

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.2-26.7l-7-4.1-67.6 17.7 17.9-65.8-4.4-7.1c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
)

interface SocialSettings {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
}

export function Footer() {
    const [socialLinks, setSocialLinks] = useState<SocialSettings>({ facebook: '#', instagram: '#', tiktok: '#', whatsapp: '#' });

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const docRef = doc(db, 'settings', 'socialLinks');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSocialLinks(docSnap.data() as SocialSettings);
                }
            } catch (error) {
                console.error("Error fetching social links:", error);
            }
        };
        fetchSocialLinks();
    }, []);

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-16 px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <li><Link href="/privacy-policy" className="hover:text-foreground">Politique de remboursement</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Suivre une commande</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Nous contacter</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">À PROPOS</h5>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">Qui nous sommes</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-foreground">Politique de retour et de remboursement</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-foreground">Politique de confidentialité</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-foreground">T&C</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto py-6 px-6 md:px-10 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <Link href="/privacy-policy" className="hover:text-foreground">Politique de confidentialité</Link>
          <Link href="/terms-and-conditions" className="hover:text-foreground">Conditions de service</Link>
        </div>
        <div className="flex space-x-4">
          {socialLinks.facebook && <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Facebook className="h-5 w-5" /></Link>}
          {socialLinks.instagram && <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Instagram className="h-5 w-5" /></Link>}
          {socialLinks.tiktok && <Link href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><TikTokIcon className="h-5 w-5 fill-current" /></Link>}
          {socialLinks.whatsapp && <Link href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><WhatsAppIcon className="h-5 w-5 fill-current" /></Link>}
        </div>
      </div>
    </footer>
  );
}
