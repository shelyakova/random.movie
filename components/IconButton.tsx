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
  let toneClassName = "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  if (tone === Tone.Accent && !disabled) {
    toneClassName = "bg-[#37C6F3] text-white";
  }

  toneClassName += disabled ? " cursor-not-allowed" : " cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${toneClassName} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
