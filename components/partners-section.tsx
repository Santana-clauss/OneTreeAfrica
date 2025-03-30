"use client"

import Image from "next/image"
import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"

const partners = [
  { name: "First-Track Mentors", logo: "/logos/fcm.jpg" },
  { name: "Deezall Infrasol Ltd", logo: "/logos/dezal.jpg" },
  { name: "Uasin Gishu County", logo: "/logos/uasin.jpeg" },
  //{ name: "Education Institution", logo: "/logos/education.png" },
  { name: "COAD", logo: "/logos/coad.jpg" },
  { name: "Kenya Forest Service", logo: "/logos/kfs.png" },
  { name: "Dunia Bora", logo: "/logos/db.jpg" },
  { name: "Government of Kenya", logo: "/logos/harambee.png" },
  { name: "Kobuji Community Forest Association", logo: "/logos/kobuj.jpg" },
  { name: "KPCG", logo: "/logos/kpch.jpg" },
  { name: "Centre for Community Dialogue Development", logo: "/logos/dialogue.jpg" },
  { name: "ASIS Driving School", logo: "/logos/asis.jpg" },
  { name: "Kimaru Kimutai & Co. Advocates", logo: "/logos/kimaru.jpg" },
 // { name: "Zanzibar Government", logo: "/logos/zanzibar.png" },
  { name: "Kenya Environmental Action Network", logo: "/logos/kean.jpg" },
  { name: "RedRoyal", logo: "/logos/reroyal.jpg" },
  { name: "Zuri Coffee", logo: "/logos/zuricoffe.jpg" },
  { name: "NCD", logo: "/logos/ncd.jpg" },
 
]


export function PartnersSection() {
  const controls = useAnimationControls()

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        x: [0, -2400],
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 40,
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
          <motion.div className="flex space-x-8 mb-0" animate={controls}>
            {/* Original set */}
            {partners.map((partner, index) => (
              <div
                key={`original-${index}`}
                className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[200px] h-[170px] flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center h-[80px] mb-2">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={80}
                    className="object-contain max-h-[80px]"
                  />
                </div>
                <p className="text-center text-xs md:text-sm font-medium text-gray-700 mt-2 line-clamp-3 h-[3.6em]">
                  {partner.name}
                </p>
              </div>
            ))}

            {/* Duplicated set for seamless scrolling */}
            {partners.map((partner, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[200px] h-[170px] flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center h-[80px] mb-2">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={80}
                    className="object-contain max-h-[80px]"
                  />
                </div>
                <p className="text-center text-xs md:text-sm font-medium text-gray-700 mt-2 line-clamp-3 h-[3.6em]">
                  {partner.name}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}


