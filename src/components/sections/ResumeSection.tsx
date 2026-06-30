"use client";
import React, { useRef } from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoader } from "@/context/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(
    () => {
      if (!isLoaderFinished || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.from(".resume-header", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".resume-btn",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .from(
          ".resume-macbook",
          {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.6"
        );
    },
    { scope: sectionRef, dependencies: [isLoaderFinished] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32 flex flex-col items-center overflow-hidden border-t border-white/10"
    >
      <div className="flex flex-col items-center mb-0 md:mb-10 px-6 z-10 relative text-center">
        <h2 className="resume-header text-[clamp(3rem,8vw,6rem)] font-black uppercase text-white leading-none tracking-tighter mb-6">
          MY RESUME.
        </h2>
        <p className="resume-header text-white/80 text-lg md:text-xl font-medium max-w-2xl text-center mb-10">
          A comprehensive overview of my professional journey, skills, and
          achievements. Download my resume to learn more.
        </p>
        <div className="resume-btn">
          <ButtonWithIcon
            label="Download Resume"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Prince_Verma_Resume.pdf"
          />
        </div>
      </div>

      <div className="w-full resume-macbook relative -mt-20 md:-mt-40">
        <MacbookScroll
          title={<span />}
          src="https://images.unsplash.com/photo-1781429235828-55c8c31baf38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8"
          showGradient={false}
        />
      </div>
    </section>
  );
}
