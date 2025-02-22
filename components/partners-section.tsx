"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const partners = [
  "GOK",
  "UG",
  "NC", // Add more partner names as needed
]

export function PartnersSection() {
  return (
    <section id="partners" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800"
        >
          Our Partners
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <Image
                src={`/placeholder.svg?height=100&width=200&text=${partner}`}
                alt={partner}
                width={200}
                height={100}
                className="object-contain hover:opacity-80 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

