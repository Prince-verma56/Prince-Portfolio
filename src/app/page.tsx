import ClientLiquidHero from "@/components/ClientLiquidHero";
import AboutSection from "@/components/sections/AboutSection";
import WorkSection from "@/components/sections/WorkSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import HeroContent from "@/components/HeroContent";
import FooterSection from "@/components/sections/FooterSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  return (
    <>
      <main className="bg-black">

        {/* ════════════════════════════════
            1. HERO — Fuel-inspired layout
            ════════════════════════════════ */}
        <ClientLiquidHero
          imageUrl="/Images/Ritika Landing page image.jpeg"
          strength={0.12}
          brushRadius={0.18}
          dissipation={0.97}
        >
          <HeroContent />
        </ClientLiquidHero>

        {/* ════════ Sections ════════ */}
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <AchievementsSection />
        <SocialFooter />
        <FooterSection />

      </main>
    </>
  );
}
