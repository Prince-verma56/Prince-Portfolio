"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import { Highlighter } from "../ui/highlighter";

gsap.registerPlugin(ScrollTrigger);

// ── THE PRODUCT FRAMEWORK DATA ──
const phases = [
  {
    id: "01",
    name: "Understand",
    titleTop: "UNDERSTAND",
    titleBottom: "THE PROBLEM",
    bgText: "RESEARCH",
    details: ["User Research", "Analytics", "Interviews"],
    visual: (
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <div className="absolute w-[280px] h-[160px] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-4 transform -translate-x-12 -translate-y-8 eco-item opacity-0">
          <div className="w-4 h-4 rounded-full bg-[#f04e00]/80 mb-4" />
          <div className="w-3/4 h-2 bg-white/10 rounded-full mb-3" />
          <div className="w-1/2 h-2 bg-white/5 rounded-full" />
        </div>
        <div className="absolute w-[320px] h-[180px] border border-[#f04e00]/20 bg-[#050505]/90 backdrop-blur-xl rounded-xl p-6 shadow-[0_0_40px_rgba(240,78,0,0.1)] transform translate-x-16 translate-y-12 eco-item opacity-0 z-10">
          <div className="w-full flex justify-between items-center mb-6">
            <span className="font-mono text-[10px] text-white/40 tracking-widest">USER_DATA.JSON</span>
            <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-white/20 rounded-full" /><div className="w-1.5 h-1.5 bg-white/20 rounded-full" /></div>
          </div>
          <div className="w-full h-[60px] border-b border-l border-white/10 relative">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M0,60 L40,40 L100,50 L160,20 L240,30 L300,10" fill="none" stroke="#f04e00" strokeWidth="2" className="draw-path" strokeDasharray="500" strokeDashoffset="500" />
            </svg>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "02",
    name: "Design",
    titleTop: "DESIGN",
    titleBottom: "THE EXPERIENCE",
    bgText: "DESIGN",
    details: ["Wireframes", "Layouts", "Component Maps"],
    visual: (
      <div className="relative w-full h-[300px] flex items-center justify-center">
        {/* Figma-like interface drawing itself */}
        <div className="w-[600px] h-[340px] border border-white/10 rounded-lg flex flex-col eco-item opacity-0 overflow-hidden relative">
          {/* Construction Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          <div className="w-full h-10 border-b border-white/10 flex items-center px-4 gap-3 bg-[#0a0a0a]/50">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-32 h-2 rounded-full bg-white/10 mx-auto" />
          </div>
          <div className="flex-1 flex p-6 gap-6 z-10">
            <div className="w-[120px] h-full flex flex-col gap-3">
              {[...Array(5)].map((_, i) => <div key={i} className="w-full h-4 bg-white/5 rounded-sm draw-box scale-x-0 origin-left" />)}
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-full h-24 border border-[#f04e00]/40 rounded-lg bg-[#f04e00]/5 draw-box scale-y-0 origin-top" />
              <div className="flex gap-4 flex-1">
                <div className="flex-1 border border-white/10 rounded-lg bg-white/[0.02] draw-box scale-x-0 origin-left" />
                <div className="flex-1 border border-white/10 rounded-lg bg-white/[0.02] draw-box scale-x-0 origin-left" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "03",
    name: "Build",
    titleTop: "BUILD",
    titleBottom: "THE SOLUTION",
    bgText: "SYSTEMS",
    details: ["API Architecture", "Frontend Nodes", "Databases"],
    visual: (
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
          <path d="M 200 150 L 400 100 L 600 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="draw-path" strokeDasharray="1000" strokeDashoffset="1000" />
          <path d="M 400 100 L 400 250 L 600 200" fill="none" stroke="#f04e00" strokeWidth="1.5" className="draw-path" strokeDasharray="1000" strokeDashoffset="1000" />
          <path d="M 200 150 L 400 250" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="draw-path" strokeDasharray="1000" strokeDashoffset="1000" />
        </svg>

        <div className="absolute top-[120px] left-[150px] eco-item opacity-0 scale-50 bg-[#050505] border border-white/10 px-5 py-3 rounded-lg shadow-2xl flex flex-col items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#61dafb]" />
          <span className="font-mono text-[9px] text-white/50 tracking-widest">FRONTEND</span>
        </div>

        <div className="absolute top-[60px] left-[350px] eco-item opacity-0 scale-50 bg-[#0a0a0a] border border-[#f04e00]/50 px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(240,78,0,0.15)] flex flex-col items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-[#f04e00] animate-pulse" />
          <span className="font-mono text-[10px] text-white tracking-widest font-bold">API GATEWAY</span>
        </div>

        <div className="absolute top-[220px] left-[350px] eco-item opacity-0 scale-50 bg-[#050505] border border-white/10 px-5 py-3 rounded-lg shadow-2xl flex flex-col items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
          <span className="font-mono text-[9px] text-white/50 tracking-widest">DATABASE</span>
        </div>

        <div className="absolute top-[120px] left-[550px] eco-item opacity-0 scale-50 bg-[#050505] border border-white/10 px-5 py-3 rounded-lg shadow-2xl flex flex-col items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="font-mono text-[9px] text-white/50 tracking-widest">EXTERNAL SVC</span>
        </div>
      </div>
    )
  },
  {
    id: "04",
    name: "Optimize",
    titleTop: "OPTIMIZE",
    titleBottom: "THE DETAILS",
    bgText: "PERFORMANCE",
    details: ["Lighthouse", "Micro-interactions", "Loading States"],
    visual: (
      <div className="relative w-full h-[300px] flex items-center justify-center gap-12">
        <div className="flex flex-col items-center eco-item opacity-0 translate-y-10">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="64" cy="64" r="60" fill="none" stroke="#00e676" strokeWidth="4" className="draw-path" strokeDasharray="377" strokeDashoffset="377" />
            </svg>
            <span className="absolute text-3xl font-black text-[#00e676]">100</span>
          </div>
          <span className="font-mono text-[10px] text-white/40 tracking-widest">PERFORMANCE</span>
        </div>

        <div className="flex flex-col items-center eco-item opacity-0 translate-y-10" style={{ transitionDelay: "100ms" }}>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="64" cy="64" r="60" fill="none" stroke="#00e676" strokeWidth="4" className="draw-path" strokeDasharray="377" strokeDashoffset="377" />
            </svg>
            <span className="absolute text-3xl font-black text-[#00e676]">100</span>
          </div>
          <span className="font-mono text-[10px] text-white/40 tracking-widest">ACCESSIBILITY</span>
        </div>

        <div className="w-[200px] h-[120px] border-l border-b border-white/20 relative eco-item opacity-0 ml-8">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,100 C 40,100 60,40 100,60 C 140,80 160,20 200,10" fill="none" stroke="#f04e00" strokeWidth="2" className="draw-path" strokeDasharray="500" strokeDashoffset="500" />
          </svg>
          <span className="absolute -bottom-6 right-0 font-mono text-[9px] text-[#f04e00]">0.8s LOAD</span>
        </div>
      </div>
    )
  },
  {
    id: "05",
    name: "Scale",
    titleTop: "SCALE",
    titleBottom: "THE PRODUCT",
    bgText: "SCALING",
    details: ["Infrastructure", "Deployments", "Monitoring"],
    visual: (
      <div className="relative w-full h-[300px] flex items-center justify-center">
        {/* Radar / Scaling Infrastructure */}
        <div className="relative w-full h-full flex items-center justify-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-[#f04e00] rounded-full scale-circle opacity-0"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
              }}
            />
          ))}

          <div className="z-10 w-24 h-24 bg-[#0a0a0a] border border-white/20 rounded-xl flex items-center justify-center shadow-2xl eco-item opacity-0 scale-50">
            <span className="font-mono text-[10px] text-white/60 tracking-widest text-center">CORE<br />CLUSTER</span>
          </div>

          <div className="absolute top-[40px] left-[200px] w-16 h-16 bg-[#050505] border border-white/10 rounded-lg eco-item opacity-0" />
          <div className="absolute bottom-[60px] right-[250px] w-16 h-16 bg-[#050505] border border-white/10 rounded-lg eco-item opacity-0" />
          <div className="absolute top-[80px] right-[180px] w-16 h-16 bg-[#050505] border border-white/10 rounded-lg eco-item opacity-0" />
        </div>
      </div>
    )
  }
];

