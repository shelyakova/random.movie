'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useSearchNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') ?? '';

    const handleSearchChange = (value: string) => {
        if (value) {
            router.push(`/?search=${encodeURIComponent(value)}`);
        } else {
            router.push('/');
        }
    };

    return { currentSearch: pathname === '/' ? currentSearch : '', handleSearchChange };
}