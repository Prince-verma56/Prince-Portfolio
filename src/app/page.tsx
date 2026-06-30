"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";

// ── Above-the-fold: load normally ──
import ClientLiquidHero from "@/components/ClientLiquidHero";
import HeroContent from "@/components/HeroContent";
import AboutSection from "@/components/sections/AboutSection";
import SetupSection from "@/components/sections/SetupSection";

// ── Below-the-fold: lazy-loaded to reduce initial JS bundle ──

const PhilosophyJourneySection = dynamic(
  () => import("@/components/sections/PhilosophyJourneySection"),
  { ssr: false, loading: () => <div className="h-screen bg-[#050505]" /> }
);
const TestimonialsSection = dynamic(
  () => import("@/components/sections/TestimonialsSection"),
  { ssr: false, loading: () => <div className="h-screen bg-[#050505]" /> }
);

const TechStackSection = dynamic(
  () => import("@/components/sections/TechStackSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const GitContributionSection = dynamic(
  () => import("@/components/sections/GitContributionSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const ServicesSection = dynamic(
  () => import("@/components/sections/ServicesSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const WorkSection = dynamic(
  () => import("@/components/sections/WorkSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const AchievementsSection = dynamic(
  () => import("@/components/sections/AchievementsSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const ResumeSection = dynamic(
  () => import("@/components/sections/ResumeSection"),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
);
const SocialFooter = dynamic(
  () => import("@/components/SocialFooter"),
  { ssr: false, loading: () => <div className="h-64 bg-black" /> }
);
const FooterSection = dynamic(
  () => import("@/components/sections/FooterSection"),
  { ssr: false, loading: () => <div className="h-32 bg-black" /> }
);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isLoaderFinished } = useLoader();

  useGSAP(() => {
    if (isLoaderFinished) {
      gsap.to(heroRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [isLoaderFinished]);

  return (
    <main className="bg-black">
      <div ref={heroRef} className="opacity-0">
        <ClientLiquidHero
          // UNCOMMENT/COMMENT AS NEEDED:
          // imageUrl="https://res.cloudinary.com/..."
          videoUrl="https://res.cloudinary.com/dtslaveid/video/upload/v1780721714/LandingePage_video3Blink_gqqorm.mp4"
          strength={0.12}
          brushRadius={0.18}
          dissipation={0.97}
        >
          <HeroContent />
        </ClientLiquidHero>
      </div>

      {/* ════════ Sections ════════ */}
      <AboutSection />
      <PhilosophyJourneySection bgImage="https://res.cloudinary.com/dtslaveid/image/upload/v1780791430/b682bca8-66a3-47d9-aee7-2212d6dfd9a4_vlkoqv.png" />
      <SetupSection />
      <GitContributionSection />
      <ServicesSection />
      <WorkSection />
      <TestimonialsSection />
      <AchievementsSection />
      <ResumeSection />
      <SocialFooter />
      <FooterSection />
    </main>
  );
}