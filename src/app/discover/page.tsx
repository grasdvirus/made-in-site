import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// Générer 20 images de produits aléatoires
const products = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Produit ${i + 1}`,
    image: `https://picsum.photos/seed/${Math.random()}/400/${Math.floor(Math.random() * (600 - 400 + 1) + 400)}`,
    hint: "fashion product",
    width: 400,
    height: Math.floor(Math.random() * (600 - 400 + 1) + 400)
}));


export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Découvrez nos styles
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Inspirez-vous de notre collection. Une nouvelle sélection à chaque visite.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 sm:gap-6 lg:gap-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group break-inside-avoid">
                    <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                            <Image 
                                src={product.image} 
                                alt={product.name} 
                                width={product.width} 
                                height={product.height} 
                                className="object-cover w-full h-auto transition-transform group-hover:scale-110" 
                                data-ai-hint={product.hint} 
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
