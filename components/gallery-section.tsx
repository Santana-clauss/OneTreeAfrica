"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Planting+Event+1",
    alt: "Large tree planting event",
    caption: "Our annual tree planting event with over 500 participants from local schools",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Workshop",
    alt: "Environmental workshop",
    caption: "Environmental education workshop for teachers and community leaders",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Seedling+Distribution",
    alt: "Seedling distribution",
    caption: "Distribution of tree seedlings to local schools for their planting programs",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Engagement",
    alt: "Community engagement session",
    caption: "Community engagement session on the importance of forest conservation",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=School+Visit",
    alt: "School visit",
    caption: "Our team visiting Eldoret National Polytechnic to discuss future collaborations",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Award+Ceremony",
    alt: "Award ceremony",
    caption: "Recognition ceremony for schools that have planted the most trees this year",
  },
]

export default function GalleryPage() {
  const [currentImage, setCurrentImage] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")

  const openImage = (index: number) => setCurrentImage(index)
  const closeImage = () => setCurrentImage(null)
  const nextImage = () => setCurrentImage((prev) => (prev === null ? null : (prev + 1) % galleryImages.length))
  const prevImage = () =>
    setCurrentImage((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24">
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8"
            >
              Our Gallery
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12"
            >
              Explore our impactful projects and see the difference we're making together through our tree planting
              initiatives across Kenya.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-100 to-green-200 group"
                    onClick={() => openImage(index)}
                  >
                    <div className="relative h-64">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-800 font-semibold line-clamp-2">{image.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {currentImage !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                >
                  <div className="relative max-w-5xl w-full">
                    <div className="relative">
                      <Image
                        src={galleryImages[currentImage].src || "/placeholder.svg"}
                        alt={galleryImages[currentImage].alt}
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
                        <p className="text-white text-center">{galleryImages[currentImage].caption}</p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-black bg-opacity-50 text-white hover:bg-opacity-75 rounded-full"
                        onClick={closeImage}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-full">
                      {galleryImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
