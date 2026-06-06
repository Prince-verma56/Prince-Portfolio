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
  const isOpen = activeFaq === index;

  useGSAP(() => {
    // Basic GSAP height animation when isOpen changes
    if (isOpen) {
      gsap.to(panelRef.current, { height: "auto", duration: 0.5, ease: "power2.inOut" });
    } else {
      gsap.to(panelRef.current, { height: 0, duration: 0.5, ease: "power2.inOut" });
    }
  }, { scope: panelRef, dependencies: [isOpen] });

  return (
    <div className={`faq-row group w-full overflow-hidden ${className}`}>
      
      {/* Clickable Header */}
      <button
        onClick={() => setActiveFaq(isOpen ? null : index)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer transition-colors duration-300 hover:bg-white/[0.02]"
      >
        <h4 className="text-xl md:text-2xl font-bold text-white transition-colors group-hover:text-[#f04e00]">
          {title}
        </h4>
        <span className="text-white text-3xl font-light ml-4 transition-transform duration-300 group-hover:scale-110">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      
      {/* Expandable Panel */}
      <div ref={panelRef} className="accordion-panel h-0 overflow-hidden px-6 md:px-8">
        <div className="pb-6 md:pb-8 border-t border-white/5 pt-6">
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
