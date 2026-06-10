"use client";
import React, { useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { ContributionGraph, type ContributionData } from "../ui/smoothui/contribution-graph/index";
import { Button } from "@/components/ui/button";
import SlideTextButton from "@/components/kokonutui/slide-text-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLoader } from "@/context/LoaderContext";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

const generateMockData = (): ContributionData[] => {
    const data: ContributionData[] = [];
    const year = 2026;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const randomSeed = Math.random();
        let level = 0;

        if (randomSeed > 0.15) level = 1;
        if (randomSeed > 0.35) level = 2;
        if (randomSeed > 0.55) level = 3;
        if (randomSeed > 0.80) level = 4;

        data.push({
            date: d.toISOString().split("T")[0],
            count: level * Math.floor(Math.random() * 5 + 1),
            level: level,
        });
    }
    return data;
};

export default function GitContributionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { isLoaderFinished } = useLoader();
    const mockData = useMemo(() => generateMockData(), []);
    const [avatarSrc, setAvatarSrc] = useState("https://github.com/Prince-verma56.png");

    useGSAP(() => {
        if (!isLoaderFinished || !sectionRef.current) return;

        // ── NEW: Section Un-slanting (Sheet Effect) ──
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

        gsap.set(".git-graph-card", { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(".git-fade-item", { opacity: 0, y: 20 });
        gsap.set(".word-mask-inner", { y: "120%", opacity: 0, rotateZ: 4, transformOrigin: "left top" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
            }
        });

        tl.to(".git-graph-card", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
        })
            .to(".git-fade-item", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.8")
            .to(".word-mask-inner", {
                y: "0%",
                opacity: 1,
                rotateZ: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out"
            }, "-=1.0");

        gsap.fromTo(
            ".git-parallax-left",
            { y: 40 },
            {
                y: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            }
        );

        gsap.fromTo(
            ".git-parallax-right",
            { y: -30 },
            {
                y: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                }
            }
        );

    }, { scope: sectionRef, dependencies: [isLoaderFinished] });

    return (
        <div className="w-full relative z-20 drop-shadow-[0_-1px_1px_rgba(255,255,255,0.05)] drop-shadow-[0_-10px_30px_rgba(240,78,0,0.05)]">
            <section
                ref={sectionRef}
                className="relative w-full min-h-screen bg-[#050505] text-white py-24 md:py-32 flex items-center overflow-hidden will-change-transform"
                style={{
                    clipPath: "polygon(0% 12%, 100% 0%, 100% 100%, 0% 100%)",
                }}
            >
                {/* ── Ultra Premium Edge Lighting (Left Focused) ── */}
                <div className="absolute top-[-150px] left-[-10%] w-[50%] h-[300px] bg-[#f04e00] opacity-[0.15] blur-[120px] pointer-events-none rounded-[100%]" />
                <div className="absolute top-[-50px] left-[-5%] w-[30%] h-[150px] bg-[#f04e00] opacity-[0.25] blur-[80px] pointer-events-none rounded-[100%]" />
                <div className="absolute top-[-20px] left-0 w-[20%] h-[50px] bg-white opacity-[0.1] blur-[30px] pointer-events-none rounded-[100%]" />

                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 w-full">

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-16 lg:gap-28 xl:gap-40 items-center">

                        {/* ── LEFT SIDE: Graph Card Box ── */}
                        <div className="git-parallax-left min-w-0">
                            <div className="git-graph-card flex flex-col gap-6 bg-[#0a0a0a]/80 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                                {/* Header Box Layer */}
                                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                                    <span className="text-white/50 text-[10px] font-mono uppercase tracking-widest">
                                        2026 Contributions
                                    </span>

                                    {/* Right side controls matching profile demands */}
                                    <div className="flex items-center gap-3.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href="https://github.com/Prince-verma56"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative group block w-7 h-7 rounded-full overflow-hidden border border-white/10 hover:border-[#f04e00] transition-all duration-300 shadow-md active:scale-95 will-change-transform"
                                                >
                                                    <Image
                                                        src={avatarSrc}
                                                        alt="Prince Verma profile avatar"
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                        sizes="28px"
                                                        onError={() => {
                                                            // Fallback sleek asset if live avatar fails to request
                                                            setAvatarSrc("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop");
                                                        }}
                                                    />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent sideOffset={10} className="bg-[#0a0a0a] border-white/10 text-white font-medium px-3 py-1.5 rounded-md shadow-xl backdrop-blur-md">
                                                <p>View GitHub Profile</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <span className="flex items-center gap-2 text-xs font-medium text-[#26a641]">
                                            <span className="w-2 h-2 rounded-full bg-[#26a641] animate-pulse" />
                                            Live Sync
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <ContributionGraph
                                        data={mockData}
                                        year={2026}
                                        showLegend={true}
                                        showTooltips={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT SIDE: Text Content ── */}
                        <div className="git-parallax-right min-w-0">
                            <div className="flex flex-col gap-8 justify-center">

                                <span className="git-fade-item text-white/40 font-mono text-[10px] uppercase tracking-widest">
                                    ( Open Source )
                                </span>

                                <h2 className="flex flex-wrap gap-x-4 gap-y-2 text-[clamp(3.5rem,7vw,6rem)] font-black uppercase leading-[0.85] tracking-tighter">
                                    <div className="overflow-hidden"><span className="word-mask-inner block">Code</span></div>
                                    <div className="overflow-hidden"><span className="word-mask-inner block">&</span></div>
                                    <div className="overflow-hidden"><span className="word-mask-inner block text-[#f04e00]">Commits.</span></div>
                                </h2>

                                <p className="git-fade-item text-white/70 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                                    Consistency is everything. I actively build public tools, contribute to open-source projects, and maintain a steady streak of learning and shipping daily.
                                </p>

                                {/* ── DIALOG IMPLEMENTATION ── */}
                                <div className="git-fade-item mt-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <SlideTextButton
                                                text="View GitHub Profile"
                                                hoverText="View GitHub Profile"
                                                variant="custom"
                                                className="whitespace-nowrap border border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest px-8 rounded-full transition-all duration-300 h-12"
                                                animateEntrance={false}
                                            />
                                        </DialogTrigger>

                                        <DialogContent className="bg-[#050505] border border-white/10 shadow-[0_0_80px_rgba(240,78,0,0.15)] rounded-3xl p-0 max-w-[420px] w-[90vw] mx-auto text-white overflow-hidden duration-500">

                                            {/* ── Premium Header Background ── */}
                                            <div className="relative w-full h-32 bg-gradient-to-br from-[#f04e00]/20 via-[#0a0a0a] to-[#050505] flex items-center justify-center border-b border-white/5">
                                                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }}></div>
                                                <div className="absolute -bottom-10 flex justify-center w-full">
                                                    <div className="relative group">
                                                        {/* Animated Glow */}
                                                        <div className="absolute inset-0 bg-[#f04e00] blur-xl rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                                                        {/* Avatar Box */}
                                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#050505] flex items-center justify-center shadow-2xl bg-[#0a0a0a] transition-transform duration-500 group-hover:scale-105">
                                                            <Image
                                                                src={avatarSrc}
                                                                alt="Avatar"
                                                                fill
                                                                className="object-cover"
                                                                sizes="96px"
                                                                onError={() => {
                                                                    setAvatarSrc("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop");
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-8 pt-16 pb-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-3xl font-black text-center text-white tracking-tighter flex flex-col items-center gap-3">
                                                        Prince Verma
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#26a641] bg-[#26a641]/10 px-3 py-1.5 rounded-full border border-[#26a641]/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#26a641] animate-pulse" />
                                                            Available for Open Source
                                                        </span>
                                                    </DialogTitle>
                                                    <DialogDescription className="text-center text-white/60 mt-6 text-sm leading-relaxed font-medium px-2">
                                                        100+ repositories & public contributions. <br />
                                                        <span className="text-white/80">Spend no time on setup and focus on shipping.</span>
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-3 mt-10">
                                                    <SlideTextButton
                                                        href="https://github.com/Prince-verma56"
                                                        target="_blank"
                                                        text="View GitHub Profile"
                                                        hoverText="View GitHub Profile"
                                                        variant="custom"
                                                        className="whitespace-nowrap w-full bg-white text-black font-bold h-14 rounded-xl text-base shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                                                        animateEntrance={false}
                                                    />
                                                    <DialogClose asChild>
                                                        <Button variant="ghost" className="w-full text-white/40 hover:text-white hover:bg-white/5 font-medium h-12 rounded-xl text-sm transition-colors mt-2">
                                                            Maybe Later
                                                        </Button>
                                                    </DialogClose>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}