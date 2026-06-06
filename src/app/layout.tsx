import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import ClientSmoothScroller from "@/components/ClientSmoothScroller";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { LoaderProvider } from "@/context/LoaderContext";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Prince Rawat — Portfolio",
  description: "B.Tech AI & Data Analytics — Developer, Designer, Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className="bg-black text-white antialiased"
        style={{ fontFamily: "var(--font-space), sans-serif" }}
        suppressHydrationWarning
      >
        <LoaderProvider>
          <Preloader />
          <Navbar />
          <ClientSmoothScroller>{children}</ClientSmoothScroller>
          <Toaster theme="dark" position="bottom-right" richColors />
        </LoaderProvider>
      </body>
    </html>
  );
}
