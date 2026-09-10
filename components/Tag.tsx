import { ComponentProps } from "react";

export enum TagRadius {
  Full = "full",
  Lg = "lg",
}

export enum TagTone {
  Neutral = "neutral",
  Outline = "outline",
  Info = "info",
  Rating = "rating",
}

interface TagProps extends ComponentProps<"button"> {
  selected?: boolean;
  radius?: TagRadius;
  tone?: TagTone;
}

const toneClassNames: Record<TagTone, string> = {
  [TagTone.Neutral]: "cursor-pointer bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  [TagTone.Outline]: "cursor-default border border-zinc-500 text-zinc-800 dark:border-zinc-500 dark:text-zinc-100",
  [TagTone.Info]: "cursor-default bg-[#9CE7FF] text-[#2988A6]",
  [TagTone.Rating]: "cursor-default bg-yellow-400 text-yellow-800",
};

const selectedClassName = "cursor-pointer bg-[#9CE7FF] text-[#2988A6]";

export default function Tag({
  className,
  children,
  selected = false,
  radius = TagRadius.Full,
  tone = TagTone.Neutral,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      className={`max-w-full shrink-0 px-4 py-2 text-sm font-medium whitespace-normal transition-colors ${
        radius === TagRadius.Lg ? "rounded-2xl" : "rounded-full"
      } ${selected ? selectedClassName : toneClassNames[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
