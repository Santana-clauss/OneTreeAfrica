"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { uploadImage } from "@/app/actions/upload"
import { createProject, updateProject } from "@/app/actions/projects"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Upload, Plus } from "lucide-react"

interface ProjectFormProps {
  project?: {
    id: number
    name: string
    trees: number
    images: string[]
  }
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!project

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadImage(formData)

        if (result.success && result.url) {
          setImages((prev) => [...prev, result.url])
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to upload image",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(formData: FormData) {
    if (images.length === 0) {
      setErrors({ images: "At least one image is required" })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Add images to form data
      formData.append("images", JSON.stringify(images))

      // Add project ID if editing
      if (isEditing) {
        formData.append("id", project.id.toString())
      }

      const result = isEditing ? await updateProject(formData) : await createProject(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/admin/projects")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })

        if (result.errors) {
          const formErrors: Record<string, string> = {}
          result.errors.forEach((error: any) => {
            formErrors[error.path] = error.message
          })
          setErrors(formErrors)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={project?.name}
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="trees">Number of Trees</Label>
          <Input
            id="trees"
            name="trees"
            type="number"
            min="1"
            defaultValue={project?.trees || 1}
            required
            className={errors.trees ? "border-red-500" : ""}
          />
          {errors.trees && <p className="text-sm text-red-500">{errors.trees}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Project Images</Label>
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" disabled={isUploading} asChild>
                  <span>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Images
                      </>
                    )}
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden aspect-square">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Project image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </Card>
            ))}

            <Label
              htmlFor="image-upload"
              className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Add Image</span>
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  )
}

