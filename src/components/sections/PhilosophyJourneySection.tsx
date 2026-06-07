"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Highlighter } from "@/components/ui/highlighter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// ── SCENE DATA ──
const researchData = [
  { category: "ANALYTICS", text: "Bounce rate 78%", top: "15%", left: "10%" },
  { category: "USER RESEARCH", text: "Users leave after onboarding", top: "25%", left: "65%" },
  { category: "PERFORMANCE", text: "Loading time 6.2s", top: "70%", left: "12%" },
  { category: "FEEDBACK", text: "Navigation feels confusing", top: "75%", left: "60%" },
  { category: "ACCESSIBILITY", text: "Contrast ratio issues", top: "45%", left: "75%" },
];

export default function PhilosophyJourneySection({ bgImage }: { bgImage?: string }) {
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

    // Section un-slanting (curtain parallax entrance)
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

    // Glow entrance opacity fade-in on scroll
    gsap.from(
      ".top-glow-bg, .top-glow-line",
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        }
      }
    );

    const pathLength = pathRef.current.getTotalLength();
    gsap.set(glowPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    // Initial cinematic states for text and images
    gsap.set(".scene-title", { opacity: 0, filter: "blur(8px)", scale: 0.95, y: 40 });
    gsap.set(".scene-1-heading", { opacity: 0, y: -25, filter: "blur(4px)" });
    gsap.set(".editorial-img", { opacity: 0, scale: 0.95, clipPath: "inset(10% 10% 10% 10%)" });

    // Initial states for scene numbers
    gsap.set(".scene-number-text", { opacity: 0, yPercent: 100 });

    gsap.to(".rocket-chassis", {
      y: 4,
      rotationZ: 0.5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // ── MASTER CINEMATIC TIMELINE ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=10000", 
        scrub: 0.4, 
        pin: true,
        anticipatePin: 1,
      }
    });

    // Master Translation & Path Sync (Duration: 1)
    tl.to(wrapperRef.current, { xPercent: -83.3333, ease: "none", duration: 1 }, 0);
    tl.to(rocketRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.125, 0.5],
        autoRotate: false,
      },
      ease: "none",
      duration: 1
    }, 0);
    tl.to(glowPathRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

    // ── SCENE 1: IDEA (0.00 to 0.16) ──
    tl.to(".scene-1-heading", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.05, ease: "power2.out" }, 0);
    tl.to(".scene-1-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.05, ease: "power3.out" }, 0);
    tl.to(".img-1", { opacity: 0.6, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.06, ease: "power2.out" }, 0);
    tl.to(".num-1", { yPercent: 0, opacity: 0.18, duration: 0.05, ease: "power2.out" }, 0);

    // ── SCENE 2: PROBLEM (0.16 to 0.33) ──
    tl.to(".scene-2-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.08, ease: "power3.out" }, 0.14);
    tl.to(".img-2", { opacity: 0.4, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out" }, 0.14);
    tl.to(".num-2", { yPercent: 0, opacity: 0.18, duration: 0.08, ease: "power2.out" }, 0.14);
    tl.fromTo(".research-card", 
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.1, stagger: 0.12, ease: "power3.out" }, 
      0.14
    );

    // ── SCENE 3: EXPERIENCE (0.33 to 0.50) ──
    tl.to(".scene-3-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.08, ease: "power3.out" }, 0.31);
    tl.to(".img-3", { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out" }, 0.31);
    tl.to(".num-3", { yPercent: 0, opacity: 0.18, duration: 0.08, ease: "power2.out" }, 0.31);
    tl.fromTo(".design-frame", 
      { y: 40, x: -20, opacity: 0 },
      { y: 0, x: 0, opacity: 1, duration: 0.08, stagger: 0.03, ease: "power3.out" }, 
      0.33
    );

    // ── SCENE 4: SOLUTION (0.50 to 0.66) ──
    tl.to(".scene-4-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.08, ease: "power3.out" }, 0.48);
    tl.to(".img-4", { opacity: 0.3, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out" }, 0.48);
    tl.to(".num-4", { yPercent: 0, opacity: 0.18, duration: 0.08, ease: "power2.out" }, 0.48);
    tl.to(".arch-line", { strokeDashoffset: 0, duration: 0.08, stagger: 0.02, ease: "power2.inOut" }, 0.48);
    tl.fromTo(".arch-node", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08, stagger: 0.02, ease: "back.out(1.5)" }, 0.50);

    // ── SCENE 5: DETAIL (0.66 to 0.83) ──
    tl.to(".scene-5-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.08, ease: "power3.out" }, 0.64);
    tl.to(".img-5", { opacity: 0.9, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.08, ease: "power2.out" }, 0.64);
    tl.to(".num-5", { yPercent: 0, opacity: 0.18, duration: 0.08, ease: "power2.out" }, 0.64);
    tl.fromTo(".metric-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08, stagger: 0.02, ease: "power2.out" }, 0.66);

    const counters = { perf: 0, load: 6.2 };
    tl.to(counters, {
      perf: 100,
      load: 0.8,
      duration: 0.16,
      ease: "none",
      onUpdate: () => {
        if (perfRef.current) perfRef.current.innerText = Math.round(counters.perf).toString();
        if (accessRef.current) accessRef.current.innerText = Math.round(counters.perf).toString();
        if (bestRef.current) bestRef.current.innerText = Math.round(counters.perf).toString();
        if (loadRef.current) loadRef.current.innerText = counters.load.toFixed(1) + "s";
      }
    }, 0.66);

    // ── SCENE 6: IMPACT (0.83 to 1.00) ──
    tl.to(".scene-6-title", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.1, ease: "power3.out" }, 0.81);
    tl.to(".img-6", { opacity: 0.8, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.1, ease: "power2.out" }, 0.81);
    tl.to(".num-6", { yPercent: 0, opacity: 0.18, duration: 0.1, ease: "power2.out" }, 0.81);

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full  overflow-hidden text-white font-space will-change-transform z-30 drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]"
      style={{
        clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src={bgImage}
            alt="Philosophy Journey Background"
            fill
            className="object-cover opacity-25"
            sizes="100vw"
            priority
          />
        </div>
      )}
        {/* ── Ultra Premium Top-Middle Glow & Separator ── */}
        <div className="top-glow-bg absolute top-[-100px] left-1/2 -translate-x-1/2 w-[50%] h-[200px] bg-[#f04e00] opacity-[0.15] blur-[100px] pointer-events-none rounded-[100%] z-20" />
        <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-[#f04e00]/90 to-transparent blur-[3px] pointer-events-none z-50" />
        <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] pointer-events-none z-50" />
      
      {/* ── CINEMATIC DEEP BACKGROUND ── */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* ── MASTER WRAPPER ── */}
      <div ref={wrapperRef} className="flex h-full w-[600vw] relative will-change-transform z-10">
        
        {/* ── DEPTH LAYER 0: THE INTELLIGENT ROUTE ── */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50">
          <svg viewBox="0 0 6000 1000" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <filter id="editorialGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path ref={pathRef} d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="transparent" strokeWidth="2" />
            <path d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path ref={glowPathRef} d="M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3300 250, 3500 250 C 3700 250, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500" fill="none" stroke="#f04e00" strokeWidth="2" filter="url(#editorialGlow)" />
          </svg>
        </div>

        {/* ── SCENE 1: IDEA ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-1 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              01
            </span>
          </div>
          
          <div className="editorial-img img-1 absolute top-[15%] left-[20%] w-[240px] h-[320px] rounded-2xl overflow-hidden z-10 mix-blend-luminosity hidden md:block">
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780617640/6fc4c5a6-3511-4f77-afa0-590a46fc9e63_lbsaxq.png" alt="Idea" fill className="object-cover" sizes="(max-width: 768px) 100vw, 240px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
          </div>

          {/* Philosophy Journey Heading (Only present in Scene 1) */}
          <div className="scene-1-heading absolute top-[12%] text-center z-20">
            <span className="text-[#f04e00] font-mono tracking-[0.4em] text-sm sm:text-base md:text-lg uppercase font-black">
              Philosophy Journey
            </span>
          </div>

          <div className="z-30 text-center relative mt-10 scene-title scene-1-title">
            <span className="text-white/40 font-mono tracking-[0.4em] text-xs mb-8 uppercase block">( How I Build )</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[clamp(4rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
              EVERY PRODUCT <br />
              STARTS WITH <br />
              <Highlighter action="underline" color="#facc15" strokeWidth={3} isView={true}>
                <span className="text-[#facc15] inline-flex items-center gap-2.5 align-middle">
                  AN IDEA.
                  <svg viewBox="0 0 36 12" className="w-9 h-3 inline-block stroke-[#facc15] stroke-[2] stroke-linecap-round fill-none">
                    <line x1="2" y1="3" x2="22" y2="3" className="speed-line-a" />
                    <line x1="8" y1="6" x2="32" y2="6" className="speed-line-b" />
                    <line x1="4" y1="9" x2="26" y2="9" className="speed-line-c" />
                  </svg>
                </span>
              </Highlighter>
            </h2>
          </div>
        </div>

        {/* ── SCENE 2: PROBLEM ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-2 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              02
            </span>
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

          <div className="absolute inset-0 pointer-events-none z-20">
            {researchData.map((card, i) => (
              <div 
                key={i} 
                className="research-card absolute border border-white/10 bg-gradient-to-br from-[#121212]/95 to-[#080808]/95 backdrop-blur-xl rounded-2xl p-6 w-[280px] md:w-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-2 border-t-[#f04e00]/80 hover:border-[#f04e00]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(240,78,0,0.08)] hidden md:block"
                style={{ top: card.top, left: card.left }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f04e00]" />
                  <span className="text-[#f04e00]/80 font-mono tracking-[0.2em] uppercase text-[9px] font-bold">{card.category}</span>
                </div>
                <p className="text-base md:text-lg font-medium leading-snug text-white/90">{card.text}</p>
              </div>
            ))}

            {/* Mobile-only stacked flex container for research cards */}
            <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[90%] flex flex-col gap-3 md:hidden">
              {researchData.slice(0, 2).map((card, i) => (
                <div key={i} className="border border-white/10 bg-gradient-to-br from-[#121212]/95 to-[#080808]/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] border-t border-t-[#f04e00]/70">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f04e00]" />
                    <span className="text-[#f04e00]/80 font-mono tracking-[0.2em] uppercase text-[9px] font-bold">{card.category}</span>
                  </div>
                  <p className="text-xs font-medium leading-snug text-white/90">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="z-30 w-full text-center px-10 scene-title scene-2-title">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
              Understand <br /> 
              <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#facc15]">The Problem</span>
              </Highlighter>
            </h2>
          </div>
        </div>

        {/* ── SCENE 3: EXPERIENCE ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-3 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              03
            </span>
          </div>
          
          <div className="z-30 text-left w-full max-w-7xl px-8 md:px-20 scene-title scene-3-title">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
              Design <br /> The <br />
              <Highlighter action="underline" color="#facc15" strokeWidth={3} isView={true}>
                <span className="text-[#ff8800]">Experience</span>
              </Highlighter>
            </h2>
          </div>

          <div className="absolute right-[10%] top-[20%] w-[550px] h-[450px] z-20 hidden md:block">
            {/* Premium Figma-like Canvas Frame */}
            <div className="design-frame absolute inset-0 border border-white/10 bg-gradient-to-br from-[#0e0e0e] to-[#050505] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-t-2 border-t-[#f04e00]/80 overflow-hidden flex flex-col hover:border-[#f04e00]/40 hover:shadow-[0_30px_60px_rgba(240,78,0,0.06)] transition-all duration-500">
              {/* Header Bar */}
              <div className="w-full h-12 border-b border-white/10 bg-[#111] flex items-center px-4 gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/20"/><div className="w-2.5 h-2.5 rounded-full bg-white/20"/><div className="w-2.5 h-2.5 rounded-full bg-white/20"/></div>
                <div className="w-48 h-1.5 rounded-full bg-white/10 mx-auto" />
              </div>
              <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-48 border-r border-white/10 p-4 flex flex-col gap-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-2 rounded-full bg-white/5" />)}
                </div>
                {/* Content Canvas */}
                <div className="flex-1 p-6 relative bg-[#050505] bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]">
                  <div className="editorial-img img-3 w-full h-40 rounded-lg overflow-hidden border border-white/10 mb-4 relative">
                     <Image src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800" alt="UI Design" fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 400px" />
                  </div>
                  <div className="w-3/4 h-3 rounded-full bg-white/20 mb-3" />
                  <div className="w-1/2 h-2 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 4: SOLUTION ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-4 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              04
            </span>
          </div>
          
          {/* Engineering Image Masked background */}
          <div className="editorial-img img-4 absolute left-[15%] top-[20%] w-[400px] h-[400px] z-10 opacity-20 pointer-events-none mix-blend-screen hidden md:block" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780792268/e07f0045-4c5b-4b5a-9bf9-f7dbfa403eba_e0rbq7.png" alt="Code" fill className="object-cover opacity-60" sizes="400px" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 hidden md:flex">
            {/* Cinematic Architecture SVG */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Lines now have proper IDs and stroke definitions to be animated via strokeDashoffset */}
              <path className="arch-line" d="M 350 400 L 500 500 L 700 400" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
              <path className="arch-line" d="M 500 500 L 500 650 L 750 700" fill="none" stroke="rgba(240,78,0,0.5)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>
            
            {/* Real Nodes with Solid Backgrounds */}
            <div className="arch-node absolute top-[37%] left-[18%] bg-[#0c0c0c]/90 border border-white/10 px-6 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-l-2 border-l-[#f04e00]/60 backdrop-blur-md hover:-translate-y-0.5 hover:border-l-[#f04e00] transition-all duration-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#61dafb]" /> 
              <span className="arch-label font-mono text-xs text-white/90 tracking-wide font-bold">Frontend Client</span>
            </div>
            
            <div className="arch-node absolute top-[47%] left-[30%] bg-[#0f0f0f]/90 border border-[#f04e00]/60 px-8 py-5 rounded-xl flex items-center gap-3 shadow-[0_0_40px_rgba(240,78,0,0.2)] border-t border-t-[#f04e00]/80 backdrop-blur-md hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(240,78,0,0.3)] transition-all duration-300">
              <span className="arch-label font-mono text-sm text-[#f04e00] tracking-wide font-black">API Gateway</span>
            </div>
            
            <div className="arch-node absolute top-[37%] left-[45%] bg-[#0c0c0c]/90 border border-white/10 px-6 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-l-2 border-l-[#f04e00]/60 backdrop-blur-md hover:-translate-y-0.5 hover:border-l-[#f04e00] transition-all duration-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]" /> 
              <span className="arch-label font-mono text-xs text-white/90 tracking-wide font-bold">Database Cloud</span>
            </div>
          </div>
          
          <div className="z-30 text-right w-full max-w-7xl px-8 md:px-20 scene-title scene-4-title">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
              Build The <br /> 
              <Highlighter action="underline" color="#facc15" strokeWidth={3} isView={true}>
                <span className="text-[#ff8800]">Solution</span>
              </Highlighter>
            </h2>
          </div>
        </div>

        {/* ── SCENE 5: DETAIL (Redesigned Cohesive Layout) ── */}
        <div className="w-[100vw] h-full flex flex-col items-center justify-center relative z-30 px-10">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-5 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              05
            </span>
          </div>
          
          {/* Charts image positioned as a background element on the right */}
          <div className="editorial-img img-5 absolute right-[6%] top-1/2 -translate-y-1/2 w-[300px] h-[220px] lg:w-[450px] lg:h-[330px] z-10 pointer-events-none rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden md:block">
            <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200" alt="Charts" fill className="object-cover" sizes="(max-width: 1024px) 300px, 450px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>

          <div className="scene-title scene-5-title text-center mb-8 md:mb-16 z-30">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[clamp(4rem,9vw,8rem)] font-black uppercase text-white leading-[0.9] tracking-tighter">
              OPTIMIZE EVERY <br />
              <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#ff8800]">DETAIL</span>
              </Highlighter>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-6 md:gap-12 lg:gap-20 text-center z-30 border border-white/10 bg-gradient-to-br from-[#111]/90 to-[#070707]/90 backdrop-blur-2xl rounded-2xl py-6 px-6 md:py-10 md:px-16 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-t border-t-[#f04e00]/30 hover:border-t-[#f04e00]/80 transition-all duration-700 max-w-[90%] md:max-w-none">
            <div className="metric-item flex flex-col items-center opacity-0">
              <span className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none"><span ref={perfRef}>0</span></span>
              <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.2em] text-[#f04e00] mt-3 font-bold">Performance</span>
            </div>
            <div className="metric-item flex flex-col items-center border-l-0 md:border-l border-white/10 pl-0 md:pl-12 lg:pl-20 opacity-0">
              <span className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none"><span ref={accessRef}>0</span></span>
              <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.2em] text-white/50 mt-3 font-bold">Accessibility</span>
            </div>
            <div className="metric-item flex flex-col items-center border-l-0 md:border-l border-white/10 pl-0 md:pl-12 lg:pl-20 opacity-0">
              <span className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none"><span ref={bestRef}>0</span></span>
              <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.2em] text-white/50 mt-3 font-bold">Best Practices</span>
            </div>
            <div className="metric-item flex flex-col items-center border-l-0 md:border-l border-white/10 pl-0 md:pl-12 lg:pl-20 opacity-0">
              <span className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none"><span ref={loadRef}>6.2s</span></span>
              <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.2em] text-white/50 mt-3 font-bold">Load Time</span>
            </div>
          </div>

        </div>

        {/* ── SCENE 6: IMPACT ── */}
        <div className="w-[100vw] h-full flex items-center justify-center relative">
          
          <div className="absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-6 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">
              06
            </span>
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

          <div className="z-30 text-center w-full max-w-6xl px-10 relative scene-title scene-6-title">
            <h2 className="text-3xl sm:text-4xl md:text-7xl lg:text-[clamp(5rem,12vw,10rem)] font-black uppercase leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
              FROM IDEA <br />
              TO <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                <span className="text-[#ff7300]">IMPACT.</span>
              </Highlighter>
            </h2>
            <p className="mt-16 text-white/30 font-mono tracking-[0.5em] text-xs uppercase">
              ( This is how I build )
            </p>
          </div>
        </div>

        {/* ── THE ROCKET ── */}
        <div ref={rocketRef} className="absolute top-0 left-0 w-16 h-8 md:w-36 md:h-16 z-50 pointer-events-none" style={{ transformOrigin: "50% 50%" }}>
          <div className="rocket-chassis w-full h-full relative origin-center">
            <style>{`
              @keyframes flame-flicker {
                0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.85; }
                50% { transform: scaleX(1.4) scaleY(0.9) translateY(0.5px); opacity: 1; }
              }
              .rocket-flame-inner {
                animation: flame-flicker 0.12s ease-in-out infinite;
                transform-origin: 15px 20px;
              }
              .rocket-flame-outer {
                animation: flame-flicker 0.2s ease-in-out infinite alternate;
                transform-origin: 15px 20px;
              }
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
              .speed-line-a {
                animation: speed-line-shift-1 0.7s ease-in-out infinite;
              }
              .speed-line-b {
                animation: speed-line-shift-2 0.7s ease-in-out infinite 0.15s;
              }
              .speed-line-c {
                animation: speed-line-shift-1 0.7s ease-in-out infinite 0.3s;
              }
            `}</style>
            <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="premiumBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cccccc" />
                </linearGradient>
              </defs>
              {/* Flickering Fire/Flame tail */}
              <g className="rocket-flame-g">
                {/* Outer Flame (orange-red) */}
                <path d="M 15 20 Q 5 12 -5 20 Q 5 28 15 20" fill="#f44336" opacity="0.8" className="rocket-flame-outer" />
                {/* Inner Flame (bright yellow-white) */}
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