import { Readex_Pro } from "next/font/google";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: "600",
});

export default function Logo() {
  return (
    <h1
      className={`${readexPro.className} mb-10 text-left text-[96px] leading-[83px] font-semibold text-black dark:text-white`}
    >
      The
      <br />
      Movie
      <br />
      List
    </h1>
  );
}
