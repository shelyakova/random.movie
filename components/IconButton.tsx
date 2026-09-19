import { ComponentProps } from "react";
import { Tone } from "@/lib/types";

interface IconButtonProps extends ComponentProps<"button"> {
  tone?: Tone;
}

export function IconButton({
  children,
  className,
  disabled,
  tone = Tone.Default,
  ...props
}: IconButtonProps) {
  let toneClassName = "bg-neutral-fill text-zinc-700 dark:text-zinc-300";

  if (tone === Tone.Accent && !disabled) {
    toneClassName = "bg-accent text-accent-foreground";
  }

  toneClassName += disabled ? " cursor-not-allowed" : " cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${toneClassName} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
