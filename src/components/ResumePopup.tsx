"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function ResumePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Handle click outside and ESC key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative flex flex-col items-start w-fit">

      <button
        ref={triggerRef}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="relative text-[#f04e00] text-xl md:text-2xl font-medium uppercase tracking-wide flex items-center gap-3 group cursor-pointer bg-transparent border-none p-0 pb-1"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <FileText size={24} className="relative z-10 transition-colors duration-300 group-hover:text-white" />
        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">View Resume</span>
        <span className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1">↗</span>
        {/* Underline growing left to right */}
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f04e00] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-4 w-56 bg-[#050505] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[99999] cursor-auto origin-top-left"
            role="dialog"
            aria-label="Resume Options"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white text-sm font-bold tracking-wide">Resume</h3>
            </div>

            <div className="flex flex-col p-2">
              <a
                href="https://drive.google.com/file/d/1HF7J1UBv6pOAiiDGIbBRoccwC9kWiaHf/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm group"
                onClick={() => setIsOpen(false)}
              >
                <span>View Online</span>
                <span className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
              </a>

              <a
                href="/resume/Prince_Verma_Resume.pdf"
                download
                className="flex items-center justify-between px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm group"
                onClick={() => setIsOpen(false)}
              >
                <span>Download PDF</span>
                <span className="text-[12px] opacity-50 group-hover:opacity-100 transition-opacity">↓</span>
              </a>
            </div>

            <div className="p-3 px-4 border-t border-white/10 bg-white/5">
              <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Last Updated</p>
              <p className="text-white/60 text-xs mt-1">July 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
