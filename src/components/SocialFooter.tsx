"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import ButtonWithIcon from "./ButtonWithIcon"; 
import SlideTextButton from "./kokonutui/slide-text-button"; 
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function SocialFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Subscribing...");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed, botField }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Subscribed successfully!", { id: loadingToastId });
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe.", { id: loadingToastId });
      }
    } catch (err) {
      toast.error("Failed to subscribe. Please try again.", { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    if (!footerRef.current) return;

    // 1. BACKGROUND SLANT ENTRANCE
    gsap.fromTo(
      footerRef.current,
      { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "top 20%",
          scrub: 1,
        }
      }
    );

    // 2. PARALLAX BACKGROUND IMAGE
    // It moves at a different speed than the scroll to create depth
    gsap.fromTo(
      ".footer-bg-image",
      { yPercent: -20 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );

    // 3. INITIAL STATES FOR TEXT
    gsap.set(".footer-mask-text", { y: "120%", opacity: 0, rotateZ: 2 });
    gsap.set(".footer-fade", { opacity: 0, y: 30 });

    // 4. PREMIUM CONTENT REVEAL TIMELINE
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 60%", // Triggers when footer is 40% up the screen
      onEnter: () => {
        const tl = gsap.timeline();
        
        // Massive text slices up
        tl.to(".footer-mask-text", {
          y: "0%",
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out"
        })
        // Smaller items and grid fade in beautifully
        .to(".footer-fade", {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.8"); // Overlap animation for fluidity
      }
    });

  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full bg-[#050505] text-white pt-40 pb-12 px-6 md:px-12 lg:px-20 border-t border-white/10 overflow-hidden will-change-transform"
      style={{ clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      {/* ── BACKGROUND IMAGE LAYER (PARALLAX) ── */}
      {/* Container is explicitly oversized (-top-[20%] and h-[120%]) to allow panning room */}
      <div className="absolute inset-0 -top-[20%] h-[120%] z-0 pointer-events-none footer-bg-image will-change-transform">
        <Image
          src="https://res.cloudinary.com/dtslaveid/image/upload/v1780617640/6fc4c5a6-3511-4f77-afa0-590a46fc9e63_lbsaxq.png" 
          alt="Footer Background"
          fill
          className="object-cover opacity-40" 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-[#050505]/40" />
      </div>

      {/* ── FOREGROUND CONTENT ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-32">
        
        {/* ── TOP: Massive CTA ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="flex flex-col gap-6 max-w-2xl">
            
            {/* The Text Mask Wrappers */}
            <h2 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter">
              <div className="overflow-hidden pb-2">
                <span className="footer-mask-text block origin-top-left">Let’s Work</span>
              </div>
              <div className="overflow-hidden pb-4">
                <span className="footer-mask-text block origin-top-left text-[#f04e00]">Together</span>
              </div>
            </h2>
            
            <p className="footer-fade text-white/80 text-lg md:text-xl font-medium max-w-md">
              Have a project in mind? We'd love to hear about it. Let’s create something great together!
            </p>
          </div>
          
          <div className="footer-fade">
            <ButtonWithIcon label="Get in Touch" href="/contact" />
          </div>
        </div>

        {/* ── BOTTOM: Links & Socials ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-white/10">
          
          {/* Email / Phone */}
          <div className="flex flex-col gap-6 footer-fade">
            <div className="flex flex-col gap-2">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">(Email)</span>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ritikarawat3225@gmail.com" target="_blank" rel="noopener noreferrer" className="text-[#f04e00] text-lg font-bold hover:text-white transition-colors">
                ritikarawat3225@gmail.com
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">(Phone)</span>
              <span className="text-white text-lg font-bold hover:text-[#f04e00] transition-colors cursor-default">+91 9557247541</span>
            </div>
          </div>

          {/* Site Links */}
          <div className="flex flex-col gap-4 footer-fade">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">(Links)</span>
            {["Home", "About", "Works", "Contact", "Blog"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-white/80 hover:text-white font-medium transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4 footer-fade">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">(Socials)</span>
            {[
              { name: "LinkedIn", url: "https://www.linkedin.com/in/ritikarawat01?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
              { name: "Instagram", url: "https://www.instagram.com/ritika_.rawat._?igsh=NGJ3bGNxdThxZHlw" }
            ].map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#f04e00] font-medium transition-colors flex items-center gap-1 group w-fit">
                {social.name} <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xs">↗</span>
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 footer-fade">
             <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">(Newsletter)</span>
             <p className="text-white/60 text-sm">Sign up for latest insights and updates.</p>
             <form onSubmit={handleSubscribe} className="w-full">
               <input
                 type="text"
                 name="botField"
                 value={botField}
                 onChange={(e) => setBotField(e.target.value)}
                 className="hidden"
                 tabIndex={-1}
                 autoComplete="off"
               />
               <div className="flex border-b border-white/20 pb-2 mt-2">
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   disabled={isSubmitting}
                   placeholder="Enter email address" 
                   className="bg-transparent w-full text-sm outline-none placeholder:text-white/30 text-white disabled:opacity-50" 
                 />
                 <SlideTextButton
                   type="submit"
                   variant="custom"
                   text={isSubmitting ? "..." : "Subscribe"}
                   hoverText={isSubmitting ? "..." : "Subscribe"}
                   animateEntrance={false}
                   disabled={isSubmitting}
                   className="text-[10px] font-bold tracking-widest uppercase hover:text-[#f04e00] transition-colors bg-transparent border-none p-0 text-white cursor-pointer disabled:opacity-50"
                 />
               </div>
             </form>
          </div>

        </div>
      </div>
    </footer>
  );
}