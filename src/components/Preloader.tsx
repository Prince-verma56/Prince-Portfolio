"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { setIsLoaderFinished } = useLoader();

  useGSAP(() => {
    // 1. Reset states for route changes
    setIsLoaderFinished(false);
    gsap.set(containerRef.current, { yPercent: 0, display: "flex" });
    gsap.set(textRef.current, { opacity: 0, y: 30 });
    if (percentRef.current) percentRef.current.innerText = "0%";

    // Dummy object to tween the percentage smoothly
    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // TELL THE WHOLE APP THE LOADER IS DONE!
        setIsLoaderFinished(true);
        // Hide the preloader so it doesn't block clicks
        gsap.set(containerRef.current, { display: "none" });
      },
    });

    // 2. Fade in the Prince text
    tl.to(textRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    })
    
    // 3. Animate the percentage from 0 to 100
    .to(progress, {
      value: 100,
      duration: 1.5, // Adjust this to make the loading faster/slower
      ease: "power2.inOut",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = Math.round(progress.value) + "%";
        }
      },
    }, "<") // Starts at the same time as the text fade
    
    // 4. Slide the whole orange panel UP and AWAY
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut",
      delay: 0.2, // Tiny pause at 100% before sliding up
    });

  }, { dependencies: [pathname] }); // Re-run whenever the route changes!

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#f04e00] flex flex-col items-center justify-center text-black"
    >
      <div className="flex flex-col items-center overflow-hidden">
        <h1 ref={textRef} className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-tighter flex items-start leading-none">
          Prince <sup className="text-[clamp(10px,2vw,1.5rem)] mt-2 ml-1">®</sup>
        </h1>
        <div ref={percentRef} className="mt-4 text-sm md:text-base font-mono font-bold tracking-widest">
          0%
        </div>
      </div>
    </div>
  );
}
