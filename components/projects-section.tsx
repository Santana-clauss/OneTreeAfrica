"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, TreesIcon as Tree } from "lucide-react"

// Define the Project type
interface Project {
  _id: string
  name: string
  trees: number
  images: string[]
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [visibleProjects, setVisibleProjects] = useState(6)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        if (data.success) {
          setProjects(data.projects)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

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
                key={project._id}
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

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: { project: Project }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Make sure we have valid images to display
  const validImages =
    project.images && project.images.length > 0
      ? project.images
      : [`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(project.name)}`]

  const nextImage = useCallback(() => {
    setDirection(1)
    setCurrentImage((prevImage) => (prevImage + 1) % validImages.length)
  }, [validImages.length])

  const prevImage = useCallback(() => {
    setDirection(-1)
    setCurrentImage((prevImage) => (prevImage - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  useEffect(() => {
    if (!isHovered && validImages.length > 1) {
      const timer = setInterval(() => {
        nextImage()
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [nextImage, isHovered, validImages.length])

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
              src={
                validImages[currentImage] ||
                `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(project.name)}`
              }
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
