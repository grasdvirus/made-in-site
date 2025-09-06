'use client';

import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, User, X, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/discover', label: 'Découvrir' },
];

const categoryLinks = [
    { href: '/products/femmes', label: 'Femmes' },
    { href: '/products/hommes', label: 'Hommes' },
    { href: '/products/montres', label: 'Montres' },
    { href: '/products/sacs', label: 'Sacs' },
]

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="p-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <Link
            href="/"
            className="text-xl font-bold tracking-widest font-headline"
          >
            EZY•RETAIL
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground p-0">
                        Produits
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href="/products">Toutes les catégories</Link>
                    </DropdownMenuItem>
                    {categoryLinks.map((link) => (
                        <DropdownMenuItem key={link.label} asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-border"></div>
            <Button variant="ghost">
              <ShoppingBag className="h-5 w-5 mr-2" />
              <span className="font-semibold">0,00 €</span>
            </Button>
          </div>
          {user ? (
            <>
              <Button variant="ghost" className="flex items-center space-x-2 pl-4">
                <Avatar className="w-8 h-8">
                  {user.photoURL && <AvatarImage src={user.photoURL} alt="User Avatar" />}
                  <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-semibold">{user.displayName || user.email}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Se déconnecter</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline font-semibold">Connexion</span>
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm">
              <SheetHeader className="p-6 border-b -m-6 mb-6 flex flex-row justify-between items-center">
                <SheetTitle>
                  <Link
                    href="/"
                    className="text-xl font-bold tracking-widest font-headline"
                  >
                    EZY•RETAIL
                  </Link>
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer le menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col items-start space-y-6 text-xl font-medium">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                    <Link href="/products" className="text-muted-foreground hover:text-foreground">Produits</Link>
                </SheetClose>
                 {categoryLinks.map((link) => (
                    <SheetClose asChild key={link.label}>
                        <Link href={link.href} className="ml-4 text-muted-foreground/80 hover:text-foreground text-lg">{link.label}</Link>
                    </SheetClose>
                 ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
