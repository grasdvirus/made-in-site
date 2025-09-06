'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/firebase/firestore";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProductDetailsClient({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();

    const handleAddToCart = () => {
        // In a real app, you'd add the product to the cart state
        toast({
          title: "Produit ajouté au panier",
          description: `${product.name} (x${quantity}) a été ajouté à votre panier.`,
        });
      };

    return (
        <div className="grid md:grid-cols-2 gap-12">
            <div>
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={800}
                className="rounded-lg object-cover w-full aspect-[4/5]"
                data-ai-hint={product.hint}
            />
            </div>
            <div>
            <h1 className="text-4xl font-bold font-headline mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                </div>
                <span className="text-muted-foreground">(12 avis)</span>
            </div>
            <p className="text-3xl font-semibold mb-6">{product.price.toLocaleString('fr-FR')} FCFA</p>
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            <Separator className="my-6" />

            <div className="flex items-center gap-4 mb-6">
                <p>Quantité:</p>
                <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="h-8 w-12 text-center border-0 bg-transparent" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart}>Ajouter au panier</Button>

            </div>
      </div>
    )
}
