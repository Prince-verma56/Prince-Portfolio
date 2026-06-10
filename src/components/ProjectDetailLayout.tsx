"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

// Note: In production, these props will be passed down from a data file based on the URL parameter.
export interface ProjectData {
  title: string;
  description: string;
  year: string;
  timeline: string;
  services: string;
  liveLink: string;
  heroImage: string;
  galleryImages: string[];
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
}

export default function ProjectDetailLayout({ project }: { project: ProjectData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. ALWAYS RUN INITIAL STATES IMMEDIATELY (UNCONDITIONAL)
    gsap.set(".mask-line", { y: "110%" });
    gsap.set(".fade-up", { opacity: 0, y: 30 });
    gsap.set(".img-wrap", { clipPath: "inset(100% 0 0 0)" });
    gsap.set(".scroll-text", { opacity: 0, y: 40 });

    // 2. Build Entrance Timeline (PAUSED)
    const tl = gsap.timeline({ paused: true });
    tl.to(".mask-line", { y: "0%", duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.2 })
      .to(".fade-up", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.8");
    tlRef.current = tl;

    // 3. Parallax Image Reveals (Applies to all images with class .img-wrap)
    const images = gsap.utils.toArray(".img-wrap");
    images.forEach((wrap: any) => {
      const inner = wrap.querySelector(".img-inner");

      // The mask wipe effect
      gsap.to(wrap,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: { trigger: wrap, start: "top 80%" }
        }
      );

      // The internal parallax scrub
      if (inner) {
        gsap.fromTo(inner,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    });

    // 4. Scroll Text Reveals for Challenge/Solution
    const textBlocks = gsap.utils.toArray(".scroll-text");
    textBlocks.forEach((block: any) => {
      gsap.to(block,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 85%" }
        }
      );
    });

  }, { scope: containerRef, dependencies: [project] });

  // 5. Play timelines and refresh ScrollTriggers when loader finishes
  useEffect(() => {
    if (isLoaderFinished) {
      tlRef.current?.play();
      ScrollTrigger.refresh();
    } else {
      tlRef.current?.progress(0).pause();
    }
  }, [isLoaderFinished]);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white pt-28 md:pt-36 lg:pt-44">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col gap-32 pb-32">

        {/* ── 1. HERO SECTION (Title & Meta) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-32 items-start">
          {/* Title & Desc */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden pb-4">
              <h1 className="mask-line translate-y-[110%] text-[clamp(4rem,12vw,10rem)] font-black uppercase leading-[0.8] tracking-tighter">
                {project.title}
              </h1>
            </div>
            <p className="fade-up opacity-0 translate-y-[30px] text-white/60 text-lg md:text-2xl font-medium max-w-xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Meta Data Grid */}
          <div className="fade-up opacity-0 translate-y-[30px] flex flex-col gap-6 md:min-w-[300px]">
            {[
              { label: "Year", value: project.year },
              { label: "Timeline", value: project.timeline },
              { label: "Services", value: project.services },
            ].map((meta) => (
              <div key={meta.label} className="grid grid-cols-[100px_1fr] gap-4 items-baseline border-b border-white/10 pb-4">
                <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">({meta.label})</span>
                <span className="text-white font-medium text-sm md:text-base">{meta.value}</span>
              </div>
            ))}
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-[#f04e00] font-bold flex items-center gap-2 w-fit group mt-2">
              Live Website <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          </div>
        </div>

        {/* ── 2. HERO IMAGE ── */}
        <div className="img-wrap relative w-full aspect-[16/12] md:aspect-[28/9] overflow-hidden rounded-xl" style={{ clipPath: "inset(100% 0 0 0)" }}>
          <div className="img-inner absolute inset-0 -top-[15%] h-[130%] w-full">
            <Image src={project.heroImage} alt={project.title} fill className="object-cover object-center " priority sizes="(max-width: 1400px) 100vw, 1400px" />
          </div>
        </div>

        {/* ── 3. CHALLENGE & SOLUTION (Editorial Layout) ── */}
        <div className="flex flex-col gap-24 md:gap-32 max-w-5xl mx-auto w-full">

          {/* Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-24 scroll-text opacity-0 translate-y-[40px]">
            <h3 className="text-white/40 text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-2">
              Challenges<span className="text-[#f04e00] text-3xl leading-none">.</span>
            </h3>
            <p className="text-white/90 text-xl md:text-3xl font-medium leading-[1.4] tracking-tight">
              {project.challenge}
            </p>
          </div>

          {/* Solution */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-24 scroll-text opacity-0 translate-y-[40px]">
            <h3 className="text-white/40 text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-2">
              Solutions<span className="text-[#f04e00] text-3xl leading-none">.</span>
            </h3>
            <p className="text-white/90 text-xl md:text-3xl font-medium leading-[1.4] tracking-tight">
              {project.solution}
            </p>
          </div>
        </div>

        {/* ── 4. SECONDARY IMAGE GALLERY ── */}
        {project.galleryImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {project.galleryImages.map((img, i) => (
              <div key={i} className={`img-wrap relative w-full aspect-[4/3] overflow-hidden rounded-xl ${i === 2 ? 'md:col-span-2 md:aspect-[21/9]' : ''}`} style={{ clipPath: "inset(100% 0 0 0)" }}>
                <div className="img-inner absolute inset-0 -top-[15%] h-[130%] w-full">
                  <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 700px" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 5. RESULTS DATA ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto w-full py-16 scroll-text opacity-0 translate-y-[40px] border-y border-white/10">
          {project.results.map((res, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-[3rem] md:text-[5rem] font-black leading-none tracking-tighter">{res.value}</span>
              <span className="text-white/50 text-xs md:text-sm font-mono tracking-widest uppercase">{res.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
