"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, TreesIcon as Tree } from "lucide-react"

const projects = [
  {
    name: "St Joseph Girls Chepterit",
    trees: 2400,
    images: [
      "/chepterit5.jpg?height=200&width=400&text=St+Joseph+Girls+1",
      "/chepterit2.jpg?height=200&width=400&text=St+Joseph+Girls+2",
      "/chepterit6.jpg?height=200&width=400&text=St+Joseph+Girls+3",
    ],
  },
  {
    name: "World Environmental Day - Landson Foundation",
    trees: 400,
    images: [
      "/earthday/Erday.jpg?height=200&width=400&text=Landson+1",
      "/earthday/Erday1.jpg?height=200&width=400&text=Landson+2",
      "/earthday/erd5.jpg?height=200&width=400&text=Landson+3",
    ],
  },
  {
    name: "ACK Ziwa High School",
    trees: 500,
    images: [
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+1",
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+2",
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+3",
    ],
  },
  {
    name: "Moi Girls High School",
    trees: 1200,
    images: [
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+1",
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+2",
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+3",
    ],
  },
  {
    name: "Kapkong High School",
    trees: 1600,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kapkong+1",
      "/placeholder.svg?height=200&width=400&text=Kapkong+2",
      "/placeholder.svg?height=200&width=400&text=Kapkong+3",
    ],
  },
  
  {
    name: "Nelson Mandela Day - Moi University Primary School",
    trees: 800,
    images: [
      "/moiuni/moiuni.jpg?height=200&width=400&text=Moi+University+1",
      "/moiuni/moiuni1.jpg?height=200&width=400&text=Moi+University+2",
      "/moiuni/moiuni3.jpg?height=200&width=400&text=Moi+University+3",
    ],
  },
  {
    name: "Eldoret National Polytechnic",
    trees: 1000,
    images: [
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+1",
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+2",
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+3",
    ],
  },
  {
    name: "Kapsabet Girls High School",
    trees: 1800,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+1",
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+2",
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+3",
    ],
  },
  {
    name: "Kitale National Polytechnic",
    trees: 700,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+1",
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+2",
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+3",
    ],
  },
  {
    name: "University of Eldoret",
    trees: 2000,
    images: [
      "/placeholder.svg?height=200&width=400&text=UoE+1",
      "/placeholder.svg?height=200&width=400&text=UoE+2",
      "/placeholder.svg?height=200&width=400&text=UoE+3",
    ],
  },
  {
    name: "Moi University Main Campus",
    trees: 2500,
    images: [
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+1",
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+2",
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+3",
    ],
  },
  {
    name: "Kesses Secondary School",
    trees: 600,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kesses+1",
      "/placeholder.svg?height=200&width=400&text=Kesses+2",
      "/placeholder.svg?height=200&width=400&text=Kesses+3",
    ],
  },
]

interface Project {
  name: string;
  trees: number;
  images: string[];
}

function ProjectCard({ project }: { project: Project }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextImage = useCallback(() => {
    setDirection(1)
    setCurrentImage((prevImage) => (prevImage + 1) % project.images.length)
  }, [project.images.length])

  const prevImage = useCallback(() => {
    setDirection(-1)
    setCurrentImage((prevImage) => (prevImage - 1 + project.images.length) % project.images.length)
  }, [project.images.length])

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        nextImage()
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [nextImage, isHovered])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <Card
      className="group overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={project.images[currentImage] || "/placeholder.svg"}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white z-10">
          <h3 className="font-bold text-xl mb-1">{project.name}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <Tree className="h-4 w-4" />
            <span className="text-sm font-medium">Trees Planted: {project.trees}</span>
          </div>
        </div>

        <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex gap-1">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentImage ? 1 : -1)
                setCurrentImage(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

export function ProjectsSection() {
  const [visibleProjects, setVisibleProjects] = useState(6)

  const loadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 6, projects.length))
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
          >
            Our Recent Projects
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Discover how we're making a difference in schools across Kenya through our tree planting initiatives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {projects.slice(0, visibleProjects).map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visibleProjects < projects.length && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={loadMore}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Show More Projects
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

