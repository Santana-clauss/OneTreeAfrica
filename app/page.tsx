import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { WhatWeDoSection } from "@/components/what-we-do-section"
import { ProjectsSection } from "@/components/projects-section"
import { TeamSection } from "@/components/team-section"
import { GallerySection } from "@/components/gallery-section"
import { NewsSection } from "@/components/news-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <WhatWeDoSection />
      <ProjectsSection />
      {/* <TeamSection /> */}
      {/* <GallerySection /> */}
      <NewsSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
