"use client";
import React, { useRef } from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(
    () => {
      if (!isLoaderFinished || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tl.from(".resume-header-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      })
        .from(
          ".resume-macbook",
          { y: 60, scale: 0.95, opacity: 0, duration: 1.2, ease: "power4.out" },
          "-=0.6"
        )
        .from(
          ".stat-left",
          { x: -30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        )
        .from(
          ".stat-right",
          { x: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        )
        .from(
          ".resume-bottom-bar",
          { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
    },
    { scope: sectionRef, dependencies: [isLoaderFinished] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#030303] py-24 md:py-32 overflow-hidden border-t border-white/5 isolate"
    >
      {/* Symmetrical Background Glow & Wireframe Textures */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="absolute w-[900px] h-[600px] bg-orange-600/15 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, transparent 20%, #030303 80%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,165,0,0.03) 40px, rgba(255,165,0,0.03) 41px)"
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">

        {/* CENTERED HEADER */}
        <div className="flex flex-col items-center text-center mb-16 z-40 relative">
          <div className="resume-header-item flex items-center gap-4 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-white/40 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase">
              Professional Overview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          </div>

          <h2 className="resume-header-item text-[clamp(3rem,6vw,5.5rem)] font-black uppercase text-white leading-none tracking-tighter mb-4">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600">RESUME.</span>
          </h2>

          <p className="resume-header-item text-neutral-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
            A comprehensive overview of my professional journey, skills, and achievements. Download my resume to learn more.
          </p>
        </div>

        {/* 3-COLUMN HERO GRID */}
        {/* Added extra padding-bottom here to give the 3D image room to pop out without hitting the bottom bar */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-4 items-center pb-24 lg:pb-32 relative">

          {/* LEFT COLUMN: Floating Stats */}
          {/* High z-index to stay above the 3D image blur */}
          <div className="order-2 lg:order-1 col-span-1 lg:col-span-3 flex flex-row lg:flex-col justify-center lg:justify-start gap-8 lg:gap-16 flex-wrap lg:pl-10 relative z-40 pointer-events-none">
            <StatItem className="stat-left pointer-events-auto" icon={<GraduationIcon />} value="2+" label="Years of Learning" />
            <StatItem className="stat-left pointer-events-auto" icon={<FolderIcon />} value="15+" label="Projects Built" />
            <StatItem className="stat-left pointer-events-auto" icon={<CodeIcon />} value="10K+" label="Lines of Code" />
          </div>

          {/* CENTER COLUMN: MacBook & 3D Preview Image */}
          {/* Lower z-index so it slides safely underneath the stats and bottom bar, but above the background */}
          <div className="order-1 lg:order-2 col-span-1 lg:col-span-6 flex justify-center relative z-20">
            {/* Added pointer-events-none so if the image overlaps buttons, you can still click through it */}
            <div className="resume-macbook w-full max-w-[800px] scale-105 lg:scale-110 pointer-events-none">
              <MacbookScroll
                title={<span />}
                src="https://images.unsplash.com/photo-1781429235828-55c8c31baf38?w=500&auto=format&fit=crop&q=60"
                showGradient={false}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Floating Stats & Quote */}
          {/* High z-index */}
          <div className="order-3 col-span-1 lg:col-span-3 flex flex-row lg:flex-col justify-center lg:justify-end gap-8 lg:gap-12 flex-wrap lg:pr-10 lg:items-end text-center lg:text-right relative z-40 pointer-events-none">
            <StatItem className="stat-right pointer-events-auto lg:items-end text-right" align="right" icon={<StackIcon />} value="5+" label="Tech Stacks" />
            <StatItem className="stat-right pointer-events-auto lg:items-end text-right" align="right" icon={<StarIcon />} value="100%" label="Dedication" />

            <div className="stat-right pointer-events-auto mt-4 p-5 rounded-2xl bg-black/40 border border-white/[0.05] backdrop-blur-md relative overflow-hidden text-left max-w-[220px]">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50" />
              <QuoteIcon className="text-orange-500 w-5 h-5 mb-3 opacity-80" />
              <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                Striving for excellence in every line of code.
              </p>
              <div className="w-8 h-px bg-orange-500/40 mt-4" />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        {/* CRITICAL FIX: Highest z-index (z-[100]), absolute positioning on mobile if needed, or relative block here to prevent 3D image overlap */}
        <div className="resume-bottom-bar w-full max-w-5xl mt-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-[100] bg-[#030303]/60 p-4 rounded-3xl backdrop-blur-xl border border-white/5">

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-inner backdrop-blur-sm">
            <CalendarIcon className="w-4 h-4 text-neutral-400" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Last Updated:</span>
              <span className="text-xs text-orange-400 font-medium">June 2026</span>
            </div>
            <span className="relative flex h-1.5 w-1.5 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-[8px] opacity-50 group-hover:opacity-80 transition duration-500"></div>
              <div className="relative bg-black rounded-xl overflow-hidden ring-1 ring-white/10">
                <ButtonWithIcon
                  label="Download Resume"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Prince_Verma_Resume.pdf"
                />
              </div>
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white/90 font-medium hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-300 backdrop-blur-md"
            >
              <EyeIcon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="text-sm tracking-wide">VIEW RESUME</span>
            </a>
          </div>

          <div className="hidden md:block w-[180px]" />
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// MICRO-COMPONENTS & ICONS
// ============================================================================

const StatItem = ({
  icon,
  value,
  label,
  className,
  align = "left"
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
  align?: "left" | "right";
}) => (
  <div className={`flex flex-col ${align === "left" ? "items-start" : "items-center lg:items-end"} gap-2 ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/80 mb-1 shadow-inner relative overflow-hidden backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      {icon}
    </div>
    <div className="text-white font-bold text-3xl tracking-tight drop-shadow-md">{value}</div>
    <div className="text-neutral-400 text-xs font-medium uppercase tracking-wider drop-shadow-sm">{label}</div>
    <div className={`w-8 h-[2px] bg-gradient-to-r ${align === "left" ? "from-orange-500/80 to-transparent" : "from-transparent to-orange-500/80"} mt-2 rounded-full`} />
  </div>
);

const GraduationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);
const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
);
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const StackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></svg>
);
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3" /></svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><circle cx="9" cy="16" r="1" /></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);