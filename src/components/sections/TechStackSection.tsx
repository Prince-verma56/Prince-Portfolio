"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import ScrollText, { type TechItem } from "../kokonutui/scroll-text";
import { Globe, ChevronRight, Shield, Hexagon, LineChart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// UPDATED: Now uses 'name' instead of 'text', and instantiates the icons as JSX elements
const techStackItems: TechItem[] = [
  { name: "Modern Frontend", icon: <Globe className="w-8 h-8 md:w-12 md:h-12" /> },
  { name: "Sustainable Backend", icon: <ChevronRight className="w-8 h-8 md:w-12 md:h-12" /> },
  { name: "Devops", icon: <Shield className="w-8 h-8 md:w-12 md:h-12" /> },
  { name: "Generative AI", icon: <Hexagon className="w-8 h-8 md:w-12 md:h-12" /> },
  { name: "and more", icon: <LineChart className="w-8 h-8 md:w-12 md:h-12" /> },
];

export default function TopSkillsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    if (!isLoaderFinished || !containerRef.current) return;

    // ── Section Un-slanting (Sheet Effect) ──
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

    gsap.fromTo(
      ".tech-content-wrapper",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef, dependencies: [isLoaderFinished] });

  return (
    <div className="w-full relative z-20 drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]">
      <section
        ref={containerRef}
        className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-32 overflow-hidden will-change-transform"
        style={{
          clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        {/* ── Ultra Premium Edge Lighting (Centered) ── */}
        <div className="absolute top-[-150px] left-[50%] -translate-x-1/2 w-[60%] h-[300px] bg-[#f04e00] opacity-[0.15] blur-[120px] pointer-events-none rounded-[100%]" />
        <div className="absolute top-[-50px] left-[50%] -translate-x-1/2 w-[40%] h-[150px] bg-[#f04e00] opacity-[0.25] blur-[80px] pointer-events-none rounded-[100%]" />
        <div className="absolute top-[-20px] left-[50%] -translate-x-1/2 w-[20%] h-[50px] bg-white opacity-[0.1] blur-[30px] pointer-events-none rounded-[100%]" />

        <div className="tech-content-wrapper flex flex-col items-center justify-center w-full relative z-10">
          <h2 className="text-[#f04e00] font-black text-[clamp(3.5rem,8vw,8rem)] tracking-tighter uppercase mb-16 md:mb-24 z-10">
            Top Skills
          </h2>

          <div className="w-full max-w-6xl mx-auto px-6 z-10">
            <ScrollText items={techStackItems} />
          </div>
        </div>
      </section>
    </div>
  );
}