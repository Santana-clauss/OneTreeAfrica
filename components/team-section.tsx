"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

const team = [
  {
    name: "Jeffrey Kosgei",
    role: "Executive Director",
    bio: "Jeffrey is the visionary founder of One Child One Tree Africa, dedicated to empowering youth through environmental education and action.",
    image: "/placeholder.svg?height=400&width=400&text=Jeffrey+Kosgei",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Timon Nganai",
    role: "Programs Lead",
    bio: "Timon oversees the development and implementation of our educational programs and tree-planting initiatives across Kenya.",
    image: "/placeholder.svg?height=400&width=400&text=Timon+Nganai",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sharon GG",
    role: "Resource Mobilization Lead",
    bio: "Sharon is responsible for securing partnerships and resources to support and expand our environmental initiatives.",
    image: "/placeholder.svg?height=400&width=400&text=Sharon+GG",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Noeline Maru",
    role: "Communications Lead",
    bio: "Noeline manages our outreach efforts, ensuring our message reaches and inspires communities across Kenya.",
    image: "/placeholder.svg?height=400&width=400&text=Noeline+Maru",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Tirop",
    role: "Government Liaison and Partnership Lead",
    bio: "Tirop builds and maintains crucial relationships with government entities and partner organizations to further our mission.",
    image: "/placeholder.svg?height=400&width=400&text=Tirop",
    linkedin: "#",
    twitter: "#",
  },
]

export function TeamSection() {
  return (
    <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated individuals driving our mission to empower youth through environmental action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="relative w-full pt-[100%] rounded-full overflow-hidden mb-4">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-[#FF6B35] mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6 flex-grow">{member.bio}</p>
                  <div className="flex gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#FF6B35]"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#FF6B35]"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

