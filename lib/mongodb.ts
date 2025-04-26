import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/onetree"

// Global variable to track connection status
let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(MONGODB_URI)
    isConnected = !!db.connections[0].readyState
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error("Failed to connect to MongoDB")
  }
}

// Define schemas and models
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trees: { type: Number, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String, default: "#FF6B35" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const gallerySchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Create models if they don't exist
export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema)
export const News = mongoose.models.News || mongoose.model("News", newsSchema)
export const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema)
