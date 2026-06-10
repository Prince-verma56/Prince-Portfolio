"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const BARS_CONFIG = [
  { height: [4, 12, 5, 10, 4], duration: 0.5 },
  { height: [4, 14, 6, 11, 4], duration: 0.6 },
  { height: [4, 11, 5, 9, 4], duration: 0.45 },
  { height: [4, 13, 6, 12, 4], duration: 0.55 },
];

const EqualizerBars = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {BARS_CONFIG.map((config, idx) => (
        <motion.div
          key={idx}
          className="w-0.5 bg-[#f04e00] rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: isPlaying ? config.height : 4,
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: idx * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function AudioDock({
  variant = "floating",
  className,
}: {
  variant?: "floating" | "navbar";
  className?: string;
}) {
  const {
    muted,
    isPlaying,
    togglePlayPause,
    audioEnabled,
  } = useAudio();

  if (!audioEnabled) return null;

  if (variant === "navbar") {
    return (
      <motion.div
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(240,78,0,0.2)",
          borderColor: "rgba(240,78,0,0.3)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "flex items-center gap-2.5 px-3 h-10 rounded-full border bg-[#050505]/50 backdrop-blur-md shadow-lg pointer-events-auto",
          className
        )}
      >
        {/* Equalizer bars */}
        <EqualizerBars isPlaying={isPlaying && !muted} />

        {/* Pulsing indicator */}
        {!muted && isPlaying ? (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#f04e00] shadow-[0_0_10px_rgba(240,78,0,.8)]"
          />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}

        {/* Play/Pause button with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlayPause}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#f04e00]/20 border border-white/10 hover:border-[#f04e00]/30 transition-all duration-300"
            >
              {isPlaying && !muted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f04e00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f04e00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="font-mono text-[10px] tracking-[0.1em] uppercase">
            {isPlaying && !muted ? "Pause" : "Play"}
          </TooltipContent>
        </Tooltip>
      </motion.div>
    );
  }

  return (
    <div className={cn("hidden md:block fixed bottom-6 right-6 z-[9999]", className)}>
      <motion.div
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 60px rgba(240,78,0,0.3)",
          borderColor: "rgba(240,78,0,0.4)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center gap-3 px-4 py-3 rounded-full border bg-[rgba(8,8,8,.9)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,.6)]"
      >
        {/* Equalizer bars */}
        <EqualizerBars isPlaying={isPlaying && !muted} />

        {/* Pulsing indicator */}
        {!muted && isPlaying ? (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-[#f04e00] shadow-[0_0_12px_rgba(240,78,0,.8)]"
          />
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/20" />
        )}

        {/* Play/Pause button with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlayPause}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#f04e00]/20 border border-white/10 hover:border-[#f04e00]/30 transition-all duration-300"
            >
              {isPlaying && !muted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f04e00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f04e00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="top" className="font-mono text-xs tracking-[0.1em] uppercase">
            {isPlaying && !muted ? "Pause" : "Play"}
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </div>
  );
}
