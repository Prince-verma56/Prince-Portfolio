"use client";
import dynamic from "next/dynamic";
import { useLoader } from "@/context/LoaderContext";

const LiquidHero = dynamic(() => import("./LiquidHero"), {
  ssr: false,
});

export default function ClientLiquidHero({
  imageUrl,
  videoUrl,
  strength,
  brushRadius,
  dissipation,
  children,
  showCustomCursor,
}: {
  imageUrl?: string;
  videoUrl?: string;
  strength?: number;
  brushRadius?: number;
  dissipation?: number;
  children?: React.ReactNode;
  showCustomCursor?: boolean;
}) {
  const { isLoaderFinished } = useLoader();

  return (
    <LiquidHero
      imageUrl={imageUrl}
      videoUrl={videoUrl}
      // Pass the loader state as the 'isPlaying' prop to the child
      isPlaying={isLoaderFinished} 
      strength={strength}
      brushRadius={brushRadius}
      dissipation={dissipation}
      showCustomCursor={showCustomCursor}
    >
      {children}
    </LiquidHero>
  );
}