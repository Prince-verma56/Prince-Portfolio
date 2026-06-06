"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import Text3DFlip from "@/components/ui/text-3d-flip";
import ShimmerText from "@/components/kokonutui/shimmer-text";

gsap.registerPlugin(ScrollTrigger);

// Matched perfectly to your screenshot
const techStack = [
  "NEXT.JS", "TENSORFLOW", "MONGODB", "TAILWIND", "GSAP", "REACT", "PYTHON", "FIGMA"
];

interface AboutSectionProps {
  isStandalonePage?: boolean;
}

export default function AboutSection({ isStandalonePage = false }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tiltWrapperRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. ALWAYS RUN INITIAL STATES IMMEDIATELY (UNCONDITIONAL)
    gsap.set(".mask-reveal-inner", { y: "120%", opacity: 0, rotate: 2 });
    if (tiltWrapperRef.current) {
      gsap.set(tiltWrapperRef.current, {
        transformPerspective: 1200,
        transformOrigin: "50% 50%", 
      });
    }

    // 2. Section Clip-Path (Slant -> Flat) - Only on scroll page
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

      // Parallax: Content sliding up
      gsap.fromTo(
        contentRef.current,
        { y: 200 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 10%", 
            scrub: 1.5,
          },
        }
      );
    }

    // 3. Modern "Mask" Text Reveal for Intro
    const textElements = gsap.utils.toArray(".mask-reveal-inner");
    if (isStandalonePage) {
      const tl = gsap.timeline({ paused: true });
      tl.to(textElements, {
        y: "0%",
        opacity: 1, 
        rotate: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out"
      });
      tlRef.current = tl;
    } else {
      textElements.forEach((el: any) => {
        gsap.to(el, {
          y: "0%",
          opacity: 1, 
          rotate: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el.parentElement, 
            start: "top 85%",
          }
        });
      });
    }

    // 4. 3D Tilted Marquee Container
    if (tiltWrapperRef.current) {
      gsap.fromTo(
        tiltWrapperRef.current,
        {
          rotationY: 12,    // Swung backward initially
          rotationZ: 3,     // Tilted downward slightly
          skewX: 3          // Sleek shear angle
        },
        {
          rotationY: -10,   // Swings forward on scroll
          rotationZ: -3,    // Lifts up dynamically
          skewX: -2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }
      );
    }

    // 5. Horizontal Marquee Track Speed
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -35, // Scrubs the text sideways as you scroll down
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    }

  }, { scope: sectionRef, dependencies: [isStandalonePage] });

  // 6. Play the timeline and refresh ScrollTriggers when loader finishes
  useEffect(() => {
    if (isLoaderFinished) {
      if (isStandalonePage && tlRef.current) {
        tlRef.current.play();
      }
      ScrollTrigger.refresh();
    } else {
      if (isStandalonePage && tlRef.current) {
        tlRef.current.progress(0).pause();
      }
    }
  }, [isLoaderFinished, isStandalonePage]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative z-20 bg-[#050505] text-white pb-40 w-full will-change-transform overflow-hidden ${
        isStandalonePage ? "pt-8" : "pt-24"
      }`}
      style={isStandalonePage ? {} : {
        clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    >
      <div 
        ref={contentRef} 
        className={`max-w-[1400px] mx-auto flex flex-col will-change-transform ${
          isStandalonePage ? "pt-0" : "pt-12 md:pt-20"
        }`}
      >
        
        {/* Top Meta Row */}
        {/* Border switched to white/10 */}
        <div className="px-6 md:px-12 border-b border-white/10 pb-6 mb-16 md:mb-24">
          <div className="overflow-hidden">
            <div className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 flex justify-between items-center text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-white/50">
              <span>• 02</span>
              <span>[About]</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

        {/* ── Intro Typography ── */}
        <div className="w-full flex flex-col gap-2 md:gap-4 px-6 md:px-12 lg:pl-[10%]">
          <div className="overflow-hidden pb-2">
            <h2 className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 text-[clamp(2rem,5vw,5.5rem)] font-medium leading-[1.05] tracking-tight flex flex-wrap items-baseline">
              <ShimmerText as="span" hoverOnly={true} text="Hi, I'm" className="inline-flex font-medium bg-gradient-to-r from-white via-neutral-400 to-white" />
              <span className="whitespace-pre"> </span>
              <ShimmerText as="span" hoverOnly={true} text="Prince" className="inline-flex font-black text-[#f04e00]" />
              <span className="whitespace-pre"> </span>
              <ShimmerText as="span" hoverOnly={true} text="– a B.Tech AI & Data" className="inline-flex font-medium bg-gradient-to-r from-white via-neutral-400 to-white" />
            </h2>
          </div>
          <div className="overflow-hidden pb-2">
            <ShimmerText
              as="h2"
              text="Analytics student who ships real things."
              hoverOnly={true}
              className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 text-[clamp(2rem,5vw,5.5rem)] font-medium leading-[1.05] tracking-tight inline-flex bg-gradient-to-r from-white via-neutral-400 to-white"
            />
          </div>
          <div className="overflow-hidden pb-2 mt-4 md:mt-8">
            <ShimmerText
              as="h2"
              text="I build across the stack: ML pipelines,"
              hoverOnly={true}
              className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 text-[clamp(1.5rem,4vw,4.5rem)] font-light leading-[1.1] tracking-tight bg-gradient-to-r from-neutral-400 via-white to-neutral-400 inline-flex"
            />
          </div>
          <div className="overflow-hidden pb-2">
            <ShimmerText
              as="h2"
              text="mobile apps, IoT dashboards, and"
              hoverOnly={true}
              className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 text-[clamp(1.5rem,4vw,4.5rem)] font-light leading-[1.1] tracking-tight bg-gradient-to-r from-neutral-400 via-white to-neutral-400 inline-flex"
            />
          </div>
          <div className="overflow-hidden pb-2">
            <ShimmerText
              as="h2"
              text="interfaces people actually want to use."
              hoverOnly={true}
              className="mask-reveal-inner opacity-0 translate-y-[120%] rotate-2 text-[clamp(1.5rem,4vw,4.5rem)] font-light leading-[1.1] tracking-tight bg-gradient-to-r from-neutral-400 via-white to-neutral-400 inline-flex"
            />
          </div>
        </div>

      </div>

      {/* ── 3D Tilted Marquee Container ── */}
      {/* Container background flipped to dark grey (#0a0a0a) and borders to white/10 */}
      <div
        ref={tiltWrapperRef}
        className="mt-32 md:mt-48 border-y border-white/10 py-6 md:py-10 bg-[#0a0a0a] flex overflow-hidden select-none will-change-transform shadow-2xl"
      >
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 md:gap-16 will-change-transform pl-12">
          {/* We duplicate the array 3 times so it never runs out of text while scrolling */}
          {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, idx) => (
            <span 
              key={idx} 
              // Marquee text flipped to crisp white
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white flex items-center gap-12 md:gap-16"
            >
              <span>{tech}</span>
              {/* The tiny orange dot */}
              <span className="text-xl md:text-3xl text-[#f04e00]">•</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}