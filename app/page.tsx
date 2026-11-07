import { ParticleHero } from "@/components/particle-hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import WorkSection from "@/components/WorkSection";
import StatsBand from "@/components/StatsBand";
import ServicesSection from "@/components/ServicesSection";
import StudioSection from "@/components/StudioSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <ParticleHero />
      <MarqueeStrip />
      <WorkSection />
      <StatsBand />
      <ServicesSection />
      <StudioSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
