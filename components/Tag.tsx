import { ComponentProps } from "react";
import { TagRadius, TagTone } from "@/lib/types";

interface TagProps extends ComponentProps<"button"> {
  selected?: boolean;
  radius?: TagRadius;
  tone?: TagTone;
  readOnly?: boolean;
}

const toneClassNames: Record<TagTone, string> = {
  [TagTone.Neutral]: "border border-transparent bg-neutral-fill text-zinc-700 dark:text-zinc-300",
  [TagTone.Outline]: "border border-zinc-500 text-zinc-800 dark:border-zinc-500 dark:text-zinc-100",
  [TagTone.Info]: "border border-transparent bg-info-bg text-info-foreground",
  [TagTone.Rating]: "border border-transparent bg-rating-bg text-rating-foreground",
  [TagTone.Success]: "border border-transparent bg-success-bg !text-success-foreground",
};

const selectedClassName = "border border-transparent bg-info-bg text-info-foreground";

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
