"use client";

import { useAudio } from "@/context/AudioContext";
import { useLoader } from "@/context/LoaderContext";
import { useEffect, useRef } from "react";

export const useAmbientAudio = () => {
  const { isLoaderFinished } = useLoader();
  const { startAmbientAudio, audioEnabled, isPlaying } = useAudio();
  const hasTriedInitialPlay = useRef(false);

  // Try to start immediately after loader finishes with almost no delay
  useEffect(() => {
    if (isLoaderFinished && audioEnabled && !hasTriedInitialPlay.current && !isPlaying) {
      hasTriedInitialPlay.current = true;
      startAmbientAudio();
    }
  }, [isLoaderFinished, audioEnabled, isPlaying, startAmbientAudio]);

  return useAudio();
};
