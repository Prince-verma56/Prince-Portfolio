"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Web design & development",
    subtitle: "Logos, colors, type, your brand, fully alive.",
    tags: ["Responsive Design", "Interactive Design"],
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=90",
    year: "Frame 7",
  },
  {
    id: "02",
    title: "Social Media",
    subtitle: "Can handle different Social Media Account at different platforms.",
    tags: ["Instagram Design", "Content Templates"],
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1800&q=90",
    year: "Frame 8",
  },
  {
    id: "03",
    title: "Branding",
    subtitle: "Can handle different Social Media Account at different platforms.",
    tags: ["Logo Design", "Color System"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&q=90",
    year: "Frame 9",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ── 1. Initial Scroll & Parallax Animations ──
  useGSAP(() => {
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
  }, { scope: sectionRef, dependencies: [] });

  // ── 2. Accordion Interaction Animations ──
  useGSAP(() => {
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const collapsedTitle = item.querySelector(".collapsed-title");
      const expandedBody = item.querySelector(".expanded-body");
      const innerContent = item.querySelector(".inner-content");

      if (activeIndex === index) {
        // OPENING ANIMATION
        gsap.to(collapsedTitle, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(expandedBody, { height: "auto", duration: 0.6, ease: "power3.inOut" });
        gsap.fromTo(
          innerContent, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out", overwrite: true }
        );
      } else {
        // CLOSING ANIMATION
        gsap.to(expandedBody, { height: 0, duration: 0.5, ease: "power3.inOut" });
        gsap.to(innerContent, { opacity: 0, y: 0, duration: 0.2, overwrite: true });
        gsap.to(collapsedTitle, { height: "auto", opacity: 1, duration: 0.4, delay: 0.3, ease: "power2.inOut" });
      }
    });

    setTimeout(() => ScrollTrigger.refresh(), 650);
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
      {/* Increased max-w to 1400px to stretch the accordion much wider */}
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
        <div className="flex flex-col w-full">
          {services.map((service, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={service.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="relative border-b border-white/10 group cursor-pointer py-10 md:py-14 w-full transition-colors hover:bg-white/[0.02]"
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

                {/* Adjusted right padding so content doesn't hit the button */}
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
                      {/* Flex justify-end pushes the title perfectly to the right side, next to the icon */}
                      <div className="flex justify-start lg:justify-end items-center h-full pt-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#f04e00]">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* 2. Expanded State */}
                    <div className="expanded-body h-0 overflow-hidden w-full">
                      {/* Using a wider grid gap since we have more space now */}
                      <div className="inner-content grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 lg:gap-20 pt-8 pb-4">
                        
                        {/* Left: Image Container */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[#0388d1] text-[10px] font-medium tracking-widest pl-1">
                            {service.year}
                          </span>
                          <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-[#0388d1]/30 shadow-2xl">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 400px"
                              priority={index === 0}
                            />
                          </div>
                        </div>

                        {/* Right: Detailed Content */}
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