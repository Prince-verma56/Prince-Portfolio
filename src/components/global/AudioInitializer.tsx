"use client";

import { useAmbientAudio } from "@/hooks/useAmbientAudio";

export default function AudioInitializer() {
  useAmbientAudio();
  return null;
}
