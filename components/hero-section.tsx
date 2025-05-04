"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/free-nonprofit-website-template.jpg-N67iAh2f1Uk22wXIZkRIAeNXgv8xBW.jpeg"
        alt="Children planting trees"
        fill
        className="object-cover brightness-50"
        priority
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 text-center text-white"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Let's Change The World With Climate Action
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Empowering the next generation through climate education and tree planting initiatives
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-3 text-lg">
            <Link href="#about">Learn More</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
          >
            <Link href="#contact">Get Involved</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

