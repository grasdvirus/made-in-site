'use client'

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const themeClass = useMemo(() => {
        if (pathname.startsWith('/products')) {
            return 'theme-products';
        }
        if (pathname === '/discover') {
            return 'theme-discover';
        }
        if (pathname === '/') {
            return 'theme-home';
        }
        return '';
    }, [pathname]);

    return (
        <div className={cn(
            themeClass,
            'bg-background text-foreground transition-colors duration-500',
            'bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]'
            )}
        >
            {children}
        </div>
    )
}