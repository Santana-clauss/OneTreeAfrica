import { connectToDatabase, Project, News, Gallery } from "@/lib/mongodb"

export async function getProjects() {
  try {
    await connectToDatabase()
    // Changed sorting to createdAt: 1 to show oldest projects first
    const projects = await Project.find().sort({ createdAt: 1 })
    return JSON.parse(JSON.stringify(projects))
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getNewsItems() {
  try {
    await connectToDatabase()
    const newsItems = await News.find().sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(newsItems))
  } catch (error) {
    console.error("Error fetching news items:", error)
    return []
  }
}

export async function getGalleryImages() {
  try {
    await connectToDatabase()
    const galleryImages = await Gallery.find().sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(galleryImages))
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}
