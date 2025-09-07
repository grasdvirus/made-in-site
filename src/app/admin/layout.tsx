
'use client'

import { Header } from '@/components/layout/header';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Home, ShoppingCart, Package, Users, LineChart, Tag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin', label: 'Products', icon: Package },
        { href: '/products/femmes', label: 'Femmes', icon: Tag },
        { href: '/products/hommes', label: 'Hommes', icon: Tag },
        { href: '/products/sacs', label: 'Sacs', icon: Tag },
        { href: '/products/montres', label: 'Montres', icon: Tag },
    ];

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>
                    <Link href="/admin">
                        <h2 className="text-lg font-semibold p-2">Admin</h2>
                    </Link>
                </SidebarHeader>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton isActive={pathname.startsWith(item.href)} variant="ghost">
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
                   <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  )
}
