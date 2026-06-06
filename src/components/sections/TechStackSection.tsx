"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import ScrollText, { type TechItem } from "../kokonutui/scroll-text";

gsap.registerPlugin(ScrollTrigger);

const techStackItems: TechItem[] = [
  { name: "Modern Frontend", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg> },
  { name: "Sustainable Backend", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg> },
  { name: "Devops", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg> },
  { name: "Generative AI", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },

];

export default function TechStackSection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. Initial State: Hide title
    gsap.set(".tech-title", { y: 60, opacity: 0 });

    // 2. Entrance Animation: Triggered when section is 20% visible
    if (!isStandalonePage) {
      gsap.to(".tech-title", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });
    } else if (isLoaderFinished) {
      gsap.to(".tech-title", { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" });
    }
  }, { scope: sectionRef, dependencies: [isLoaderFinished, isStandalonePage] });

  return (
    <section ref={sectionRef} className="relative z-20 bg-[#050505] text-white py-32 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Title with Mask Reveal */}
        <div className="overflow-hidden mb-16">
          <h2 className="tech-title text-[clamp(3rem,8vw,6rem)] font-black uppercase text-[#f04e00] text-center">
            TOP SKILLS
          </h2>
        </div>

        {/* ScrollText handles its own internal reveal via Framer Motion whileInView */}
        <div className="w-full relative py-12">
          <ScrollText items={techStackItems} />
        </div>

      </div>
    </section>
  );
}