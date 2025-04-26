import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectToDatabase()
    return NextResponse.json({ success: true, message: "MongoDB connection successful" })
  } catch (error) {
    console.error("MongoDB connection test error:", error)
    return NextResponse.json({ success: false, message: "MongoDB connection failed" }, { status: 500 })
  }
}
