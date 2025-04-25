"use client"

import { useState } from "react"
import { Leaf, GraduationCap, Target, ArrowRight, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const stats = [
  { number: "25,000+", label: "Trees Planted" },
  { number: "30+", label: "Schools Engaged" },
  { number: "25,000+", label: "Students Involved" },
  { number: "5+", label: "Years of Impact" },
]

const features = [
  {
    icon: Leaf,
    title: "Our Mission",
    description:
      "To create a platform for the next generation to take climate action through education and tree planting initiatives.",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    icon: Target,
    title: "Our Goal",
    description:
      "To equip the next generation with skills, knowledge, tools and resources to be proactive climate change solution providers.",
    color: "bg-[#FF6B35]",
    textColor: "text-[#FF6B35]",
  },
  {
    icon: GraduationCap,
    title: "Our Impact",
    description:
      "Over 19,000 school children have each planted and adopted a tree in their school as a way of taking climate action.",
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "Building a network of environmentally conscious youth leaders across Kenya to drive sustainable change.",
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function AboutSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">About One Child One Tree Africa</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Established in 2017 in Kenya, we align with Sustainable Development Goal No. 13: Climate Action. Our
              mission is to provide a platform for the next generation to take climate action through education,
              conservation, and tree planting.
            </p>
            <div className="flex items-center text-[#FF6B35] font-semibold group cursor-pointer">
              <span>Learn more about our journey</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-transparent to-transparent z-10" />
            <Image
              src="/paulboit.jpg"
              alt="Children planting trees"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-[#FF6B35] mb-2">{stat.number}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-3 lg:grid-cols-4">
            <div className="bg-[#198754] text-white p-8 md:col-span-1 lg:col-span-1">
              <h3 className="text-3xl font-bold mb-6">Our Core Values</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeFeature === index ? "opacity-100 font-bold" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center">
                      <feature.icon className="w-6 h-6 mr-2" />
                      <span>{feature.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 md:col-span-2 lg:col-span-3">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col justify-center"
              >
                <h4 className={`text-2xl font-bold mb-4 ${features[activeFeature].textColor}`}>
                  {features[activeFeature].title}
                </h4>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{features[activeFeature].description}</p>
                <div
                  className={`inline-flex items-center font-semibold ${features[activeFeature].textColor} cursor-pointer group`}
                >
                  <span>Learn more about {features[activeFeature].title.toLowerCase()}</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

