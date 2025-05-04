"use server"

import { revalidatePath } from "next/cache"
import { checkAuth } from "./auth"
import { connectToDatabase, Project, News, Gallery } from "@/lib/mongodb"
import { revalidatePages } from "@/lib/actions/revalidate"

// Helper function to simulate image upload and return a placeholder URL
async function mockImageUpload(file: File, category: string) {
  const fileName = file.name.replace(/\s+/g, "-").toLowerCase();
  // Return the correct path for uploaded images
  return `/uploads/${fileName}`;
}

// Projects management
export async function getProjects() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  try {
    await connectToDatabase()
    const projects = await Project.find().sort({ updatedAt: -1 }).lean(); // Use .lean() to return plain objects
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function uploadProjectImage(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const projectId = formData.get("projectId") as string
  const image = formData.get("image") as File

  if (!projectId || !image) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    await connectToDatabase()

    // Find the project and check image count
    const project = await Project.findById(projectId)
    if (!project) {
      return { success: false, message: "Project not found" }
    }

    // Check if project already has 3 images
    if (project.images.length >= 3) {
      return {
        success: false,
        message: "Maximum of 3 images allowed per project. Please delete an existing image first.",
      }
    }

    // Use our mock image upload function instead of Vercel Blob
    // For real uploads, we would use Vercel Blob or another storage service
    // For now, we'll use the actual file name to make it more realistic
    const imageUrl = await mockImageUpload(image, "project")

    project.images.push(imageUrl)
    project.updatedAt = new Date()
    await project.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Image upload error:", error)
    return { success: false, message: "Failed to upload image" }
  }
}

export async function deleteProjectImage(projectId: string, imageIndex: number) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  try {
    await connectToDatabase()

    const project = await Project.findById(projectId)
    if (!project) {
      return { success: false, message: "Project not found" }
    }

    if (imageIndex < 0 || imageIndex >= project.images.length) {
      return { success: false, message: "Image not found" }
    }

    // Remove the image
    project.images.splice(imageIndex, 1)
    project.updatedAt = new Date()
    await project.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project image:", error)
    return { success: false, message: "Failed to delete image" }
  }
}

export async function updateProject(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const projectId = formData.get("projectId") as string
  const name = formData.get("name") as string
  const trees = Number.parseInt(formData.get("trees") as string)

  if (!projectId || !name || isNaN(trees)) {
    return { success: false, message: "Missing or invalid required fields" }
  }

  try {
    await connectToDatabase()

    const project = await Project.findById(projectId)
    if (!project) {
      return { success: false, message: "Project not found" }
    }

    // Update the project
    project.name = name
    project.trees = trees
    project.updatedAt = new Date()
    await project.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, message: "Failed to update project" }
  }
}

export async function addProject(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const trees = Number.parseInt(formData.get("trees") as string)

  if (!name || isNaN(trees)) {
    return { success: false, message: "Missing or invalid required fields" }
  }

  try {
    await connectToDatabase()

    const newProject = new Project({
      name,
      trees,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newProject.save()

    // Revalidate all pages that might display this data
    await revalidatePages()

    return { success: true }
  } catch (error) {
    console.error("Error adding project:", error)
    return { success: false, message: "Failed to add project" }
  }
}

export async function deleteProject(projectId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  try {
    await connectToDatabase()

    const result = await Project.findByIdAndDelete(projectId)
    if (!result) {
      return { success: false, message: "Project not found" }
    }

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, message: "Failed to delete project" }
  }
}

// News management
export async function getNewsItems() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  try {
    await connectToDatabase()
    const newsItems = await News.find().sort({ createdAt: -1 }).lean(); // Use .lean() to return plain objects
    return newsItems
  } catch (error) {
    console.error("Error fetching news items:", error)
    throw new Error("Failed to fetch news items")
  }
}

export async function addNewsItem(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const link = formData.get("link") as string
  const image = formData.get("image") as File
  const color = formData.get("color") as string

  if (!title || !excerpt || !link || !image || !color) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    await connectToDatabase()

    // Use our mock image upload function instead of Vercel Blob
    const imageUrl = await mockImageUpload(image, "news")

    // Add the news item
    const newItem = new News({
      title,
      excerpt,
      link,
      image: imageUrl,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newItem.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true, imageUrl }
  } catch (error) {
    console.error("News image upload error:", error)
    return { success: false, message: "Failed to add news item" }
  }
}

export async function updateNewsItem(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const newsId = formData.get("newsId") as string
  const title = formData.get("title") as string
  const excerpt = formData.get("excerpt") as string
  const link = formData.get("link") as string
  const color = formData.get("color") as string
  const image = formData.get("image") as File | null

  if (!newsId || !title || !excerpt || !link || !color) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    await connectToDatabase()

    const newsItem = await News.findById(newsId)
    if (!newsItem) {
      return { success: false, message: "News item not found" }
    }

    // Update text fields
    newsItem.title = title
    newsItem.excerpt = excerpt
    newsItem.link = link
    newsItem.color = color
    newsItem.updatedAt = new Date()

    // Update image if provided
    if (image && image.size > 0) {
      const imageUrl = await mockImageUpload(image, "news")
      newsItem.image = imageUrl
    }

    await newsItem.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating news item:", error)
    return { success: false, message: "Failed to update news item" }
  }
}

export async function deleteNewsItem(newsId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  try {
    await connectToDatabase()

    const result = await News.findByIdAndDelete(newsId)
    if (!result) {
      return { success: false, message: "News item not found" }
    }

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting news item:", error)
    return { success: false, message: "Failed to delete news item" }
  }
}

