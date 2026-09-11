'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useSearchNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = pathname === '/' ? (searchParams.get('search') ?? '') : '';
    const currentCategoryIds = pathname === '/'
        ? searchParams.getAll('categoryIds').map(Number)
        : [];

    const handleSearchChange = (value: string) => {
        const params = new URLSearchParams();
        if (value) params.set('search', value);
        currentCategoryIds.forEach((id) => params.append('categoryIds', String(id)));
        router.push(`/?${params}`);
    };

    const handleFilterChange = (categoryIds: number[]) => {
        const params = new URLSearchParams();
        if (currentSearch) params.set('search', currentSearch);
        categoryIds.forEach((id) => params.append('categoryIds', String(id)));
        router.push(`/?${params}`);
    };

    return { currentSearch, currentCategoryIds, handleSearchChange, handleFilterChange };
}