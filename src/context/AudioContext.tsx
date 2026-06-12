"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export type SFXType = "whoosh" | "click" | "tick" | "impact" | "swoosh";

interface AudioContextType {
  volume: number;
  muted: boolean;
  audioEnabled: boolean;
  isPlaying: boolean;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  playSfx: (type: SFXType) => void;
  togglePlayPause: () => void;
  startAmbientAudio: () => void;
}

const STORAGE_KEYS = {
  volume: "audio-volume",
  muted: "audio-muted",
  audioEnabled: "audio-enabled",
};

// Set to your audio file path to enable ambient music, e.g. "/sounds/RockMusic.mp3"
const AMBIENT_AUDIO_PATH = "";

const SFX_FILES: Record<SFXType, string> = {
  whoosh: "/sounds/SciFi Enter.mp3",
  click: "/sounds/SciFi Enter.mp3",
  tick: "/sounds/SciFi Enter.mp3",
  impact: "/sounds/SciFi Enter.mp3",
  swoosh: "/sounds/SciFi Enter.mp3",
};

const AudioContext = createContext<AudioContextType>({
  volume: 0.12,
  muted: false,
  audioEnabled: true,
  isPlaying: false,
  setVolume: () => { },
  toggleMute: () => { },
  playSfx: () => { },
  togglePlayPause: () => { },
  startAmbientAudio: () => { },
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const sfxPoolRef = useRef<Map<SFXType, HTMLAudioElement[]>>(new Map());
  const fadeRafRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const [volume, setVolumeState] = useState(0.12);
  const [muted, setMutedState] = useState(false);
  const [audioEnabled, setAudioEnabledState] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);
  const audioEnabledRef = useRef(audioEnabled);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const clamp = (n: number) => Math.max(0, Math.min(1, n));

  const cancelFade = () => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  const fadeIn = useCallback((targetVol: number) => {
    cancelFade();
    const el = ambientRef.current;
    if (!el) return;
    const start = el.volume;
    const duration = 300;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (ambientRef.current) ambientRef.current.volume = clamp(start + (targetVol - start) * ease);
      if (p < 1) fadeRafRef.current = requestAnimationFrame(tick);
      else fadeRafRef.current = null;
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  }, []);

  const fadeOut = useCallback(() => {
    cancelFade();
    const el = ambientRef.current;
    if (!el) return;
    const start = el.volume;
    const duration = 500;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (ambientRef.current) ambientRef.current.volume = clamp(start * (1 - ease));
      if (p < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        if (ambientRef.current) ambientRef.current.pause();
        setIsPlaying(false);
        fadeRafRef.current = null;
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  }, []);

  const startAmbientAudio = useCallback(async () => {
    const el = ambientRef.current;
    if (!el || !audioEnabledRef.current) return;

    el.volume = 0;
    el.muted = false;

    try {
      await el.play();
      hasStartedRef.current = true;
      setIsPlaying(true);
      if (!mutedRef.current) fadeIn(volumeRef.current);
    } catch {
      // If autoplay fails, reset state so next attempt can try again
      hasStartedRef.current = false;
      setIsPlaying(false);
      console.log("[Audio] Autoplay blocked, waiting for user gesture.");
    }
  }, [fadeIn]);

  const togglePlayPause = useCallback(() => {
    if (isPlayingRef.current) fadeOut();
    else startAmbientAudio();
  }, [fadeOut, startAmbientAudio]);

  const toggleMute = useCallback(() => setMutedState((p) => !p), []);
  const setVolume = useCallback((v: number) => setVolumeState(clamp(v)), []);

  const playSfx = useCallback((type: SFXType) => {
    // If ambient audio not started yet, start it first (uses user gesture from this interaction)
    const el = ambientRef.current;
    if (el && audioEnabledRef.current && (el.paused || !hasStartedRef.current)) {
      startAmbientAudio();
    }

    if (mutedRef.current || !audioEnabledRef.current) return;
    const pool = sfxPoolRef.current.get(type);
    if (!pool?.length) return;
    const audio = pool.find((a) => a.paused || a.currentTime === 0)
      ?? (pool[0].cloneNode() as HTMLAudioElement);
    audio.currentTime = 0;
    audio.volume = clamp(volumeRef.current * 0.6);
    audio.play().catch(() => { });
  }, [startAmbientAudio]);

  // Init once
  useEffect(() => {
    const savedVol = localStorage.getItem(STORAGE_KEYS.volume);
    const savedMuted = localStorage.getItem(STORAGE_KEYS.muted);
    const savedEnabled = localStorage.getItem(STORAGE_KEYS.audioEnabled);

    requestAnimationFrame(() => {
      if (savedVol) { const v = parseFloat(savedVol); setVolumeState(v); volumeRef.current = v; }
      if (savedMuted) { const m = savedMuted === "true"; setMutedState(m); mutedRef.current = m; }
      if (savedEnabled) { const e = savedEnabled === "true"; setAudioEnabledState(e); audioEnabledRef.current = e; }
      startAmbientAudio();
    });

    if (AMBIENT_AUDIO_PATH) {
      const el = new Audio(AMBIENT_AUDIO_PATH);
      el.loop = true;
      el.volume = 0;
      el.preload = "auto";
      ambientRef.current = el;
    }

    const sfxTypes: SFXType[] = ["whoosh", "click", "tick", "impact", "swoosh"];
    sfxTypes.forEach((type) => {
      const pool: HTMLAudioElement[] = [];
      for (let i = 0; i < 3; i++) {
        const a = new Audio(SFX_FILES[type]);
        a.preload = "auto";
        a.volume = 0.3;
        pool.push(a);
      }
      sfxPoolRef.current.set(type, pool);
    });

    return () => {
      cancelFade();
      const el = ambientRef.current;
      if (el) { el.pause(); el.src = ""; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume/mute
  useEffect(() => {
    const el = ambientRef.current;
    if (el && !el.paused) {
      if (!muted && el.muted) el.muted = false;
      el.volume = clamp(muted ? 0 : volume);
    }
    localStorage.setItem(STORAGE_KEYS.volume, volume.toString());
    localStorage.setItem(STORAGE_KEYS.muted, muted.toString());
  }, [volume, muted]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.audioEnabled, audioEnabled.toString());
  }, [audioEnabled]);

  // First-gesture handler
  useEffect(() => {
    const onGesture = () => {
      const el = ambientRef.current;
      if (!el || !audioEnabledRef.current) return;

      if (el.paused || !hasStartedRef.current) {
        // Never started — start now with one single gesture!
        startAmbientAudio();
      }
    };

    window.addEventListener("click", onGesture, { passive: true, once: true });
    window.addEventListener("keydown", onGesture, { passive: true, once: true });
    window.addEventListener("touchstart", onGesture, { passive: true, once: true });

    return () => {
      window.removeEventListener("click", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
  }, [startAmbientAudio]);

  return (
    <AudioContext.Provider value={{ volume, muted, audioEnabled, isPlaying, setVolume, toggleMute, playSfx, togglePlayPause, startAmbientAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);