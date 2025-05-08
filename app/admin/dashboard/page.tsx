"use client"

import { useState, useEffect, useCallback } from "react"
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
  Edit,
  AlertTriangle,
  Database,
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
  addProject,
  seedInitialData,
  deleteProject,
  updateNewsItem,
  updateGalleryImage,
} from "@/app/actions/admin"
import { migrateStaticData } from "@/lib/actions/migrate-static-data"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Add this import at the top
import { AdminHelpDialog } from "@/components/admin-help-dialog"

// Update the getImagePath helper function
const getImagePath = (imagePath: string) => {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith('/uploads/')) {
    // For local uploads, ensure the path is correct
    return imagePath;
  }
  if (imagePath.startsWith('http')) {
    // For external URLs
    return imagePath;
  }
  // For other paths (like static images)
  return `/${imagePath.replace(/^\//, '')}`;
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingNews, setIsAddingNews] = useState(false)
  const [isAddingGallery, setIsAddingGallery] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const [selectedNewsItem, setSelectedNewsItem] = useState<any | null>(null)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<any | null>(null)
  const [isUpdatingNews, setIsUpdatingNews] = useState(false)
  const [isUpdatingGallery, setIsUpdatingGallery] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null)
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

  async function handleSeedData() {
    setIsSeeding(true)
    try {
      const result = await seedInitialData()

      if (result.success) {
        toast({
          title: "Success",
          description: "Initial data seeded successfully",
        })

        // Refresh data
        const [projectsData, newsData, galleryData] = await Promise.all([
          getProjects(),
          getNewsItems(),
          getGalleryImages(),
        ])

        setProjects(projectsData)
        setNewsItems(newsData)
        setGalleryImages(galleryData)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to seed initial data",
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
      setIsSeeding(false)
    }
  }

  async function handleMigrateStaticData() {
    setIsMigrating(true)
    try {
      const result = await migrateStaticData()

      if (result.success) {
        toast({
          title: "Success",
          description: `Static data migrated successfully. Added: ${result.results.projects.added} projects, ${result.results.news.added} news items, ${result.results.gallery.added} gallery images.`,
        })

        // Refresh data
        const [projectsData, newsData, galleryData] = await Promise.all([
          getProjects(),
          getNewsItems(),
          getGalleryImages(),
        ])

        setProjects(projectsData)
        setNewsItems(newsData)
        setGalleryImages(galleryData)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to migrate static data",
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
      setIsMigrating(false)
    }
  }

  const handleFileValidation = useCallback(
    (file: File | null): boolean => {
      if (!file) {
        toast({
          title: "Error",
          description: "Please select a file",
          variant: "destructive",
        })
        return false
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "File type not supported. Please upload JPEG, PNG, GIF, or WebP images.",
          variant: "destructive",
        })
        return false
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File is too large. Maximum size is 5MB.",
          variant: "destructive",
        })
        return false
      }

      return true
    },
    [toast],
  )

  async function handleAddProject(formData: FormData) {
    setIsAddingProject(true)
    try {
      const result = await addProject(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Project added successfully",
        })

        // Refresh projects
        const updatedProjects = await getProjects()
        setProjects(updatedProjects)

        // Reset form
        const form = document.getElementById("projectForm") as HTMLFormElement
        if (form) form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add project",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Project add error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding project",
        variant: "destructive",
      })
    } finally {
      setIsAddingProject(false)
    }
  }

  async function handleDeleteProject(projectId: string) {
    try {
      const result = await deleteProject(projectId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })

        // Refresh projects
        const updatedProjects = await getProjects()
        setProjects(updatedProjects)
        setSelectedProject(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete project",
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

  // Update the handleProjectImageUpload function to better handle the response
  async function handleProjectImageUpload(formData: FormData) {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      })
      return
    }

    const imageFile = formData.get("image") as File
    if (!handleFileValidation(imageFile)) {
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
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Update the handleAddNewsItem function to better handle the response
  async function handleAddNewsItem(formData: FormData) {
    const imageFile = formData.get("image") as File
    if (!handleFileValidation(imageFile)) {
      return
    }

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
      console.error("News upload error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding news item",
        variant: "destructive",
      })
    } finally {
      setIsAddingNews(false)
    }
  }

  async function handleUpdateNewsItem(formData: FormData) {
    if (!selectedNewsItem) {
      return
    }

    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0 && !handleFileValidation(imageFile)) {
      return
    }

    setIsUpdatingNews(true)
    try {
      formData.append("newsId", selectedNewsItem._id)
      const result = await updateNewsItem(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "News item updated successfully",
        })

        // Refresh news items
        const updatedNews = await getNewsItems()
        setNewsItems(updatedNews)
        setSelectedNewsItem(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update news item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("News update error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating news item",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingNews(false)
    }
  }

  // Update the handleAddGalleryImage function to better handle the response
  async function handleAddGalleryImage(formData: FormData) {
    const imageFile = formData.get("image") as File
    if (!handleFileValidation(imageFile)) {
      return
    }

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
      console.error("Gallery upload error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding gallery image",
        variant: "destructive",
      })
    } finally {
      setIsAddingGallery(false)
    }
  }

  async function handleUpdateGalleryImage(formData: FormData) {
    if (!selectedGalleryImage) {
      return
    }

    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0 && !handleFileValidation(imageFile)) {
      return
    }

    setIsUpdatingGallery(true)
    try {
      formData.append("imageId", selectedGalleryImage._id)
      const result = await updateGalleryImage(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Gallery image updated successfully",
        })

        // Refresh gallery images
        const updatedGallery = await getGalleryImages()
        setGalleryImages(updatedGallery)
        setSelectedGalleryImage(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update gallery image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Gallery update error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating gallery image",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingGallery(false)
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

  async function handleDeleteItem() {
    if (!itemToDelete) return

    try {
      let result

      if (itemToDelete.type === "project") {
        result = await deleteProject(itemToDelete.id)
      } else if (itemToDelete.type === "news") {
        result = await deleteNewsItem(itemToDelete.id)
      } else if (itemToDelete.type === "gallery") {
        result = await deleteGalleryImage(itemToDelete.id)
      }

      if (result?.success) {
        toast({
          title: "Success",
          description: `${itemToDelete.type} deleted successfully`,
        })

        // Refresh data
        if (itemToDelete.type === "project") {
          const updatedProjects = await getProjects()
          setProjects(updatedProjects)
          if (selectedProject === itemToDelete.id) {
            setSelectedProject(null)
          }
        } else if (itemToDelete.type === "news") {
          const updatedNews = await getNewsItems()
          setNewsItems(updatedNews)
        } else if (itemToDelete.type === "gallery") {
          const updatedGallery = await getGalleryImages()
          setGalleryImages(updatedGallery)
        }
      } else {
        toast({
          title: "Error",
          description: result?.message || `Failed to delete ${itemToDelete.type}`,
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
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  function confirmDelete(type: string, id: string) {
    setItemToDelete({ type, id })
    setIsDeleteDialogOpen(true)
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
        {/* Then update the header section in the return statement: */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <AdminHelpDialog />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMigrateStaticData} disabled={isMigrating}>
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Migrate Static Data
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSeedData} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Seed Data
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
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
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Create a new project to track tree planting initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="projectForm" action={handleAddProject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name-new">Project Name</Label>
                    <Input id="project-name-new" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-trees-new">Trees Planted</Label>
                    <Input id="project-trees-new" name="trees" type="number" defaultValue="0" required />
                  </div>
                  <Button type="submit" className="bg-[#198754] hover:bg-[#198754]/90" disabled={isAddingProject}>
                    {isAddingProject ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

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
                      <option key={project._id} value={project._id}>
                        {project.name} ({project.trees} trees)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <div className="space-y-6">
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Update Project Details</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete("project", selectedProject)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </Button>
                      </div>
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
                            defaultValue={projects.find((p) => p._id === selectedProject)?.name || ""}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-trees">Trees Planted</Label>
                          <Input
                            id="project-trees"
                            name="trees"
                            type="number"
                            defaultValue={projects.find((p) => p._id === selectedProject)?.trees || 0}
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
                          .find((p) => p._id === selectedProject)
                          ?.images.map((image: string, index: number) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video relative rounded-md overflow-hidden">
                                <Image
                                  src={getImagePath(image) || "/placeholder.svg"}
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
                        {projects.find((p) => p._id === selectedProject)?.images.length === 0 && (
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

                {selectedNewsItem && (
                  <div className="border-t border-b py-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Edit News Item</h3>
                      <Button size="sm" variant="outline" onClick={() => setSelectedNewsItem(null)}>
                        Cancel
                      </Button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleUpdateNewsItem(formData)
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="edit-news-title">Title</Label>
                        <Input id="edit-news-title" name="title" defaultValue={selectedNewsItem.title} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-news-excerpt">Excerpt</Label>
                        <Textarea
                          id="edit-news-excerpt"
                          name="excerpt"
                          defaultValue={selectedNewsItem.excerpt}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-news-link">Link</Label>
                        <Input
                          id="edit-news-link"
                          name="link"
                          type="url"
                          defaultValue={selectedNewsItem.link}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-news-image">Image (leave empty to keep current image)</Label>
                        <div className="mb-2">
                          <Image
                            src={getImagePath(selectedNewsItem.image) || "/placeholder.svg"}
                            alt={selectedNewsItem.title}
                            width={200}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <Input id="edit-news-image" name="image" type="file" accept="image/*" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-news-color">Color (hex code)</Label>
                        <Input
                          id="edit-news-color"
                          name="color"
                          defaultValue={selectedNewsItem.color.replace("bg-", "#")}
                          required
                        />
                      </div>
                      <Button type="submit" className="bg-[#198754] hover:bg-[#198754]/90" disabled={isUpdatingNews}>
                        {isUpdatingNews ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Article
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-4">Current Articles</h3>
                  <div className="space-y-4">
                    {newsItems.map((item) => (
                      <Card key={item._id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                            <Image
                              src={getImagePath(item.image) || "/placeholder.svg"}
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
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedNewsItem(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => confirmDelete("news", item._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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

                {selectedGalleryImage && (
                  <div className="border-t border-b py-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Edit Gallery Image</h3>
                      <Button size="sm" variant="outline" onClick={() => setSelectedGalleryImage(null)}>
                        Cancel
                      </Button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleUpdateGalleryImage(formData)
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="edit-gallery-alt">Alt Text</Label>
                        <Input id="edit-gallery-alt" name="alt" defaultValue={selectedGalleryImage.alt} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-gallery-caption">Caption</Label>
                        <Textarea
                          id="edit-gallery-caption"
                          name="caption"
                          defaultValue={selectedGalleryImage.caption}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-gallery-image">Image (leave empty to keep current image)</Label>
                        <div className="mb-2">
                          <Image
                            src={getImagePath(selectedGalleryImage.src) || "/placeholder.svg"}
                            alt={selectedGalleryImage.alt}
                            width={200}
                            height={200}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <Input id="edit-gallery-image" name="image" type="file" accept="image/*" />
                      </div>
                      <Button type="submit" className="bg-[#198754] hover:bg-[#198754]/90" disabled={isUpdatingGallery}>
                        {isUpdatingGallery ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Gallery Image
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-4">Current Gallery Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image._id} className="relative group">
                        <div className="aspect-square relative rounded-md overflow-hidden">
                          <Image
                            src={getImagePath(image.src) || "/placeholder.svg"}
                            alt={image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end">
                          <div className="p-3 w-full bg-black bg-opacity-50 text-white">
                            <p className="text-sm line-clamp-2">{image.caption}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white"
                            onClick={() => setSelectedGalleryImage(image)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => confirmDelete("gallery", image._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
