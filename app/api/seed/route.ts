import { NextResponse } from "next/server"
import { connectToDatabase, Project, News, Gallery } from "@/lib/mongodb"

export async function GET() {
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
          createdAt: new Date("2020-01-15"), // Adding specific dates to ensure order
          updatedAt: new Date(),
        },
        {
          name: "World Environmental Day - Landson Foundation",
          trees: 400,
          images: ["/earthday/Erday.jpg", "/earthday/Erday1.jpg", "/earthday/erd5.jpg"],
          createdAt: new Date("2020-03-22"),
          updatedAt: new Date(),
        },
        {
          name: "ACK Ziwa High School",
          trees: 500,
          images: [],
          createdAt: new Date("2020-05-10"),
          updatedAt: new Date(),
        },
        {
          name: "Moi Girls High School",
          trees: 1200,
          images: [],
          createdAt: new Date("2020-07-05"),
          updatedAt: new Date(),
        },
        {
          name: "Kapkong High School",
          trees: 1600,
          images: [],
          createdAt: new Date("2020-09-18"),
          updatedAt: new Date(),
        },
        {
          name: "Nelson Mandela Day - Moi University Primary School",
          trees: 800,
          images: ["/moiuni/moiuni.jpg", "/moiuni/moiuni1.jpg", "/moiuni/moiuni3.jpg"],
          createdAt: new Date("2020-11-30"),
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
          createdAt: new Date("2021-01-15"),
          updatedAt: new Date(),
        },
        {
          title: "Involve local communities in conservation",
          excerpt: "Learn about our approach to community-driven conservation efforts across Kenya.",
          image: "/placeholder.svg?height=200&width=300&text=Community",
          link: "https://nation.africa/kenya/blogs-opinion/blogs/make-conservation-local-4412142",
          color: "bg-cyan-500",
          createdAt: new Date("2021-03-20"),
          updatedAt: new Date(),
        },
        {
          title: "Learn from Costa Rica's success story",
          excerpt: "Discover how we're applying lessons from Costa Rica's environmental policies to our initiatives.",
          image: "/placeholder.svg?height=200&width=300&text=Costa+Rica",
          link: "https://nation.africa/kenya/blogs-opinion/blogs/learn-from-costa-rica-s-success-story-4263508",
          color: "bg-amber-500",
          createdAt: new Date("2021-05-10"),
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
          createdAt: new Date("2021-02-15"),
        },
        {
          src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
          alt: "Community members participating in tree planting",
          caption: "Local community members joining our reforestation efforts",
          createdAt: new Date("2021-04-20"),
        },
        {
          src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
          alt: "Environmental education session",
          caption: "Our team conducting an environmental education session at Moi Girls High School",
          createdAt: new Date("2021-06-10"),
        },
      ]

      await Gallery.insertMany(initialGalleryImages)
      console.log("Initial gallery images seeded")
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        projects: projectCount,
        news: newsCount,
        gallery: galleryCount,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
  }
}
