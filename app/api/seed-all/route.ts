import { NextResponse } from "next/server"
import { connectToDatabase, Project, News, Gallery } from "@/lib/mongodb"

// Original static data from components
const staticProjects = [
  {
    name: "St Joseph Girls Chepterit",
    trees: 2400,
    images: ["/chepterit5.jpg", "/chepterit2.jpg", "/chepterit6.jpg"],
  },
  {
    name: "World Environmental Day - Landson Foundation",
    trees: 400,
    images: ["/earthday/Erday.jpg", "/earthday/Erday1.jpg", "/earthday/erd5.jpg"],
  },
  {
    name: "ACK Ziwa High School",
    trees: 500,
    images: [
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+1",
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+2",
      "/placeholder.svg?height=200&width=400&text=ACK+Ziwa+3",
    ],
  },
  {
    name: "Moi Girls High School",
    trees: 1200,
    images: [
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+1",
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+2",
      "/placeholder.svg?height=200&width=400&text=Moi+Girls+3",
    ],
  },
  {
    name: "Kapkong High School",
    trees: 1600,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kapkong+1",
      "/placeholder.svg?height=200&width=400&text=Kapkong+2",
      "/placeholder.svg?height=200&width=400&text=Kapkong+3",
    ],
  },
  {
    name: "Nelson Mandela Day - Moi University Primary School",
    trees: 800,
    images: ["/moiuni/moiuni.jpg", "/moiuni/moiuni1.jpg", "/moiuni/moiuni3.jpg"],
  },
  {
    name: "Eldoret National Polytechnic",
    trees: 1000,
    images: [
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+1",
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+2",
      "/placeholder.svg?height=200&width=400&text=Eldoret+Poly+3",
    ],
  },
  {
    name: "Kapsabet Girls High School",
    trees: 1800,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+1",
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+2",
      "/placeholder.svg?height=200&width=400&text=Kapsabet+Girls+3",
    ],
  },
  {
    name: "Kitale National Polytechnic",
    trees: 700,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+1",
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+2",
      "/placeholder.svg?height=200&width=400&text=Kitale+Poly+3",
    ],
  },
  {
    name: "University of Eldoret",
    trees: 2000,
    images: [
      "/placeholder.svg?height=200&width=400&text=UoE+1",
      "/placeholder.svg?height=200&width=400&text=UoE+2",
      "/placeholder.svg?height=200&width=400&text=UoE+3",
    ],
  },
  {
    name: "Moi University Main Campus",
    trees: 2500,
    images: [
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+1",
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+2",
      "/placeholder.svg?height=200&width=400&text=Moi+Uni+3",
    ],
  },
  {
    name: "Kesses Secondary School",
    trees: 600,
    images: [
      "/placeholder.svg?height=200&width=400&text=Kesses+1",
      "/placeholder.svg?height=200&width=400&text=Kesses+2",
      "/placeholder.svg?height=200&width=400&text=Kesses+3",
    ],
  },
]

const staticNewsItems = [
  {
    title: "Our founder Jeffrey K Kosgei talks about One Child One Tree Africa",
    excerpt: "In a recent interview, our founder shares insights on the organization's mission and future plans.",
    image: "/placeholder.svg?height=200&width=300&text=Interview",
    link: "https://www.youtube.com/live/kVQ1v8kiHzM?si=5uYJ59AWSJxEe5Rd",
    color: "bg-pink-500",
  },
  {
    title: "Involve local communities in conservation",
    excerpt: "Learn about our approach to community-driven conservation efforts across Kenya.",
    image: "/placeholder.svg?height=200&width=300&text=Community",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/make-conservation-local-4412142",
    color: "bg-cyan-500",
  },
  {
    title: "Learn from Costa Rica's success story",
    excerpt: "Discover how we're applying lessons from Costa Rica's environmental policies to our initiatives.",
    image: "/placeholder.svg?height=200&width=300&text=Costa+Rica",
    link: "https://nation.africa/kenya/blogs-opinion/blogs/learn-from-costa-rica-s-success-story-4263508",
    color: "bg-amber-500",
  },
]

const staticGalleryImages = [
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+1",
    alt: "Students planting trees at local school",
    caption: "Students from St. Joseph Girls planting trees during our annual event",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
    alt: "Community members participating in tree planting",
    caption: "Local community members joining our reforestation efforts",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
    alt: "Environmental education session",
    caption: "Our team conducting an environmental education session at Moi Girls High School",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Nursery+1",
    alt: "Tree nursery managed by women",
    caption: "Women tending to our tree nursery, growing seedlings for future planting events",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+2",
    alt: "Students planting trees in rural area",
    caption: "Students from Kapkong High School participating in rural reforestation",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Eco+Club+Meeting",
    alt: "Eco-club meeting at school",
    caption: "An eco-club meeting at ACK Ziwa High School, discussing upcoming projects",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Planting+Event+1",
    alt: "Large tree planting event",
    caption: "Our annual tree planting event with over 500 participants from local schools",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Workshop",
    alt: "Environmental workshop",
    caption: "Environmental education workshop for teachers and community leaders",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Seedling+Distribution",
    alt: "Seedling distribution",
    caption: "Distribution of tree seedlings to local schools for their planting programs",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Engagement",
    alt: "Community engagement session",
    caption: "Community engagement session on the importance of forest conservation",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=School+Visit",
    alt: "School visit",
    caption: "Our team visiting Eldoret National Polytechnic to discuss future collaborations",
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Award+Ceremony",
    alt: "Award ceremony",
    caption: "Recognition ceremony for schools that have planted the most trees this year",
  },
]

export async function GET() {
  try {
    await connectToDatabase()
    const results = {
      projects: { added: 0, skipped: 0 },
      news: { added: 0, skipped: 0 },
      gallery: { added: 0, skipped: 0 },
    }

    // Seed projects
    for (const project of staticProjects) {
      // Check if project already exists (by name)
      const existingProject = await Project.findOne({ name: project.name })

      if (!existingProject) {
        // Add timestamps
        const newProject = new Project({
          ...project,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        await newProject.save()
        results.projects.added++
      } else {
        results.projects.skipped++
      }
    }

    // Seed news items
    for (const newsItem of staticNewsItems) {
      // Check if news item already exists (by title)
      const existingNews = await News.findOne({ title: newsItem.title })

      if (!existingNews) {
        // Add timestamps
        const newNewsItem = new News({
          ...newsItem,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        await newNewsItem.save()
        results.news.added++
      } else {
        results.news.skipped++
      }
    }

    // Seed gallery images
    for (const galleryImage of staticGalleryImages) {
      // Check if gallery image already exists (by src and caption)
      const existingImage = await Gallery.findOne({
        src: galleryImage.src,
        caption: galleryImage.caption,
      })

      if (!existingImage) {
        // Add timestamp
        const newGalleryImage = new Gallery({
          ...galleryImage,
          createdAt: new Date(),
        })

        await newGalleryImage.save()
        results.gallery.added++
      } else {
        results.gallery.skipped++
      }
    }

    return NextResponse.json({
      success: true,
      message: "Static data migration completed",
      results,
    })
  } catch (error) {
    console.error("Error migrating static data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to migrate static data",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
