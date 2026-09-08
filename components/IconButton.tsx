import { ReactNode } from "react";

export enum Tone {
    Default = "default",
    Accent = "accent",
}

export function IconButton({ children, tone = Tone.Default }: { children: ReactNode; tone?: Tone }) {
    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone === Tone.Accent
                ? "bg-[#37C6F3] text-white"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
        >
            {children}
        </div>
    );
}