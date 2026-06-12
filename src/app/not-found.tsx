"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

// ── Floating particle data ──────────────────────────────────────────────────
const particles = [
  { x: "12%", y: "18%", size: 3, delay: 0 },
  { x: "88%", y: "22%", size: 2, delay: 0.4 },
  { x: "5%",  y: "65%", size: 4, delay: 0.8 },
  { x: "93%", y: "70%", size: 2, delay: 0.2 },
  { x: "55%", y: "8%",  size: 3, delay: 0.6 },
  { x: "30%", y: "88%", size: 2, delay: 1.0 },
  { x: "75%", y: "85%", size: 3, delay: 0.3 },
  { x: "20%", y: "40%", size: 2, delay: 0.9 },
  { x: "80%", y: "45%", size: 4, delay: 0.1 },
  { x: "45%", y: "92%", size: 2, delay: 0.7 },
  { x: "65%", y: "15%", size: 3, delay: 0.5 },
  { x: "10%", y: "82%", size: 2, delay: 1.2 },
];

// ── Scattered initial positions for the 404 digits ─────────────────────────
const digitSpecs = [
  { char: "4", x: -420, y: -60,  rotate: -14, scale: 0.5, blur: 20 },
  { char: "0", x:    0, y: 280,  rotate:   8, scale: 0.4, blur: 24 },
  { char: "4", x:  400, y: -80,  rotate:  12, scale: 0.5, blur: 20 },
];

