import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "next/image";

// Mock data, in a real app this would come from a database
const products = {
  femmes: [
    { id: 1, name: "Robe d'été florale", price: "79,99 €", image: "https://picsum.photos/400/500?random=11", hint:"floral dress" },
    { id: 2, name: "Blazer ajusté", price: "129,99 €", image: "https://picsum.photos/400/500?random=12", hint:"fitted blazer" },
    { id: 3, name: "Jupe midi plissée", price: "69,99 €", image: "https://picsum.photos/400/500?random=13", hint:"pleated skirt" },
    { id: 4, name: "Chemisier en soie", price: "99,99 €", image: "https://picsum.photos/400/500?random=14", hint:"silk blouse" },
  ],
  hommes: [
    { id: 1, name: "Chemise Oxford", price: "89,99 €", image: "https://picsum.photos/400/500?random=21", hint:"oxford shirt" },
    { id: 2, name: "Chino slim", price: "79,99 €", image: "https://picsum.photos/400/500?random=22", hint:"slim chino" },
    { id: 3, name: "Polo en piqué", price: "59,99 €", image: "https://picsum.photos/400/500?random=23", hint:"pique polo" },
    { id: 4, name: "Veste en jean", price: "149,99 €", image: "https://picsum.photos/400/500?random=24", hint:"denim jacket" },
  ],
  montres: [
    { id: 1, name: "Montre chronographe", price: "299,99 €", image: "https://picsum.photos/400/500?random=31", hint:"chronograph watch" },
    { id: 2, name: "Montre automatique", price: "499,99 €", image: "https://picsum.photos/400/500?random=32", hint:"automatic watch" },
    { id: 3, name: "Montre minimaliste", price: "199,99 €", image: "https://picsum.photos/400/500?random=33", hint:"minimalist watch" },
    { id: 4, name: "Montre connectée", price: "349,99 €", image: "https://picsum.photos/400/500?random=34", hint:"smartwatch" },
  ],
  sacs: [
    { id: 1, name: "Sac à dos en cuir", price: "199,99 €", image: "https://picsum.photos/400/500?random=41", hint:"leather backpack" },
    { id: 2, name: "Sac bandoulière", price: "149,99 €", image: "https://picsum.photos/400/500?random=42", hint:"crossbody bag" },
    { id: 3, name: "Tote bag en toile", price: "49,99 €", image: "https://picsum.photos/400/500?random=43", hint:"canvas tote" },
    { id: 4, name: "Sac de voyage", price: "249,99 €", image: "https://picsum.photos/400/500?random=44", hint:"travel bag" },
  ],
};

const categoryNames: { [key: string]: string } = {
    femmes: "Femmes",
    hommes: "Hommes",
    montres: "Montres",
    sacs: "Sacs",
}

export default function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;
    const categoryProducts = products[category as keyof typeof products] || [];
    const categoryName = categoryNames[category] || "Catégorie";

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
                        <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-4xl font-bold tracking-tight font-headline mb-8">{categoryName}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" data-ai-hint={product.hint} />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-muted-foreground">{product.price}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
