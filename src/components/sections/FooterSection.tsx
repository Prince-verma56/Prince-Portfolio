"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    if (!isLoaderFinished || !containerRef.current) return;

    gsap.set(".orange-footer-text", { y: "120%", opacity: 0, rotateZ: 2 });
    gsap.set(".orange-footer-fade", { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(".orange-footer-text", {
          y: "0%",
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out"
        })
        .to(".orange-footer-fade", {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.8");
      }
    });
  }, { scope: containerRef, dependencies: [isLoaderFinished] });

  return (
    <section ref={containerRef} id="contact" className="bg-[#F04E00] min-h-0 md:min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 md:py-20 text-center border-t border-neutral-900 overflow-hidden">
      <div className="orange-footer-fade overflow-hidden mb-4 md:mb-6">
         <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-900 uppercase">{"// HAVE A PROJECT?"}</span>
      </div>
      <h2 className="text-[clamp(2.5rem,12vw,8rem)] font-black uppercase text-white leading-[0.9] tracking-tighter mb-6 md:mb-12">
        <div className="overflow-hidden pb-1 md:pb-2">
           <span className="orange-footer-text block origin-top-left">LET&apos;S WORK</span>
        </div>
        <div className="overflow-hidden pb-2 md:pb-4">
           <span className="orange-footer-text block origin-top-left">TOGETHER.</span>
        </div>
      </h2>
      <div className="orange-footer-fade">
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=princeverma.dev96@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-2xl font-medium text-white border-b border-white/20 pb-2 hover:text-[#000] hover:border-[#000] transition-colors duration-300 break-all"
        >
          princeverma.dev96@gmail.com
        </a>
      </div>
    </section>
  );
}