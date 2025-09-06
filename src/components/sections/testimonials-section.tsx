import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jenny Wilson",
    avatar: "https://i.pravatar.cc/40?u=jenny",
    rating: 5,
  },
  {
    name: "Darrell Steward",
    avatar: "https://i.pravatar.cc/56?u=darrell",
    rating: 5,
    quote: "Il y a 10 ans, il était extrêmement difficile de trouver une pièce qui s'adapte à l'espace que vous créez. Des tables basses mobiles aux pièces décoratives, etc. Vous avez maintenant des designers de bon goût qui ont conçu de belles pièces parmi lesquelles choisir."
  },
  {
    name: "Jeremy Wilson",
    avatar: "https://i.pravatar.cc/40?u=jeremy",
    rating: 5,
  },
];

const TestimonialCard = ({ name, avatar, rating, quote, isCenter }: { name: string, avatar: string, rating: number, quote?: string, isCenter?: boolean }) => {
    return (
        <Card className={`text-left ${isCenter ? 'border-primary shadow-lg scale-105' : 'bg-muted/50 border-transparent hidden lg:block'}`}>
            <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <Avatar className={isCenter ? "w-14 h-14" : "w-10 h-10"}>
                        <AvatarImage src={avatar} alt={`Avatar de ${name}`} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                        <p className={`font-semibold ${isCenter ? 'text-lg' : ''}`}>{name}</p>
                        <div className="flex text-yellow-400">
                            {Array.from({ length: rating }).map((_, i) => (
                                <Star key={i} className={`w-5 h-5 fill-current ${isCenter ? '' : 'w-4 h-4'}`} />
                            ))}
                        </div>
                    </div>
                </div>
                {quote && <p className="text-muted-foreground">{quote}</p>}
            </CardContent>
        </Card>
    );
};

export function TestimonialsSection() {
    return (
        <section className="py-16 px-6 md:px-10 text-center">
            <h3 className="text-4xl font-bold mb-4 font-headline">TÉMOIGNAGES</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">Nous sommes là où nous sommes aujourd'hui grâce à vous !</p>
            <div className="relative">
                <div className="flex items-center justify-center space-x-2 md:space-x-4">
                    <TestimonialCard {...testimonials[0]} />
                    <TestimonialCard {...testimonials[1]} isCenter />
                    <TestimonialCard {...testimonials[2]} />
                </div>
            </div>
        </section>
    );
}
