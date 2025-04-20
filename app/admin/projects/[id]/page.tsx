import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { projects, projectImages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { ProjectForm } from "../components/project-form"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  // Get project
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  })

  if (!project) {
    notFound()
  }

  // Get project images
  const images = await db.query.projectImages.findMany({
    where: eq(projectImages.projectId, id),
    orderBy: (projectImages, { asc }) => [asc(projectImages.order)],
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      <ProjectForm
        project={{
          id: project.id,
          name: project.name,
          trees: project.trees,
          images: images.map((img) => img.imageUrl),
        }}
      />
    </div>
  )
}

