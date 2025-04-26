"use server"

import { revalidatePath } from "next/cache"

export async function revalidatePages() {
  // Revalidate the home page
  revalidatePath("/")

  // Revalidate the gallery page
  revalidatePath("/gallery")

  // Revalidate the admin dashboard
  revalidatePath("/admin/dashboard")

  return { success: true }
}
