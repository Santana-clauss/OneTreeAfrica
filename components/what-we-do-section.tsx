"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Leaf, Book, Users, TreePine } from "lucide-react"
import Image from "next/image"

const activities = [
  {
    title: "Tree Planting",
    description:
      "We organize tree planting events in schools and communities, engaging students in hands-on environmental action.",
    icon: TreePine,
    color: "bg-emerald-500",
    image: "/treeplanting.jpg", // Updated image path
  },
  {
    title: "Environmental Education",
    description: "Our curriculum teaches students about climate change, conservation, and sustainable practices.",
    icon: Book,
    color: "bg-blue-500",
    image: "/mixxed.jpg", // Updated image path
  },
  {
    title: "Community Engagement",
    description: "We work with local communities to create sustainable environmental initiatives and raise awareness.",
    icon: Users,
    color: "bg-purple-500",
    image: "/images/community-engagement.jpg", // Updated image path
  },
  {
    title: "Eco-Clubs",
    description:
      "We establish and support eco-clubs in schools to foster ongoing environmental stewardship among students.",
    icon: Leaf,
    color: "bg-yellow-500",
    image: "/whatwedo.jpg", // Updated image path
  },
]

export function WhatWeDoSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="what-we-do" className="py-20 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">What We Do</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our programs focus on empowering the next generation through hands-on environmental action and education.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    activeIndex === index ? "shadow-lg scale-105" : "hover:shadow-md"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <CardContent className="p-6 flex items-center">
                    <div className={`${activity.color} p-3 rounded-full mr-4`}>
                      <activity.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                    <ChevronRight
                      className={`w-6 h-6 transition-transform duration-300 ${
                        activeIndex === index ? "transform rotate-90" : ""
                      }`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={activities[activeIndex].image || "/placeholder.svg"}
              alt={activities[activeIndex].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white mb-2">{activities[activeIndex].title}</h3>
              <Button className="bg-white text-gray-800 hover:bg-gray-100">Learn More</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

