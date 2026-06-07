"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoader } from "@/context/LoaderContext";
import ClientLiquidHero from "@/components/ClientLiquidHero";
import HeroContent from "@/components/HeroContent";
import TechStackSection from "@/components/sections/TechStackSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkSection from "@/components/sections/WorkSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import SocialFooter from "@/components/SocialFooter";
import AboutSection from "@/components/sections/AboutSection";
import FooterSection from "@/components/sections/FooterSection";
import GitContributionSection from "@/components/sections/GitContributionSection";
import PhilosophyJourneySection from "@/components/sections/PhilosophyJourneySection";

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
      {/* <TechStackSection /> */}
   
      <PhilosophyJourneySection bgImage="https://res.cloudinary.com/dtslaveid/image/upload/v1780791430/b682bca8-66a3-47d9-aee7-2212d6dfd9a4_vlkoqv.png" />
      {/* <TechStackSection /> */}
      <GitContributionSection />
      <ServicesSection />
      <WorkSection /> 
      <AchievementsSection />
      <SocialFooter />
      <FooterSection />
    </main>
  );
}