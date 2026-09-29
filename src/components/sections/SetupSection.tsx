"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import Image from "next/image";

const MODEL_URL = "/models/SetupDesk_draco.glb";

// Must be dynamically imported with ssr:false — Three.js/WebGL is browser-only
const ModelViewer = dynamic(() => import("../ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-white/20 border-t-[#f04e00] rounded-full animate-spin" />
    </div>
  ),
});

gsap.registerPlugin(ScrollTrigger);

// ── NARRATIVE DATA ──
const workspaceBlocks = [
  { id: "01", title: "Hardware", desc: "M3 Max MacBook Pro / 64GB RAM / Dual Studio Displays" },
  { id: "02", title: "Development Stack", desc: "React, Next.js, Node.js, TypeScript, Tailwind CSS" },
  { id: "03", title: "Creative Tools", desc: "Figma, Adobe Creative Cloud, Blender" },
  { id: "04", title: "Productivity", desc: "VS Code, GitHub, Docker, Linear" }
];

const floatingBadges = ["BUILDING DAILY", "FULL STACK", "UI ENGINEER", "PROBLEM SOLVER"];

export default function SetupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { isLoaderFinished } = useLoader();

  // Warm the three.js chunk and fetch the model while the user is still in the
  // sections above, so arriving here no longer coincides with a ~600 KB script
  // parse plus a GLB decode (that overlap was the stutter on entering Workspace).
  useEffect(() => {
    if (!isLoaderFinished) return;
    let cancelled = false;
    const warm = () => {
      import("../ModelViewer")
        .then((m) => { if (!cancelled) m.preloadModel?.(MODEL_URL); })
        .catch(() => { /* non-critical */ });
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(warm, { timeout: 4000 }) : window.setTimeout(warm, 1500);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(id); else window.clearTimeout(id);
    };
  }, [isLoaderFinished]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      // Mount (and warm up) the WebGL scene about 1.5 viewports early, off-screen.
      { rootMargin: "1400px 0px" }
    );
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // ── INITIAL STATES ──
    gsap.set(".mask-setup-text", { y: "120%", opacity: 0, rotateZ: 3 });
    gsap.set(".setup-fade", { opacity: 0, y: 30 });
    gsap.set(".setup-block", { opacity: 0, x: 20 });
    gsap.set(".setup-badge", { opacity: 0, scale: 0.8 });
    gsap.set(".setup-line", { scaleX: 0 });
    // Note: model-container is NOT hidden here — the WebGL canvas must always be visible
    // or the Three.js renderer will not initialise correctly.
    gsap.set(".model-glow", { opacity: 0 });

    // ── ENTRANCE TIMELINE (Scrubbed on Scroll) ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "top 25%",
        scrub: 1,
      }
    });

    tl.to(".mask-setup-text", {
      y: "0%", opacity: 1, rotateZ: 0, duration: 1.2, stagger: 0.1, ease: "expo.out"
    })
      .to(".setup-fade", {
        opacity: 1, y: 0, duration: 1, ease: "power3.out"
      }, "-=0.8")
      // Divider draws in from the left instead of only fading
      .to(".setup-line", { scaleX: 1, duration: 1.1, ease: "expo.out" }, "-=0.9")

      // 2. Stagger Stacked Blocks
      .to(".setup-block", {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
      }, "-=0.6")

      // 3. Activate Environment Glow & Badges
      .to(".model-glow", {
        opacity: 0.25, duration: 3, ease: "power2.inOut"
      }, "-=0.5")
      .to(".setup-badge", {
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)"
      }, "-=1.2");

    // ── PARALLAX BACKGROUND TEXT ──
    gsap.fromTo(".parallax-setup-bg",
      { y: 50 },
      {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="setup"
      className="relative w-full min-h-screen bg-[#050505] text-white py-24 md:py-32 overflow-hidden flex items-center z-10"
    >
      {/* ── BACKGROUND ELEMENTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image 
          src="/Images/BG%20Images/WorkSpaceSectionBG.png"
          alt="Workspace Background"
          fill
          className="setup-bg-image object-cover opacity-50"
          priority
        />
        {/* Fade effects to blend image into the dark theme and improve readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />
      </div>
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('/noise.svg')]" />
      <div className="parallax-setup-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter whitespace-nowrap z-0">
        WORKSPACE
      </div>

      <div className="setup-parallax-content w-full h-full relative z-10 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative w-full mt-16 md:mt-24">

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-28 items-center">

            {/* ── LEFT: 3D MODEL ENVIRONMENT (60% on Desktop) ── */}
            <div className="lg:col-span-7 relative w-full aspect-square md:aspect-4/3 group perspective-[1000px]">

              {/* Ambient Radial Glow */}
              {/* Pre-shaped radial glow: a live 100px blur() over the WebGL canvas was re-filtered every frame */}
              <div className="model-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full pointer-events-none opacity-0 transition-opacity duration-700 group-hover:opacity-[0.4] bg-[radial-gradient(circle,rgba(255,83,3,0.45)_0%,rgba(255,83,3,0.14)_38%,transparent_68%)]" />

              {/* Technical Grid Overlay Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 rounded-3xl [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

              {/* Model Container Wrapper */}
              <div ref={containerRef} className="model-container w-full h-full relative z-10 rounded-3xl overflow-hidden">
                {hasEnteredView ? (
                  <>
                    <ModelViewer
                      url={MODEL_URL}
                      width="100%"
                      height="100%"
                      autoRotate={true}
                      autoRotateSpeed={0.25}
                      enableMouseParallax={false}
                      enableHoverRotation={false}
                      enableManualRotation={true}
                      environmentPreset="none"
                      fadeIn={true}
                      showScreenshotButton={false}
                      defaultZoom={1.8}
                      ambientIntensity={0.5}
                      keyLightIntensity={1.2}
                      fillLightIntensity={0.6}
                      rimLightIntensity={0.4}
                      modelScale={1.5}
                      cameraFov={35}
                      defaultRotationX={30}
                      defaultRotationY={225}
                      modelYOffset={0.0}
                      enableManualZoom={false}
                      onModelLoaded={() => setIsModelLoaded(true)}
                    />
                    {/* HTML loader overlay */}
                    <div className={`absolute inset-0 bg-[#050505]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-3xl transition-[opacity,transform,visibility] duration-700 pointer-events-none ${isModelLoaded ? "opacity-0 scale-95 invisible" : "opacity-100 scale-100"}`}>
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                        <div className="absolute inset-0 border-2 border-t-[#f04e00] rounded-full animate-spin shadow-[0_0_15px_rgba(240,78,0,0.4)]" />
                        <span className="font-space text-[10px] text-white/50 tracking-widest uppercase font-bold animate-pulse">3D</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-[#f04e00] rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* ── VIEWPORT BLUEPRINT TECH CORNERS ── */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/25 pointer-events-none transition-all duration-700 group-hover:border-[#f04e00]/60" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/25 pointer-events-none transition-all duration-700 group-hover:border-[#f04e00]/60" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/25 pointer-events-none transition-all duration-700 group-hover:border-[#f04e00]/60" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/25 pointer-events-none transition-all duration-700 group-hover:border-[#f04e00]/60" />

              {/* ── HUD PANEL: TOP LEFT (SYSTEM DIAGNOSTICS) ── */}
              <div className="absolute top-6 left-6 flex flex-col gap-2.5 p-3.5 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-500 scale-95 group-hover:scale-100 -translate-x-2 group-hover:translate-x-0 w-[170px] select-none">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="font-space text-[8px] text-[#f04e00] tracking-widest uppercase font-bold">SYSTEM DIAGNOSTICS</span>
                  <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-pulse shadow-[0_0_8px_#00e676]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-white/40 font-medium tracking-wider">CPU STATUS</span>
                    <span className="text-[#00e676] font-bold tracking-wider">ONLINE</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#00e676] w-[18%] h-full animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] mt-0.5">
                    <span className="text-white/40 font-medium tracking-wider">GPU LOAD</span>
                    <span className="text-[#f04e00] font-bold tracking-wider">24%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#f04e00] w-[24%] h-full" />
                  </div>
                </div>
              </div>

              {/* ── HUD PANEL: TOP RIGHT (VIEWPORT ANALYTICS) ── */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 p-3.5 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-500 scale-95 group-hover:scale-100 translate-x-2 group-hover:translate-x-0 w-[150px] select-none">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="font-space text-[8px] text-white/50 tracking-widest uppercase font-bold">VIEWPORT INFO</span>
                </div>
                <div className="flex flex-col gap-1 text-[9px] text-white/70">
                  <div className="flex justify-between">
                    <span className="text-white/40">RENDERER</span>
                    <span className="font-bold">WEBGL/R3F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">FOV / ZOOM</span>
                    <span className="font-bold">35° / 1.8X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">FPS</span>
                    <span className="font-bold text-[#00e676] animate-pulse">60.00</span>
                  </div>
                </div>
              </div>

              {/* ── HUD PANEL: BOTTOM DETAILS ── */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center p-3 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-500 translate-y-2 group-hover:translate-y-0 text-[9px] text-white/50 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f04e00] rounded-full animate-ping" />
                  <span className="tracking-wider uppercase text-white/70 font-semibold">STREAM ACTIVE: 6.95MB GLB</span>
                </div>
                <span className="font-mono text-white/30 hidden sm:inline">[ 39°45'N  104°52'W ]</span>
                <span className="tracking-widest uppercase text-[#f04e00] font-bold">READY TO DEPLOY</span>
              </div>

              {/* ── FLOATING NARRATIVE TEXTS (Always Visible, subtle parallax) ── */}
              <div className="absolute -left-6 top-1/3 -translate-y-1/2 z-20 pointer-events-none">
                <div className="font-space text-[10px] text-white/50 uppercase tracking-widest select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  4+ Hours Daily Building Products
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 z-20 pointer-events-none">
                <div className="flex flex-col items-end gap-1 select-none">
                  <span className="font-space text-[9px] text-[#f04e00] uppercase tracking-widest">React • Next.js • Node.js</span>
                  <span className="font-space text-[9px] text-white/30 uppercase tracking-widest">Currently Crafting Digital Experiences</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT: CONTENT & NARRATIVE (40% on Desktop) ── */}
            <div ref={contentWrapperRef} className="lg:col-span-5 flex flex-col justify-center min-w-0">

              {/* Header Area */}
              <span className="setup-fade font-space text-[10px] text-[#f04e00] uppercase tracking-widest mb-4 block">
                ( Command Center )
              </span>

              <h2 className="flex flex-col text-[clamp(3.5rem,6vw,5rem)] font-black uppercase leading-[0.85] tracking-tighter mb-6">
                <div className="overflow-hidden pb-1"><span className="mask-setup-text block origin-top-left">MY</span></div>
                <div className="overflow-hidden pb-2"><span className="mask-setup-text block origin-top-left text-[#f04e00]">WORKSPACE</span></div>
              </h2>

              <div className="setup-fade setup-line origin-left h-px w-16 bg-gradient-to-r from-[#f04e00] to-transparent mb-6" />

              <p className="setup-fade text-white/60 text-lg leading-relaxed max-w-md mb-10">
                The environment where ideas become products. Optimized for deep work, rapid iteration, and seamless engineering.
              </p>

              {/* Stacked Workspace Data Blocks */}
              <div className="flex flex-col gap-3 mb-10">
                {workspaceBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="setup-block relative overflow-hidden flex items-start gap-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-xl hover:bg-white/[0.02] hover:border-white/10 hover:translate-x-1 transition-[background-color,border-color,transform] duration-500 group"
                  >
                    {/* Accent rail grows in on hover */}
                    <span className="absolute left-0 top-3 bottom-3 w-px bg-[#f04e00] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" aria-hidden="true" />
                    <span className="font-space text-xs text-white/30 font-bold mt-0.5 group-hover:text-[#f04e00] transition-colors">{block.id}</span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white text-sm tracking-wide">{block.title}</span>
                      <span className="font-space text-[10px] text-white/50 uppercase tracking-widest leading-relaxed">{block.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Shadcn-style Badges */}
              <div className="flex flex-wrap gap-2">
                {floatingBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="setup-badge inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-space font-semibold text-white/70 uppercase tracking-widest shadow-sm transition-colors hover:bg-white/10 hover:text-white cursor-default"
                  >
                    {badge}
                  </span>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
