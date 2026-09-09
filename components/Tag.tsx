import { ComponentProps } from "react";

export enum TagRadius {
  Full = "full",
  Lg = "lg",
}

interface TagProps extends ComponentProps<"button"> {
  selected?: boolean;
  radius?: TagRadius;
}

export default function Tag({
  className,
  children,
  selected = false,
  radius = TagRadius.Full,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      className={`max-w-full shrink-0 cursor-pointer px-4 py-2 text-sm font-medium whitespace-normal transition-colors ${
        radius === TagRadius.Lg ? "rounded-2xl" : "rounded-full"
      } ${
        selected
          ? "bg-[#9CE7FF] text-[#2988A6]"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
