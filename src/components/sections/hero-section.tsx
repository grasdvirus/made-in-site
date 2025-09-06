import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="p-6 md:p-10">
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-16 lg:p-24 text-white flex flex-col justify-center min-h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1400/500')" }} data-ai-hint="fashion sale">
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold max-w-lg leading-tight font-headline">BLACK FRIDAY SALE</h2>
          <p className="mt-4 text-lg">20 Nov - 30 Nov</p>
          <p className="mt-1 text-lg font-semibold">Discount of <span className="bg-white text-black px-2 py-1 rounded">40%*</span> on all products.</p>
          <Button size="lg" className="mt-8 bg-white text-black hover:bg-gray-200 font-bold group">
            SEE PRODUCTS
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
