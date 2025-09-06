import { StyleForm } from "./style-form";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Guide de style IA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Obtenez des recommandations de style personnalisées en fonction de votre historique de navigation
          et de vos préférences. Notre styliste IA vous aidera à découvrir de nouveaux articles que vous
          allez adorer.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <StyleForm />
      </div>
    </div>
  );
}
