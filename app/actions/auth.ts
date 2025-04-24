"use server"

import { cookies } from "next/headers"

// In a real application, you would use a database and proper authentication
// This is a simplified example for demonstration purposes
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123" // In a real app, use hashed passwords

export async function signIn(username: string, password: string) {
  // Simple authentication check
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a cookie to maintain the session
    cookies().set("auth_token", "admin_authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  }

  return { success: false, message: "Invalid username or password" }
}

export async function signOut() {
  cookies().delete("auth_token")
  return { success: true }
}

export async function checkAuth() {
  const token = cookies().get("auth_token")
  return token?.value === "admin_authenticated"
}
