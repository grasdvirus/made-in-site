import { StyleForm } from "./style-form";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          AI Style Guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get personalized style recommendations based on your browsing history
          and preferences. Our AI stylist will help you discover new items you'll
          love.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <StyleForm />
      </div>
    </div>
  );
}
