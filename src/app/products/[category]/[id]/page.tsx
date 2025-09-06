import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { ProductDetailsClient } from "./product-details-client";

// Mock data
const products: Record<string, any[]> = {
  femmes: [
    { id: 1, name: "Robe d'été florale", price: "79,99 €", image: "https://picsum.photos/400/600?random=11", hint: "floral dress", width: 400, height: 600, description: "Une robe d'été légère et aérée, parfaite pour les journées ensoleillées. Tissu en coton doux avec un imprimé floral vibrant." },
    { id: 2, name: "Blazer ajusté", price: "129,99 €", image: "https://picsum.photos/400/500?random=12", hint: "fitted blazer", width: 400, height: 500, description: "Un blazer élégant et ajusté qui peut être porté au bureau ou pour une soirée. Entièrement doublé avec une fermeture à un seul bouton." },
    { id: 3, name: "Jupe midi plissée", price: "69,99 €", image: "https://picsum.photos/400/550?random=13", hint: "pleated skirt", width: 400, height: 550, description: "Cette jupe midi plissée est un ajout polyvalent à votre garde-robe. Associez-la à un chemisier pour un look chic ou à un t-shirt pour une tenue décontractée." },
    { id: 4, name: "Chemisier en soie", price: "99,99 €", image: "https://picsum.photos/400/580?random=14", hint: "silk blouse", width: 400, height: 580, description: "Luxueux chemisier en pure soie. Doux au toucher avec un magnifique drapé. Parfait pour les occasions spéciales." },
  ],
  hommes: [
    { id: 1, name: "Chemise Oxford", price: "89,99 €", image: "https://picsum.photos/400/520?random=21", hint: "oxford shirt", width: 400, height: 520, description: "Chemise Oxford classique à manches longues en coton de qualité supérieure. Un incontournable de la garde-robe masculine." },
    { id: 2, name: "Chino slim", price: "79,99 €", image: "https://picsum.photos/400/580?random=22", hint: "slim chino", width: 400, height: 580, description: "Pantalon chino coupe slim en sergé de coton extensible pour un confort toute la journée. Un style polyvalent pour toutes les occasions." },
    { id: 3, name: "Polo en piqué", price: "59,99 €", image: "https://picsum.photos/400/500?random=23", hint: "pique polo", width: 400, height: 500, description: "Polo classique en tricot piqué de coton respirant. Le choix parfait pour un look décontracté mais soigné." },
    { id: 4, name: "Veste en jean", price: "149,99 €", image: "https://picsum.photos/400/600?random=24", hint: "denim jacket", width: 400, height: 600, description: "Veste en jean intemporelle avec une coupe classique. Fabriquée en denim résistant, elle est conçue pour durer." },
  ],
  montres: [
    { id: 1, name: "Montre chronographe", price: "299,99 €", image: "https://picsum.photos/400/500?random=31", hint: "chronograph watch", width: 400, height: 500, description: "Montre chronographe sportive avec un boîtier en acier inoxydable et un bracelet en cuir véritable. Étanche jusqu'à 50 mètres." },
    { id: 2, name: "Montre automatique", price: "499,99 €", image: "https://picsum.photos/400/550?random=32", hint: "automatic watch", width: 400, height: 550, description: "Une montre automatique sophistiquée avec un fond de boîtier transparent pour voir le mouvement. Bracelet en acier inoxydable." },
    { id: 3, name: "Montre minimaliste", price: "199,99 €", image: "https://picsum.photos/400/600?random=33", hint: "minimalist watch", width: 400, height: 600, description: "Design épuré et minimaliste. Cette montre présente un cadran simple avec des index bâtons et un bracelet en maille milanaise." },
    { id: 4, name: "Montre connectée", price: "349,99 €", image: "https://picsum.photos/400/520?random=34", hint: "smartwatch", width: 400, height: 520, description: "Restez connecté avec cette montre intelligente élégante. Suivi de la condition physique, notifications et cadrans personnalisables." },
  ],
  sacs: [
    { id: 1, name: "Sac à dos en cuir", price: "199,99 €", image: "https://picsum.photos/400/580?random=41", hint: "leather backpack", width: 400, height: 580, description: "Sac à dos élégant et fonctionnel en cuir véritable. Comprend un compartiment rembourré pour ordinateur portable et plusieurs poches." },
    { id: 2, name: "Sac bandoulière", price: "149,99 €", image: "https://picsum.photos/400/600?random=42", hint: "crossbody bag", width: 400, height: 600, description: "Sac bandoulière compact parfait pour transporter vos essentiels. Bandoulière réglable et fermeture à glissière sécurisée." },
    { id: 3, name: "Tote bag en toile", price: "49,99 €", image: "https://picsum.photos/400/500?random=43", hint: "canvas tote", width: 400, height: 500, description: "Tote bag spacieux en toile de coton durable. Idéal pour le shopping, la plage ou un usage quotidien." },
    { id: 4, name: "Sac de voyage", price: "249,99 €", image: "https://picsum.photos/400/550?random=44", hint: "travel bag", width: 400, height: 550, description: "Sac de voyage spacieux pour les escapades du week-end. Plusieurs compartiments pour une organisation facile. Conforme aux exigences de taille des bagages à main." },
  ],
};

const categoryNames: { [key: string]: string } = {
  femmes: "Femmes",
  hommes: "Hommes",
  montres: "Montres",
  sacs: "Sacs",
};

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { category, id } = React.use(params);
  const categoryProducts = products[category] || [];
  const product = categoryProducts.find((p) => p.id === parseInt(id));
  const categoryName = categoryNames[category] || "Catégorie";
  
  if (!product) {
    return <div>Produit non trouvé</div>;
  }
  
  const relatedProducts = categoryProducts.filter((p) => p.id !== product.id);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Produits</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products/${category}`}>
              {categoryName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetailsClient product={product} />

      <div className="mt-24">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Vous pourriez aussi aimer</h2>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
            {relatedProducts.map((relatedProduct) => (
                <CarouselItem key={relatedProduct.id} className="md:basis-1/2 lg:basis-1/4">
                    <Link href={`/products/${category}/${relatedProduct.id}`}>
                        <Card className="overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image src={relatedProduct.image} alt={relatedProduct.name} fill className="object-cover w-full h-auto transition-transform group-hover:scale-110" data-ai-hint={relatedProduct.hint} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{relatedProduct.name}</h3>
                                    <p className="text-muted-foreground">{relatedProduct.price}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
