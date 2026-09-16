"use client";
import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

const WORD = "PRINCE";

// yPercent that fully hides an element outside its overflow-hidden mask.
// Keep in sync with the `130%` used by `.preloader-letter` in globals.css.
const HIDDEN = 130;

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const trademarkRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const { setIsLoaderFinished } = useLoader();

  useGSAP(
    () => {
      const container = containerRef.current;
      const content = contentRef.current;
      const percent = percentRef.current;
      const trademark = trademarkRef.current;
      if (!container || !content || !percent || !trademark) return;

      setIsLoaderFinished(false);

      const progress = { value: 0 };
      const paint = () => {
        percent.textContent = `${Math.round(progress.value)}%`;
      };

      // Reset for route-change re-runs. `y: 0` also neutralises the SSR inline
      // px transform GSAP would otherwise read, so the yPercent tween lands on 0.
      gsap.set(container, { yPercent: 0, opacity: 1, display: "flex" });
      gsap.set(content, { yPercent: 0 });
      gsap.set(percent, { y: 0, yPercent: HIDDEN });
      gsap.set(trademark, { opacity: 0, y: 8 });
      paint();

      const finish = () => {
        setIsLoaderFinished(true);
        gsap.set(container, { display: "none" });
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap
          .timeline({ onComplete: finish })
          .set(percent, { yPercent: 0 })
          .set(trademark, { opacity: 1, y: 0 })
          .to(progress, { value: 100, duration: 1, ease: "none", onUpdate: paint })
          .to(container, { opacity: 0, duration: 0.4, ease: "power1.out" });
        return;
      }

      // The letters rise through their masks with a pure CSS animation
      // (`.preloader-letter` in globals.css). That runs on the compositor, so it
      // stays smooth while React hydrates and heavy chunks load. GSAP only drives
      // what genuinely needs JS: the counter and the exit choreography.
      // No force3D default: it would leak onto the plain counter object tween and
      // GSAP warns about it; transforms already animate as translate3d while tweening.
      const tl = gsap.timeline({
        delay: 0.1,
        onComplete: finish,
      });

      // ── ENTER: counter rises through its mask, mark fades in after the word lands ──
      tl.to(percent, { yPercent: 0, duration: 0.8, ease: "power4.out" }, 0.35)
        .to(trademark, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 1.15);

      // ── COUNT ──
      tl.to(progress, { value: 100, duration: 2.2, ease: "power2.inOut", onUpdate: paint }, 0.3);

      // ── EXIT: counter and mark leave through the mask… ──
      tl.to(percent, { yPercent: -HIDDEN, duration: 0.5, ease: "power3.in" }, 2.6)
        .to(trademark, { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, 2.6);

      // ── …then the sheet lifts while the word lags behind it (parallax) ──
      tl.to(container, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.8)
        .to(content, { yPercent: 55, duration: 1.1, ease: "expo.inOut" }, 2.8);
    },
    { scope: containerRef, dependencies: [pathname] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f04e00] text-black select-none"
      style={{ willChange: "transform" }}
    >
      <div ref={contentRef} className="flex flex-col items-center justify-center will-change-transform">
        {/* Main branding block */}
        <div className="flex items-start leading-none pb-2">
          <h1 className="flex items-center text-[clamp(3.5rem,10vw,7rem)] font-black uppercase leading-none tracking-normal">
            {WORD.split("").map((char, i) => (
              // Keyed on pathname so a route change remounts the letters and replays the CSS rise.
              <span
                key={`${pathname}-${i}`}
                className="preloader-mask"
                // Tight tracking via margins instead of letter-spacing, so the masks never clip glyph edges.
                style={{ marginRight: i < WORD.length - 1 ? "-0.045em" : 0 }}
              >
                <span className="preloader-letter" style={{ "--i": i } as CSSProperties}>
                  {char}
                </span>
              </span>
            ))}
          </h1>

          <span
            ref={trademarkRef}
            className="mt-2 ml-1 text-[clamp(12px,2.5vw,1.75rem)] font-bold opacity-0 pointer-events-none will-change-transform"
          >
            ®
          </span>
        </div>

        {/* Progress counter inside its own mask */}
        <div className="mt-6 overflow-hidden leading-tight">
          <div
            ref={percentRef}
            className="font-mono text-sm md:text-base font-bold tracking-[0.2em] tabular-nums opacity-80 will-change-transform"
            // Hidden before hydration so there is no flash of "0%" sitting in place.
            style={{ transform: "translate3d(0, 130%, 0)" }}
          >
            0%
          </div>
        </div>
      </div>
    </div>
  );
}
