import { Readex_Pro } from "next/font/google";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: "600",
});

export enum LogoSize {
  Small = 'small',
  Large = 'large',
}

interface LogoProps {
  size?: LogoSize;
}

export default function Logo({ size = LogoSize.Small }: LogoProps) {
  const sizeClasses = size === LogoSize.Large ? 'text-[96px] leading-[83px]' : 'text-[36px] leading-[36px]';

  return (
    <h1
      className={`${readexPro.className} text-left ${sizeClasses} font-semibold text-black dark:text-white`}
    >
      The
      <br />
      Movie
      <br />
      List
    </h1>
  );
}
