
'use client'

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Home, ShoppingCart, Package, Users, LineChart, Tag, Settings, Info, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin/products', label: 'Produits', icon: Package },
        { href: '/admin/categories', label: 'Catégories', icon: LayoutGrid },
        { href: '/admin/settings/home', label: 'Réglages Accueil', icon: Settings },
    ];

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>
                    <Link href="/admin/products" className="flex items-center gap-2">
                         <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">40x40</div>
                        <h2 className="text-lg font-semibold">Tableau de bord</h2>
                    </Link>
                </SidebarHeader>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton isActive={pathname === item.href} variant="ghost">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <div className="flex h-screen bg-muted/40">
            <AdminSidebar />
            <div className="flex flex-col flex-1">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                   <SidebarTrigger className="sm:hidden" />
                   <h1 className="text-xl font-semibold">Admin</h1>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  )
}
