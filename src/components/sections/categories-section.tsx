import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const categories = [
    { name: "FEMMES", image: "https://picsum.photos/400/500?random=1", hint: "woman fashion", href: "/products/femmes" },
    { name: "MONTRES", image: "https://picsum.photos/400/500?random=2", hint: "luxury watch", href: "/products/montres" },
    { name: "HOMMES", image: "https://picsum.photos/400/500?random=3", hint: "man fashion", href: "/products/hommes" },
    { name: "SACS", image: "https://picsum.photos/400/500?random=4", hint: "handbag", href: "/products/sacs" }
];

const CategoryCard = ({ image, name, hint, href }: { image: string, name: string, hint: string, href: string }) => (
    <Link href={href} className="group relative overflow-hidden rounded-xl aspect-[4/5] block">
        <Image src={image} alt={`Catégorie ${name}`} fill className="object-cover transition-transform group-hover:scale-110 duration-500" data-ai-hint={hint} />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <p className="absolute bottom-4 left-4 text-white text-xl font-semibold font-headline">{name}</p>
    </Link>
);

export function CategoriesSection() {
    return (
        <section className="py-12 px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                <h3 className="text-4xl font-bold font-headline">DÉCOUVREZ<br />NOS CATÉGORIES</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                    <p className="text-muted-foreground max-w-sm">Explorez nos collections, conçues pour vous apporter les dernières tendances et des styles intemporels.</p>
                    <Button asChild variant="outline" className="flex-shrink-0 rounded-full hidden sm:inline-flex">
                        <Link href="/products">Toutes les catégories</Link>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(cat => <CategoryCard key={cat.name} {...cat} />)}
            </div>
            <Button asChild variant="outline" className="sm:hidden block mt-6 w-full rounded-full">
                <Link href="/products">Toutes les catégories</Link>
            </Button>
        </section>
    );
};
