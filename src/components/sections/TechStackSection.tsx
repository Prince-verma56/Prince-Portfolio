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
  { name: "N8N Workflows", icon: <LineChart className="w-8 h-8 md:w-12 md:h-12" /> },
];

export default function TopSkillsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    if (!isLoaderFinished) return;

    gsap.fromTo(
      containerRef.current,
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
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-32 overflow-hidden"
    >
      <h2 className="text-[#f04e00] font-black text-[clamp(3.5rem,8vw,8rem)] tracking-tighter uppercase mb-16 md:mb-24 z-10">
        Top Skills
      </h2>

      <div className="w-full max-w-6xl mx-auto px-6 z-10">
        <ScrollText items={techStackItems} />
      </div>
    </section>
  );
}