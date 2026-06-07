"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLoader } from "@/context/LoaderContext";
import { FollowerPointerCard } from "@/components/FollowerPointerCard";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "01",
    title: "Adhayaya",
    subtitle: "Indian Heritage & Travel Platform",
    tags: ["Next.js", "WebGL", "Travel"],
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=90",
    link: "/works/adhayaya",
    year: "2024",
    visual: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-24 h-24 text-white">
        <path d="M12 2L2 22l10-4 10 4L12 2z" />
        <circle cx="12" cy="14" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "02",
    title: "Dhritam",
    subtitle: "AI-Powered Health Monitoring",
    tags: ["Python", "TensorFlow", "IoT"],
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1800&q=90",
    link: "/works/dhritam",
    year: "2024",
    visual: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-24 h-24 text-white">
        <path d="M2 12h4l3-9 5 18 3-9h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: "03",
    title: "Hazu",
    subtitle: "Predictive Analytics Dashboard",
    tags: ["React", "D3.js", "ML"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&q=90",
    link: "/works/hazu",
    year: "2023",
    visual: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-24 h-24 text-white">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9M9 3v6" />
      </svg>
    )
  },
];

interface WorkSectionProps {
  isStandalonePage?: boolean;
}

export default function WorkSection({ isStandalonePage = false }: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { isLoaderFinished } = useLoader();

  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);

  // ── 1. MASTER ENTRANCE & PINNING LOGIC ──
  useGSAP(() => {
    if (!isLoaderFinished || !sectionRef.current) return;

    // ── Restored: Section Clip-Path (Slant -> Flat) ──
    if (!isStandalonePage) {
      gsap.fromTo(
        sectionRef.current,
        { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          }
        }
      );

      // Top glowing lines SVG path unslanting
      gsap.fromTo(
        [".work-top-line", ".work-top-glow"],
        { attr: { d: "M 0 12 L 100 0" } },
        {
          attr: { d: "M 0 0 L 100 0" },
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          }
        }
      );

      // ── Restored: Velvet Parallax Smooth Slide ──
      gsap.fromTo(
        contentRef.current,
        { y: 120 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 10%",
            scrub: 1,
          },
        }
      );

      // ── NEW: Connected Side Entrance (Go Aside) ──
      // Slide and fade-in left column from the left
      gsap.fromTo(
        ".work-left-col",
        { x: -120, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 15%",
            scrub: 1,
          }
        }
      );

      // Slide and fade-in right showcase from the right
      gsap.fromTo(
        ".showcase-container",
        { x: 120, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 15%",
            scrub: 1,
          }
        }
      );

      // Glow entrance opacity fade-in on scroll
      gsap.from(
        ".top-left-glow-bg, .top-left-glow-line",
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          }
        }
      );

      // Entrance reveal for LATEST WORK. heading
      gsap.fromTo(
        ".mask-title",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 10%",
            scrub: 1,
          }
        }
      );
    } else {
      // For standalone page, perform immediate entry transitions
      gsap.fromTo(
        ".mask-title",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, ease: "power3.out" }
      );
      gsap.fromTo(
        [".work-left-col", ".showcase-container"],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }
      );
    }

    // ── OPTIMIZED: Adjusted scroll distance for both desktop and mobile ──
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pinDistance = isTouchDevice ? projects.length * 100 : projects.length * 300;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${pinDistance}vh`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.min(
          projects.length - 1,
          Math.floor(self.progress * projects.length)
        );
        setActiveIndex((prev) => {
          if (prev !== index) {
            return index;
          }
          return prev;
        });
      }
    });

    // Extremely subtle global parallax on the right showcase while scrolling
    gsap.fromTo(
      ".showcase-container",
      { y: -20 },
      {
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${pinDistance}vh`,
          scrub: true,
        }
      }
    );

    // Continuous floating animation for support visuals
    gsap.to(".support-visual", {
      y: 15,
      rotation: 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

  }, { scope: sectionRef, dependencies: [isStandalonePage, isLoaderFinished] });

  // ── 2. CINEMATIC CROSSFADES (Triggered by activeIndex change) ──
  useGSAP(() => {
    const prev = prevIndexRef.current;
    if (prev === activeIndex) return;

    const tl = gsap.timeline();

    gsap.set(`.img-container-${activeIndex}`, { zIndex: 10 });
    gsap.set(`.img-container-${prev}`, { zIndex: 5 });

    tl.to(`.img-container-${prev}`, { opacity: 0, duration: 1, ease: "power3.inOut" }, 0);
    tl.to(`.img-container-${prev} .parallax-inner`, { scale: 1.05, duration: 1, ease: "power3.inOut" }, 0);

    tl.fromTo(`.img-container-${activeIndex}`,
      { opacity: 0, clipPath: "inset(100% 0 0 0)" },
      { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power4.inOut" },
      0
    );
    tl.fromTo(`.img-container-${activeIndex} .parallax-inner`,
      { scale: 1.05 },
      { scale: 1, duration: 1.2, ease: "power4.inOut" },
      0
    );

    tl.to(`.visual-${prev}`, { opacity: 0, scale: 0.8, duration: 0.6, ease: "power2.out" }, 0);
    tl.fromTo(`.visual-${activeIndex}`,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 0.15, scale: 1, y: 0, duration: 1, ease: "power3.out" },
      0.2
    );

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);



  return (
    <section
      ref={sectionRef}
      id="work"
      className={`relative z-30 bg-[#050505] w-full min-h-screen overflow-hidden flex items-center will-change-transform drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)] ${isStandalonePage ? "pt-24 md:pt-28 lg:pt-36" : ""
        }`}
      style={isStandalonePage ? {} : { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      {/* ── Slanted Glowing Top Separator Line ── */}
      {!isStandalonePage && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-40" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="workTopLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#f04e00" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#f04e00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="workTopGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#f04e00" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#f04e00" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="workTopGlowBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="work-top-glow"
            d="M 0 12 L 100 0"
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke="url(#workTopGlowGrad)"
            strokeWidth="8"
            filter="url(#workTopGlowBlur)"
          />
          <path
            className="work-top-line"
            d="M 0 12 L 100 0"
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke="url(#workTopLineGrad)"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* ── Restored: Ultra Premium Edge Lighting (Left Focused) ── */}
      <div className="top-left-glow-bg absolute top-[-150px] left-[-10%] w-[50%] h-[300px] bg-[#f04e00] opacity-[0.15] blur-[120px] pointer-events-none rounded-[100%] z-0" />
      <div className="top-left-glow-bg absolute top-[-50px] left-[-5%] w-[30%] h-[150px] bg-[#f04e00] opacity-[0.25] blur-[80px] pointer-events-none rounded-[100%] z-0" />
      <div className="top-left-glow-line absolute top-[-20px] left-0 w-[20%] h-[50px] bg-white opacity-[0.1] blur-[30px] pointer-events-none rounded-[100%] z-0" />

      <div ref={contentRef} className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-16 flex flex-col justify-center gap-6 md:gap-12 h-full will-change-transform pt-16 md:pt-0">

        {/* ── LATEST WORK. HEADING ── */}
        <div className="mask-title-wrapper overflow-hidden pb-1 select-none pointer-events-none w-full">
          <h2 className="mask-title translate-y-[110%] opacity-0 text-[clamp(2.5rem,7vw,6.5rem)] font-black uppercase text-[#f04e00] leading-[0.85] tracking-tighter">
            LATEST WORK.
          </h2>
        </div>

        {/* ── COLUMNS WRAPPER ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">

          {/* ── LEFT NAVIGATION COLUMN ── */}
          <div className="work-left-col w-full md:w-[35%] lg:w-[30%] flex flex-col justify-center gap-6 md:gap-12 md:pr-10">

            <div className="flex flex-col">
              <span className="text-white/30 text-[10px] font-mono tracking-[0.3em] uppercase mb-4">
                SELECTED PROJECT
              </span>

              {/* Morphing Project Number */}
              <div className="relative h-[100px] overflow-hidden">
                {projects.map((p, i) => (
                  <div
                    key={`num-${p.id}`}
                    className={`absolute inset-0 flex items-center transition-transform duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${i === activeIndex
                      ? "translate-y-0 opacity-100"
                      : i < activeIndex
                        ? "-translate-y-full opacity-0"
                        : "translate-y-full opacity-0"
                      }`}
                  >
                    <span className="text-[6rem] xl:text-[8rem] font-black text-[#f04e00] leading-none tracking-tighter">
                      {p.id}.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Navigation List */}
            <div className="flex flex-col gap-6 relative">
              {projects.map((p, i) => {
                const isActive = i === activeIndex;
                return (
                  <div key={p.id} className="relative flex items-center gap-4 group">
                    {/* Animated Active Indicator */}
                    <div className="w-6 flex justify-end overflow-hidden">
                      <span className={`block w-4 h-[2px] bg-[#f04e00] origin-right transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0"}`} />
                    </div>

                    <span
                      className={`text-2xl xl:text-3xl tracking-wide transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative ${isActive
                        ? "text-white font-black scale-100 origin-left"
                        : "text-white/40 font-medium scale-95 blur-[1px] origin-left"
                        }`}
                    >
                      {p.title}
                      {/* Growing Underline for active state */}
                      <div className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${isActive ? "w-full scale-x-100" : "w-full scale-x-0"}`} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT SHOWCASE COLUMN ── */}
          <div className="showcase-container w-full md:w-[65%] lg:w-[70%] h-auto md:h-[60vh] lg:h-[70vh] flex items-center justify-center md:justify-end relative">

            <div
              ref={showcaseRef}
              className="relative w-full max-w-[900px] aspect-[16/10] group"
            >
              {/* Layer 3: Soft Orange Ambient Glow */}
              <div className="absolute inset-0 bg-[#f04e00] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 scale-90 z-0 pointer-events-none" />

              {/* Ghost Image Stacks (Creates physical depth) */}
              <div className="absolute inset-0 bg-[#0a0a0a] border border-white/5 rounded-2xl scale-[0.97] translate-y-[20px] z-0 shadow-2xl" />
              <div className="absolute inset-0 bg-[#080808] border border-white/5 rounded-2xl scale-[0.94] translate-y-[40px] -z-10 shadow-2xl" />

              {/* The Cinematic Image Container wrapped in Custom Follower */}
              <FollowerPointerCard title="View Project" className="absolute inset-0 w-full h-full z-10 rounded-2xl overflow-hidden">
                <Link href={projects[activeIndex].link} className="absolute inset-0 cursor-none overflow-hidden rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] block w-full h-full">

                  {/* Layer 2: Noise Texture Overlay */}
                  <div className="absolute inset-0 z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

                  {/* Mapped Images for Crossfades */}
                  {projects.map((p, i) => (
                    <div
                      key={`img-${p.id}`}
                      className={`img-container-${i} absolute inset-0 will-change-transform`}
                      style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 1 }}
                    >
                      <div className="parallax-inner w-full h-full relative">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 70vw"
                          priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-[#050505]/40" />
                      </div>

                      {/* ── IMAGE CORNER DETAILS ── */}
                      <div className="absolute inset-0 z-30 p-8 flex flex-col justify-between pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="text-white/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                          Project {p.id}
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="text-white/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                            Year — {p.year}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Link>
              </FollowerPointerCard>

              {/* ── FLOATING SUPPORT VISUALS ── */}
              {projects.map((p, i) => (
                <div
                  key={`visual-${p.id}`}
                  className={`visual-${i} support-visual absolute -right-[8%] -top-[10%] z-20 pointer-events-none drop-shadow-[0_10px_20px_rgba(240,78,0,0.2)]`}
                  style={{ opacity: i === 0 ? 0.15 : 0 }}
                >
                  {p.visual}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}