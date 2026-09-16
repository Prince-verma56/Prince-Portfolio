"use client";

import React, { useRef, type CSSProperties } from "react";
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
  Activity,
  Users,
  Gauge,
  MessageSquare,
  Eye,
  type LucideIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

type ResearchCardData = {
  category: string;
  text: string;
  tag: string;
  severity: string;
  level: string;
  Icon: LucideIcon;
  style: CSSProperties;
};

// Research cards ring the headline (two above, one centred at the top, two below)
// so none of them sits behind the title. `severity` drives the small gauge line.
const researchData: ResearchCardData[] = [
  { category: "ANALYTICS", text: "Bounce rate 78%", tag: "Metric", severity: "78%", level: "High", Icon: Activity, style: { top: "12%", left: "6%" } },
  { category: "ACCESSIBILITY", text: "Contrast ratio issues", tag: "Audit", severity: "46%", level: "Medium", Icon: Eye, style: { top: "8%", left: "calc(50% - 150px)" } },
  { category: "USER RESEARCH", text: "Users leave after onboarding", tag: "Interview", severity: "64%", level: "High", Icon: Users, style: { top: "12%", right: "6%" } },
  { category: "PERFORMANCE", text: "Loading time 6.2s", tag: "Lighthouse", severity: "86%", level: "Critical", Icon: Gauge, style: { bottom: "12%", left: "8%" } },
  { category: "FEEDBACK", text: "Navigation feels confusing", tag: "Session notes", severity: "58%", level: "Medium", Icon: MessageSquare, style: { bottom: "10%", right: "7%" } },
];

