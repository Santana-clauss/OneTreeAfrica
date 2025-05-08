"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

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

// Create email transporter from env variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendContactEmail(formData: FormData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      recipient: formData.get("recipient"),
    }

    const result = contactSchema.safeParse(data)

    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        error: result.error.errors,
      }
    }

    await transporter.sendMail({
      from: `"One Child One Tree Contact" <${process.env.EMAIL_USER}>`,
      to: String(data.recipient),
      replyTo: String(data.email),
      subject: `New Contact Form Message from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(data.message).replace(/\n/g, '<br>')}</p>
      `,
    })

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Email error:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    }
  }
}

export async function processDonation(formData: FormData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      amount: formData.get("amount"),
      recipient: formData.get("recipient"),
    }

    const result = donationSchema.safeParse(data)

    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: result.error.errors,
      }
    }

    // Simulate donation handling
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
