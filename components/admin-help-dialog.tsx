"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function AdminHelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admin Dashboard Help</DialogTitle>
          <DialogDescription>Understanding the admin dashboard features</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="border-b pb-4">
            <h3 className="font-bold text-lg mb-2">Admin Buttons</h3>
            <ul className="space-y-3">
              <li>
                <span className="font-semibold">Migrate Static Data:</span> This button imports all the previously
                hardcoded projects, news items, and gallery images into the MongoDB database. Use this once when setting
                up your site to ensure all your existing content is in the database.
              </li>
              <li>
                <span className="font-semibold">Seed Data:</span> This button adds a small set of sample data (projects,
                news, gallery) to an empty database. Only use this if your database is completely empty and you need
                some starter content.
              </li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-bold text-lg mb-2">Projects</h3>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Image Limit:</span> Each project can have a maximum of 3 images.
              </li>
              <li>
                <span className="font-semibold">Project Order:</span> Projects are displayed on the website in the order
                they were created (oldest first).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Tips</h3>
            <ul className="space-y-2">
              <li>Always use the "Update" button after making changes to ensure they're saved.</li>
              <li>Images should be optimized for web (less than 5MB, ideally much smaller).</li>
              <li>Use descriptive alt text and captions for better accessibility.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
