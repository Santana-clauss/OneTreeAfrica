"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface NewsItem {
  id: number
  title: string
  excerpt: string
  image: string
  link: string
  color: string
}

export function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])

  useEffect(() => {
    async function fetchNews() {
      const response = await fetch("/api/blogs")
      const data = await response.json()
      setNewsItems(data.blogs)
    }
    fetchNews()
  }, [])

  return (
    <section id="news" className="py-12 bg-gradient-to-b from-green-100 to-green-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">News & Blog</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest initiatives, success stories, and environmental insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                <div className="relative h-40">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <div
                    className={`absolute top-3 left-3 ${item.color} text-white px-2 py-1 rounded-full text-xs font-medium`}
                  >
                    Featured
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                  <Button asChild variant="outline" className="w-full group text-sm">
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
      </div>
    </section>
  )
}

