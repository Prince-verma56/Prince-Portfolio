"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EqualizerBars = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-[#f04e00] rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: isPlaying ? [4, 10 + Math.random() * 4, 5, 8 + Math.random() * 3, 4][i - 1] : 4,
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function AudioDock() {
  const {
    muted,
    isPlaying,
    togglePlayPause,
    audioEnabled,
  } = useAudio();

  if (!audioEnabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <motion.div
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 60px rgba(240,78,0,0.3)",
          borderColor: "rgba(240,78,0,0.4)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/10 bg-[rgba(8,8,8,.9)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,.6)]"
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
                  strokeLinecap="round" strokeLinejoin="round"
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
