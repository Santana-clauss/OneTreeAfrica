import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

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

    const db = client.db("your-database-name");
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
    });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    uploadStream.end(fileBuffer);

    return NextResponse.json({
      url: filename, // Return only the filename or URL
      pathname: filename,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: "Unexpected server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
