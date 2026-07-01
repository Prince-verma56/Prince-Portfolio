"use client";
import React, { useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import InfiniteMenu from '../InfiniteMenu';
import { useLoader } from "@/context/LoaderContext";

function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { isLoaderFinished } = useLoader();

    useGSAP(() => {
        if (!isLoaderFinished || !sectionRef.current) return;

        // 1. Premium Slanted Entrance
        gsap.fromTo(
            sectionRef.current,
            { clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)" },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "top top",
                    scrub: 1,
                }
            }
        );

        // 2. Header Parallax Effect
        gsap.fromTo(headerRef.current,
            { y: 50 },
            {
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            }
        );
        // 3. Content Fade & Slide In
        gsap.fromTo(".sphere-container",
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".sphere-container",
                    start: "top 80%",
                }
            }
        );

    }, { scope: sectionRef, dependencies: [isLoaderFinished] });

    // Premium colored portraits with rich professional metadata
    const items = [
        {
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
            name: 'Aarav Sharma',
            role: 'Frontend Lead',
            company: 'Binary Brains',
            relationship: 'Collaborated closely on enterprise product architecture.',
            badges: ['TEAM LEAD', 'SYSTEMS EXPERT'],
            stats: ['3 Projects Together', '2025 Collaboration'],
            quote: 'Prince consistently delivered polished and production-ready solutions. His attention to detail, performance optimization, and UI quality stood out throughout the entire lifecycle.',
            skills: [
                { name: 'Problem Solving', value: 95 },
                { name: 'Execution', value: 90 }
            ],
            bgWord: 'EXECUTION'
        },
        {
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
            name: 'Priya Patel',
            role: 'Product Manager',
            company: 'Nexus Tech',
            relationship: 'Managed scope and agile delivery for the core platform.',
            badges: ['PRODUCT MANAGER', 'AGILE COACH'],
            stats: ['Core Platform', '6 Month Sprint'],
            quote: 'Working with Prince is seamless. He doesn’t just write code; he understands the product vision and proactively suggests UX improvements that actually impact user retention.',
            skills: [
                { name: 'Communication', value: 98 },
                { name: 'Ownership', value: 95 }
            ],
            bgWord: 'LEADERSHIP'
        },
        {
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
            name: 'Marcus Chen',
            role: 'CTO',
            company: 'Elevate.ai',
            relationship: 'Mentored and oversaw technical system designs.',
            badges: ['STARTUP FOUNDER', 'MENTOR'],
            stats: ['Backend Architecture', 'AI Integration'],
            quote: 'Rarely do you find an engineer who balances deep technical architecture with high-end visual execution. Prince engineered a robust, scalable system that exceeded our benchmarks.',
            skills: [
                { name: 'Architecture', value: 92 },
                { name: 'Innovation', value: 96 }
            ],
            bgWord: 'INNOVATION'
        },
        {
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
            name: 'Sarah Jenkins',
            role: 'Creative Director',
            company: 'Studio Verta',
            relationship: 'Partnered on high-fidelity web animations and GSAP.',
            badges: ['DESIGN PARTNER', 'CREATIVE'],
            stats: ['Awwwards Nominee', 'UI/UX Polish'],
            quote: 'Prince bridged the gap between our design team and development perfectly. He breathes life into static Figma files with incredibly smooth physics and zero performance drops.',
            skills: [
                { name: 'UI Polish', value: 99 },
                { name: 'Animation', value: 94 }
            ],
            bgWord: 'CREATIVITY'
        },
        {
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            name: 'David Okafor',
            role: 'Lead Engineer',
            company: 'Fintech Core',
            relationship: 'Co-developed secure API gateways and state management.',
            badges: ['ENGINEERING LEAD', 'SECURITY'],
            stats: ['Financial Systems', 'Data Sync'],
            quote: 'A powerhouse developer. He refactored our legacy React codebase, slashing load times by 60%, and introduced strict TypeScript patterns that saved us countless debugging hours.',
            skills: [
                { name: 'Optimization', value: 97 },
                { name: 'Clean Code', value: 95 }
            ],
            bgWord: 'TRUST'
        }
    ];

    return (
        <section ref={sectionRef} className="relative z-20 w-full bg-[#050505] pt-32 md:pt-48 pb-12 border-t border-white/10 overflow-hidden will-change-transform -mt-32 rounded-t-[40px] md:rounded-t-[64px] shadow-[0_-50px_100px_rgba(0,0,0,0.9)]">
            
            {/* ── SECTION HEADER (Parallax) ── */}
            <div ref={headerRef} className="text-center mb-8 md:mb-16 relative z-20 pointer-events-none select-none will-change-transform">
                <span className="font-mono text-[10px] text-[#f04e00] uppercase tracking-widest block mb-3">
                    What People Say
                </span>
                <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-2xl">
                    Trusted By <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f04e00] to-orange-400">People</span><br/>
                    Who Built <span className="relative inline-block pb-2">With Me<div className="absolute bottom-0 left-0 w-full h-[4px] md:h-[6px] bg-[#f04e00]" /></span>
                </h2>
            </div>

            {/* ── SPHERE CONTAINER ── */}
            <div className="sphere-container relative w-full h-auto min-h-[1000px] md:min-h-0 md:h-[800px] max-w-[1600px] mx-auto">
                {/* Central Soft Glow Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#f04e00] rounded-full blur-[140px] opacity-15 pointer-events-none z-0" />
                
                <InfiniteMenu 
                    items={items}
                    scale={1}
                />
            </div>
        </section>
    );
}

export default TestimonialsSection;