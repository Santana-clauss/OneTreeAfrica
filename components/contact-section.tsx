"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { sendContactEmail, processDonation } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

const COMPANY_EMAIL = "santanajepchumba@gmail.com"

export function ContactSection() {
  const { toast } = useToast()
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [isDonationSubmitting, setIsDonationSubmitting] = useState(false)
  const [donationAmount, setDonationAmount] = useState("50")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  async function handleContactSubmit(formData: FormData) {
    setIsContactSubmitting(true)
    setFormErrors({})

    try {
      formData.append("recipient", COMPANY_EMAIL) // Add the company's email address
      const result = await sendContactEmail(formData)

      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully!",
        })
        // Reset the form
        const form = document.getElementById("contactForm") as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })

        // Handle validation errors
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

  async function handleDonationSubmit(formData: FormData) {
    setIsDonationSubmitting(true)
    setFormErrors({})

    try {
      formData.append("recipient", COMPANY_EMAIL) // Add the company's email address
      const result = await processDonation(formData)

      if (result.success) {
        toast({
          title: "Donation Received",
          description: "Thank you for your generous donation!",
        })
        // Reset the form
        const form = document.getElementById("donationForm") as HTMLFormElement
        if (form) form.reset()
        setDonationAmount("50")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })

        // Handle validation errors
        if (result.errors) {
          const errors: Record<string, string> = {}
          result.errors.forEach((error) => {
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
      setIsDonationSubmitting(false)
    }
  }

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
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="donate">Donate</TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
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
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
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
            </TabsContent>

            <TabsContent value="donate">
              <form id="donationForm" action={handleDonationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Donation Amount ($)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["10", "25", "50", "100"].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={donationAmount === amount ? "default" : "outline"}
                        onClick={() => setDonationAmount(amount)}
                        className={donationAmount === amount ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90" : ""}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div>
                    <Input
                      type="number"
                      name="amount"
                      id="amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className={`w-full mt-2 ${formErrors.amount ? "border-red-500" : ""}`}
                      min="1"
                      step="1"
                      required
                    />
                    {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
                  </div>
                </div>

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

                <Button
                  type="submit"
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                  disabled={isDonationSubmitting}
                >
                  {isDonationSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Donate Now"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

