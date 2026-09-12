import "./globals.css";
import { Roboto } from "next/font/google";
import { QueryProvider } from "@/lib/query-client";
import { ErrorModal } from "@/components";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${roboto.variable}`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
        <ErrorModal />
      </body>
    </html>
  );
}
