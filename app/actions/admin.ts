"use server"

import { revalidatePath } from "next/cache"
import { checkAuth } from "./auth"

// In a real application, you would use a database to store this data
// This is a simplified example for demonstration purposes

// Mock data storage
const projects = [
  {
    id: "1",
    name: "St Joseph Girls Chepterit",
    trees: 2400,
    images: ["/chepterit5.jpg", "/chepterit2.jpg", "/chepterit6.jpg"],
  },
  {
    id: "2",
    name: "World Environmental Day - Landson Foundation",
    trees: 400,
    images: ["/earthday/Erday.jpg", "/earthday/Erday1.jpg", "/earthday/erd5.jpg"],
  },
  {
    id: "3",
    name: "ACK Ziwa High School",
    trees: 500,
    images: [],
  },
  // Add more projects
  {
    id: "4",
    name: "Moi Girls High School",
    trees: 1200,
    images: [],
  },
  {
    id: "5",
    name: "Kapkong High School",
    trees: 1600,
    images: [],
  },
  {
    id: "6",
    name: "Nelson Mandela Day - Moi University Primary School",
    trees: 800,
    images: ["/moiuni/moiuni.jpg", "/moiuni/moiuni1.jpg", "/moiuni/moiuni3.jpg"],
  },
]

const newsItems = [
  {
    id: "1",
    title: "Our founder Jeffrey K Kosgei talks about One Child One Tree Africa",
    excerpt: "In a recent interview, our founder shares insights on the organization's mission and future plans.",
    image: "/placeholder.svg?height=200&width=300&text=Interview",
    link: "https://www.youtube.com/live/kVQ1v8kiHzM?si=5uYJ59AWSJxEe5Rd",
    color: "bg-pink-500",
  },
  {
    id: "2",
    title: "Involve local communities in conservation",
    excerpt: "Learn about our approach to community-driven conservation efforts across Kenya.",
    image: "/placeholder.svg?height=200&width=300&text=Community",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/make-conservation-local-4412142",
    color: "bg-cyan-500",
  },
  {
    id: "3",
    title: "Learn from Costa Rica's success story",
    excerpt: "Discover how we're applying lessons from Costa Rica's environmental policies to our initiatives.",
    image: "/placeholder.svg?height=200&width=300&text=Costa+Rica",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/learn-from-costa-rica-s-success-story-4263508",
    color: "bg-amber-500",
  },
]

const galleryImages = [
  {
    id: "1",
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+1",
    alt: "Students planting trees at local school",
    caption: "Students from St. Joseph Girls planting trees during our annual event",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
    alt: "Community members participating in tree planting",
    caption: "Local community members joining our reforestation efforts",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
    alt: "Environmental education session",
    caption: "Our team conducting an environmental education session at Moi Girls High School",
  },
]

// Helper function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

// Projects management
export async function getProjects() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  return projects
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

  // In a real application, you would upload the image to a storage service
  // and get back a URL. Here we'll simulate that.
  const imageUrl = `/uploads/${image.name}`

  // Find the project and add the image
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) {
    return { success: false, message: "Project not found" }
  }

  projects[projectIndex].images.push(imageUrl)

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteProjectImage(projectId: string, imageIndex: number) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) {
    return { success: false, message: "Project not found" }
  }

  if (imageIndex < 0 || imageIndex >= projects[projectIndex].images.length) {
    return { success: false, message: "Image not found" }
  }

  // Remove the image
  projects[projectIndex].images.splice(imageIndex, 1)

  revalidatePath("/admin/dashboard")
  return { success: true }
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

  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) {
    return { success: false, message: "Project not found" }
  }

  // Update the project
  projects[projectIndex].name = name
  projects[projectIndex].trees = trees

  revalidatePath("/admin/dashboard")
  return { success: true }
}

// News management
export async function getNewsItems() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  return newsItems
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

  // In a real application, you would upload the image to a storage service
  // and get back a URL. Here we'll simulate that.
  const imageUrl = `/uploads/${image.name}`

  // Add the news item
  const newItem = {
    id: generateId(),
    title,
    excerpt,
    link,
    image: imageUrl,
    color,
  }

  newsItems.unshift(newItem)

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteNewsItem(newsId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const itemIndex = newsItems.findIndex((item) => item.id === newsId)
  if (itemIndex === -1) {
    return { success: false, message: "News item not found" }
  }

  // Remove the news item
  newsItems.splice(itemIndex, 1)

  revalidatePath("/admin/dashboard")
  return { success: true }
}

// Gallery management
export async function getGalleryImages() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    throw new Error("Not authenticated")
  }

  return galleryImages
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

  // In a real application, you would upload the image to a storage service
  // and get back a URL. Here we'll simulate that.
  const imageUrl = `/uploads/${image.name}`

  // Add the gallery image
  const newImage = {
    id: generateId(),
    src: imageUrl,
    alt,
    caption,
  }

  galleryImages.unshift(newImage)

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteGalleryImage(imageId: string) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return { success: false, message: "Not authenticated" }
  }

  const imageIndex = galleryImages.findIndex((img) => img.id === imageId)
  if (imageIndex === -1) {
    return { success: false, message: "Gallery image not found" }
  }

  // Remove the gallery image
  galleryImages.splice(imageIndex, 1)

  revalidatePath("/admin/dashboard")
  return { success: true }
}
