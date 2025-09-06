
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

// Hardcoded admin UID for now
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_UID';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.uid !== ADMIN_UID)) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }
  
  if (user.uid !== ADMIN_UID) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Tableau de bord Admin
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ici, vous pourrez bientôt ajouter, modifier et supprimer des produits. Pour l'instant, la gestion des produits se fait directement dans le code dans le fichier <code className="bg-muted p-1 rounded">src/app/products/[category]/page.tsx</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
