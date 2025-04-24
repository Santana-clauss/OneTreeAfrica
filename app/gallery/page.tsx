"use client"

import { GallerySection } from "@/components/gallery-section"
import { Header } from "@/components/header"

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <GallerySection />
      </main>
    </div>
  )
}

