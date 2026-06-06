"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionDivider — diagonal color wedge that acts as an UPPER OVERLAY layer.
 *
 * Architecture fix: the wedge is position:fixed so it sits above ALL content
 * (z-index: 9990) regardless of parent overflow. It is anchored to the top of
 * the viewport at scroll start and GSAP scrubs it upward (yPercent 0 → -110)
 * as you scroll the section into view — creating the illusion that the previous
 * section's color is being "wiped away" to reveal the new section beneath.
 *
 * Props:
 *   sectionId   — the `id` of the section this divider transitions INTO.
 *   fromColor   — background color of the section ABOVE (matched color = seamless seam).
 *   skewDir     — diagonal direction: "right" (↘) or "left" (↙).
 *   height      — wedge height in px (default 260).
 */
type Props = {
  sectionId: string;
  fromColor: string;
  skewDir?: "right" | "left";
  height?: number;
};

export default function SectionDivider({
  sectionId,
  fromColor,
  skewDir = "right",
  height = 280,
}: Props) {
  const wedgeRef = useRef<HTMLDivElement>(null);

  // Clip shapes — "right" = high on left, low on right; "left" = low on left, high on right
  const clip =
    skewDir === "right"
      ? `polygon(0 0, 100% 0, 100% 38%, 0 100%)`
      : `polygon(0 0, 100% 0, 100% 100%, 0 38%)`;

  useEffect(() => {
    const el = wedgeRef.current;
    if (!el) return;

    // Use requestAnimationFrame to ensure DOM is ready
    const setup = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      // Position the fixed wedge to initially cover the top of the target section
      // by syncing its translateY to the section's top — then scrub it upward.
      const tween = gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: -110,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: section,
            // Start when section top is 95% from viewport top (just entering)
            start: "top 95%",
            // End when section top hits the top of viewport
            end: "top top",
            scrub: 2,
          },
        }
      );

      // Also handle the initial Y position: wedge should track section top
      // We do this by setting a CSS custom property for the top offset
      const updateTop = () => {
        const rect = section.getBoundingClientRect();
        const scrollY = window.scrollY;
        el.style.top = `${rect.top + scrollY}px`;
      };

      updateTop();
      ScrollTrigger.addEventListener("refresh", updateTop);
      window.addEventListener("resize", updateTop);

      return () => {
        tween.kill();
        ScrollTrigger.removeEventListener("refresh", updateTop);
        window.removeEventListener("resize", updateTop);
      };
    };

    const cleanup = setup();
    return () => {
      if (cleanup) cleanup();
    };
  }, [sectionId]);

  return (
    <div
      ref={wedgeRef}
      aria-hidden="true"
      className="fixed inset-x-0 pointer-events-none will-change-transform"
      style={{
        top: 0,
        height: `${height}px`,
        backgroundColor: fromColor,
        clipPath: clip,
        zIndex: 9990,
      }}
    />
  );
}
