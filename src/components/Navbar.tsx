"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import SlideTextButton from "@/components/kokonutui/slide-text-button";
import { Button } from "./ui/button";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { isLoaderFinished } = useLoader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Simple clock for the top right
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) + " (IST)");
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Unconditionally kill the old scroll trigger if it exists to prevent it from persisting on route change
    const oldTrigger = ScrollTrigger.getById("logo-shrink");
    if (oldTrigger) {
      oldTrigger.kill();
    }

    if (isLoaderFinished) {
      // ── 1. The Shrinking Logo Effect ──
      if (isHome) {
        gsap.to(".nav-logo-text", {
          fontSize: "24px", // Shrinks to normal logo size on scroll
          ease: "power2.inOut",
          scrollTrigger: {
            id: "logo-shrink",
            trigger: document.body,
            start: "top top",
            end: "300px top",
            scrub: 1,
          },
        });
      } else {
        // Clear inline style so Tailwind class controls the font size
        gsap.set(".nav-logo-text", { clearProps: "all" });
      }

      // ── 2. Logo Entrance Animation ──
      gsap.to(".nav-logo-text", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1,1)",
      });

      // ── 3. Top Right Entrance Animations ──
      gsap.to(".nav-top-right > *", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2, // Small delay after loader finishes to stagger with the logo
      });
    } else {
      // Hide elements initially while loader is active
      gsap.set(".nav-logo-text", { opacity: 0, y: isHome ? 40 : 15 });
      gsap.set(".nav-top-right > *", { opacity: 0, y: -10 });
    }

    // ── 4. Ultra-Smooth Side-Panel Menu Timeline ──
    menuTl.current = gsap.timeline({ paused: true })
      // Fade in the left-side blur backdrop
      .to(".menu-backdrop", {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.inOut",
      })
      // Slide in the right-side solid panel smoothly
      .to(".menu-panel", {
        x: "0%",
        duration: 0.8,
        ease: "expo.inOut",
      }, "<")
      // Premium text reveal: sliding up with a slight un-rotate
      .fromTo(".menu-link-item",
        { y: 60, opacity: 0, rotateZ: 3 },
        { y: 0, opacity: 1, rotateZ: 0, stagger: 0.08, duration: 0.8, ease: "power4.out" },
        "-=0.4"
      )
      // Fade in the bottom meta data (Roles & Socials)
      .fromTo(".menu-meta",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        "-=0.5"
      );
  }, { scope: containerRef, dependencies: [pathname, isLoaderFinished] });

  // Play/Reverse menu and lock scrolling
  useEffect(() => {
    if (isMenuOpen) {
      menuTl.current?.play();
      document.body.style.overflow = "hidden";
    } else {
      menuTl.current?.reverse();
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <nav ref={containerRef}>
      {/* ── Main Top Bar (Fixed Header) ── */}
      <header className="fixed top-0 left-0 w-full z-[9000] pointer-events-none px-6 md:px-10 pt-8 md:pt-10 flex justify-between items-start">

        {/* Massive Shrinking Logo (Top Left) */}
        {/* max-w-[70vw] ensures it truncates nicely on mobile without breaking layout */}
        <div className="pointer-events-auto min-w-0 max-w-[80vw] md:max-w-none shrink">
          <Link
            href="/"
            className={"nav-logo-text font-black uppercase text-white whitespace-nowrap block " + (isHome ? "text-4xl sm:text-[10vw] md:text-[11vw] origin-top-left will-change-auto leading-[0.8] tracking-tighter transition-colors hover:text-white/80" : "text-2xl md:text-3xl tracking-tighter hover:text-white/80 transition-colors")}
          >
            Prince<sup className="text-[clamp(10px,2vw,1.5rem)] font-bold align-super ml-1 md:ml-2">®</sup>
          </Link>
        </div>

        {/* Right Navigation Group */}
        {/* FIXED: Added 'absolute right-6 md:static' so on mobile it is pinned to the right edge and NEVER pushed away by the logo */}
        <div className="nav-top-right absolute right-6 top-8 md:static md:right-auto md:top-auto flex items-start gap-6 md:gap-12 pointer-events-auto shrink-0">

          {/* Availability (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col gap-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white text-[12px] uppercase font-bold tracking-widest">Available for project</span>
            </div>
            <span className="text-white/50 text-[11px] uppercase tracking-widest font-mono">Early Feb 2026</span>
          </div>

          {/* Local Time (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col gap-1 text-right">
            <span className="text-white text-[12px] uppercase font-bold tracking-widest">{time || "Loading..."}</span>
            <span className="text-white/50 text-[11px] uppercase tracking-widest font-mono">Local Time</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <SlideTextButton
              variant="custom"
              text="Let's Talk"
              href="/contact"
              animateEntrance={false}
              className="hidden sm:flex items-center justify-center border hover:bg-[#f04e00] hover:text-white border-white/20 hover:border-white/50 bg-white/5 backdrop-blur-sm text-white text-[12px] font-bold uppercase tracking-widest px-7 py-3 rounded-full transition-all duration-300 ease-in-out"
            />

            {/* Hamburger Toggle - Explicit cursor-pointer */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col justify-center items-center w-10 h-10 md:w-12 md:h-12 gap-1.5 border border-white/20 hover:border-white/50 bg-[#050505]/50 backdrop-blur-md rounded-full transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Open Menu"
            >
              <span className="w-4 md:w-5 h-px bg-white block" />
              <span className="w-4 md:w-5 h-px bg-white block" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Left Side: Blurred Backdrop ── */}
      <div
        className="menu-backdrop fixed inset-0 w-full h-screen bg-black/60 backdrop-blur-md z-[9998] invisible opacity-0 cursor-none"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ── Right Side: Solid Sliding Menu Panel ── */}
      <div
        className="menu-panel fixed top-0 right-0 w-full md:w-1/2 lg:w-[40%] h-screen bg-[#070707] z-[9999] translate-x-full flex flex-col justify-between p-6 md:p-12 border-l border-white/5 shadow-2xl"
      >
        {/* Top Row inside Menu */}
        <div className="flex justify-between items-center w-full">
          <div className="menu-meta flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#f04e00]" />
            <span className="text-white/50 text-[10px] font-mono tracking-widest uppercase">Menu</span>
          </div>

          {/* Explicit cursor-pointer added */}
          <Button
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-white/40 rounded-full transition-colors group cursor-pointer bg-white/5"
            aria-label="Close Menu"
          >
            <span className="text-white/50 group-hover:text-white transition-colors text-sm font-light">✕</span>
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 mt-16 md:mt-20">
          {navLinks.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="menu-link-item group flex items-center gap-4 text-white text-[clamp(3.5rem,9vw,5rem)] font-black uppercase tracking-tighter leading-none hover:pl-4 transition-[padding] duration-300 ease-out cursor-none"
              >
                {link.label}
                <span className="w-2 h-2 md:w-3 md:h-3 bg-[#f04e00] opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
              </Link>
            </div>
          ))}
        </div>

        {/* ── Bottom Footer Info (UPDATED TO MATCH YOUR REQUEST) ── */}
        <div className="grid grid-cols-2 gap-6 mt-auto pt-12 border-t border-white/5">

          {/* Bottom Left Aligned: Roles */}
          <div className="menu-meta flex flex-col gap-4">
            <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">(Roles)</span>
            <div className="flex flex-col gap-1.5">
              <span className="text-white/90 text-sm md:text-base font-bold tracking-wide">Designer</span>
              <span className="text-white/90 text-sm md:text-base font-bold tracking-wide">Developer</span>
              <span className="text-white/90 text-sm md:text-base font-bold tracking-wide">ML Engineer</span>
            </div>
          </div>

          {/* Bottom Right Aligned: Contact & Socials */}
          <div className="menu-meta flex flex-col gap-4 items-end text-right">
            <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">(Connect)</span>
            <div className="flex flex-col gap-3 items-end">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=princeverma.dev96@gmail.com" target="_blank" rel="noopener noreferrer" className="text-[#f04e00] text-sm md:text-base font-bold hover:opacity-80 transition-opacity cursor-none">
                princeverma.dev96@gmail.com
              </a>
              <div className="flex flex-col gap-1.5 items-end">
                {[
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/prince-verma26/" },
                  { name: "Instagram", url: "https://www.instagram.com/its.prince_charley/" },
                  { name: "GitHub", url: "https://github.com/Prince-verma56" }
                ].map((social) => (
                  <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-white/70 text-xs md:text-sm hover:text-white transition-colors flex items-center gap-1 group cursor-none">
                    <span className="opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-[10px]">↗</span> {social.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}