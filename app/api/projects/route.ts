import { NextResponse } from "next/server"
import { Project } from "@/lib/mongodb"

export async function GET() {
  try {
    const projects = await Project.find({})
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string | null
    const trees = formData.get("trees") as string | null
    const images = formData.getAll("images").map((file: any) => URL.createObjectURL(file))

    if (!name || !trees) {
      return NextResponse.json({ success: false, message: "Name and trees are required" }, { status: 400 })
    }

    const newProject = new Project({
      name,
      trees: parseInt(trees, 10),
      images,
    })

    await newProject.save()

    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ success: false, message: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string | null
    const trees = formData.get("trees") as string | null
    const images = formData.getAll("images").map((file: any) => URL.createObjectURL(file))

    if (!id) {
      return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 })
    }

    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 })
    }

    project.name = name ?? project.name
    project.trees = trees ? parseInt(trees, 10) : project.trees
    project.images = images.length > 0 ? [...project.images, ...images] : project.images

    await project.save()

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ success: false, message: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 })
    }

    await Project.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 })
  }
}
