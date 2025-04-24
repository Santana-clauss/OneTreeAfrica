import { NextResponse } from "next/server"

let projects: { id: number; name: string; trees: number; images: string[] }[] = []

export async function GET() {
  return NextResponse.json({ projects })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const name = formData.get("name") as string | null
  const trees = formData.get("trees") as string | null
  const images = formData.getAll("images").map((file: any) => URL.createObjectURL(file))

  const newProject = {
    id: projects.length + 1,
    name: name ?? "Unnamed Project",
    trees: trees ? parseInt(trees, 10) : 0,
    images,
  }
  projects.push(newProject)

  return NextResponse.json({ success: true, projects })
}

export async function PUT(req: Request) {
  const formData = await req.formData()
  const id = formData.get("id") as string | null
  const name = formData.get("name") as string | null
  const trees = formData.get("trees") as string | null
  const images = formData.getAll("images").map((file: any) => URL.createObjectURL(file))

  if (!id) {
    return NextResponse.json({ success: false, message: "Project ID is required" })
  }

  const projectIndex = projects.findIndex((project) => project.id === parseInt(id, 10))
  if (projectIndex === -1) {
    return NextResponse.json({ success: false, message: "Project not found" })
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    name: name ?? projects[projectIndex].name,
    trees: trees ? parseInt(trees, 10) : projects[projectIndex].trees,
    images: images.length > 0 ? [...projects[projectIndex].images, ...images] : projects[projectIndex].images,
  }

  return NextResponse.json({ success: true, projects })
}
