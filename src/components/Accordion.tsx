"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface AccordionProps {
  index: number;
  title: string;
  content: string;
  activeFaq: number | null;
  setActiveFaq: (index: number | null) => void;
  className?: string;
}

export default function Accordion({ index, title, content, activeFaq, setActiveFaq, className = '' }: AccordionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = activeFaq === index;
  const formattedIndex = (index + 1).toString().padStart(2, "0");

  useGSAP(() => {
    if (isOpen) {
      gsap.to(panelRef.current, { height: "auto", duration: 0.45, ease: "power3.out" });
      gsap.to(".accordion-content", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.05 });
    } else {
      gsap.to(panelRef.current, { height: 0, duration: 0.35, ease: "power3.inOut" });
      gsap.to(".accordion-content", { opacity: 0, y: -8, duration: 0.2, ease: "power3.inOut" });
    }
  }, { scope: containerRef, dependencies: [isOpen] });

  return (
    <div 
      ref={containerRef}
      className={`faq-row group w-full overflow-hidden relative transition-all duration-500 ${
        isOpen ? "bg-[#f04e00]/[0.02]" : "hover:bg-white/[0.01]"
      } ${className}`}
    >
      {/* Micro glow behind index */}
      <div className="absolute -left-12 -top-12 w-28 h-28 bg-[#f04e00]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Clickable Header */}
      <button
        onClick={() => setActiveFaq(isOpen ? null : index)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-none relative z-10"
      >
        <div className="flex items-center gap-4 md:gap-6 mr-4">
          {/* Index & Orange Square */}
          <div className="flex items-center gap-3 font-mono text-sm md:text-base font-black shrink-0">
            <span className="text-white/40 group-hover:text-[#f04e00]/70 transition-colors duration-300 font-mono">
              {formattedIndex}.
            </span>
            <span className={`w-2 h-2 bg-[#f04e00] rounded-xs transition-transform duration-500 ${
              isOpen ? "scale-125 rotate-45 shadow-[0_0_8px_#f04e00]" : "group-hover:scale-110 group-hover:rotate-90"
            }`} />
          </div>
          
          <h4 
            className="text-lg md:text-xl font-bold transition-all duration-300"
            style={{
              color: isOpen ? "#f04e00" : "rgba(255, 255, 255, 0.9)",
              textShadow: isOpen ? "0 0 15px rgba(240, 78, 0, 0.25)" : "none"
            }}
          >
            {title}
          </h4>
        </div>

        {/* Circular Plus/Minus Button */}
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${
          isOpen 
            ? "border-[#f04e00] bg-[#f04e00]/10 shadow-[0_0_15px_rgba(240,78,0,0.3)] text-[#f04e00]" 
            : "border-white/10 text-white/60 group-hover:border-[#f04e00] group-hover:bg-[#f04e00]/5 group-hover:text-[#f04e00] group-hover:shadow-[0_0_10px_rgba(240,78,0,0.2)]"
        }`}>
          <div className="relative w-3.5 h-3.5 flex items-center justify-center">
            {/* Horizontal Line */}
            <span className="absolute w-full h-[1.5px] bg-current transition-transform duration-300" />
            {/* Vertical Line */}
            <span className={`absolute h-full w-[1.5px] bg-current transition-all duration-300 ${
              isOpen ? "scale-y-0 rotate-90" : "scale-y-100"
            }`} />
          </div>
        </div>
      </button>

      {/* Expandable Panel */}
      <div ref={panelRef} className="accordion-panel h-0 overflow-hidden px-6 md:px-8 pl-16 md:pl-24">
        <div className="accordion-content opacity-0 translate-y-[-8px] pb-6 md:pb-8">
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl font-light">
            {content}
          </p>
        </div>
      </div>

      {/* Animated Bottom Border */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] transition-all duration-500 ${
        isOpen ? "bg-[#f04e00]" : "bg-white/5 group-hover:bg-[#f04e00]/30"
      }`} />
    </div>
  );
}
