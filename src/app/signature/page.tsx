
'use client'

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Link2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" {...props}><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-23.3 2.6-57.9 0 0 21.9-7 72.1 25.6 20.9-6.2 43.7-9.4 66.5-9.4 22.8 0 45.7 3.1 66.5 9.4 50.2-32.6 72.1-25.6 72.1-25.6 13.7 34.7 5.2 51.4 2.6 57.9 16 17.6 23.6 31.4 23.6 58.9 0 96.5-56.4 104.2-112.6 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
);

interface SignatureSettings {
    fullName: string;
    bio: string;
    email: string;
    phone: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
}

export default function SignaturePage() {
    const [settings, setSettings] = useState<SignatureSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'settings', 'signature');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as SignatureSettings);
                }
            } catch (error) {
                console.error("Error fetching signature page settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            Signet par Cristan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Créateur de solutions numériques sur mesure.
          </p>
        </div>
        
         {isLoading ? (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : settings ? (
            <Card className="overflow-hidden">
                <div className="relative w-full h-48 bg-muted">
                    <Image 
                        src="https://picsum.photos/800/200" 
                        alt="Bannière abstraite"
                        fill
                        className="object-cover"
                        data-ai-hint="abstract texture"
                    />
                </div>
                <CardContent className="p-8 text-center">
                    <Image 
                        src={`https://i.pravatar.cc/150?u=${settings.email}`} 
                        alt={`Photo de ${settings.fullName}`}
                        width={128}
                        height={128}
                        className="rounded-full mx-auto -mt-24 mb-4 border-4 border-background"
                        data-ai-hint="portrait professional"
                    />
                    <h2 className="text-3xl font-bold font-headline">{settings.fullName}</h2>
                    <p className="text-muted-foreground mb-6">{settings.bio}</p>

                    <div className="space-y-3 text-left max-w-sm mx-auto">
                       {settings.email && (
                            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                <Mail className="w-5 h-5 text-primary"/>
                                <span>{settings.email}</span>
                            </a>
                       )}
                       {settings.phone && (
                             <a href={`tel:${settings.phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                <Phone className="w-5 h-5 text-primary"/>
                                <span>{settings.phone}</span>
                            </a>
                       )}
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 flex justify-center gap-4">
                    {settings.portfolioUrl && <Button asChild variant="secondary"><Link href={settings.portfolioUrl} target="_blank" rel="noopener noreferrer"><Link2 className="w-4 h-4 mr-2"/>Portfolio</Link></Button>}
                    {settings.linkedinUrl && <Button asChild variant="ghost" size="icon"><Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"><LinkedInIcon className="w-5 h-5 fill-current"/></Link></Button>}
                    {settings.githubUrl && <Button asChild variant="ghost" size="icon"><Link href={settings.githubUrl} target="_blank" rel="noopener noreferrer"><GitHubIcon className="w-5 h-5 fill-current"/></Link></Button>}
                </CardFooter>
            </Card>
        ) : (
             <p className="text-center text-muted-foreground">Les informations de signature n'ont pas encore été configurées.</p>
        )}
      </div>
    </div>
  );
}