export default function TechStackSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);

  // ── MASTER ENTRANCE & PINNING LOGIC ──
  useGSAP(() => {
    if (!isLoaderFinished || !containerRef.current) return;

    // Preserve the Slant entrance glow & unslanting
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

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${phases.length * 150}vh`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      // When PhilosophyJourneySection starts to enter, drop our z-index
      // so it cleanly slides over us
      onLeave: () => {
        gsap.set(containerRef.current, { zIndex: 5 });
      },
      onEnterBack: () => {
        gsap.set(containerRef.current, { zIndex: 10 });
      },
      onUpdate: (self) => {
        const index = Math.min(
          phases.length - 1,
          Math.floor(self.progress * phases.length)
        );
        setActiveIndex(prev => (prev !== index ? index : prev));
      }
    });

    // ⚠️  activeIndex intentionally NOT here — adding it re-creates the
    // ScrollTrigger pin on every scroll tick, causing duplicate fixed-position
    // elements and z-index chaos.
  }, { scope: containerRef, dependencies: [isLoaderFinished] });

  // ── CINEMATIC SCROLL-TRIGGERED CROSSFADES ──
  useGSAP(() => {
    const prev = prevIndexRef.current;
    if (prev === activeIndex) return;

    const tl = gsap.timeline();

    // 1. Animate OUT previous scene
    tl.to(`.phase-content-${prev}`, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0);

    // 2. Animate IN new scene
    tl.set(`.phase-content-${activeIndex}`, { opacity: 1, zIndex: 10 }, 0.4);
    tl.set(`.phase-content-${prev}`, { zIndex: 1 }, 0.4);

    // Title 1 Slide Up
    tl.fromTo(`.phase-content-${activeIndex} .title-top`,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
      0.4
    );

    // Title 2 Clip Reveal
    tl.fromTo(`.phase-content-${activeIndex} .title-bottom`,
      { clipPath: "inset(100% 0 0 0)", y: 10 },
      { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.8, ease: "expo.out" },
      0.5
    );

    // Reveal Ecosystem Items (Scale/Fade)
    const ecoItems = gsap.utils.toArray(`.phase-content-${activeIndex} .eco-item`);
    if (ecoItems.length) {
      tl.fromTo(ecoItems,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: "back.out(1.2)" },
        0.6
      );
    }

    // Reveal Ecosystem Drawings (SVG Paths & Skeletons)
    const drawPaths = gsap.utils.toArray(`.phase-content-${activeIndex} .draw-path`);
    if (drawPaths.length) {
      tl.to(drawPaths,
        { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: "power2.inOut" },
        0.7
      );
    }
    const drawBoxes = gsap.utils.toArray(`.phase-content-${activeIndex} .draw-box`);
    if (drawBoxes.length) {
      tl.to(drawBoxes,
        { scaleX: 1, scaleY: 1, duration: 0.8, stagger: 0.05, ease: "expo.out" },
        0.7
      );
    }

    // Scale Animation specific to Scene 5
    if (activeIndex === 4) {
      const scaleCircles = gsap.utils.toArray(`.phase-content-${activeIndex} .scale-circle`);
      if (scaleCircles.length) {
        tl.to(scaleCircles,
          { opacity: 0.2, scale: 1.2, duration: 1.5, stagger: 0.15, ease: "power2.out" },
          0.6
        );
      }
    }

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div className="w-full relative z-10 drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]" style={{ isolation: 'isolate' }}>
      <section
        ref={containerRef}
        id="techstack"
        className="relative w-full h-screen bg-[#050505] overflow-hidden will-change-transform flex flex-col items-center"
        style={{
          clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        {/* ── Ultra Premium Edge Lighting ── */}
        <div className="absolute top-[-150px] left-[50%] -translate-x-1/2 w-[60%] h-[300px] bg-[#f04e00] opacity-[0.12] blur-[120px] pointer-events-none rounded-[100%]" />

        {/* ── CINEMATIC DEEP BACKGROUND ── */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* ── MICRO DETAILS (Corners) ── */}
        <div className="absolute top-10 left-10 text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase z-20">PHASE {phases[activeIndex].id}</div>
        <div className="absolute top-10 right-10 text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase z-20">ACTIVE PROCESS</div>
        <div className="absolute bottom-10 left-10 text-[#f04e00]/60 font-mono text-[10px] tracking-[0.3em] uppercase z-20">SCROLL TO EXPLORE</div>
        <div className="absolute bottom-10 right-10 text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase z-20">2026 SYSTEM</div>

        {/* ── PROGRESS INDICATOR (Left Sidebar) ── */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 hidden lg:flex">
          {phases.map((phase, i) => {
            const isActive = i === activeIndex;
            const isPassed = i < activeIndex;
            return (
              <div key={phase.id} className="flex items-center gap-4 group transition-opacity duration-300">
                <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? 'text-[#f04e00]' : isPassed ? 'text-white/40' : 'text-white/20'}`}>
                  {phase.id}
                </span>
                <div className="w-[1px] h-6 bg-white/10 relative mx-1">
                  <div className={`absolute top-0 left-0 w-full bg-[#f04e00] transition-all duration-500 ease-out ${isActive || isPassed ? 'h-full' : 'h-0'}`} />
                </div>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-[#f04e00] scale-125 shadow-[0_0_10px_rgba(240,78,0,0.5)]' : isPassed ? 'bg-white/40' : 'bg-transparent border border-white/20'}`} />
                <span className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ${isActive ? 'text-white font-bold translate-x-1' : isPassed ? 'text-white/40' : 'text-white/20'}`}>
                  {phase.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── MASSIVE BACKGROUND TYPOGRAPHY ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.015] whitespace-nowrap pointer-events-none z-0 tracking-tighter transition-all duration-1000 ease-out select-none mix-blend-screen">
          {phases[activeIndex].bgText}
        </div>

        {/* ── CENTERED EVOLVING COMPOSITION ── */}
        <div className="relative w-full max-w-[1000px] h-full mx-auto flex flex-col items-center justify-center z-10">

          {phases.map((phase, i) => (
            <div
              key={`phase-${phase.id}`}
              className={`phase-content-${i} absolute inset-0 w-full flex flex-col items-center justify-center will-change-transform`}
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 1, pointerEvents: i === activeIndex ? "auto" : "none" }}
            >

              {/* 1. The Centered Headline */}
              <div className="text-center mb-12 flex flex-col items-center">
                <h3 className="title-top text-[clamp(2.5rem,5vw,4rem)] font-black uppercase text-white/80 leading-[1] tracking-tighter mb-[-10px]">
                  {phase.titleTop}
                </h3>
                <div className="title-bottom overflow-hidden">
                  <h2 className="text-[clamp(3.5rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter text-white">
                    <Highlighter action="underline" color="#f04e00" strokeWidth={3} padding={4} iterations={1} isView={true}>
                      {phase.titleBottom}
                    </Highlighter>
                  </h2>
                </div>
              </div>

              {/* 2. The Ecosystem Animation */}
              <div className="w-full mb-12">
                {phase.visual}
              </div>

              {/* 3. Details / Micro Labels */}
              <div className="flex gap-8 items-center justify-center eco-item opacity-0 translate-y-4">
                {phase.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="font-mono text-xs text-white/60 tracking-widest uppercase">{detail}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </section>
    </div>
  );
}