export default function NotFound() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const digitsRef     = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const btnRef        = useRef<HTMLAnchorElement>(null);
  const glitchRef     = useRef<HTMLSpanElement>(null);
  const particlesRef  = useRef<HTMLDivElement>(null);
  const lineRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── 1. Initial invisible state ──────────────────────────────────────
      gsap.set(".nf-digit", {
        opacity: 0,
        x: (i) => digitSpecs[i]?.x ?? 0,
        y: (i) => digitSpecs[i]?.y ?? 0,
        rotate: (i) => digitSpecs[i]?.rotate ?? 0,
        scale: (i) => digitSpecs[i]?.scale ?? 0.5,
        filter: (i) => `blur(${digitSpecs[i]?.blur ?? 20}px)`,
      });
      gsap.set([taglineRef.current, subtitleRef.current, btnRef.current, lineRef.current], {
        opacity: 0,
        y: 40,
      });
      gsap.set(".nf-particle", { opacity: 0, scale: 0 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // ── 2. Digit assembly (mirrors Preloader letter-scatter pattern) ─────
      tl.to(".nf-digit", {
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
      }, 0)
        .to(".nf-digit", {
          x: 0, y: 0, rotate: 0, scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          stagger: 0.08,
          ease: "expo.out",
        }, 0.15);

      // ── 3. Subtle overshoot snap ─────────────────────────────────────────
      tl.to(digitsRef.current, {
        scale: 1.04,
        duration: 0.14,
        ease: "power2.out",
      }, 1.7)
        .to(digitsRef.current, {
          scale: 1,
          duration: 0.22,
          ease: "back.out(1.7)",
        });

      // ── 4. Divider line wipe in ──────────────────────────────────────────
      tl.to(lineRef.current, {
        opacity: 1,
        y: 0,
        scaleX: 1,
        duration: 0.6,
        ease: "power3.out",
      }, 1.8);

      // ── 5. Tagline + subtitle reveal ─────────────────────────────────────
      tl.to([taglineRef.current, subtitleRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: "power3.out",
      }, 2.0);

      // ── 6. CTA button ────────────────────────────────────────────────────
      tl.to(btnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.5)",
      }, 2.4);

      // ── 7. Particles float in ────────────────────────────────────────────
      tl.to(".nf-particle", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: { amount: 0.8, from: "random" },
        ease: "back.out(2)",
      }, 1.5);

      // ── 8. Perpetual particle float ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".nf-particle").forEach((el, i) => {
        gsap.to(el, {
          y: `${(i % 2 === 0 ? -1 : 1) * (8 + (i % 3) * 6)}px`,
          x: `${(i % 3 === 0 ? -1 : 1) * (4 + (i % 4) * 3)}px`,
          duration: 2.4 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // ── 9. Looping glitch flicker on "404" ───────────────────────────────
      const glitchLoop = gsap.timeline({ repeat: -1, repeatDelay: 3.5 });
      glitchLoop
        .to(".nf-digit", {
          skewX: 6,
          textShadow: "4px 0 0 #f04e00, -4px 0 0 rgba(240,78,0,0.4)",
          duration: 0.06,
          ease: "none",
        })
        .to(".nf-digit", {
          skewX: -4,
          textShadow: "-4px 0 0 #f04e00, 4px 0 0 rgba(240,78,0,0.3)",
          duration: 0.05,
          ease: "none",
        })
        .to(".nf-digit", {
          skewX: 0,
          textShadow: "none",
          duration: 0.08,
          ease: "none",
        })
        .to(".nf-digit", {
          skewX: 3,
          textShadow: "3px 0 0 #f04e00, -2px 0 0 rgba(240,78,0,0.4)",
          duration: 0.04,
          ease: "none",
        })
        .to(".nf-digit", {
          skewX: 0,
          textShadow: "none",
          duration: 0.1,
          ease: "none",
        });

      glitchLoop.delay(4);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* ── Noise overlay ─────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "160px",
          opacity: 0.025,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Radial orange glow behind digits ──────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -52%)",
          width: "60vw",
          height: "60vw",
          maxWidth: 700,
          maxHeight: 700,
          background:
            "radial-gradient(circle, rgba(240,78,0,0.13) 0%, rgba(240,78,0,0.04) 45%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating orange particles ──────────────────────────────────── */}
      <div ref={particlesRef} aria-hidden>
        {particles.map((p, i) => (
          <div
            key={i}
            className="nf-particle"
            style={{
              position: "fixed",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#f04e00",
              boxShadow: `0 0 ${p.size * 3}px rgba(240,78,0,0.8)`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Horizontal scan line ──────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(240,78,0,0.015) 3px, rgba(240,78,0,0.015) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Corner crosshair marks ────────────────────────────────────── */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div
          key={i}
          aria-hidden
          className="hero-cross"
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            ...pos,
            opacity: 0.3,
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="#f04e00" strokeWidth={1.2}>
            <line x1="10" y1="0" x2="10" y2="20" />
            <line x1="0" y1="10" x2="20" y2="10" />
          </svg>
        </div>
      ))}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Tiny label */}
        <p
          style={{
            fontFamily: "var(--font-space), sans-serif",
            fontSize: "clamp(10px, 1.5vw, 13px)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#f04e00",
            marginBottom: "1.5rem",
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          Error — Page not found
        </p>

        {/* 404 scattered digits */}
        <div
          ref={digitsRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.02em",
            lineHeight: 1,
            willChange: "transform",
          }}
        >
          {digitSpecs.map((spec, i) => (
            <span
              key={i}
              className="nf-digit"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(7rem, 22vw, 18rem)",
                fontWeight: 900,
                color: i === 1 ? "#f04e00" : "#ffffff",
                lineHeight: 1,
                willChange: "transform, filter",
                letterSpacing: "-0.04em",
                // The zero gets the brand orange treatment
                textShadow: i === 1
                  ? "0 0 60px rgba(240,78,0,0.5)"
                  : "none",
              }}
            >
              {spec.char}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          ref={lineRef}
          style={{
            width: "clamp(60px, 12vw, 120px)",
            height: 1,
            background: "linear-gradient(90deg, transparent, #f04e00, transparent)",
            margin: "2rem auto",
            opacity: 0,
            transformOrigin: "center",
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontFamily: "var(--font-space), sans-serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            marginBottom: "0.75rem",
            opacity: 0,
          }}
        >
          This page got lost in the void.
        </p>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "var(--font-space), sans-serif",
            fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.02em",
            maxWidth: 420,
            lineHeight: 1.7,
            marginBottom: "3rem",
            opacity: 0,
          }}
        >
          The route you requested doesn&apos;t exist. It may have been moved, deleted,
          or never existed at all.
        </p>

        {/* CTA */}
        <Link
          href="/"
          ref={btnRef}
          id="nf-home-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.9rem 2.2rem",
            background: "#f04e00",
            color: "#000",
            fontFamily: "var(--font-space), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 2,
            opacity: 0,
            transition: "background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
            boxShadow: "0 0 0 0 rgba(240,78,0,0)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#ff6a1a";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 30px rgba(240,78,0,0.5)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#f04e00";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 0 rgba(240,78,0,0)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          {/* Arrow icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ transform: "rotate(180deg)" }}
          >
            <path
              d="M7 1L1 7L7 13M1 7H13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </Link>

      </div>

      {/* ── Bottom brand watermark ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-space), sans-serif",
          fontSize: 10,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.12)",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        Prince Verma · Portfolio
      </div>
    </div>
  );
}
