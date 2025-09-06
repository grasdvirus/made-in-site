// @/lib/products.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'femmes' | 'hommes' | 'montres' | 'sacs';
    imageUrl: string; // Maintenant un chemin local, ex: /images/products/image.jpg
    hint?: string;
    width?: number;
    height?: number;
}

export const products: Product[] = [
    { 
        id: '1', 
        name: "COMPLET HAUT ET PANTALON", 
        price: 24000, 
        description: "Un ensemble chic et élégant, parfait pour les occasions professionnelles ou les sorties.",
        category: "femmes", 
        imageUrl: "https://picsum.photos/600/800?random=1", 
        hint: "fitted blazer" 
    },
    { 
        id: '2', 
        name: "Robe d'été florale", 
        price: 35000, 
        description: "Légère et aérée, cette robe est idéale pour les journées ensoleillées.",
        category: "femmes", 
        imageUrl: "https://picsum.photos/600/800?random=2", 
        hint: "floral dress" 
    },
    { 
        id: '3', 
        name: "Montre Classique en Cuir", 
        price: 75000, 
        description: "Une montre intemporelle avec un bracelet en cuir véritable pour un look sophistiqué.",
        category: "montres", 
        imageUrl: "https://picsum.photos/600/800?random=3", 
        hint: "classic watch" 
    },
    { 
        id: '4', 
        name: "Costume Trois-Pièces", 
        price: 120000, 
        description: "Incarnez l'élégance avec ce costume trois-pièces sur mesure.",
        category: "hommes", 
        imageUrl: "https://picsum.photos/600/800?random=4", 
        hint: "men suit" 
    },
    { 
        id: '5', 
        name: "Sac à main en cuir", 
        price: 55000, 
        description: "Un accessoire indispensable, ce sac à main en cuir allie style et fonctionnalité.",
        category: "sacs", 
        imageUrl: "https://picsum.photos/600/800?random=5", 
        hint: "leather handbag" 
    },
];

export function getProducts(): Product[] {
    return products;
}

export function getProduct(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
    return products.filter(p => p.category === category);
}
