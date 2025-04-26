"use server"

import { z } from "zod"

// Email validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recipient: z.string().email("Invalid recipient email"),
})

// Donation validation schema
const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipient: z.string().email("Invalid recipient email"),
})

export async function sendContactEmail(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      recipient: formData.get("recipient"),
    }

    // Validate form data
    const result = contactSchema.safeParse(data)

    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        error: result.error.errors,
      }
    }

    // In a real application, you would send an email here
    // For this example, we'll just simulate a successful email send

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
    }
  }
}

export async function processDonation(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      amount: formData.get("amount"),
      recipient: formData.get("recipient"),
    }

    // Validate form data
    const result = donationSchema.safeParse(data)

    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: result.error.errors,
      }
    }

    // In a real application, you would process the donation here
    // For this example, we'll just simulate a successful donation

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Donation processed successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to process donation",
    }
  }
}
