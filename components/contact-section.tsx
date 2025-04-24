"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { sendContactEmail } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const COMPANY_EMAIL = "santanajepchumba@gmail.com"

export function ContactSection() {
  const { toast } = useToast()
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  async function handleContactSubmit(formData: FormData) {
    setIsContactSubmitting(true)
    setFormErrors({})

    try {
      formData.append("recipient", COMPANY_EMAIL)
      const result = await sendContactEmail(formData)

      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully!",
        })
        const form = document.getElementById("contactForm") as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })

        if (result.error && Array.isArray(result.error)) {
          const errors: Record<string, string> = {}
          result.error.forEach((error: { path: string[]; message: string }) => {
            const field = error.path[0] as string
            errors[field] = error.message
          })
          setFormErrors(errors)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsContactSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-10 bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-gray-600 mb-8 max-w-md mx-auto"
        >
          We'd love to hear from you! Fill out the form below, and we'll get back to you as soon as possible.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          <form id="contactForm" action={handleContactSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                className={`w-full ${formErrors.name ? "border-red-500" : ""}`}
                required
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                className={`w-full ${formErrors.email ? "border-red-500" : ""}`}
                required
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <Textarea
                name="message"
                placeholder="Your Message"
                className={`w-full ${formErrors.message ? "border-red-500" : ""}`}
                required
              />
              {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-3 rounded-lg"
              disabled={isContactSubmitting}
            >
              {isContactSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

