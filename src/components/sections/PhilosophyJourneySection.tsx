"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Highlighter } from "@/components/ui/highlighter";
import { useSFX } from "@/hooks/useSFX";
import {
  MonitorSmartphone,
  Cpu,
  Database,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const researchData = [
  { category: "ANALYTICS", text: "Bounce rate 78%", top: "15%", left: "10%" },
  { category: "USER RESEARCH", text: "Users leave after onboarding", top: "25%", left: "65%" },
  { category: "PERFORMANCE", text: "Loading time 6.2s", top: "70%", left: "12%" },
  { category: "FEEDBACK", text: "Navigation feels confusing", top: "75%", left: "60%" },
  { category: "ACCESSIBILITY", text: "Contrast ratio issues", top: "45%", left: "75%" },
];

export default function PhilosophyJourneySection({ bgImage }: { bgImage?: string }) {
  const { playSfx } = useSFX();
  const soundTriggeredRef = useRef<Set<string>>(new Set());

  const containerRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);

  const perfRef = useRef<HTMLSpanElement>(null);
  const accessRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);
  const loadRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current || !rocketRef.current || !pathRef.current) return;

    soundTriggeredRef.current.clear();

    const isMobile = window.innerWidth < 768;
    // ── Mobile gets shorter scroll distance so it's not exhausting ──
    const scrollDistance = isMobile ? 5500 : 10000;

    gsap.fromTo(
      containerRef.current,
      { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        }
      }
    );

    gsap.from(".top-glow-bg, .top-glow-line", {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: 1,
      }
    });

    const pathLength = pathRef.current.getTotalLength();
    gsap.set(glowPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    gsap.set(".scene-title", { opacity: 0, scale: 0.95, y: 40 });
    gsap.set(".scene-1-heading", { opacity: 0, y: -25 });
    gsap.set(".editorial-img", { opacity: 0, scale: 0.95, clipPath: "inset(10% 10% 10% 10%)" });
    gsap.set(".scene-number-text", { opacity: 0, yPercent: 100 });

    gsap.to(".rocket-chassis", {
      y: 4, rotationZ: 0.5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    // 🎵 SOUND CUES - Adjust these values to change when sound effects play!
    // Format: [scrollProgress (0 to 1), soundId]
    // scrollProgress = 0 → Start of section
    // scrollProgress = 1 → End of section
    // Each scene spans ~16.66% of scroll (6 scenes total, 1/6 ≈ 0.166 per scene)
    const SOUND_CUES: Array<[number, string]> = [
      [0.005, "s1"], // Scene 1 (Idea): 5% scroll
      [0.160, "s2"], // Scene 2 (Problem): 21.6% scroll
      [0.360, "s3"], // Scene 3 (Experience): 38.3% scroll
      [0.50, "s4"], // Scene 4 (Solution): 55% scroll
      [0.716, "s5"], // Scene 5 (Detail): 71.6% scroll
      [0.883, "s6"], // Scene 6 (Impact): 88.3% scroll
    ];

    // 🎬 SCROLL TRIGGER CONFIG - Adjust these values for scroll behavior!
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current, // Element that triggers the scroll animation
        start: "top top", // Animation starts when top of container hits top of viewport
        end: `+=${scrollDistance}`, // Scroll distance for whole section
        scrub: isMobile ? 0.3 : 0.4, // How tightly animation follows scroll (smaller = more responsive!)
        pin: true, // Pin the section in place while scrolling
        anticipatePin: 1, // Helps with smooth pinning
        onLeaveBack: () => soundTriggeredRef.current.clear(),
        onUpdate: (self) => {
          const p = self.progress;
          for (const [threshold, id] of SOUND_CUES) {
            if (p >= threshold && !soundTriggeredRef.current.has(id)) {
              soundTriggeredRef.current.add(id);
              playSfx("whoosh");
            }
            if (p < threshold - 0.02) soundTriggeredRef.current.delete(id);
          }
        },
      }
    });

    tl.to(wrapperRef.current, { xPercent: -83.3333, ease: "none", duration: 1 }, 0);
    tl.to(rocketRef.current, {
      motionPath: { path: pathRef.current, align: pathRef.current, alignOrigin: [0.125, 0.5], autoRotate: false },
      ease: "none", duration: 1
    }, 0);
    tl.to(glowPathRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

    // SCENE 1 - Start at beginning
    tl.to(".scene-1-heading", { y: 0, opacity: 1, duration: 0.06, ease: "power2.out" }, 0);
    tl.to(".scene-1-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0);
    tl.to(".img-1", { opacity: 0.6, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0);
    tl.to(".num-1", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0);

    // SCENE 2 - Start at beginning
    tl.to(".scene-2-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0.166);
    tl.to(".img-2", { opacity: 0.4, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0.166);
    tl.to(".num-2", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0.166);
    tl.fromTo(".research-card",
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.02, stagger: 0.001, ease: "power3.out" }, 0.160);

    // SCENE 3 - Start at beginning
    tl.to(".scene-3-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0.333);
    tl.to(".num-3", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0.333);
    tl.fromTo(".design-grid",
      { opacity: 0, y: 80, rotate: -12 },
      { opacity: 1, y: 0, rotate: -6, duration: 0.08, ease: "power3.out" }, 0.336);
    tl.fromTo(".design-wireframe",
      { opacity: 0, y: 50, rotate: -6 },
      { opacity: 1, y: 0, rotate: -2, duration: 0.08, ease: "power3.out" }, 0.336);
    tl.fromTo(".design-final",
      { opacity: 0, scale: 0.94, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.336);
    tl.to(".img-3", { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.19, ease: "power2.out" }, 0.336);

    // SCENE 4 - Start at beginning
    tl.to(".scene-4-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0.5);
    tl.to(".img-4", { opacity: 0.3, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0.5);
    tl.to(".num-4", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0.5);
    tl.to(".arch-line", { strokeDashoffset: 0, duration: 0.06, stagger: 0.01, ease: "power2.inOut" }, 0.5);
    tl.fromTo(".arch-node",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.06, stagger: 0.01, ease: "back.out(1.5)" }, 0.5);

    // SCENE 5 - Start at beginning
    tl.to(".scene-5-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0.666);
    tl.to(".img-5", { opacity: 0.9, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0.666);
    tl.to(".num-5", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0.666);
    tl.fromTo(".metric-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.06, stagger: 0.01, ease: "power2.out" }, 0.666);

    const counters = { perf: 0, load: 6.2 };
    tl.to(counters, {
      perf: 100, load: 0.8, duration: 0.10, ease: "none",
      onUpdate: () => {
        if (perfRef.current) perfRef.current.innerText = Math.round(counters.perf).toString();
        if (accessRef.current) accessRef.current.innerText = Math.round(counters.perf).toString();
        if (bestRef.current) bestRef.current.innerText = Math.round(counters.perf).toString();
        if (loadRef.current) loadRef.current.innerText = counters.load.toFixed(1) + "s";
      }
    }, 0.666);

    // SCENE 6 - Start at beginning
    tl.to(".scene-6-title", { y: 0, opacity: 1, duration: 0.06, ease: "power3.out" }, 0.833);
    tl.to(".img-6", { opacity: 0.8, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0.833);
    tl.to(".num-6", { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, 0.833);

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden text-white font-space will-change-transform z-30 bg-[#050505] -mt-32 rounded-t-[40px] md:rounded-t-[64px] shadow-[0_-50px_100px_rgba(0,0,0,0.9)]"
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image src={bgImage} alt="Philosophy Journey Background" fill className="object-cover opacity-25" sizes="100vw" priority />
        </div>
      )}

      <div className="top-glow-bg absolute top-[-100px] left-1/2 -translate-x-1/2 w-[50%] h-[200px] bg-[#f04e00] opacity-[0.15] blur-[100px] pointer-events-none rounded-[100%] z-20" />
      <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-[#f04e00]/90 to-transparent blur-[3px] pointer-events-none z-50" />
      <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] pointer-events-none z-50" />
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]"></div>

      <div ref={wrapperRef} className="flex h-full w-[600vw] relative will-change-transform z-10">

        {/* PATH SVG */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50">
          <svg viewBox="0 0 6000 1000" preserveAspectRatio="none" className="w-full h-full">
            <path ref={pathRef} d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="transparent" strokeWidth="2" />
            <path d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path ref={glowPathRef} d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="#f04e00" strokeWidth="3" />
          </svg>
        </div>

        {/* ── SCENE 1: IDEA ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-1 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">01</span>
          </div>

          {/* Desktop image */}
          <div className="editorial-img img-1 absolute top-[15%] left-[20%] w-[240px] h-[320px] rounded-2xl overflow-hidden z-10 mix-blend-luminosity hidden md:block">
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780617640/6fc4c5a6-3511-4f77-afa0-590a46fc9e63_lbsaxq.png" alt="Idea" fill className="object-cover" sizes="240px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
          </div>

          {/* Mobile: small decorative image top-right */}
          <div className="editorial-img img-1 absolute top-[8%] right-[6%] w-[100px] h-[130px] rounded-xl overflow-hidden z-10 mix-blend-luminosity md:hidden opacity-40">
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780617640/6fc4c5a6-3511-4f77-afa0-590a46fc9e63_lbsaxq.png" alt="Idea" fill className="object-cover" sizes="100px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
          </div>

          <div className="scene-1-heading absolute top-[8%] left-0 right-0 text-center z-20 md:top-[12%]">
            <span className="text-[#f04e00] font-mono tracking-[0.4em] text-xs sm:text-sm md:text-lg uppercase font-black">
              Philosophy Journey
            </span>
          </div>

          {/* Mobile layout: stacked with supporting items */}
          <div className="z-30 w-full px-6 md:px-0 md:text-center flex flex-col md:items-center gap-6 scene-title scene-1-title mt-8 md:mt-10">
            <span className="text-white/40 font-mono tracking-[0.4em] text-[10px] md:text-xs mb-0 md:mb-8 uppercase block text-center">( How I Build )</span>
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4rem,9vw,8rem)] font-black uppercase tracking-tighter text-white text-center">
              EVERY PRODUCT <br />
              STARTS WITH <br />
              <span className="text-[#facc15] inline-flex items-center gap-2 align-middle">
                AN IDEA.
                <svg viewBox="0 0 36 12" className="w-7 h-2.5 md:w-9 md:h-3 inline-block stroke-[#facc15] stroke-[2] stroke-linecap-round fill-none">
                  <line x1="2" y1="3" x2="22" y2="3" className="speed-line-a" />
                  <line x1="8" y1="6" x2="32" y2="6" className="speed-line-b" />
                  <line x1="4" y1="9" x2="26" y2="9" className="speed-line-c" />
                </svg>
              </span>
            </h2>

            {/* Mobile-only supporting pill items */}
            <div className="flex flex-wrap gap-2 justify-center md:hidden mt-2">
              {["Vision", "Research", "Strategy"].map((tag) => (
                <span key={tag} className="border border-[#f04e00]/30 text-[#f04e00]/70 font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-[#f04e00]/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 2: PROBLEM ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-2 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">02</span>
          </div>

          <div
            className="editorial-img img-2 absolute inset-0 z-10 opacity-30 mix-blend-screen pointer-events-none"
            style={{
              WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
              maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)"
            }}
          >
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780709628/1d325170-a560-419e-aae0-de1068ef30e4_ors8v2.png" alt="Data Analytics" fill className="object-cover opacity-40 blur-sm" sizes="100vw" />
          </div>

          {/* Desktop scattered cards */}
          <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
            {researchData.map((card, i) => (
              <div
                key={i}
                className="research-card absolute border border-white/10 bg-gradient-to-br from-[#121212]/95 to-[#080808]/95 backdrop-blur-xl rounded-2xl p-6 w-[280px] md:w-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-2 border-t-[#f04e00]/80 hover:border-[#f04e00]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(240,78,0,0.08)]"
                style={{ top: card.top, left: card.left }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f04e00]" />
                  <span className="text-[#f04e00]/80 font-mono tracking-[0.2em] uppercase text-[9px] font-bold">{card.category}</span>
                </div>
                <p className="text-base md:text-lg font-medium leading-snug text-white/90">{card.text}</p>
              </div>
            ))}
          </div>

          {/* Title */}
          <div className="z-30 w-full text-center px-6 md:px-10 scene-title scene-2-title flex flex-col items-center gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white tracking-tighter drop-shadow-2xl">
              Understand <br />
              <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#facc15]">The Problem</span>
              </Highlighter>
            </h2>

            {/* Mobile-only cards — 2 compact rows */}
            <div className="flex flex-col gap-2.5 mt-6 w-[88%] md:hidden">
              {researchData.slice(0, 2).map((card, i) => (
                <div key={i} className="research-card border border-white/10 bg-gradient-to-br from-[#121212]/95 to-[#080808]/95 backdrop-blur-xl rounded-xl px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.4)] border-t border-t-[#f04e00]/60 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f04e00] shrink-0" />
                  <div>
                    <span className="text-[#f04e00]/80 font-mono tracking-[0.2em] uppercase text-[8px] font-bold block">{card.category}</span>
                    <p className="text-[11px] font-medium leading-snug text-white/80 mt-0.5">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 3: EXPERIENCE ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-3 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">03</span>
          </div>

          {/* Desktop mockup stack (right side) */}
          <div className="absolute right-[8%] top-[16%] w-[620px] h-[500px] z-20 hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] bg-[#f04e00]/8 blur-[120px] rounded-full" />
            </div>
            <div className="design-grid absolute inset-0 translate-x-[-60px] translate-y-[30px] rotate-[-6deg] rounded-2xl border border-white/5 bg-[#080808] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>
            <div className="design-wireframe absolute inset-0 translate-x-[-25px] translate-y-[10px] rotate-[-2deg] rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
              <div className="p-6 flex flex-col gap-4">
                <div className="w-1/3 h-3 rounded-full bg-white/10" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-24 rounded-xl border border-white/5" />
                  <div className="h-24 rounded-xl border border-white/5" />
                </div>
                <div className="h-32 rounded-xl border border-white/5 mt-2" />
              </div>
            </div>
            <div className="design-final absolute inset-0 rounded-2xl overflow-hidden border border-white/10 border-t-2 border-t-[#f04e00]/80 bg-linear-to-br from-[#0e0e0e] to-[#050505] shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              <div className="w-full h-12 border-b border-white/10 bg-[#111] flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="w-40 h-1.5 rounded-full bg-white/10 mx-auto" />
              </div>
              <div className="flex h-full">
                <div className="w-44 border-r border-white/10 p-5">
                  <div className="flex flex-col gap-5">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#f04e00] font-mono">Research</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono">Wireframes</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono">Design System</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-mono">Prototype</div>
                  </div>
                </div>
                <div className="flex-1 p-5 bg-[#050505]">
                  <div className="editorial-img img-3 relative w-full h-44 rounded-xl overflow-hidden border border-white/10">
                    <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780836436/ChatGPT_Image_Jun_7_2026_06_16_59_PM_au3b51.png" alt="Project UI" fill sizes="400px" className="object-cover" />
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="w-[80%] h-3 rounded-full bg-white/20" />
                    <div className="w-[55%] h-2 rounded-full bg-white/10" />
                    <div className="w-[70%] h-2 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title — left on desktop, center on mobile */}
          <div className="z-30 w-full max-w-7xl px-6 md:px-20 scene-title scene-3-title flex flex-col gap-5 md:gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase tracking-tighter text-white text-center md:text-left">
              Design <br />The <br />
              <span className="text-[#ff8800]">Experience</span>
            </h2>

            {/* Mobile-only mini mockup preview */}
            <div className="md:hidden w-full mt-2">
              {/* Mini browser mockup */}
              <div className="design-final w-full rounded-2xl overflow-hidden border border-white/10 border-t-2 border-t-[#f04e00]/70 bg-[#0c0c0c] shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
                {/* Titlebar */}
                <div className="h-8 bg-[#111] border-b border-white/10 flex items-center px-3 gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 mx-4" />
                </div>
                {/* Content */}
                <div className="p-3 flex gap-3">
                  {/* Sidebar */}
                  <div className="w-20 border-r border-white/10 pr-2 flex flex-col gap-2.5 shrink-0">
                    <div className="text-[7px] uppercase tracking-[0.2em] text-[#f04e00] font-mono">Research</div>
                    <div className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-mono">Wireframes</div>
                    <div className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-mono">System</div>
                    <div className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-mono">Prototype</div>
                  </div>
                  {/* Main */}
                  <div className="flex-1">
                    <div className="editorial-img img-3 relative w-full h-24 rounded-lg overflow-hidden border border-white/10">
                      <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780836436/ChatGPT_Image_Jun_7_2026_06_16_59_PM_au3b51.png" alt="Project UI" fill sizes="200px" className="object-cover" />
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="w-4/5 h-1.5 rounded-full bg-white/20" />
                      <div className="w-3/5 h-1 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 4: SOLUTION ── */}
        <div className="w-screen h-full flex items-center justify-center relative">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-4 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">04</span>
          </div>

          <div className="editorial-img img-4 rounded-6xl absolute left-[18%] top-[10%] w-[400px] h-[400px] z-10 opacity-20 pointer-events-none mix-blend-screen hidden md:block" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780792268/e07f0045-4c5b-4b5a-9bf9-f7dbfa403eba_e0rbq7.png" alt="Code" fill className="object-cover opacity-60" sizes="400px" />
          </div>

          {/* Desktop architecture nodes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 hidden md:flex">
            <svg className="absolute inset-0 w-full h-full">
              <path className="arch-line" d="M 350 400 L 500 500 L 700 400" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
              <path className="arch-line" d="M 500 500 L 500 650 L 750 700" fill="none" stroke="rgba(240,78,0,0.5)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>
            <div className="arch-node absolute top-[40%] left-[10%] min-w-[230px] bg-[#0c0c0c]/90 border border-white/10 border-l-2 border-l-[#f04e00]/60 px-5 py-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <MonitorSmartphone className="w-4 h-4 text-[#61dafb] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-mono">Interface</span>
                <span className="font-mono text-xs text-white/90 tracking-wide font-bold uppercase">User Experience</span>
              </div>
            </div>
            <div className="arch-node absolute top-[40%] left-[36%] min-w-[230px] bg-[#0c0c0c]/95 border border-[#f04e00]/10 border-l-2 border-l-[#f04e00] px-5 py-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <Cpu className="w-4 h-4 text-[#f04e00] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#f04e00]/70 font-mono">Core</span>
                <span className="font-mono text-xs text-white tracking-wide font-bold uppercase">Solution Engine</span>
              </div>
            </div>
            <div className="arch-node absolute bottom-[15%] left-[36%] min-w-[230px] bg-[#0c0c0c]/90 border border-white/10 border-l-2 border-l-[#f04e00]/60 px-5 py-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <Database className="w-4 h-4 text-[#3ecf8e] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-mono">Data</span>
                <span className="font-mono text-xs text-white/90 tracking-wide font-bold uppercase">Data Intelligence</span>
              </div>
            </div>
          </div>

          <div className="z-30 w-full max-w-7xl px-6 md:px-20 scene-title scene-4-title flex flex-col gap-5 md:gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white tracking-tighter drop-shadow-2xl text-center md:text-right">
              Build The <br />
              <span className="text-[#ff8800]">Solution</span>
            </h2>

            {/* Mobile-only compact arch nodes */}
            <div className="md:hidden flex flex-col gap-2.5 w-full">
              {[
                { icon: <MonitorSmartphone className="w-3.5 h-3.5 text-[#61dafb]" />, label: "Interface", title: "User Experience" },
                { icon: <Cpu className="w-3.5 h-3.5 text-[#f04e00]" />, label: "Core", title: "Solution Engine" },
                { icon: <Database className="w-3.5 h-3.5 text-[#3ecf8e]" />, label: "Data", title: "Data Intelligence" },
              ].map((node, i) => (
                <div key={i} className="arch-node bg-[#0c0c0c]/90 border border-white/10 border-l-2 border-l-[#f04e00]/60 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                  {node.icon}
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-mono block">{node.label}</span>
                    <span className="font-mono text-[11px] text-white/90 font-bold uppercase">{node.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 5: DETAIL ── */}
        <div className="w-[100vw] h-full flex flex-col items-center justify-center relative z-30 px-6 md:px-10">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-5 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">05</span>
          </div>

          <div className="editorial-img img-5 absolute right-[6%] top-1/2 -translate-y-1/2 w-[300px] h-[220px] lg:w-[450px] lg:h-[330px] z-10 pointer-events-none rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden md:block">
            <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200" alt="Charts" fill className="object-cover rounded-3xl" sizes="450px" />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>

          <div className="scene-title scene-5-title text-center mb-6 md:mb-16 z-30">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4rem,9vw,8rem)] font-black uppercase text-white tracking-tighter">
              OPTIMIZE EVERY <br />
              <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#ff8800]">DETAIL</span>
              </Highlighter>
            </h2>
          </div>

          {/* Metrics grid — 2x2 on mobile, row on desktop */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 text-center z-30 border border-white/10 bg-gradient-to-br from-[#111]/90 to-[#070707]/90 backdrop-blur-2xl rounded-2xl py-4 px-5 md:py-6 md:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-t border-t-[#f04e00]/30 hover:border-t-[#f04e00]/80 transition-all duration-700 w-auto max-w-[92%] md:max-w-none mx-auto inline-flex">
            <div className="metric-item flex flex-col items-center opacity-0 py-1">
              <span className="text-[2rem] md:text-4xl lg:text-6xl font-black text-white leading-none"><span ref={perfRef}>0</span></span>
              <span className="font-mono text-[8px] md:text-xs uppercase tracking-[0.15em] text-[#f04e00] mt-2 font-bold">Performance</span>
            </div>
            <div className="metric-item flex flex-col items-center border-l border-white/10 pl-4 md:pl-8 lg:pl-12 opacity-0 py-1">
              <span className="text-[2rem] md:text-4xl lg:text-6xl font-black text-white leading-none"><span ref={accessRef}>0</span></span>
              <span className="font-mono text-[8px] md:text-xs uppercase tracking-[0.15em] text-white/50 mt-2 font-bold">Accessibility</span>
            </div>
            <div className="metric-item flex flex-col items-center border-t border-white/10 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-8 lg:pl-12 opacity-0 py-1">
              <span className="text-[2rem] md:text-4xl lg:text-6xl font-black text-white leading-none"><span ref={bestRef}>0</span></span>
              <span className="font-mono text-[8px] md:text-xs uppercase tracking-[0.15em] text-white/50 mt-2 font-bold">Best Practices</span>
            </div>
            <div className="metric-item flex flex-col items-center border-t border-l border-white/10 pt-4 pl-4 md:border-t-0 md:pt-0 md:pl-8 lg:pl-12 opacity-0 py-1">
              <span className="text-[2rem] md:text-4xl lg:text-6xl font-black text-white leading-none"><span ref={loadRef}>6.2s</span></span>
              <span className="font-mono text-[8px] md:text-xs uppercase tracking-[0.15em] text-white/50 mt-2 font-bold">Load Time</span>
            </div>
          </div>
        </div>

        {/* ── SCENE 6: IMPACT ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">

          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-6 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">06</span>
          </div>

          <div
            className="editorial-img img-6 absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-40"
            style={{
              WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 80%)",
              maskImage: "radial-gradient(circle at center, black 20%, transparent 80%)"
            }}
          >
            <Image src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600" alt="Impact" fill className="object-cover opacity-30" sizes="100vw" />
          </div>

          <div className="z-30 text-center w-full max-w-6xl px-6 md:px-10 relative scene-title scene-6-title">
            <h2 className="text-[2.5rem] leading-[0.85] sm:text-4xl md:text-7xl lg:text-[clamp(5rem,12vw,10rem)] font-black uppercase tracking-tighter text-white drop-shadow-2xl">
              FROM IDEA <br />
              TO <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#ff7300]">IMPACT.</span>
              </Highlighter>
            </h2>
            <p className="mt-8 md:mt-16 text-white/30 font-mono tracking-[0.5em] text-[10px] md:text-xs uppercase">
              ( This is how I build )
            </p>
          </div>
        </div>

        {/* ── ROCKET ── */}
        <div ref={rocketRef} className="absolute top-0 left-0 w-12 h-6 md:w-36 md:h-16 z-50 pointer-events-none" style={{ transformOrigin: "50% 50%" }}>
          <div className="rocket-chassis w-full h-full relative origin-center">
            <style>{`
              @keyframes flame-flicker {
                0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.85; }
                50% { transform: scaleX(1.4) scaleY(0.9) translateY(0.5px); opacity: 1; }
              }
              .rocket-flame-inner { animation: flame-flicker 0.12s ease-in-out infinite; transform-origin: 15px 20px; }
              .rocket-flame-outer { animation: flame-flicker 0.2s ease-in-out infinite alternate; transform-origin: 15px 20px; }
              @keyframes speed-line-shift-1 {
                0% { transform: translateX(0px); opacity: 0.5; }
                50% { transform: translateX(3px); opacity: 1; }
                100% { transform: translateX(0px); opacity: 0.5; }
              }
              @keyframes speed-line-shift-2 {
                0% { transform: translateX(0px); opacity: 0.4; }
                50% { transform: translateX(4px); opacity: 1; }
                100% { transform: translateX(0px); opacity: 0.4; }
              }
              .speed-line-a { animation: speed-line-shift-1 0.7s ease-in-out infinite; }
              .speed-line-b { animation: speed-line-shift-2 0.7s ease-in-out infinite 0.15s; }
              .speed-line-c { animation: speed-line-shift-1 0.7s ease-in-out infinite 0.3s; }
            `}</style>
            <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="premiumBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cccccc" />
                </linearGradient>
              </defs>
              <g className="rocket-flame-g">
                <path d="M 15 20 Q 5 12 -5 20 Q 5 28 15 20" fill="#f44336" opacity="0.8" className="rocket-flame-outer" />
                <path d="M 15 20 Q 8 16 0 20 Q 8 24 15 20" fill="#ffeb3b" className="rocket-flame-inner" />
              </g>
              <path d="M 25 12 L 15 4 L 40 10 Z" fill="#888888" />
              <path d="M 25 28 L 15 36 L 40 30 Z" fill="#888888" />
              <path d="M 15 12 Q 15 6 30 6 L 85 6 Q 115 20 85 34 L 30 34 Q 15 34 15 28 Z" fill="url(#premiumBody)" />
              <path d="M 65 10 Q 90 20 65 30 Q 55 20 65 10 Z" fill="#0a0a0a" />
              <circle cx="45" cy="20" r="2" fill="#f04e00" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
