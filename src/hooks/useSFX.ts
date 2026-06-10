"use client";

import { useAudio } from "@/context/AudioContext";

export const useSFX = () => {
  const { playSfx } = useAudio();

  return { playSfx };
};
