"use client";

import { useAudio, type SFXType } from "@/context/AudioContext";

export const useSFX = () => {
  const { playSfx } = useAudio();

  return { playSfx };
};
