

'use client'

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { ClientLayout } from '@/components/layout/client-layout';
import { CartProvider } from '@/hooks/use-cart.tsx';
import { usePathname } from 'next/navigation';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

// export const metadata: Metadata = {
//   title: 'EzyRetail AI',
//   description: 'Une expérience e-commerce moderne avec des guides de style alimentés par l\'IA.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <head>
        <title>EzyRetail AI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            {isAdminPage ? (
              <div className="bg-muted/40">{children}</div>
            ) : (
                <ClientLayout>
                    <div className="bg-card shadow-lg">
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </ClientLayout>
            )}
            <Toaster />
            <ScrollToTopButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
