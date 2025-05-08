import fs from "fs"
import path from "path"
import { mkdir, writeFile } from "fs/promises"
import sharp from 'sharp'

// Base directory for file storage
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

// Ensure the uploads directory exists
export async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
    return true
  } catch (error) {
    console.error("Error creating uploads directory:", error)
    return false
  }
}

// Save a file to the uploads directory
export async function saveFile(file: Buffer, filename: string): Promise<string> {
  await ensureUploadDir()

  // Create a unique filename with original extension
  const ext = filename.split('.').pop()
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  const filePath = path.join(UPLOAD_DIR, uniqueFilename)

  try {
    await writeFile(filePath, file)
    // Return the public URL path that will work with Next.js Image component
    return `/uploads/${uniqueFilename}`
  } catch (error) {
    console.error("Error saving file:", error)
    throw new Error("Failed to save file")
  }
}

// Check if a file exists
export function fileExists(filepath: string): boolean {
  try {
    // Remove leading slash if present
    const relativePath = filepath.startsWith("/") ? filepath.slice(1) : filepath
    const fullPath = path.join(process.cwd(), "public", relativePath)
    return fs.existsSync(fullPath)
  } catch (error) {
    console.error("Error checking if file exists:", error)
    return false
  }
}

// Get a debug report of file paths and existence
export function getFileDebugInfo(filepath: string) {
  try {
    // Remove leading slash if present
    const relativePath = filepath.startsWith("/") ? filepath.slice(1) : filepath
    const fullPath = path.join(process.cwd(), "public", relativePath)
    const exists = fs.existsSync(fullPath)

    return {
      requestedPath: filepath,
      relativePath,
      fullPath,
      exists,
      cwd: process.cwd(),
      publicDir: path.join(process.cwd(), "public"),
      uploadsDir: UPLOAD_DIR,
      uploadsDirExists: fs.existsSync(UPLOAD_DIR),
    }
  } catch (error) {
    console.error("Error getting file debug info:", error)
    return { error: String(error) }
  }
}
