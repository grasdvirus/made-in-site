'use client';

import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/about', label: 'About Us' },
  { href: '/help', label: 'Help' },
];

export function Header() {
  return (
    <header className="p-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <Link href="/" className="text-xl font-bold tracking-widest font-headline">
            EZY•RETAIL
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
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
              <span className="font-semibold">$90.49</span>
            </Button>
          </div>
          <Button variant="ghost" className="flex items-center space-x-2 pl-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/40?u=chintan" alt="User Avatar" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline font-semibold">Chintan</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm">
                <div className="flex justify-between items-center p-6 border-b -m-6 mb-6">
                    <Link href="/" className="text-xl font-bold tracking-widest font-headline">
                        EZY•RETAIL
                    </Link>
                    <SheetClose asChild>
                         <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col items-start space-y-6 text-xl font-medium">
                    {navLinks.map((link) => (
                        <SheetClose asChild key={link.label}>
                             <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                                {link.label}
                            </Link>
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
