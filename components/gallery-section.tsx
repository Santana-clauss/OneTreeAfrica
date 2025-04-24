"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const response = await fetch("/api/gallery")
        const data = await response.json()
        setGalleryImages(data.images)
      } catch (error) {
        console.error("Failed to load gallery images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#198754]" />
      </div>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
          >
            Our Gallery
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Explore moments captured during our tree planting initiatives and community engagements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-square">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || "Gallery Image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{image.caption}</h3>
                <p className="text-gray-600 text-sm">{image.alt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

