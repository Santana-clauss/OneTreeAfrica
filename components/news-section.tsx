"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const newsItems = [
  {
    title: "Our founder Jeffrey K Kosgei talks about One Child One Tree Africa",
    excerpt: "In a recent interview, our founder shares insights on the organization's mission and future plans.",
    image: "/placeholder.svg?height=200&width=300&text=Interview",
    link: "https://www.youtube.com/live/kVQ1v8kiHzM?si=5uYJ59AWSJxEe5Rd",
    color: "bg-pink-500",
  },
  {
    title: "Involve local communities in conservation",
    excerpt: "Learn about our approach to community-driven conservation efforts across Kenya.",
    image: "/placeholder.svg?height=200&width=300&text=Community",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/make-conservation-local-4412142",
    color: "bg-cyan-500",
  },
  {
    title: "Learn from Costa Rica's success story",
    excerpt: "Discover how we're applying lessons from Costa Rica's environmental policies to our initiatives.",
    image: "/placeholder.svg?height=200&width=300&text=Costa+Rica",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/learn-from-costa-rica-s-success-story-4263508",
    color: "bg-amber-500",
  },
]

export function NewsSection() {
  return (
    <section id="news" className="py-20 bg-gradient-to-b from-green-100 to-green-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">News & Blog</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest initiatives, success stories, and environmental insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <div
                    className={`absolute top-4 left-4 ${item.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    Featured
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                  <Button asChild variant="outline" className="w-full group">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-lg">
            View All Articles
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

