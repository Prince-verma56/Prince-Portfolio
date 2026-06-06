"use client";
import React, { useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ContributionGraph, type ContributionData } from "../ui/smoothui/contribution-graph/index"; 
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const mockData = useMemo(() => generateMockData(), []);

  useGSAP(() => {
    if (!sectionRef.current) return;

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

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative z-20 w-full bg-[#050505] text-white py-32 md:py-48 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
          
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
                        <img 
                          src="https://github.com/Prince-verma56.png" 
                          alt="Prince Verma profile avatar" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            // Fallback sleek asset if live avatar fails to request
                            e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop";
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
                    <Button 
                      variant="outline" 
                      className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest px-8 rounded-full transition-all duration-300 h-12"
                    >
                      View GitHub Profile
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-3xl p-8 max-w-[400px] w-[90vw] mx-auto text-white backdrop-blur-2xl duration-500">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 flex items-center justify-center shadow-inner">
                        <img 
                          src="https://github.com/Prince-verma56.png" 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-center text-white tracking-tight">Prince Verma</DialogTitle>
                      <DialogDescription className="text-center text-white/60 mt-4 text-sm leading-relaxed">
                        100+ collection of repositories and public contributions. Spend no time on setup and focus on shipping.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-3 mt-8">
                      <Link href="https://github.com/Prince-verma56" target="_blank" className="w-full">
                        <Button className="w-full bg-[#f04e00] hover:bg-[#f04e00]/80 text-white font-bold h-12 rounded-xl text-base shadow-[0_0_20px_rgba(240,78,0,0.3)] transition-all hover:shadow-[0_0_30px_rgba(240,78,0,0.5)]">
                          View GitHub Profile
                        </Button>
                      </Link>
                      <DialogClose asChild>
                        <Button variant="ghost" className="w-full text-white/50 hover:text-white hover:bg-white/10 font-medium h-12 rounded-xl text-base transition-colors">
                          Maybe Later
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}