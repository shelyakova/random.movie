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
    size === LogoSize.Large
      ? "text-[96px] leading-[83px] tv:text-[40px] tv:leading-[40px]"
      : "text-[36px] leading-[36px] tv:text-[24px] tv:leading-[24px]";

  return (
    <Link href="/" className="focus-ring cursor-pointer rounded-lg">
      <p
        className={`${readexPro.className} text-left ${sizeClasses} text-foreground font-semibold`}
      >
        The <br className="tv:hidden" />
        Movie <br className="tv:hidden" />
        List
      </p>
    </Link>
  );
}
