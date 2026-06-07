import FooterSection from "@/components/sections/FooterSection";
import SocialFooter from "@/components/SocialFooter";

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-black">
        {children}
      </main>
      <SocialFooter />
      <FooterSection />
    </>
  );
}
