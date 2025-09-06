import { ShippingIcon, ReturnIcon, RefundIcon } from '@/components/icons';

export function BenefitsSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
                <ShippingIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">FREE SHIPPING</h4>
                <p className="text-primary-foreground/80">Free shipping on all orders over $50.</p>
            </div>
            <div>
                <ReturnIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">7-DAY RETURNS</h4>
                <p className="text-primary-foreground/80">Not satisfied? You have 7 days to return the product.</p>
            </div>
            <div>
                <RefundIcon className="mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 font-headline">1-DAY REFUNDS</h4>
                <p className="text-primary-foreground/80">Get a refund the same day we receive the product back.</p>
            </div>
        </div>
    </section>
  );
}
