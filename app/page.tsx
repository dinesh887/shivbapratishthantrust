import SiteInteractions from "@/src/components/layout/SiteInteractions";
import Footer from "@/src/components/layout/Footer";
import AboutSection from "@/src/components/sections/AboutSection";
import CTASection from "@/src/components/sections/CTASection";
import FAQSection from "@/src/components/sections/FAQSection";
import GallerySection from "@/src/components/sections/GallerySection";
import HeroSection from "@/src/components/sections/HeroSection";
import JoinSection from "@/src/components/sections/JoinSection";
import RegistrationSection from "@/src/components/sections/RegistrationSection";
import RulesSection from "@/src/components/sections/RulesSection";
import WinnersSection from "@/src/components/sections/WinnersSection";

export default function Home() {
  return (
    <SiteInteractions>
      <HeroSection />
      <AboutSection />
      <JoinSection />
      <RulesSection />
      <RegistrationSection />
      <GallerySection />
      <WinnersSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </SiteInteractions>
  );
}