// Gallery management
export async function getGalleryImages() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  try {
    await connectToDatabase()
    const galleryImages = await Gallery.find().sort({ createdAt: -1 }).lean(); // Use .lean() to return plain objects
    return galleryImages
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    throw new Error("Failed to fetch gallery images")
  }
}

export async function uploadGalleryImage(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const image = formData.get("image") as File
  const alt = formData.get("alt") as string
  const caption = formData.get("caption") as string

  if (!image || !alt || !caption) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    await connectToDatabase()

    // Use our mock image upload function instead of Vercel Blob
    const imageUrl = await mockImageUpload(image, "gallery")

    // Add the gallery image
    const newImage = new Gallery({
      src: imageUrl,
      alt,
      caption,
      createdAt: new Date(),
    })

    await newImage.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Gallery image upload error:", error)
    return { success: false, message: "Failed to add gallery image" }
  }
}

export async function updateGalleryImage(formData: FormData) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const imageId = formData.get("imageId") as string
  const alt = formData.get("alt") as string
  const caption = formData.get("caption") as string
  const image = formData.get("image") as File | null

  if (!imageId || !alt || !caption) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    await connectToDatabase()

    const galleryImage = await Gallery.findById(imageId)
    if (!galleryImage) {
      return { success: false, message: "Gallery image not found" }
    }

    // Update text fields
    galleryImage.alt = alt
    galleryImage.caption = caption

    // Update image if provided
    if (image && image.size > 0) {
      const imageUrl = await mockImageUpload(image, "gallery")
      galleryImage.src = imageUrl
    }

    await galleryImage.save()

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating gallery image:", error)
    return { success: false, message: "Failed to update gallery image" }
  }
}

export async function deleteGalleryImage(imageId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  try {
    await connectToDatabase()

    const result = await Gallery.findByIdAndDelete(imageId)
    if (!result) {
      return { success: false, message: "Gallery image not found" }
    }

    await revalidatePages()

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    return { success: false, message: "Failed to delete gallery image" }
  }
}

// Seed initial data if the database is empty
export async function seedInitialData() {
  try {
    await connectToDatabase()

    // Check if we have any projects
    const projectCount = await Project.countDocuments()
    if (projectCount === 0) {
      // Seed initial projects
      const initialProjects = [
        {
          name: "St Joseph Girls Chepterit",
          trees: 2400,
          images: ["/chepterit5.jpg", "/chepterit2.jpg", "/chepterit6.jpg"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "World Environmental Day - Landson Foundation",
          trees: 400,
          images: ["/earthday/Erday.jpg", "/earthday/Erday1.jpg", "/earthday/erd5.jpg"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ACK Ziwa High School",
          trees: 500,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Moi Girls High School",
          trees: 1200,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kapkong High School",
          trees: 1600,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Nelson Mandela Day - Moi University Primary School",
          trees: 800,
          images: ["/moiuni/moiuni.jpg", "/moiuni/moiuni1.jpg", "/moiuni/moiuni3.jpg"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await Project.insertMany(initialProjects)
      console.log("Initial projects seeded")
    }

    // Check if we have any news items
    const newsCount = await News.countDocuments()
    if (newsCount === 0) {
      // Seed initial news items
      const initialNewsItems = [
        {
          title: "Our founder Jeffrey K Kosgei talks about One Child One Tree Africa",
          excerpt: "In a recent interview, our founder shares insights on the organization's mission and future plans.",
          image: "/placeholder.svg?height=200&width=300&text=Interview",
          link: "https://www.youtube.com/live/kVQ1v8kiHzM?si=5uYJ59AWSJxEe5Rd",
          color: "bg-pink-500",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Involve local communities in conservation",
          excerpt: "Learn about our approach to community-driven conservation efforts across Kenya.",
          image: "/placeholder.svg?height=200&width=300&text=Community",
          link: "https://nation.africa/kenya/blogs-opinion/blogs/make-conservation-local-4412142",
          color: "bg-cyan-500",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Learn from Costa Rica's success story",
          excerpt: "Discover how we're applying lessons from Costa Rica's environmental policies to our initiatives.",
          image: "/placeholder.svg?height=200&width=300&text=Costa+Rica",
          link: "https://nation.africa/kenya/blogs-opinion/blogs/learn-from-costa-rica-s-success-story-4263508",
          color: "bg-amber-500",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await News.insertMany(initialNewsItems)
      console.log("Initial news items seeded")
    }

    // Check if we have any gallery images
    const galleryCount = await Gallery.countDocuments()
    if (galleryCount === 0) {
      // Seed initial gallery images
      const initialGalleryImages = [
        {
          src: "/placeholder.svg?height=600&width=800&text=Students+Planting+1",
          alt: "Students planting trees at local school",
          caption: "Students from St. Joseph Girls planting trees during our annual event",
          createdAt: new Date(),
        },
        {
          src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
          alt: "Community members participating in tree planting",
          caption: "Local community members joining our reforestation efforts",
          createdAt: new Date(),
        },
        {
          src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
          alt: "Environmental education session",
          caption: "Our team conducting an environmental education session at Moi Girls High School",
          createdAt: new Date(),
        },
      ]

      await Gallery.insertMany(initialGalleryImages)
      console.log("Initial gallery images seeded")
    }

    return { success: true }
  } catch (error) {
    console.error("Error seeding initial data:", error)
    return { success: false, message: "Failed to seed initial data" }
  }
}
