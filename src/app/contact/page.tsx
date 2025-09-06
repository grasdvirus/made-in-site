import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Contactez-nous
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Vous avez une question ou un commentaire ? Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.
        </p>
      </div>

      <div className="max-w-xl mx-auto mt-12">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input placeholder="Votre nom" />
            <Input type="email" placeholder="Votre e-mail" />
          </div>
          <Input placeholder="Sujet" />
          <Textarea placeholder="Votre message" rows={6} />
          <div className="text-center">
            <Button type="submit">Envoyer le Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
