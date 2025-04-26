"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Define the GalleryImage type
interface GalleryImage {
  _id: string
  src: string
  alt: string
  caption: string
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [currentImage, setCurrentImage] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/mongodb?collection=gallery")
        const data = await response.json()
        if (data.success) {
          setGalleryImages(data.data.slice(0, 6)) // Only show first 6 on homepage
        }
      } catch (error) {
        console.error("Error fetching gallery:", error)
      }
    }

    fetchGallery()
  }, [])

  const openImage = (index: number) => setCurrentImage(index)
  const closeImage = () => setCurrentImage(null)
  const nextImage = () => setCurrentImage((prev) => (prev === null ? null : (prev + 1) % galleryImages.length))
  const prevImage = () =>
    setCurrentImage((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length))

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Our Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our impactful projects and see the difference we're making together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="cursor-pointer overflow-hidden group" onClick={() => openImage(index)}>
                <div className="relative h-64">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{image.caption}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
            <Link href="/gallery">View Full Gallery</Link>
          </Button>
        </div>

        <AnimatePresence>
          {currentImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            >
              <div className="relative max-w-4xl w-full">
                <Image
                  src={galleryImages[currentImage].src || "/placeholder.svg"}
                  alt={galleryImages[currentImage].alt}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-white text-center mt-4">{galleryImages[currentImage].caption}</p>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                  onClick={closeImage}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
