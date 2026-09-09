import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export default function Button({
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`mt-2 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-colors ${disabled
          ? "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700"
          : "cursor-pointer bg-[#37C6F3]"
        } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
