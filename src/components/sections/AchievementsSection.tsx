"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Customizing the data slightly to allow for that beautiful mixed-color typography
const achievements = [
  {
    title: "Global AI Summit Winner",
    prize: "50,000",
    descriptionPart1: "Secured 1st position among competing teams and won a",
    descriptionPart2: "cash prize for innovation in healthcare technology.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=90",
  },
  {
    title: "CODEPUNK Hackathon",
    prize: "Official Recognition",
    description: "Recognized as Top 10 Runner-ups in Internal University rounds for IoT innovation management.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=90",
  },
];

export default function AchievementsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // 1. Overall Section Reveal
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

    // 2. Main Title Reveal
    gsap.fromTo(
      ".main-title-mask",
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".main-title-wrapper",
          start: "top 80%",
        }
      }
    );

    // 3. Per-Achievement Animations
    rowRefs.current.forEach((row) => {
      if (!row) return;

      const imgWrap = row.querySelector(".img-wrap");
      const imgInner = row.querySelector(".img-inner");
      const textMasks = row.querySelectorAll(".text-mask");

      // Initial States
      gsap.set(imgWrap, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(textMasks, { y: "110%", opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 75%",
        },
      });

      // Reveal Image, then stagger text
      tl.to(imgWrap, { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "power3.inOut" })
        .to(textMasks, { y: "0%", opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=0.8");

      // Independent Parallax for Image
      if (imgInner) {
        gsap.fromTo(
          imgInner,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    });

    ScrollTrigger.refresh();
  }, { scope: containerRef, dependencies: [] });

  return (
    <section
      ref={containerRef}
      id="achievements"
      className="relative z-30 bg-[#0a0a0a] pb-32 overflow-hidden w-full will-change-transform"
      style={{
        clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    >
      {/* Dynamic Slanted Orange Background Shape */}
      {/* This perfectly replicates the bold orange top section from your screenshot, but gives it a sleek angle */}
      <div 
        className="absolute top-0 left-0 w-full h-[70vh] bg-[#f04e00] z-0 pointer-events-none origin-top-left"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 0 100%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-32 flex flex-col will-change-transform">
        
        {/* Header */}
        <div className="main-title-wrapper overflow-hidden pb-4 mb-16 md:mb-24">
          <h2 className="main-title-mask text-[clamp(3.5rem,8vw,8rem)] font-black uppercase text-white leading-[0.85] tracking-tighter shadow-sm">
            LET'S TALK ABOUT <br /> ACHIEVEMENTS.
          </h2>
        </div>

        {/* ── ACHIEVEMENT 01: The Hero Layout ── */}
        <div 
          ref={(el) => { rowRefs.current[0] = el; }}
          className="flex flex-col items-center gap-12 md:gap-16 mb-40 w-full"
        >
          {/* Overlapping Image Container */}
          <div className="img-wrap relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-xl shadow-2xl bg-black">
            <div className="img-inner absolute inset-0 -top-[15%] h-[130%] w-full">
              <Image
                src={achievements[0].image}
                alt={achievements[0].title}
                fill
                className="object-cover opacity-90"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Mixed Typography Text Box */}
          <div className="max-w-5xl text-center px-4">
            <div className="overflow-hidden pb-2">
              <h3 className="text-mask text-3xl md:text-5xl lg:text-[3.5rem] font-light text-white leading-tight tracking-tight">
                <span className="font-bold text-[#f04e00]">{achievements[0].title}:</span> {achievements[0].descriptionPart1} <span className="font-bold text-[#f04e00]">₹{achievements[0].prize}</span> {achievements[0].descriptionPart2}
              </h3>
            </div>
          </div>
        </div>


        {/* ── ACHIEVEMENT 02: The Grid Layout ── */}
        <div 
          ref={(el) => { rowRefs.current[1] = el; }}
          className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-center w-full max-w-6xl mx-auto"
        >
          {/* Portrait Image */}
          <div className="img-wrap relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl bg-[#111]">
            <div className="img-inner absolute inset-0 -top-[15%] h-[130%] w-full">
              <Image
                src={achievements[1].image}
                alt={achievements[1].title}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="overflow-hidden pb-2">
              <h3 className="text-mask text-5xl md:text-6xl lg:text-7xl font-black text-[#f04e00] uppercase leading-[0.85] tracking-tighter">
                {achievements[1].title}:
              </h3>
            </div>
            
            <div className="overflow-hidden pb-2">
              <p className="text-mask text-white/90 text-xl md:text-3xl font-light leading-relaxed">
                {achievements[1].description}
              </p>
            </div>
            
            {/* Meta Tags */}
            <div className="overflow-hidden mt-4 pt-2">
              <div className="text-mask flex gap-3">
                 <span className="border border-white/20 bg-white/5 text-white/80 text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full">
                   {achievements[1].prize}
                 </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}