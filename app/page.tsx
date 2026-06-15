import {ParticleHero} from "@/components/particle-hero"
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import StudioSection from "@/components/StudioSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <ParticleHero />
      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <StudioSection />
      <Footer />
    </main>
  )
}