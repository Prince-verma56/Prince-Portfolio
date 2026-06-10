import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import "sonner/dist/styles.css";
import { cn } from "@/lib/utils";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Prince Verma — Portfolio",
  description: "B.Tech AI & Data Analytics — Developer, Designer, Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, spaceGrotesk.variable)} suppressHydrationWarning>
      <body
        className="bg-black text-white antialiased"
        style={{ fontFamily: "var(--font-space), sans-serif" }}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
