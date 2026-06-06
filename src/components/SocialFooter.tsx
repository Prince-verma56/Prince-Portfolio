"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image"; // Next.js Image component added
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
    // Reveal animation for footer elements when scrolling into view
    gsap.fromTo(
      ".footer-reveal",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12 lg:px-20 border-t border-white/10 overflow-hidden"
    >
      {/* ── BACKGROUND IMAGE LAYER ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          // 👇 REPLACE THIS PATH WITH YOUR ACTUAL IMAGE PATH (e.g., "/images/footer-bg.jpg")
          src="https://res.cloudinary.com/dtslaveid/image/upload/v1780617640/6fc4c5a6-3511-4f77-afa0-590a46fc9e63_lbsaxq.png" 
          alt="Footer Background"
          fill
          className="object-cover opacity-50" // Adjust opacity (0-100) to make the image brighter or darker
          sizes="100vw"
        />
        {/* Dark gradient overlay to blend the image into the black background and keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/30" />
      </div>

      {/* ── FOREGROUND CONTENT ── */}
      {/* relative z-10 ensures all text and buttons sit securely ABOVE the background image */}
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-24">
        
        {/* ── TOP: Massive CTA ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="flex flex-col gap-6 max-w-2xl footer-reveal">
            <h2 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-tighter">
              Let’s Work <br /> Together
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
              Have a project in mind? We'd love to hear about it. Let’s create something great together!
            </p>
          </div>
          <div className="footer-reveal">
            <ButtonWithIcon label="Get in Touch" href="/contact" />
          </div>
        </div>

        {/* ── BOTTOM: Links & Socials ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-12 border-t border-white/10 footer-reveal">
          
          {/* Email / Phone */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">(Email)</span>
              <a href="mailto:hello@Prince.com" className="text-[#f04e00] text-lg font-bold hover:opacity-80 transition-opacity">
                hello@Prince.com
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">(Phone)</span>
              <span className="text-white text-lg font-bold">+12 34567890</span>
            </div>
          </div>

          {/* Site Links */}
          <div className="flex flex-col gap-4">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">(Links)</span>
            {["Home", "About", "Works", "Contact", "Blog"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-white/80 hover:text-white font-medium transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-2">(Socials)</span>
            {["X/Twitter", "Instagram", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-1 group w-fit">
                {social} <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xs">↗</span>
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
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