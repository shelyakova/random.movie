export function NoData() {
    return (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            className="h-20 w-20 text-zinc-300 dark:text-zinc-700"
        >
            <rect x="14" y="24" width="92" height="72" rx="10" stroke="currentColor" strokeWidth={4} />
            <path d="M14 40h92" stroke="currentColor" strokeWidth={4} />
            <path d="M30 24v16M46 24v16M62 24v16" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
            <circle cx="60" cy="66" r="18" stroke="currentColor" strokeWidth={4} />
            <path d="m73 79 12 12" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
        </svg>
    );
}
