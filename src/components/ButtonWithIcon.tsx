import React from 'react';
import SlideTextButton from './kokonutui/slide-text-button';

interface ButtonWithIconProps {
  label: string;
  href?: string;
  type?: 'orange-gradient' | 'black-stroke'; // Added black stroke for later use
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
  download?: string | boolean;
}

export default function ButtonWithIcon({ label, href, target, rel, download }: ButtonWithIconProps) {
  return (
    <div className="group relative flex-shrink-0 w-fit">
      {/* Slide Text Button with slide vertical transition */}
      <SlideTextButton
        variant="custom"
        text={label}
        hoverText={`${label} ↗`}
        href={href}
        target={target}
        rel={rel}
        download={download}
        animateEntrance={false}
        className="relative flex items-center justify-center gap-3 bg-[#f04e00] hover:bg-[#ff5a1a] px-8 md:px-12 py-4 md:py-5 rounded-full transition-all duration-300 shadow-2xl shadow-[#f04e00]/20 pointer-events-auto text-white text-base md:text-lg font-extrabold uppercase tracking-widest leading-none"
      />
      
      {/* Subtle border outline as seen in Screenshot 2026-06-05 040604.png */}
      <div className="absolute inset-0 border border-white/10 rounded-full scale-[1.05] pointer-events-none" />
    </div>
  );
}
