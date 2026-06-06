"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Full Stack Products",
    subtitle: "Building scalable web applications from idea to deployment with modern technologies.",
    tags: ["React", "Node.js"],
  },
  {
    id: "02",
    title: "3D Web Experiences",
    subtitle: "Creating immersive, interactive websites using Three.js, WebGL, and modern animations.",
    tags: ["Three.js", "GSAP"],
  },
  {
    id: "03",
    title: "UI/UX Design",
    subtitle: "Designing intuitive interfaces that balance aesthetics, usability, and business goals.",
    tags: ["Figma", "Design Systems"],
  },
  {
    id: "04",
    title: "AI-Powered Solutions",
    subtitle: "Integrating AI models, APIs, and intelligent workflows into real-world applications.",
    tags: ["LLMs", "AI Integration"],
  },
  {
    id: "05",
    title: "Automation Systems",
    subtitle: "Eliminating repetitive work through smart automations, workflows, and custom tools.",
    tags: ["Workflows", "APIs"],
  },
  {
    id: "06",
    title: "Agentic AI Systems",
    subtitle: "Developing autonomous AI agents capable of reasoning, planning, and executing tasks.",
    tags: ["AI Agents", "Multi-Agent"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ── 1. Initial Scroll, Entrance & Parallax Animations ──
  useGSAP(() => {
    // Section un-slanting
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

    // Global Container Parallax
    gsap.fromTo(
      contentRef.current,
      { y: 150 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 15%",
          scrub: 1.5,
        },
      }
    );

    // Heading Reveal
    gsap.fromTo(
      ".mask-title-wrapper",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".mask-title-wrapper",
          start: "top 85%",
        },
      }
    );

    // ── NEW: Accordion Rows Staggered Entrance ──
    gsap.fromTo(
      ".accordion-row",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.1, // This creates the "one by one" effect
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".accordion-list",
          start: "top 85%",
          once: true, // Only play once when scrolled into view
        }
      }
    );

    // ── NEW: Accordion Rows Continuous Parallax ──
    // Uses yPercent so it doesn't conflict with the 'y' entrance animation
    gsap.to(".accordion-row", {
      yPercent: -10, // Slight upward drift as you scroll down
      ease: "none",
      stagger: 0.02, // Adds a slight wave effect to the parallax
      scrollTrigger: {
        trigger: ".accordion-list",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

  }, { scope: sectionRef, dependencies: [] });

  // ── 2. Accordion Interaction Animations ──
  useGSAP(() => {
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const collapsedTitle = item.querySelector(".collapsed-title");
      const expandedBody = item.querySelector(".expanded-body");
      const innerContent = item.querySelector(".inner-content");

      if (activeIndex === index) {
        // OPENING ANIMATION (Upgraded to expo.inOut for premium smoothness)
        gsap.to(collapsedTitle, { height: 0, opacity: 0, duration: 0.5, ease: "expo.inOut" });
        gsap.to(expandedBody, { height: "auto", duration: 0.7, ease: "expo.inOut" });
        gsap.fromTo(
          innerContent, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out", overwrite: true }
        );
      } else {
        // CLOSING ANIMATION
        gsap.to(expandedBody, { height: 0, duration: 0.6, ease: "expo.inOut" });
        gsap.to(innerContent, { opacity: 0, y: 0, duration: 0.2, overwrite: true });
        gsap.to(collapsedTitle, { height: "auto", opacity: 1, duration: 0.5, delay: 0.2, ease: "expo.inOut" });
      }
    });

    setTimeout(() => ScrollTrigger.refresh(), 800);
  }, { scope: sectionRef, dependencies: [activeIndex] });


  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-30 bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-20 overflow-hidden w-full will-change-transform"
      style={{
        clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    >
      <div ref={contentRef} className="max-w-[1400px] mx-auto flex flex-col will-change-transform">

        {/* Top Titles Section */}
        <div className="mask-title-wrapper flex flex-col items-end pb-8 mb-16 border-b border-white/10 w-full">
          <span className="text-white/60 font-mono tracking-widest text-sm mb-2 uppercase">
            (Services)
          </span>
          <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-black uppercase text-white leading-none tracking-tighter text-right">
            HOW I CAN HELP <span className="font-serif italic font-medium">?</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="accordion-list flex flex-col w-full">
          {services.map((service, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={service.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="accordion-row relative border-b border-white/10 group py-10 md:py-14 w-full transition-colors hover:bg-white/[0.02] cursor-pointer"
              >
                
                {/* ── Animated Toggle Icon (+ / -) ── */}
                <div className="absolute top-12 md:top-16 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 bg-transparent transition-all duration-300 group-hover:border-white/50 z-10">
                  <div className="relative w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center">
                    {/* Horizontal Line */}
                    <span className="absolute w-full h-[1.5px] bg-white rounded-full transition-transform duration-500 ease-in-out" />
                    {/* Vertical Line */}
                    <span 
                      className={`absolute w-full h-[1.5px] bg-white rounded-full transition-all duration-500 ease-in-out ${
                        isOpen ? "rotate-0 opacity-0" : "rotate-90 opacity-100"
                      }`} 
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 px-4 md:px-8 pr-20 md:pr-28">
                  
                  {/* Fixed Number on Left */}
                  <div className="w-16 md:w-[120px] flex-shrink-0 pt-2">
                    <div className="relative inline-block">
                      <span className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter transition-colors group-hover:text-white/80">
                        {service.id}.
                      </span>
                      {/* Tiny Orange Accent Dot */}
                      <div className="absolute bottom-1 -right-3 w-2.5 h-2.5 bg-[#f04e00]" />
                    </div>
                  </div>

                  {/* Right Side (Changes based on click) */}
                  <div className="flex-1 flex flex-col justify-center">

                    {/* 1. Collapsed State */}
                    <div className="collapsed-title w-full overflow-hidden">
                      <div className="flex justify-start lg:justify-end items-center h-full pt-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#f04e00]">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* 2. Expanded State */}
                    <div className="expanded-body h-0 overflow-hidden w-full">
                      <div className="inner-content pt-8 pb-4">

                        {/* Detailed Content */}
                        <div className="flex flex-col gap-8 justify-center">
                          <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#f04e00] leading-[0.9] tracking-tight">
                            {service.title}
                          </h3>
                          
                          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light">
                            {service.subtitle}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 mt-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="border border-white/20 bg-white/5 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}