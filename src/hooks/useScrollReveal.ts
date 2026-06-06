"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  type?: "up" | "left" | "clip" | "stagger";
  staggerChildren?: string;
  delay?: number;
  duration?: number;
};

export function useScrollReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const { type = "up", staggerChildren, delay = 0, duration = 0.9 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerChildren ? el.querySelectorAll(staggerChildren) : [el];

    const fromVars: gsap.TweenVars =
      type === "up"    ? { opacity: 0, y: 70 }
      : type === "left"  ? { opacity: 0, x: 90 }
      : type === "clip"  ? { clipPath: "inset(0 100% 0 0)", opacity: 1 }
      :                    { opacity: 0, y: 50 };

    const toVars: gsap.TweenVars =
      type === "up"    ? { opacity: 1, y: 0 }
      : type === "left"  ? { opacity: 1, x: 0 }
      : type === "clip"  ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
      :                    { opacity: 1, y: 0 };

    gsap.set(targets, fromVars);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    if (staggerChildren) {
      tl.to(targets, {
        ...toVars,
        duration,
        delay,
        stagger: 0.12,
        ease: "power3.out",
      });
    } else {
      tl.to(el, { ...toVars, duration, delay, ease: "power3.out" });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [type, staggerChildren, delay, duration]);

  return ref;
}
