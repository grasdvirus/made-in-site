

'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/app/admin/products/page";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ProductDetailsClient({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(product.imageUrl);

    const { toast } = useToast();
    const { addItem } = useCart();
    
    const availableSizes = product.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const availableColors = product.colors?.split(',').map(s => s.trim()).filter(Boolean) || [];

    const handleAddToCart = () => {
        if (availableSizes.length > 0 && !selectedSize) {
            toast({ variant: 'destructive', title: "Veuillez sélectionner une taille." });
            return;
        }
        if (availableColors.length > 0 && !selectedColor) {
            toast({ variant: 'destructive', title: "Veuillez sélectionner une couleur." });
            return;
        }
        addItem(product, quantity);
        toast({
          title: "Produit ajouté au panier",
          description: `${product.name} (x${quantity}) a été ajouté à votre panier.`,
        });
      };

    return (
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                    <Image
                        src={activeImage}
                        alt={product.name}
                        width={600}
                        height={800}
                        className="rounded-lg object-cover w-full aspect-[4/5] transition-all duration-300"
                        data-ai-hint={product.hint}
                    />
                </div>
                <div className="grid grid-cols-5 gap-2">
                    <button onClick={() => setActiveImage(product.imageUrl)} className={cn("rounded-md overflow-hidden border-2", activeImage === product.imageUrl ? 'border-primary' : 'border-transparent')}>
                        <Image src={product.imageUrl} alt="Thumbnail 1" width={100} height={125} className="object-cover w-full aspect-[4/5]"/>
                    </button>
                    {product.imageUrl2 && (
                         <button onClick={() => setActiveImage(product.imageUrl2!)} className={cn("rounded-md overflow-hidden border-2", activeImage === product.imageUrl2 ? 'border-primary' : 'border-transparent')}>
                            <Image src={product.imageUrl2} alt="Thumbnail 2" width={100} height={125} className="object-cover w-full aspect-[4/5]"/>
                        </button>
                    )}
                </div>
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

            {availableSizes.length > 0 && (
                <div className="space-y-4 mb-6">
                    <p className="font-semibold">Taille : <span className="text-muted-foreground">{selectedSize}</span></p>
                    <RadioGroup value={selectedSize || undefined} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                        {availableSizes.map(size => (
                             <div key={size}>
                                <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only"/>
                                <Label htmlFor={`size-${size}`} className="h-10 w-10 flex items-center justify-center rounded-full border text-sm font-semibold cursor-pointer transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-accent hover:text-accent-foreground">
                                    {size}
                                </Label>
                             </div>
                        ))}
                    </RadioGroup>
                </div>
            )}

             {availableColors.length > 0 && (
                <div className="space-y-4 mb-6">
                    <p className="font-semibold">Couleur : <span className="text-muted-foreground">{selectedColor}</span></p>
                    <RadioGroup value={selectedColor || undefined} onValueChange={setSelectedColor} className="flex flex-wrap gap-3">
                       {availableColors.map(color => (
                             <div key={color}>
                                <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only"/>
                                <Label htmlFor={`color-${color}`} className="px-4 py-2 flex items-center justify-center rounded-md border text-sm font-semibold cursor-pointer transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-accent hover:text-accent-foreground">
                                    {color}
                                </Label>
                             </div>
                        ))}
                    </RadioGroup>
                </div>
            )}

            <div className="flex items-center gap-4 mb-6">
                <p className="font-semibold">Quantité:</p>
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