/** Research card: solid fill (no backdrop blur), hairline top highlight, icon badge, gauge line. */
function ResearchCard({ card, index, compact = false }: { card: ResearchCardData; index: number; compact?: boolean }) {
  const Icon = card.Icon;
  return (
    <div
      className={`research-card overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)] ${compact ? "relative w-full" : "absolute w-[300px]"}`}
      style={compact ? undefined : card.style}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f04e00]/70 to-transparent" aria-hidden="true" />
      <span className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(240,78,0,0.16),transparent_70%)]" aria-hidden="true" />
      <div className={`relative ${compact ? "px-4 py-3" : "p-5"}`}>
        <div className={`flex items-center gap-2.5 ${compact ? "mb-1.5" : "mb-3"}`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#f04e00]/25 bg-[#f04e00]/10 text-[#f04e00]">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">{card.category}</span>
          <span className="ml-auto font-mono text-[9px] tracking-[0.2em] text-white/25">0{index + 1}</span>
        </div>
        <p className={`${compact ? "text-[13px]" : "text-[17px]"} font-medium leading-snug text-white/90`}>{card.text}</p>
        {!compact && (
          <>
            <div className="mt-4 h-px w-full bg-white/[0.06]">
              <span className="block h-px bg-gradient-to-r from-[#f04e00] to-[#ff8800]" style={{ width: card.severity }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[8px] tracking-[0.2em] uppercase text-white/30">
              <span>{card.tag}</span>
              <span className="text-[#f04e00]/80">{card.level}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const SCENES = 6;
// Height of one row in the pager's rolling counter (px); rows use the same fixed height.
const ODOMETER_ROW = 14;
// The wrapper travels (SCENES - 1) viewports over the pinned distance, so scene i
// is centred in the viewport at progress i / (SCENES - 1).
const sceneCenter = (i: number) => i / (SCENES - 1);
// Reveal while the scene is still ~35vw right of centre; settle once it is ~55vw left.
const revealAt = (i: number) => Math.max(0, sceneCenter(i) - 0.35 / (SCENES - 1));
const exitAt = (i: number) => sceneCenter(i) + 0.55 / (SCENES - 1);

// Cloudinary renders the soft analytics backdrop pre-blurred, so the page no
// longer runs a CSS blur() over a full-viewport image on every frame.
const ANALYTICS_BG =
  "https://res.cloudinary.com/dtslaveid/image/upload/e_blur:400/v1780709628/1d325170-a560-419e-aae0-de1068ef30e4_ors8v2.png";

const PATH_D =
  "M -100 500 C 200 500, 300 750, 500 750 C 700 750, 800 500, 1000 500 C 1200 500, 1300 250, 1500 250 C 1700 250, 1800 500, 2000 500 C 2200 500, 2300 750, 2500 750 C 2700 750, 2800 500, 3000 500 C 3200 500, 3280 140, 3500 140 C 3720 140, 3800 500, 4000 500 C 4200 500, 4300 750, 4500 750 C 4700 750, 4800 500, 5000 500 C 5200 500, 5300 250, 5500 250 C 5700 250, 5800 500, 6100 500";

/**
 * One headline line inside an overflow mask so it can rise into view.
 * The negative-margin padding keeps rough-notation circles from being clipped
 * once the line has landed, without changing the layout.
 */
function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden px-[0.25em] -mx-[0.25em] py-[0.12em] -my-[0.12em] ${className}`}>
      <span className="journey-line block">{children}</span>
    </span>
  );
}

export default function PhilosophyJourneySection({ bgImage }: { bgImage?: string }) {
  const { playSfx } = useSFX();
  const soundTriggeredRef = useRef<Set<string>>(new Set());

  const containerRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const dotFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const odometerRef = useRef<HTMLDivElement>(null);
  const railIndexRef = useRef(1);

  const perfRef = useRef<HTMLSpanElement>(null);
  const accessRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);
  const loadRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const rocket = rocketRef.current;
    const path = pathRef.current;
    if (!container || !wrapper || !rocket || !path) return;

    soundTriggeredRef.current.clear();

    const isMobile = window.innerWidth < 768;
    // ── Mobile gets shorter scroll distance so it's not exhausting ──
    const scrollDistance = isMobile ? 5500 : 10000;
    const has = (selector: string) => container.querySelector(selector) !== null;

    // ── SHEET ENTRANCE (slanted top edge flattens as the section arrives) ──
    gsap.fromTo(
      container,
      { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "none",
        scrollTrigger: { trigger: container, start: "top bottom", end: "top top", scrub: 1 },
      }
    );

    gsap.from(".top-glow-bg, .top-glow-line", {
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: container, start: "top bottom", end: "top top", scrub: 1 },
    });

    const pathLength = path.getTotalLength();
    gsap.set(glowPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    // ── INITIAL STATES ──
    gsap.set(".journey-line", { yPercent: 130 });
    gsap.set(".scene-title", { opacity: 0 });
    gsap.set(".scene-1-heading", { opacity: 0, y: -25 });
    gsap.set(".editorial-img", { opacity: 0, scale: 1.08, clipPath: "inset(12% 12% 12% 12%)" });
    gsap.set(".scene-number-text", { opacity: 0, yPercent: 100 });
    gsap.set(".metrics-panel", { opacity: 0, y: 24 });
    const dotFills = dotFillRefs.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(dotFills, { scaleX: 0, transformOrigin: "left center" });
    if (dotFills[0]) gsap.set(dotFills[0], { scaleX: 1 });
    gsap.set(odometerRef.current, { y: 0 });

    // Idle bob for the rocket: created paused and only runs while the section is pinned.
    const rocketIdle = gsap.to(".rocket-chassis", {
      y: 4, rotationZ: 0.5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true,
    });

    // 🎵 SOUND CUES — one whoosh as each scene's headline lands.
    const SOUND_CUES: Array<[number, string]> = Array.from({ length: SCENES }, (_, i) => [
      Math.max(0.005, revealAt(i)),
      `s${i + 1}`,
    ]);

    // 🎬 MASTER SCRUB — pins the section and drives every scene from one timeline.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: isMobile ? 0.3 : 0.4,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          // Rocket flame / speed-line keyframes (globals.css) and the idle bob run only while pinned.
          container.classList.toggle("journey-active", self.isActive);
          if (self.isActive) rocketIdle.play();
          else rocketIdle.pause();
        },
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
          // Rolling scene counter: the digit column slides one row per scene (transform only).
          const idx = Math.min(SCENES, Math.max(1, Math.round(p * (SCENES - 1)) + 1));
          if (idx !== railIndexRef.current) {
            railIndexRef.current = idx;
            gsap.to(odometerRef.current, { y: -(idx - 1) * ODOMETER_ROW, duration: 0.6, ease: "expo.out", overwrite: true });
          }
        },
      },
    });

    // ── TRAVEL ──
    tl.to(wrapper, { xPercent: -(100 * (SCENES - 1)) / SCENES, ease: "none", duration: 1 }, 0);
    tl.to(rocket, {
      motionPath: { path, align: path, alignOrigin: [0.125, 0.5], autoRotate: false },
      ease: "none", duration: 1,
    }, 0);
    tl.to(glowPathRef.current, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
    // Pager: segment j fills while the journey travels from scene j-1 to scene j.
    for (let j = 1; j < SCENES; j++) {
      if (dotFills[j]) tl.to(dotFills[j], { scaleX: 1, ease: "none", duration: 1 / (SCENES - 1) }, (j - 1) / (SCENES - 1));
    }

    // ── DEPTH ── while a scene crosses the viewport its background layers drift
    // with the travel (they appear further away) and foreground layers lead it.
    // Pure transforms; each layer only animates during its own scene's passage.
    const travelVw = 100 * (SCENES - 1);
    for (let i = 0; i < SCENES; i++) {
      const c = sceneCenter(i);
      const start = Math.max(0, c - 1 / (SCENES - 1));
      const end = Math.min(1, c + 1 / (SCENES - 1));
      const bg = `.scene-${i + 1} .depth-bg`;
      const fg = `.scene-${i + 1} .depth-fg`;
      if (has(bg)) {
        tl.fromTo(bg,
          { x: `${(start - c) * travelVw * 0.12}vw` },
          { x: `${(end - c) * travelVw * 0.12}vw`, ease: "none", duration: end - start, immediateRender: true },
          start);
      }
      if (has(fg)) {
        tl.fromTo(fg,
          { x: `${(start - c) * travelVw * -0.05}vw` },
          { x: `${(end - c) * travelVw * -0.05}vw`, ease: "none", duration: end - start, immediateRender: true },
          start);
      }
    }

    // ── SCENE REVEALS ── headline lines rise through their masks, the scene number
    // follows, the editorial image un-clips, then the scene settles back as it leaves.
    const imageOpacity = [0.6, 0.4, 1, 0.3, 0.9, 0.8];
    const reveal = (i: number, extra?: (at: number) => void) => {
      const at = revealAt(i);
      const s = `.scene-${i + 1}`;
      tl.to(`${s} .scene-title`, { opacity: 1, duration: 0.03, ease: "power2.out" }, at);
      tl.to(`${s} .journey-line`, { yPercent: 0, duration: 0.07, stagger: 0.012, ease: "power3.out" }, at);
      tl.to(`${s} .scene-number-text`, { yPercent: 0, opacity: 0.18, duration: 0.06, ease: "power2.out" }, at + 0.01);
      if (has(`${s} .editorial-img`)) {
        tl.to(`${s} .editorial-img`, {
          opacity: imageOpacity[i], scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.09, ease: "power2.out",
        }, at + 0.01);
      }
      extra?.(at);
      if (i < SCENES - 1) {
        // Opacity only: scaling these text-shadowed headings re-rasterised them every frame of the exit.
        tl.to(`${s} .scene-title`, { opacity: 0.25, duration: 0.06, ease: "power2.in" }, exitAt(i));
      }
    };

    // SCENE 1 — IDEA
    reveal(0, (at) => {
      tl.to(".scene-1-heading", { y: 0, opacity: 1, duration: 0.06, ease: "power2.out" }, at);
    });

    // SCENE 2 — PROBLEM
    reveal(1, (at) => {
      tl.fromTo(".research-card",
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.04, stagger: 0.006, ease: "power3.out" }, at + 0.02);
    });

    // SCENE 3 — EXPERIENCE
    reveal(2, (at) => {
      tl.fromTo(".design-grid",
        { opacity: 0, y: 80, rotate: -12 },
        { opacity: 1, y: 0, rotate: -6, duration: 0.08, ease: "power3.out" }, at + 0.01);
      tl.fromTo(".design-wireframe",
        { opacity: 0, y: 50, rotate: -6 },
        { opacity: 1, y: 0, rotate: -2, duration: 0.08, ease: "power3.out" }, at + 0.02);
      tl.fromTo(".design-final",
        { opacity: 0, scale: 0.94, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.08, ease: "power3.out" }, at + 0.03);
    });

    // SCENE 4 — SOLUTION
    reveal(3, (at) => {
      tl.to(".arch-line", { strokeDashoffset: 0, duration: 0.06, stagger: 0.01, ease: "power2.inOut" }, at + 0.02);
      tl.fromTo(".arch-node",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.06, stagger: 0.01, ease: "back.out(1.5)" }, at + 0.02);
    });

    // SCENE 5 — DETAIL
    reveal(4, (at) => {
      // The panel frame arrives with its scene instead of sitting empty before the items land.
      tl.to(".metrics-panel", { opacity: 1, y: 0, duration: 0.05, ease: "power3.out" }, at + 0.01);
      tl.fromTo(".metric-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.06, stagger: 0.01, ease: "power2.out" }, at + 0.02);

      const counters = { perf: 0, load: 6.2 };
      tl.to(counters, {
        perf: 100, load: 0.8, duration: 0.10, ease: "none",
        onUpdate: () => {
          const perf = Math.round(counters.perf).toString();
          if (perfRef.current) perfRef.current.innerText = perf;
          if (accessRef.current) accessRef.current.innerText = perf;
          if (bestRef.current) bestRef.current.innerText = perf;
          if (loadRef.current) loadRef.current.innerText = counters.load.toFixed(1) + "s";
        },
      }, at + 0.02);
    });

    // SCENE 6 — IMPACT
    reveal(5);

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden text-white font-space will-change-transform z-30 bg-[#050505] -mt-32 rounded-t-[40px] md:rounded-t-[64px] shadow-[0_-50px_100px_rgba(0,0,0,0.9)]"
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Not `priority`: this section sits well below the fold, so the 1.8 MB PNG
              no longer competes with the hero during load. */}
          <Image src={bgImage} alt="Philosophy Journey Background" fill className="object-cover opacity-25" sizes="100vw" />
        </div>
      )}

      {/* Pre-shaped radial haze instead of a live 100px blur() filter */}
      <div className="top-glow-bg absolute top-[-180px] left-1/2 -translate-x-1/2 w-[70%] h-[360px] pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,rgba(240,78,0,0.5)_0%,rgba(240,78,0,0.16)_38%,transparent_72%)]" />
      <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-gradient-to-r from-transparent via-[#f04e00]/90 to-transparent blur-[3px] pointer-events-none z-50" />
      <div className="top-glow-line absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] pointer-events-none z-50" />
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]"></div>

      <div ref={wrapperRef} className="flex h-full w-[600vw] relative will-change-transform z-10">

        {/* PATH SVG */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50">
          <svg viewBox="0 0 6000 1000" preserveAspectRatio="none" className="w-full h-full">
            <path ref={pathRef} d={PATH_D} fill="none" stroke="transparent" strokeWidth="2" />
            <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path ref={glowPathRef} d={PATH_D} fill="none" stroke="#f04e00" strokeWidth="3" />
          </svg>
        </div>

        {/* ── SCENE 1: IDEA ── */}
        <div className="scene-1 w-[100vw] h-full flex items-center justify-center relative">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-1 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">01</span>
          </div>

          {/* Desktop image */}
          <div className="editorial-img depth-bg img-1 absolute top-[15%] left-[20%] w-[240px] h-[320px] rounded-2xl overflow-hidden z-10 mix-blend-luminosity hidden md:block">
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
              <Line>EVERY PRODUCT</Line>
              <Line>STARTS WITH</Line>
              <Line>
                <span className="text-[#facc15] inline-flex items-center gap-2 align-middle">
                  AN IDEA.
                  {/* Speed lines as HTML bars: transforms on SVG children dirty layout every
                      frame in Blink, while transforms on these spans stay on the compositor. */}
                  <span className="inline-flex flex-col justify-evenly w-7 h-2.5 md:w-9 md:h-3 align-middle" aria-hidden="true">
                    <span className="speed-line-a block h-[2px] w-[56%] ml-[5.5%] rounded-full bg-[#facc15]" />
                    <span className="speed-line-b block h-[2px] w-[67%] ml-[22%] rounded-full bg-[#facc15]" />
                    <span className="speed-line-c block h-[2px] w-[61%] ml-[11%] rounded-full bg-[#facc15]" />
                  </span>
                </span>
              </Line>
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
        <div className="scene-2 w-[100vw] h-full flex items-center justify-center relative">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-2 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">02</span>
          </div>

          <div
            className="editorial-img depth-bg img-2 absolute inset-0 z-10 opacity-30 mix-blend-screen pointer-events-none"
            style={{
              WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
              maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)"
            }}
          >
            <Image src={ANALYTICS_BG} alt="Data Analytics" fill className="object-cover opacity-40" sizes="100vw" />
          </div>

          {/* Desktop research cards ringed around the headline (see ResearchCard) */}
          <div className="depth-fg absolute inset-0 pointer-events-none z-20 hidden md:block">
            {researchData.map((card, i) => (
              <ResearchCard key={card.category} card={card} index={i} />
            ))}
          </div>

          {/* Title */}
          <div className="z-30 w-full text-center px-6 md:px-10 scene-title scene-2-title flex flex-col items-center gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white tracking-tighter drop-shadow-2xl">
              <Line>Understand</Line>
              <Line>
                <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                  <span className="text-[#facc15]">The Problem</span>
                </Highlighter>
              </Line>
            </h2>

            {/* Mobile-only cards — 2 compact rows */}
            <div className="flex flex-col gap-2.5 mt-6 w-[88%] md:hidden">
              {researchData.slice(0, 2).map((card, i) => (
                <ResearchCard key={card.category} card={card} index={i} compact />
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 3: EXPERIENCE ── */}
        <div className="scene-3 w-[100vw] h-full flex items-center justify-center relative">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-3 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">03</span>
          </div>

          {/* Desktop mockup stack (right side) */}
          <div className="absolute right-[8%] top-[16%] w-[620px] h-[500px] z-20 hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Radial glow replaces a 120px blur() filter that the GPU re-ran every frame */}
              <div className="w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(240,78,0,0.16)_0%,rgba(240,78,0,0.05)_45%,transparent_70%)]" />
            </div>
            <div className="design-grid depth-fg absolute inset-0 translate-x-[-60px] translate-y-[30px] rotate-[-6deg] rounded-2xl border border-white/5 bg-[#080808] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>
            <div className="design-wireframe depth-fg absolute inset-0 translate-x-[-25px] translate-y-[10px] rotate-[-2deg] rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
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
              {/* Title bar with traffic lights and an address pill */}
              <div className="w-full h-12 border-b border-white/10 bg-[#111] flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
                </div>
                <div className="mx-auto flex h-6 w-64 items-center justify-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.04] font-mono text-[9px] tracking-[0.15em] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e676]" />
                  princeverma.dev / design-system
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-6 rounded-full bg-white/10" />
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="flex h-full">
                {/* Sidebar with an active step and a progress card */}
                <div className="w-44 border-r border-white/10 p-5">
                  <div className="mb-4 font-mono text-[8px] uppercase tracking-[0.3em] text-white/25">Project</div>
                  <div className="flex flex-col gap-4">
                    {[["Research", true], ["Wireframes", false], ["Design System", false], ["Prototype", false]].map(([label, active]) => (
                      <div key={String(label)} className="flex items-center gap-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#f04e00] shadow-[0_0_8px_rgba(240,78,0,0.8)]" : "bg-white/15"}`} />
                        <span className={`text-[10px] uppercase tracking-[0.25em] font-mono ${active ? "text-[#f04e00]" : "text-white/50"}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                    <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/30">Progress</div>
                    <div className="mt-1 text-lg font-black leading-none text-white">72<span className="text-[#f04e00]">%</span></div>
                    <div className="mt-2 h-px w-full bg-white/[0.08]"><span className="block h-px w-[72%] bg-gradient-to-r from-[#f04e00] to-[#ff8800]" /></div>
                  </div>
                </div>
                {/* Main: KPI tiles, the board image with a caption bar, and labelled progress rows */}
                <div className="flex-1 p-5 bg-[#050505]">
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {[["12", "Screens"], ["48", "Components"], ["4", "Flows"]].map(([n, l]) => (
                      <div key={l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                        <div className="text-base font-black leading-none text-white">{n}</div>
                        <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.25em] text-white/35">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="editorial-img img-3 relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                    {/* sizes matches the rendered width so the board is served sharp instead of upscaled */}
                    <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780836436/ChatGPT_Image_Jun_7_2026_06_16_59_PM_au3b51.png" alt="Project UI" fill sizes="(min-width: 768px) 560px, 220px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-[#050505]/80 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
                      <span>Research board · v2.3</span>
                      <span className="flex items-center gap-1.5 text-[#00e676]"><span className="h-1 w-1 rounded-full bg-[#00e676]" />Synced</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[["Typography scale", "82%"], ["Color tokens", "64%"], ["Motion spec", "40%"]].map(([l, w]) => (
                      <div key={l} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">{l}</span>
                        <span className="relative h-px flex-1 bg-white/[0.08]"><span className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#f04e00] to-[#ff8800]" style={{ width: w }} /></span>
                        <span className="font-mono text-[8px] text-white/40">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title — left on desktop, center on mobile */}
          <div className="z-30 w-full max-w-7xl px-6 md:px-20 scene-title scene-3-title flex flex-col gap-5 md:gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase tracking-tighter text-white text-center md:text-left">
              <Line>Design</Line>
              <Line>The</Line>
              <Line><span className="text-[#ff8800]">Experience</span></Line>
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
        <div className="scene-4 w-screen h-full flex items-center justify-center relative">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-4 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">04</span>
          </div>

          <div className="editorial-img depth-bg img-4 rounded-6xl absolute left-[18%] top-[10%] w-[400px] h-[400px] z-10 opacity-20 pointer-events-none mix-blend-screen hidden md:block" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <Image src="https://res.cloudinary.com/dtslaveid/image/upload/v1780792268/e07f0045-4c5b-4b5a-9bf9-f7dbfa403eba_e0rbq7.png" alt="Code" fill className="object-cover opacity-60" sizes="400px" />
          </div>

          {/* Desktop architecture nodes (lines and nodes share one layer so the depth drift keeps them aligned) */}
          <div className="depth-fg absolute inset-0 flex items-center justify-center pointer-events-none z-20 hidden md:flex">
            <svg className="absolute inset-0 w-full h-full">
              <path className="arch-line" d="M 350 400 L 500 500 L 700 400" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
              <path className="arch-line" d="M 500 500 L 500 650 L 750 700" fill="none" stroke="rgba(240,78,0,0.5)" strokeWidth="1.5" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>
            <div className="arch-node absolute top-[40%] left-[10%] min-w-[230px] bg-[#0d0d0d] border border-white/10 border-l-2 border-l-[#f04e00]/60 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <MonitorSmartphone className="w-4 h-4 text-[#61dafb] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-mono">Interface</span>
                <span className="font-mono text-xs text-white/90 tracking-wide font-bold uppercase">User Experience</span>
              </div>
            </div>
            <div className="arch-node absolute top-[40%] left-[30%] min-w-[230px] bg-[#0c0c0c] border border-[#f04e00]/10 border-l-2 border-l-[#f04e00] px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <Cpu className="w-4 h-4 text-[#f04e00] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#f04e00]/70 font-mono">Core</span>
                <span className="font-mono text-xs text-white tracking-wide font-bold uppercase">Solution Engine</span>
              </div>
            </div>
            <div className="arch-node absolute bottom-[15%] left-[36%] min-w-[230px] bg-[#0d0d0d] border border-white/10 border-l-2 border-l-[#f04e00]/60 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              <Database className="w-4 h-4 text-[#3ecf8e] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-mono">Data</span>
                <span className="font-mono text-xs text-white/90 tracking-wide font-bold uppercase">Data Intelligence</span>
              </div>
            </div>
          </div>

          <div className="z-30 w-full max-w-7xl px-6 md:px-20 scene-title scene-4-title flex flex-col gap-5 md:gap-0">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4.5rem,10vw,9rem)] font-black uppercase text-white tracking-tighter drop-shadow-2xl text-center md:text-right">
              <Line>Build The</Line>
              <Line><span className="text-[#ff8800]">Solution</span></Line>
            </h2>

            {/* Mobile-only compact arch nodes */}
            <div className="md:hidden flex flex-col gap-2.5 w-full">
              {[
                { icon: <MonitorSmartphone className="w-3.5 h-3.5 text-[#61dafb]" />, label: "Interface", title: "User Experience" },
                { icon: <Cpu className="w-3.5 h-3.5 text-[#f04e00]" />, label: "Core", title: "Solution Engine" },
                { icon: <Database className="w-3.5 h-3.5 text-[#3ecf8e]" />, label: "Data", title: "Data Intelligence" },
              ].map((node, i) => (
                <div key={i} className="arch-node bg-[#0d0d0d] border border-white/10 border-l-2 border-l-[#f04e00]/60 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
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
        <div className="scene-5 w-[100vw] h-full flex flex-col items-center justify-center relative z-30 px-6 md:px-10">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-5 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">05</span>
          </div>

          <div className="editorial-img depth-bg img-5 absolute right-[6%] top-1/2 -translate-y-1/2 w-[300px] h-[220px] lg:w-[450px] lg:h-[330px] z-10 pointer-events-none rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden md:block">
            <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200" alt="Charts" fill className="object-cover rounded-3xl" sizes="450px" />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
          </div>

          <div className="scene-title scene-5-title text-center mb-6 md:mb-16 z-30">
            <h2 className="text-[2.2rem] leading-[0.88] sm:text-4xl md:text-6xl lg:text-[clamp(4rem,9vw,8rem)] font-black uppercase text-white tracking-tighter">
              <Line>OPTIMIZE EVERY</Line>
              <Line>
                <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                  <span className="text-[#ff8800]">DETAIL</span>
                </Highlighter>
              </Line>
            </h2>
          </div>

          {/* Metrics grid — 2x2 on mobile, row on desktop */}
          <div className="metrics-panel depth-fg grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 text-center z-30 border border-white/10 bg-gradient-to-br from-[#111] to-[#070707] rounded-2xl py-4 px-5 md:py-6 md:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-t border-t-[#f04e00]/30 hover:border-t-[#f04e00]/80 transition-[border-color] duration-700 w-auto max-w-[92%] md:max-w-none mx-auto inline-flex">
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
        <div className="scene-6 w-[100vw] h-full flex items-center justify-center relative">

          <div className="depth-bg absolute bottom-[10%] left-[8%] z-20 pointer-events-none select-none overflow-hidden">
            <span className="scene-number-text num-6 block font-mono text-5xl md:text-6xl font-black leading-none text-[#f04e00]">06</span>
          </div>

          <div
            className="editorial-img depth-bg img-6 absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-40"
            style={{
              WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 80%)",
              maskImage: "radial-gradient(circle at center, black 20%, transparent 80%)"
            }}
          >
            <Image src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600" alt="Impact" fill className="object-cover opacity-30" sizes="100vw" />
          </div>

          <div className="z-30 text-center w-full max-w-6xl px-6 md:px-10 relative scene-title scene-6-title">
            <h2 className="text-[2.5rem] leading-[0.85] sm:text-4xl md:text-7xl lg:text-[clamp(5rem,12vw,10rem)] font-black uppercase tracking-tighter text-white drop-shadow-2xl">
              <Line>FROM IDEA</Line>
              <Line>
                TO{" "}
                <Highlighter action="circle" color="#facc15" padding={8} strokeWidth={3} isView={true}>
                  <span className="text-[#ff7300]">IMPACT.</span>
                </Highlighter>
              </Line>
            </h2>
            <p className="mt-8 md:mt-16 text-white/30 font-mono tracking-[0.5em] text-[10px] md:text-xs uppercase">
              ( This is how I build )
            </p>
          </div>
        </div>

        {/* ── ROCKET ── (flame / speed-line keyframes live in globals.css and run only while pinned) */}
        <div ref={rocketRef} className="absolute top-0 left-0 w-12 h-6 md:w-36 md:h-16 z-50 pointer-events-none" style={{ transformOrigin: "50% 50%" }}>
          <div className="rocket-chassis w-full h-full relative origin-center">
            {/* The two flames are separate <svg> elements so their flicker animates the
                element's own CSS transform (compositor) instead of an SVG child transform
                (which forces a layout on every frame in Blink). Same viewBox, same geometry. */}
            <svg viewBox="0 0 120 40" className="rocket-flame-outer absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
              <path d="M 15 20 Q 5 12 -5 20 Q 5 28 15 20" fill="#f44336" opacity="0.8" />
            </svg>
            <svg viewBox="0 0 120 40" className="rocket-flame-inner absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
              <path d="M 15 20 Q 8 16 0 20 Q 8 24 15 20" fill="#ffeb3b" />
            </svg>
            <svg viewBox="0 0 120 40" className="relative w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="premiumBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cccccc" />
                </linearGradient>
              </defs>
              <path d="M 25 12 L 15 4 L 40 10 Z" fill="#888888" />
              <path d="M 25 28 L 15 36 L 40 30 Z" fill="#888888" />
              <path d="M 15 12 Q 15 6 30 6 L 85 6 Q 115 20 85 34 L 30 34 Q 15 34 15 28 Z" fill="url(#premiumBody)" />
              <path d="M 65 10 Q 90 20 65 30 Q 55 20 65 10 Z" fill="#0a0a0a" />
              <circle cx="45" cy="20" r="2" fill="#f04e00" />
            </svg>
          </div>
        </div>

      </div>

      {/* ── PAGER ── glass pill: rolling scene counter + six segments that fill as the journey travels.
          Transform-only (counter slides, segments scaleX); no backdrop blur. */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 md:gap-4 rounded-full border border-white/[0.08] bg-[#0a0a0a]/85 px-4 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)] pointer-events-none select-none" aria-hidden="true">
        <div className="relative h-[14px] overflow-hidden font-mono text-[11px] leading-[14px] tracking-[0.25em] text-white tabular-nums">
          <div ref={odometerRef} className="flex flex-col">
            {Array.from({ length: SCENES }, (_, i) => (
              <span key={i} className="block h-[14px] leading-[14px]">{String(i + 1).padStart(2, "0")}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: SCENES }, (_, i) => (
            <span key={i} className="relative h-[3px] w-5 md:w-7 overflow-hidden rounded-full bg-white/[0.1]">
              <span
                ref={(el) => { dotFillRefs.current[i] = el; }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f04e00] to-[#ff8800]"
                style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
              />
            </span>
          ))}
        </div>
        <span className="font-mono text-[11px] leading-[14px] tracking-[0.25em] text-white/30 tabular-nums">06</span>
      </div>
    </section>
  );
}
