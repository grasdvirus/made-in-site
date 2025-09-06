import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShippingIcon, ReturnIcon, RefundIcon, FileText, FileCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            À Propos d'EzyRetail
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Où vous créez votre propre style.
          </p>
        </div>
        
        <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-12">
            <Image 
                src="https://picsum.photos/1200/400" 
                alt="Notre équipe" 
                fill
                className="object-cover"
                data-ai-hint="team business"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-muted-foreground mb-16">
            <div>
                <h2 className="text-3xl font-bold font-headline text-foreground mb-4">Notre Histoire</h2>
                <p className="mb-4">
                    Fondée en 2024, EzyRetail a commencé avec une vision simple : rendre la mode de luxe accessible et personnelle. Nous avons vu une opportunité de combiner la technologie avec le stylisme personnel pour créer une expérience de magasinage unique.
                </p>
                <p>
                    Partis d'une petite boutique, nous sommes maintenant une plateforme en ligne florissante, au service des passionnés de mode du monde entier. Notre engagement envers la qualité, le style et l'innovation reste au cœur de tout ce que nous faisons.
                </p>
            </div>
            <div>
                <h2 className="text-3xl font-bold font-headline text-foreground mb-4">Notre Mission</h2>
                <p className="mb-4">
                    Notre mission est de vous donner les moyens d'exprimer votre individualité à travers la mode. Nous croyons que le style est une forme d'expression de soi, et nous nous efforçons de fournir des sélections qui répondent à tous les goûts et à toutes les occasions.
                </p>
                <p>
                    Avec notre guide de style alimenté par l'IA, nous allons au-delà de la simple vente de vêtements ; nous vous aidons à découvrir et à affiner votre style personnel, en veillant à ce que vous vous sentiez confiant et inspiré chaque jour.
                </p>
            </div>
        </div>

        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-foreground mb-4">Besoin d'aide ?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Nous sommes là pour vous aider avec vos commandes, retours et toute autre question.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Link href="/contact">
                <Card className="h-full">
                    <CardHeader>
                        <ReturnIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Retourner un produit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Contactez-nous pour initier un retour.</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/privacy-policy">
                <Card className="h-full">
                    <CardHeader>
                        <RefundIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Politique de remboursement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Consultez nos conditions de remboursement.</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/contact">
                <Card className="h-full">
                    <CardHeader>
                        <ShippingIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Suivre une commande</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Suivez votre commande en temps réel.</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/privacy-policy">
                <Card className="h-full">
                    <CardHeader>
                        <FileText className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Politique de confidentialité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Lisez notre politique de confidentialité.</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/terms-and-conditions">
                <Card className="h-full">
                    <CardHeader>
                        <FileCheck className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Termes & Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Lisez nos termes et conditions.</p>
                    </CardContent>
                </Card>
            </Link>
             <Link href="/contact">
                <Card className="h-full">
                    <CardHeader>
                        <HelpCircle className="mx-auto mb-4 h-10 w-10 text-primary" />
                        <CardTitle className="text-xl">Nous contacter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Pour toute autre question, contactez-nous.</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
