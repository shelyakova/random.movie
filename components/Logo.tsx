import Link from "next/link";
import { Readex_Pro } from "next/font/google";
import { LogoSize } from "@/lib/types";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: "600",
});

interface LogoProps {
  size?: LogoSize;
}

export default function Logo({ size = LogoSize.Small }: LogoProps) {
  const sizeClasses =
    size === LogoSize.Large ? "text-[96px] leading-[83px]" : "text-[36px] leading-[36px]";

  return (
    <Link href="/" className="cursor-pointer">
      <p
        className={`${readexPro.className} text-left ${sizeClasses} text-foreground font-semibold`}
      >
        The
        <br />
        Movie
        <br />
        List
      </p>
    </Link>
  );
}
