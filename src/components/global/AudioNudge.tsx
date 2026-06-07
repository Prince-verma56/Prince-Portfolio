"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { useLoader } from "@/context/LoaderContext";

export default function AudioNudge() {
  const { showNudge, enableAudio } = useAudio();
  const { isLoaderFinished } = useLoader();

  if (!showNudge || !isLoaderFinished) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <button
        onClick={enableAudio}
        className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-[rgba(8,8,8,.9)] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,.5)] hover:bg-[rgba(15,15,15,.95)] hover:border-[#f04e00]/30 transition-all group"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[#f04e00]/10 flex items-center justify-center group-hover:bg-[#f04e00]/20 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f04e00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-left">
          <p className="font-mono text-xs tracking-[0.15em] text-[#f04e00] uppercase mb-1">
            Enable Soundscape
          </p>
          <p className="text-sm text-white/70">
            Tap anywhere to enter the experience
          </p>
        </div>

        {/* Arrow */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/30 group-hover:text-white/50 transition-colors"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="m9 18 6-6-6-6" />
        </motion.svg>
      </button>
    </motion.div>
  );
}
