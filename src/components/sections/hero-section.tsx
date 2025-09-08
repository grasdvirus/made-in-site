
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSettings {
    title: string;
    subtitle: string;
    promoText: string;
    imageUrls: string[];
}

export function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [randomImageUrl, setRandomImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const docRef = doc(db, 'settings', 'homePage');
            const docSnap = await getDoc(docRef);

            let loadedSettings: HeroSettings;
            if (docSnap.exists() && docSnap.data().hero) {
                loadedSettings = docSnap.data().hero as HeroSettings;
            } else {
                // Fallback to default if no settings are found
                loadedSettings = {
                    title: 'SOLDES DU BLACK FRIDAY',
                    subtitle: '20 Nov - 30 Nov',
                    promoText: 'Réduction de 40%* sur tous les produits.',
                    imageUrls: ['https://picsum.photos/1400/500']
                };
            }
            setSettings(loadedSettings);

            if (loadedSettings.imageUrls && loadedSettings.imageUrls.length > 0) {
                const randomIndex = Math.floor(Math.random() * loadedSettings.imageUrls.length);
                setRandomImageUrl(loadedSettings.imageUrls[randomIndex]);
            }

        } catch (error) {
            console.error("Error fetching hero settings:", error);
            // Set default settings on error
            const defaultSettings = {
                title: 'SOLDES DU BLACK FRIDAY',
                subtitle: '20 Nov - 30 Nov',
                promoText: 'Réduction de 40%* sur tous les produits.',
                imageUrls: ['https://picsum.photos/1400/500']
            };
            setSettings(defaultSettings);
            setRandomImageUrl(defaultSettings.imageUrls[0]);
        } finally {
            setIsLoading(false);
        }
    };

    fetchSettings();
  }, []);

  if (isLoading || !settings || !randomImageUrl) {
    return (
        <section className="p-6 md:p-10">
             <Skeleton className="rounded-2xl w-full min-h-[500px]" />
        </section>
    );
  }

  return (
    <section className="p-6 md:p-10">
      <div 
        className="relative overflow-hidden rounded-2xl p-8 md:p-16 lg:p-24 text-white flex flex-col justify-center min-h-[500px] bg-cover bg-center transition-all duration-500" 
        style={{ backgroundImage: `url('${randomImageUrl}')` }} 
        data-ai-hint="fashion sale"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent rounded-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold max-w-lg leading-tight font-headline">{settings.title}</h2>
          <p className="mt-4 text-lg">{settings.subtitle}</p>
          <p className="mt-1 text-lg font-semibold" dangerouslySetInnerHTML={{ __html: settings.promoText.replace(/(\*.*\*)/g, '<span class="bg-white text-black px-2 py-1 rounded">$1</span>') }}></p>
          <Button size="lg" asChild className="mt-8 bg-white text-black hover:bg-gray-200 font-bold group btn-neumorphism">
            <Link href="/products">
              VOIR LES PRODUITS
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
