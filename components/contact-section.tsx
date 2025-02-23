"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-green-100 to-green-200">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800"
        >
          Contact Us
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <form className="space-y-4">
            <Input type="text" placeholder="Your Name" className="w-full" />
            <Input type="email" placeholder="Your Email" className="w-full" />
            <Textarea placeholder="Your Message" className="w-full" />
            <Button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

