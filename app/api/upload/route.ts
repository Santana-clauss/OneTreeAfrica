import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "File type not supported. Please upload JPEG, PNG, GIF, or WebP images.",
        },
        { status: 400 },
      )
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File is too large. Maximum size is 5MB.",
        },
        { status: 400 },
      )
    }

    // In a real implementation, you would upload to Vercel Blob here
    // For now, we'll return a mock response with a placeholder URL
    const fileName = file.name.replace(/\s+/g, "-").toLowerCase()
    const uploadPath = `/uploads/${fileName}`
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      url: uploadPath,
      pathname: filename,
      contentType: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
