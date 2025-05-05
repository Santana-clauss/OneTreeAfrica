import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "File type not supported. Please upload JPEG, PNG, GIF, or WebP images.",
        },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File is too large. Maximum size is 5MB.",
        },
        { status: 400 }
      );
    }

    // Normalize file name
    const fileName = file.name.replace(/\s+/g, "-").toLowerCase();
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Logging the file path for debugging
    console.log("Uploading file to:", filePath);

    // Ensure uploads directory exists
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Failed to create upload directory:", mkdirError);
      return NextResponse.json({ error: "Failed to create upload directory" }, { status: 500 });
    }

    // Save the file
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
    } catch (writeError) {
      console.error("Failed to save file:", writeError);
      return NextResponse.json({ error: "Failed to save file to server" }, { status: 500 });
    }

    console.log("File uploaded successfully:", filePath);

    const uploadPath = `/uploads/${fileName}`;

    return NextResponse.json({
      url: uploadPath,
      pathname: filename,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      {
        error: "Unexpected server error. Ensure your request includes a valid file and filename.",
        details: (error as Error).message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
