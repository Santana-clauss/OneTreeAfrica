"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { uploadImage } from "@/app/actions/upload"
import { createNews, updateNews } from "@/app/actions/news"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Upload } from "lucide-react"

interface NewsFormProps {
  news?: {
    id: number
    title: string
    excerpt: string
    content: string
    imageUrl: string
    link?: string
    color: string
  }
}

export function NewsForm({ news }: NewsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(news?.imageUrl || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!news

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadImage(formData)

      if (result.success && result.url) {
        setImageUrl(result.url)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to upload image",
          variant: "destructive",
        })
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

  function removeImage() {
    setImageUrl("")
  }

  async function handleSubmit(formData: FormData) {
    if (!imageUrl) {
      setErrors({ imageUrl: "An image is required" })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Add image URL to form data
      formData.append("imageUrl", imageUrl)

      // Add news ID if editing
      if (isEditing) {
        formData.append("id", news.id.toString())
      }

      const result = isEditing ? await updateNews(formData) : await createNews(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/admin/news")
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
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={news?.title}
            required
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={news?.excerpt}
            required
            className={errors.excerpt ? "border-red-500" : ""}
          />
          {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            rows={8}
            defaultValue={news?.content}
            required
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link (Optional)</Label>
          <Input
            id="link"
            name="link"
            type="url"
            defaultValue={news?.link}
            placeholder="https://example.com/article"
            className={errors.link ? "border-red-500" : ""}
          />
          {errors.link && <p className="text-sm text-red-500">{errors.link}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            defaultValue={news?.color || "bg-blue-500"}
            required
            className={errors.color ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500">Use Tailwind CSS color classes like bg-blue-500, bg-green-500, etc.</p>
          {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Featured Image</Label>
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" disabled={isUploading || !!imageUrl} asChild>
                  <span>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}

          {imageUrl && (
            <Card className="relative overflow-hidden aspect-video">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <Image src={imageUrl || "/placeholder.svg"} alt="Featured image" fill className="object-cover" />
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/news")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Article"
          ) : (
            "Create Article"
          )}
        </Button>
      </div>
    </form>
  )
}

