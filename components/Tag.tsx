import { ComponentProps } from "react";
import { TagRadius, TagTone } from "@/lib/types";

interface TagProps extends ComponentProps<"button"> {
  selected?: boolean;
  radius?: TagRadius;
  tone?: TagTone;
  readOnly?: boolean;
}

const toneClassNames: Record<TagTone, string> = {
  [TagTone.Neutral]: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  [TagTone.Outline]: "border border-zinc-500 text-zinc-800 dark:border-zinc-500 dark:text-zinc-100",
  [TagTone.Info]: "bg-[#9CE7FF] text-[#2988A6]",
  [TagTone.Rating]: "bg-yellow-400 text-yellow-800",
};

const selectedClassName = "bg-[#9CE7FF] text-[#2988A6]";

export default function Tag({
  className,
  children,
  selected = false,
  radius = TagRadius.Full,
  tone = TagTone.Neutral,
  readOnly = false,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      className={`max-w-full shrink-0 px-4 py-2 text-sm font-medium whitespace-normal transition-colors ${
        radius === TagRadius.Lg ? "rounded-2xl" : "rounded-full"
      } ${selected ? selectedClassName : toneClassNames[tone]} ${className ?? ""} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
      onClick={readOnly ? undefined : props.onClick}
      {...props}
    >
      {children}
    </button>
  );
}
