"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

// Form validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

const donationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid donation amount",
  }),
})

// Create email transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export async function sendContactEmail(formData: FormData) {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    const validatedData = contactFormSchema.parse({
      name,
      email,
      message,
    })

    // Create email transporter
    const transporter = createTransporter()

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Contact Form: Message from ${validatedData.name}`,
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        
        Message:
        ${validatedData.message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <h3>Message:</h3>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return { success: true, message: "Your message has been sent successfully!" }
  } catch (error) {
    console.error("Contact form error:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
      }
    }

    return { success: false, message: "Failed to send message. Please try again later." }
  }
}

export async function processDonation(formData: FormData) {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const amount = formData.get("amount") as string

    const validatedData = donationFormSchema.parse({
      name,
      email,
      amount,
    })

    // In a real implementation, you would integrate with a payment processor here
    // For example, with Stripe:
    //
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(Number(validatedData.amount) * 100), // Convert to cents
    //   currency: 'usd',
    //   metadata: {
    //     name: validatedData.name,
    //     email: validatedData.email,
    //   },
    // });
    //
    // return {
    //   success: true,
    //   clientSecret: paymentIntent.client_secret,
    //   message: "Payment initiated"
    // };

    // For now, we'll simulate a successful donation and send confirmation emails

    // Create email transporter
    const transporter = createTransporter()

    // Email content for donor
    const donorMailOptions = {
      from: process.env.EMAIL_FROM,
      to: validatedData.email,
      subject: `Thank You for Your Donation to One Tree One Child`,
      text: `
        Dear ${validatedData.name},
        
        Thank you for your generous donation of $${validatedData.amount} to One Tree One Child. Your contribution will help us continue our mission of environmental conservation and education.
        
        Best regards,
        The One Tree One Child Team
      `,
      html: `
        <h2>Thank You for Your Donation</h2>
        <p>Dear ${validatedData.name},</p>
        <p>Thank you for your generous donation of <strong>$${validatedData.amount}</strong> to One Tree One Child.</p>
        <p>Your contribution will help us continue our mission of environmental conservation and education.</p>
        <p>Best regards,<br>The One Tree One Child Team</p>
      `,
    }

    // Email notification for organization
    const orgMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Donation Received`,
      text: `
        A new donation has been received:
        
        Amount: $${validatedData.amount}
        Name: ${validatedData.name}
        Email: ${validatedData.email}
      `,
      html: `
        <h2>New Donation Received</h2>
        <p><strong>Amount:</strong> $${validatedData.amount}</p>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
      `,
    }

    // Send emails
    await transporter.sendMail(donorMailOptions)
    await transporter.sendMail(orgMailOptions)

    return { success: true, message: "Thank you for your donation!" }
  } catch (error) {
    console.error("Donation processing error:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
      }
    }

    return { success: false, message: "Failed to process donation. Please try again later." }
  }
}

