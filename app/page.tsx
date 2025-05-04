import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { WhatWeDoSection } from "@/components/what-we-do-section"
import { ProjectsSection } from "@/components/projects-section"
import { TeamSection } from "@/components/team-section"
import { NewsSection } from "@/components/news-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import { DonationSection } from "@/components/ui/donate-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <WhatWeDoSection />
      <ProjectsSection />
      {/* <TeamSection /> */}
      <NewsSection />
      {/* <DonationSection /> */}
      <PartnersSection />
      <ContactSection />
    </div>
  )
}

