"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

const galleryImages = [
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+1",
    alt: "Students planting trees at local school",
    caption: "Students from St. Joseph Girls planting trees during our annual event",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
    alt: "Community members participating in tree planting",
    caption: "Local community members joining our reforestation efforts",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
    alt: "Environmental education session",
    caption: "Our team conducting an environmental education session at Moi Girls High School",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Nursery+1",
    alt: "Tree nursery managed by women",
    caption: "Women tending to our tree nursery, growing seedlings for future planting events",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+2",
    alt: "Students planting trees in rural area",
    caption: "Students from Kapkong High School participating in rural reforestation",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Eco+Club+Meeting",
    alt: "Eco-club meeting at school",
    caption: "An eco-club meeting at ACK Ziwa High School, discussing upcoming projects",
  },
]

export function GallerySection() {
  const [currentImage, setCurrentImage] = useState<number | null>(null)

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
              key={index}
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

