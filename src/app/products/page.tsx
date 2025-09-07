
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
  
const categories = [
    { name: "FEMMES", image: "https://picsum.photos/800/600?random=1", hint: "woman fashion", href:"/products/femmes" },
    { name: "MONTRES", image: "https://picsum.photos/800/600?random=2", hint: "luxury watch", href:"/products/montres" },
    { name: "HOMMES", image: "https://picsum.photos/800/600?random=3", hint: "man fashion", href:"/products/hommes" },
    { name: "SACS", image: "https://picsum.photos/800/600?random=4", hint: "handbag", href:"/products/sacs" }
];

export default function ProductsPage() {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            Nos Produits
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Parcourez nos collections et trouvez votre style.
          </p>
        </div>
  
        <div className="mt-12">
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>
                {categories.map((category, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Link href={category.href}>
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                        <Image src={category.image} alt={category.name} fill className="object-cover" data-ai-hint={category.hint} />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <span className="text-2xl font-semibold text-white font-headline">{category.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="block" />
                <CarouselNext className="block" />
            </Carousel>
        </div>
      </div>
    );
  }
