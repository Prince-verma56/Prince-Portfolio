"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { FlipText } from "@/components/ui/flip-text";

gsap.registerPlugin(ScrollTrigger);

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
    // 1. Force clean, hidden starting states immediately
    gsap.set(".mask-reveal-inner", { y: "130%", opacity: 0, rotate: 2 });
    
    if (tiltWrapperRef.current) {
      gsap.set(tiltWrapperRef.current, {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
      });
    }

    // 2. Section Entry Polish (Slant -> Flat)
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

      // Smooth content parallax shift
      gsap.fromTo(
        contentRef.current,
        { y: 100 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        }
      );
    }

    // 3. True Line-by-Line Scroll Unfolding Mechanics
    const textElements = gsap.utils.toArray(".mask-reveal-inner") as HTMLElement[];

    if (isStandalonePage) {
      // Intro sequence behavior for direct landing page views
      const tl = gsap.timeline({ paused: true });
      textElements.forEach((el, index) => {
        const words = el.querySelectorAll('.word');
        if (words.length > 0) {
          gsap.set(el, { y: "0%", opacity: 1, rotate: 0 });
          gsap.set(words, { y: "130%", opacity: 0, rotate: 4 });
          tl.to(words, { y: "0%", opacity: 1, rotate: 0, duration: 1.1, stagger: 0.03, ease: "power4.out" }, index * 0.1);
        } else {
          tl.to(el, { y: "0%", opacity: 1, rotate: 0, duration: 1.1, ease: "power4.out" }, index * 0.1);
        }
      });
      tlRef.current = tl;
    } else {
      // Dynamic scroll behavior: Each line reveals independently upon viewport entry
      textElements.forEach((el) => {
        const words = el.querySelectorAll('.word');
        if (words.length > 0) {
          // Un-hide the line wrapper so words can animate inside it
          gsap.set(el, { y: "0%", opacity: 1, rotate: 0 });
          // Hide words individually for sheet-like parallax reveal
          gsap.set(words, { y: "130%", opacity: 0, rotate: 4 });
          
          gsap.to(words, {
            y: "0%",
            opacity: 1,
            rotate: 0,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top 95%",
              end: "bottom 60%",
              scrub: 1,
            }
          });
        } else {
          // Fallback for lines without words
          gsap.to(el, {
            y: "0%",
            opacity: 1,
            rotate: 0,
            duration: 0.95,
            ease: "power4.out", // High-inertia premium decay curve
            scrollTrigger: {
              trigger: el.parentElement, // Triggers off the stable parent mask container
              start: "top 88%",         // Activates naturally as the line enters the screen area
              toggleActions: "play none none none",
            }
          });
        }
      });
    }

    // 4. Dynamic 3D Tilted Container Swing
    if (tiltWrapperRef.current) {
      gsap.fromTo(
        tiltWrapperRef.current,
        {
          rotationY: 10,
          rotationZ: 2,
          skewX: 2
        },
        {
          rotationY: -8,
          rotationZ: -2,
          skewX: -1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }
      );
    }

    // 5. Linear Marquee Progression
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -15,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    }

  }, { scope: sectionRef, dependencies: [isStandalonePage] });

  // 6. Loader Synchronization & Safe Layout Calculation
  useEffect(() => {
    if (isLoaderFinished) {
      if (isStandalonePage && tlRef.current) {
        tlRef.current.play();
      }
      // Small delay so all lazy-loaded sections have mounted before recalculating scroll positions
      const id = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(id);
    } else {
      if (isStandalonePage && tlRef.current) {
        tlRef.current.progress(0).pause();
      }
    }
  }, [isLoaderFinished, isStandalonePage]);

  return (
    <div className="w-full relative drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]">
      <section
        ref={sectionRef}
        id="about"
        className={`relative w-full bg-[#050505] text-white pb-16 md:pb-32 will-change-transform overflow-hidden ${
          isStandalonePage ? "pt-28 md:pt-36 lg:pt-44" : "pt-24"
        } border-b border-white/5`}
        style={isStandalonePage ? { zIndex: 5 } : {
          clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
          zIndex: 5,
        }}
      >
        {/* ── Ultra Premium Edge Lighting (Left Focused) ── */}
        {!isStandalonePage && (
          <>
            <div className="absolute top-[-150px] left-[-10%] w-[50%] h-[300px] bg-[#f04e00] opacity-[0.15] blur-[120px] pointer-events-none rounded-[100%]" />
            <div className="absolute top-[-50px] left-[-5%] w-[30%] h-[150px] bg-[#f04e00] opacity-[0.25] blur-[80px] pointer-events-none rounded-[100%]" />
            <div className="absolute top-[-20px] left-0 w-[20%] h-[50px] bg-white opacity-[0.1] blur-[30px] pointer-events-none rounded-[100%]" />
          </>
        )}

        <div
          ref={contentRef}
          className={`relative z-10 max-w-[1400px] mx-auto flex flex-col will-change-transform ${
            isStandalonePage ? "pt-0" : "pt-12 md:pt-20"
          }`}
        >

        {/* Top Meta Row */}
        <div className="px-6 md:px-12 border-b border-white/10 pb-6 mb-16 md:mb-24">
          <div className="overflow-hidden">
            <div className="mask-reveal-inner opacity-0 translate-y-[130%] rotate-2 flex justify-between items-center text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-white/50">
              <span>• 02</span>
              <span>[About]</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

        {/* Intro Typography Copy Lines */}
        <div className="w-full flex flex-col gap-1 md:gap-2 px-6 md:px-12 lg:pl-[10%]">
          
          <div className="overflow-hidden pb-2">
            <h2 className="mask-reveal-inner opacity-0 translate-y-[130%] rotate-2 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tight">
              <FlipText className="text-white">Hi, I'm </FlipText>
              <FlipText className="font-black text-[#f04e00]">Prince</FlipText>
            </h2>
          </div>

          <div className="overflow-hidden pb-2">
            <h2 className="mask-reveal-inner opacity-0 translate-y-[130%] rotate-2 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tight">
              <FlipText className="text-neutral-300">– a software developer</FlipText>
            </h2>
          </div>

          <div className="overflow-hidden pb-2 mt-4 md:mt-6">
            <h2 className="mask-reveal-inner opacity-0 translate-y-[130%] rotate-2 text-[clamp(1.75rem,5vw,4.5rem)] font-medium leading-[1.25] tracking-tight">
              <FlipText className="text-neutral-300">passionate about crafting </FlipText>
              <FlipText className="font-bold text-white">exceptional </FlipText>
              <FlipText className="text-neutral-300">digital experiences through </FlipText>
              <FlipText className="font-bold text-white">AI and design.</FlipText>
            </h2>
          </div>
          
          <div className="overflow-hidden pb-2 mt-8 md:mt-12">
            <h2 className="mask-reveal-inner opacity-0 translate-y-[130%] rotate-2 text-[clamp(1.5rem,4.5vw,4rem)] font-light leading-[1.3] tracking-tight">
              <FlipText className="text-neutral-400">Building </FlipText>
              <FlipText className="font-bold text-white">full-stack products, </FlipText>
              <FlipText className="text-neutral-400">immersive </FlipText>
              <FlipText className="font-bold text-white">3D experiences, </FlipText>
              <FlipText className="text-neutral-400">and </FlipText>
              <FlipText className="font-bold text-white">AI-powered solutions.</FlipText>
            </h2>
          </div>
        </div>

      </div>

      {/* 3D Tilted Marquee Track */}
      <div
        ref={tiltWrapperRef}
        className="mt-20 md:mt-32 border-y border-white/10 py-6 md:py-10 bg-[#0a0a0a] flex overflow-hidden select-none will-change-transform shadow-2xl"
      >
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 md:gap-16 will-change-transform pl-12">
          {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, idx) => (
            <span
              key={idx}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white flex items-center gap-12 md:gap-16"
            >
              <span>{tech}</span>
              <span className="text-xl md:text-3xl text-[#f04e00]">•</span>
            </span>
          ))}
        </div>
      </div>
      
      </section>
    </div>
  );
}