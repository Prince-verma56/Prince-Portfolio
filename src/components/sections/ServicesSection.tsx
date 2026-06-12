"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Full Stack Products",
    subtitle: "Building scalable web applications from idea to deployment with modern technologies.",
    tags: ["React", "Node.js"],
    image: "https://res.cloudinary.com/dtslaveid/image/upload/v1781245408/b6d38109-6908-453e-8836-a4284fa4daf5_ukalze.png",
  },
  {
    id: "02",
    title: "3D Web Experiences",
    subtitle: "Creating immersive, interactive websites using Three.js, WebGL, and modern animations.",
    tags: ["Three.js", "GSAP"],
    image: "https://res.cloudinary.com/dtslaveid/image/upload/v1781245402/fec6f177-fae4-44b5-aad9-16ffaf15fa4a_cmgtup.png",
  },
  {
    id: "03",
    title: "UI/UX Design",
    subtitle: "Designing intuitive interfaces that balance aesthetics, usability, and business goals.",
    tags: ["Figma", "Design Systems"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "04",
    title: "AI-Powered Solutions",
    subtitle: "Integrating AI models, APIs, and intelligent workflows into real-world applications.",
    tags: ["LLMs", "AI Integration"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "05",
    title: "Automation Systems",
    subtitle: "Eliminating repetitive work through smart automations, workflows, and custom tools.",
    tags: ["Workflows", "APIs"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "06",
    title: "Agentic AI Systems",
    subtitle: "Developing autonomous AI agents capable of reasoning, planning, and executing tasks.",
    tags: ["AI Agents", "Multi-Agent"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const accordionListRef = useRef<HTMLDivElement>(null);
  const { isLoaderFinished } = useLoader();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ── 1. Initial Scroll, Entrance & Parallax Animations ──
  useGSAP(() => {
    if (!isLoaderFinished || !sectionRef.current) return;

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

    // Heading Reveal — scoped to headingRef, not a global .mask-title-wrapper query
    gsap.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      }
    );

    // Accordion Rows Staggered Entrance — scoped to accordionListRef
    const rows = accordionListRef.current
      ? gsap.utils.toArray<HTMLElement>(accordionListRef.current.querySelectorAll(".accordion-row"))
      : [];

    if (rows.length) {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: accordionListRef.current,
            start: "top 85%",
            once: true,
          }
        }
      );

      // Accordion Rows Continuous Parallax
      gsap.to(rows, {
        yPercent: -10,
        ease: "none",
        stagger: 0.02,
        scrollTrigger: {
          trigger: accordionListRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    }

  }, { scope: sectionRef, dependencies: [isLoaderFinished] });

  // ── 2. Accordion Interaction Animations ──
  useGSAP(() => {
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const collapsedTitle = item.querySelector(".collapsed-title");
      const expandedBody = item.querySelector(".expanded-body");
      const innerContent = item.querySelector(".inner-content");

      if (activeIndex === index) {
        // OPENING ANIMATION
        gsap.to(collapsedTitle, { height: 0, opacity: 0, duration: 0.5, ease: "expo.inOut" });
        gsap.to(expandedBody, {
          height: "auto",
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.fromTo(
          innerContent,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out", overwrite: true }
        );
      } else {
        // CLOSING ANIMATION
        gsap.to(expandedBody, {
          height: 0,
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.to(innerContent, { opacity: 0, y: 0, duration: 0.2, overwrite: true });
        gsap.to(collapsedTitle, { height: "auto", opacity: 1, duration: 0.5, delay: 0.2, ease: "expo.inOut" });
      }
    });
  }, { scope: sectionRef, dependencies: [activeIndex] });


  return (
    <div className="w-full relative z-30 drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]">
      <section
        ref={sectionRef}
        id="services"
        className="relative w-full bg-[#0a0a0a] py-32 overflow-hidden will-change-transform"
        style={{
          clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        {/* ── Ultra Premium Edge Lighting (Right Focused) ── */}
        <div className="absolute top-[-150px] right-[-10%] w-[50%] h-[300px] bg-[#f04e00] opacity-[0.15] blur-[120px] pointer-events-none rounded-[100%]" />
        <div className="absolute top-[-50px] right-[-5%] w-[30%] h-[150px] bg-[#f04e00] opacity-[0.25] blur-[80px] pointer-events-none rounded-[100%]" />
        <div className="absolute top-[-20px] right-0 w-[20%] h-[50px] bg-white opacity-[0.1] blur-[30px] pointer-events-none rounded-[100%]" />

        <div ref={contentRef} className="relative z-10 max-w-[1400px] mx-auto flex flex-col will-change-transform px-6 md:px-12 lg:px-20">

          {/* Top Titles Section */}
          <div ref={headingRef} className="mask-title-wrapper flex flex-col items-end pb-8 mb-16 border-b border-white/10 w-full">
            <span className="text-white/60 font-mono tracking-widest text-sm mb-2 uppercase">
              (Services)
            </span>
            <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-black uppercase text-white leading-none tracking-tighter text-right">
              HOW I CAN HELP <span className="font-serif italic font-medium text-[#f04e00]">?</span>
            </h2>
          </div>

          {/* Accordion List */}
          <div ref={accordionListRef} className="accordion-list flex flex-col w-full">
            {services.map((service, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={service.id}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className={`accordion-row relative group py-10 md:py-14 w-full transition-colors cursor-pointer ${isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                    }`}
                >
                  {/* ── Premium Animated Divider Lines ── */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 transition-colors duration-500 group-hover:bg-white/20" />

                  <div
                    className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#f04e00] via-[#f04e00]/50 to-transparent origin-left transition-transform duration-700 ease-out ${isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />

                  {/* ── Animated Toggle Icon (+ / -) ── */}
                  <div className="absolute top-12 md:top-16 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 bg-transparent transition-all duration-300 group-hover:border-white/50 z-10">
                    <div className="relative w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center">
                      {/* Horizontal Line */}
                      <span className="absolute w-full h-[1.5px] bg-white rounded-full transition-transform duration-500 ease-in-out" />
                      {/* Vertical Line */}
                      <span
                        className={`absolute w-full h-[1.5px] bg-white rounded-full transition-all duration-500 ease-in-out ${isOpen ? "rotate-0 opacity-0" : "rotate-90 opacity-100"
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

                      {/* 2. Expanded State (NOW WITH IMAGE GRID) */}
                      <div className="expanded-body h-0 overflow-hidden w-full">
                        <div className="inner-content pt-8 pb-4 opacity-0">

                          {/* Image & Text Flex Container */}
                          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch">

                            {/* LEFT: Premium Image Container */}
                            <div className="w-full lg:w-[45%] h-[260px] md:h-[350px] relative rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                              {/* Dark Overlay to blend perfectly with background */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent z-10" />
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                              />
                            </div>

                            {/* RIGHT: Text & Tags Container */}
                            <div className="flex-1 flex flex-col gap-6 lg:gap-8 justify-center">
                              <h3 className="text-4xl md:text-5xl lg:text-[4rem] font-black text-[#f04e00] leading-[0.9] tracking-tighter drop-shadow-lg">
                                {service.title}
                              </h3>

                              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl font-light">
                                {service.subtitle}
                              </p>

                              {/* Actionable Tags */}
                              <div className="flex flex-wrap gap-3 md:gap-4 mt-2">
                                {service.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="border border-white/20 bg-transparent hover:bg-white/5 transition-colors text-white/90 text-xs md:text-sm font-medium px-5 py-2.5 rounded-full cursor-default"
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
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}