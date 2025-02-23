"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

export function DonationSection() {
  const [amount, setAmount] = useState("")

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically integrate with a payment processor
    alert(`Thank you for your donation of $${amount}!`)
  }

  return (
    <section id="donate" className="py-12 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Support Our Cause</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donation helps us plant more trees and educate more children about environmental conservation.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleDonate} className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-grow"
                  min="1"
                  required
                />
                <Button type="submit" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
                  <Heart className="mr-2 h-4 w-4" /> Donate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

