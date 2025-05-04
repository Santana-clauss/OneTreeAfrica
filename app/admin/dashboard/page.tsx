"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ImageIcon,
  Newspaper,
  ImageIcon as ImageLucide,
  LogOut,
  Upload,
  Trash2,
  Plus,
  Save,
  Loader2,
} from "lucide-react"
import { checkAuth, signOut } from "@/app/actions/auth"
import {
  uploadProjectImage,
  addNewsItem,
  uploadGalleryImage,
  getProjects,
  getNewsItems,
  getGalleryImages,
  deleteProjectImage,
  deleteNewsItem,
  deleteGalleryImage,
  updateProject,
} from "@/app/actions/admin"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingNews, setIsAddingNews] = useState(false)
  const [isAddingGallery, setIsAddingGallery] = useState(false)
  const router = useRouter()

  const { toast } = useToast()

  useEffect(() => {
    async function verifyAuth() {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.push("/admin")
        return
      }

      // Load data
      try {
        const [projectsData, newsData, galleryData] = await Promise.all([
          getProjects(),
          getNewsItems(),
          getGalleryImages(),
        ])

        setProjects(projectsData)
        setNewsItems(newsData)
        setGalleryImages(galleryData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [router])

  async function handleSignOut() {
    await signOut()
    router.push("/admin")
  }

  async function handleProjectImageUpload(formData: FormData) {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      formData.append("projectId", selectedProject)
      const result = await uploadProjectImage(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })

        // Refresh projects
        const updatedProjects = await getProjects()
        setProjects(updatedProjects)
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
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  async function handleAddNewsItem(formData: FormData) {
    setIsAddingNews(true)
    try {
      const result = await addNewsItem(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "News item added successfully",
        })

        // Refresh news items
        const updatedNews = await getNewsItems()
        setNewsItems(updatedNews)

        // Reset form
        const form = document.getElementById("newsForm") as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add news item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAddingNews(false)
    }
  }

  async function handleAddGalleryImage(formData: FormData) {
    setIsAddingGallery(true)
    try {
      const result = await uploadGalleryImage(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Gallery image added successfully",
        })

        // Refresh gallery images
        const updatedGallery = await getGalleryImages()
        setGalleryImages(updatedGallery)

        // Reset form
        const form = document.getElementById("galleryForm") as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add gallery image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAddingGallery(false)
    }
  }

  async function handleDeleteProjectImage(projectId: string, imageIndex: number) {
    try {
      const result = await deleteProjectImage(projectId, imageIndex)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
        })

        // Refresh projects
        const updatedProjects = await getProjects()
        setProjects(updatedProjects)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteNewsItem(newsId: string) {
    try {
      const result = await deleteNewsItem(newsId)

      if (result.success) {
        toast({
          title: "Success",
          description: "News item deleted successfully",
        })

        // Refresh news items
        const updatedNews = await getNewsItems()
        setNewsItems(updatedNews)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete news item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteGalleryImage(imageId: string) {
    try {
      const result = await deleteGalleryImage(imageId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Gallery image deleted successfully",
        })

        // Refresh gallery images
        const updatedGallery = await getGalleryImages()
        setGalleryImages(updatedGallery)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete gallery image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateProject(projectId: string, formData: FormData) {
    try {
      formData.append("projectId", projectId)
      const result = await updateProject(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        })

        // Refresh projects
        const updatedProjects = await getProjects()
        setProjects(updatedProjects)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#198754]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="projects">
              <ImageIcon className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="mr-2 h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <ImageLucide className="mr-2 h-4 w-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Projects</CardTitle>
                <CardDescription>Upload images for existing projects or update project details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="project-select">Select Project</Label>
                  <select
                    id="project-select"
                    className="w-full p-2 border rounded-md"
                    value={selectedProject || ""}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.trees} trees)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <div className="space-y-6">
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">Update Project Details</h3>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          handleUpdateProject(selectedProject, formData)
                        }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name</Label>
                          <Input
                            id="project-name"
                            name="name"
                            defaultValue={projects.find((p) => p.id === selectedProject)?.name || ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-trees">Trees Planted</Label>
                          <Input
                            id="project-trees"
                            name="trees"
                            type="number"
                            defaultValue={projects.find((p) => p.id === selectedProject)?.trees || 0}
                            required
                          />
                        </div>
                        <Button type="submit" className="bg-[#198754] hover:bg-[#198754]/90">
                          <Save className="mr-2 h-4 w-4" />
                          Update Project
                        </Button>
                      </form>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">Upload New Image</h3>
                      <form action={handleProjectImageUpload} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-image">Select Image</Label>
                          <Input id="project-image" name="image" type="file" accept="image/*" required />
                        </div>
                        <Button type="submit" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90" disabled={isUploading}>
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
                        </Button>
                      </form>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">Current Images</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {projects
                          .find((p) => p.id === selectedProject)
                          ?.images.map((image: string, index: number) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video relative rounded-md overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Project image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteProjectImage(selectedProject, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        {projects.find((p) => p.id === selectedProject)?.images.length === 0 && (
                          <p className="text-gray-500 italic">No images uploaded yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage News & Blog</CardTitle>
                <CardDescription>Add new articles or edit existing ones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-medium mb-4">Add New Article</h3>
                  <form id="newsForm" action={handleAddNewsItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">Title</Label>
                      <Input id="news-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-excerpt">Excerpt</Label>
                      <Textarea id="news-excerpt" name="excerpt" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-link">Link</Label>
                      <Input id="news-link" name="link" type="url" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-image">Image</Label>
                      <Input id="news-image" name="image" type="file" accept="image/*" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-color">Color (hex code)</Label>
                      <Input id="news-color" name="color" defaultValue="#FF6B35" required />
                    </div>
                    <Button type="submit" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90" disabled={isAddingNews}>
                      {isAddingNews ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Article
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Current Articles</h3>
                  <div className="space-y-4">
                    {newsItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 sm:w-2/3 flex flex-col">
                            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                            <p className="text-gray-600 mb-4 flex-grow">{item.excerpt}</p>
                            <div className="flex justify-between items-center">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#198754] hover:underline flex items-center"
                              >
                                View Article
                              </a>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteNewsItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {newsItems.length === 0 && <p className="text-gray-500 italic">No articles added yet</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Gallery</CardTitle>
                <CardDescription>Add new images to the gallery or remove existing ones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-medium mb-4">Add New Gallery Image</h3>
                  <form id="galleryForm" action={handleAddGalleryImage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-image">Select Image</Label>
                      <Input id="gallery-image" name="image" type="file" accept="image/*" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-alt">Alt Text</Label>
                      <Input id="gallery-alt" name="alt" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-caption">Caption</Label>
                      <Textarea id="gallery-caption" name="caption" required />
                    </div>
                    <Button type="submit" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90" disabled={isAddingGallery}>
                      {isAddingGallery ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Gallery
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Current Gallery Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square relative rounded-md overflow-hidden">
                          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end">
                          <div className="p-3 w-full bg-black bg-opacity-50 text-white">
                            <p className="text-sm line-clamp-2">{image.caption}</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteGalleryImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {galleryImages.length === 0 && <p className="text-gray-500 italic">No gallery images added yet</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
