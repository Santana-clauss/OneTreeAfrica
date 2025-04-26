"use server"

import { revalidatePath } from "next/cache"

export async function migrateStaticData() {
  try {
    // Call the seed API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/seed-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    // Revalidate all pages to show the new data
    revalidatePath("/")
    revalidatePath("/gallery")
    revalidatePath("/admin/dashboard")

    return result
  } catch (error) {
    console.error("Error migrating static data:", error)
    return {
      success: false,
      message: "Failed to migrate static data",
      error: (error as Error).message,
    }
  }
}
