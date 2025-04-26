import { NextResponse } from "next/server"
import { connectToDatabase, Project, News, Gallery } from "@/lib/mongodb"

// Update the GET function to properly format ObjectIds
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get("collection")

    if (!collection) {
      return NextResponse.json({ error: "Collection parameter is required" }, { status: 400 })
    }

    await connectToDatabase()

    let data
    switch (collection) {
      case "projects":
        data = await Project.find().sort({ updatedAt: -1 })
        break
      case "news":
        data = await News.find().sort({ createdAt: -1 })
        break
      case "gallery":
        data = await Gallery.find().sort({ createdAt: -1 })
        break
      default:
        return NextResponse.json({ error: "Invalid collection" }, { status: 400 })
    }

    // Convert MongoDB documents to plain objects and handle ObjectIds
    const serializedData = JSON.parse(JSON.stringify(data))

    return NextResponse.json({ success: true, data: serializedData })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get("collection")
    const action = searchParams.get("action")

    if (!collection || !action) {
      return NextResponse.json({ error: "Collection and action parameters are required" }, { status: 400 })
    }

    await connectToDatabase()
    const body = await request.json()

    let result
    switch (collection) {
      case "projects":
        if (action === "create") {
          result = await Project.create(body)
        } else if (action === "update" && body._id) {
          result = await Project.findByIdAndUpdate(body._id, body, { new: true })
        } else if (action === "delete" && body._id) {
          result = await Project.findByIdAndDelete(body._id)
        } else {
          return NextResponse.json({ error: "Invalid action or missing ID" }, { status: 400 })
        }
        break

      case "news":
        if (action === "create") {
          result = await News.create(body)
        } else if (action === "update" && body._id) {
          result = await News.findByIdAndUpdate(body._id, body, { new: true })
        } else if (action === "delete" && body._id) {
          result = await News.findByIdAndDelete(body._id)
        } else {
          return NextResponse.json({ error: "Invalid action or missing ID" }, { status: 400 })
        }
        break

      case "gallery":
        if (action === "create") {
          result = await Gallery.create(body)
        } else if (action === "update" && body._id) {
          result = await Gallery.findByIdAndUpdate(body._id, body, { new: true })
        } else if (action === "delete" && body._id) {
          result = await Gallery.findByIdAndDelete(body._id)
        } else {
          return NextResponse.json({ error: "Invalid action or missing ID" }, { status: 400 })
        }
        break

      default:
        return NextResponse.json({ error: "Invalid collection" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
