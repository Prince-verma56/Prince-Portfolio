import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import ClientSmoothScroller from "@/components/ClientSmoothScroller";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { LoaderProvider } from "@/context/LoaderContext";
import { AudioProvider } from "@/context/AudioContext";
import AudioDock from "@/components/global/AudioDock";
import AudioInitializer from "@/components/global/AudioInitializer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { TooltipProvider } from "@/components/ui/tooltip";
import "sonner/dist/styles.css";

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
        <SmoothCursor />
        <TooltipProvider delayDuration={100}>
          <LoaderProvider>
            <AudioProvider>
              <AudioInitializer />
              <Preloader />
              <Navbar />
              <ClientSmoothScroller>{children}</ClientSmoothScroller>
              <AudioDock />
              <Toaster theme="dark" position="bottom-right" richColors />
            </AudioProvider>
          </LoaderProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
