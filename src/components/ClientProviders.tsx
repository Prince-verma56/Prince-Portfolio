"use client";

import dynamic from "next/dynamic";
import { LoaderProvider } from "@/context/LoaderContext";
import { AudioProvider } from "@/context/AudioContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import ClientSmoothScroller from "@/components/ClientSmoothScroller";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

// Lazy-load purely client-side heavy components — not needed for SSR
const SmoothCursor = dynamic(
  () => import("@/components/ui/smooth-cursor").then((m) => m.SmoothCursor),
  { ssr: false }
);

const AudioInitializer = dynamic(
  () => import("@/components/global/AudioInitializer"),
  { ssr: false }
);

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothCursor />
      <TooltipProvider delayDuration={100}>
        <LoaderProvider>
          <AudioProvider>
            <AudioInitializer />
            <Preloader />
            <Navbar />
            <ClientSmoothScroller>{children}</ClientSmoothScroller>

            <Toaster theme="dark" position="bottom-right" richColors />
          </AudioProvider>
        </LoaderProvider>
      </TooltipProvider>
    </>
  );
}
