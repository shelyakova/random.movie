import { ComponentProps } from "react";
import Link from "next/link";

type ButtonProps = ComponentProps<"button"> & {
  href?: string;
  target?: ComponentProps<"a">["target"];
};

export default function Button({
  className,
  children,
  disabled,
  href,
  target,
  ...props
}: ButtonProps) {
  const buttonClassName = `mt-2 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-colors ${
    disabled ? "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700" : "cursor-pointer bg-[#37C6F3]"
  } ${className ?? ""}`;

  if (href && !disabled) {
    return (
      <Link href={href} target={target} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
