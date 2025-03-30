"use client"

import Image from "next/image"
import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"

const partners = [
  { name: "First-Track Mentors", logo: "/logos/fcm.jpg" },
  { name: "Deezall Infrasol Ltd", logo: "/logos/dezal.jpg" },
  { name: "The Champions", logo: "/logos/uasin.jpeg" },
  //{ name: "Education Institution", logo: "/logos/education.png" },
  { name: "COAD", logo: "/logos/coad.jpg" },
  { name: "Kenya Forest Service", logo: "/logos/kfs.png" },
  { name: "Dunia Bora", logo: "/logos/db.jpg" },
  { name: "Government of Kenya", logo: "/logos/harambee.png" },
  { name: "Kobuji Community Forest Association", logo: "/logos/kobuj.jpg" },
  { name: "KPCG", logo: "/logos/kpch.jpg" },
  { name: "Community Dialogue", logo: "/logos/dialogue.jpg" },
  { name: "ASIS Driving School", logo: "/logos/asis.jpg" },
  { name: "Kimaru Kimutai & Co. Advocates", logo: "/logos/kimaru.jpg" },
 // { name: "Zanzibar Government", logo: "/logos/zanzibar.png" },
  { name: "KEAN", logo: "/logos/kean.jpg" },
  { name: "RedRoyal", logo: "/logos/reroyal.jpg" },
  { name: "Zuri Coffe", logo: "/logos/zuricoffe.jpg" },
  { name: "NCD", logo: "/logos/ncd.jpg" },
 
]

export function PartnersSection() {
  const controls = useAnimationControls()

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        x: [0, -2400], // Increased distance to accommodate more logos
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 40, // Increased duration for smoother scrolling
            ease: "linear",
          },
        },
      })
    }

    startAnimation()
  }, [controls])

  return (
    <section id="partners" className="py-10 bg-gradient-to-b from-orange-200 to-orange-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800"
        >
          Our Partners
        </motion.h2>

        <div className="relative w-full">
          {/* First row of logos that will scroll */}
          <motion.div className="flex space-x-8 mb-0" animate={controls}>
            {/* Original set */}
            {partners.map((partner, index) => (
              <div
                key={`original-${index}`}
                className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[180px] h-[120px] flex items-center justify-center"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={80}
                  className="object-contain max-h-[80px]"
                />
              </div>
            ))}

            {/* Duplicated set for seamless scrolling */}
            {partners.map((partner, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[180px] h-[120px] flex items-center justify-center"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={80}
                  className="object-contain max-h-[80px]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

