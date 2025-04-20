"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Image, LogOut, Users } from "lucide-react"
import { logout } from "@/app/auth"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/admin/login"
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/projects", label: "Projects", icon: Image },
    { href: "/admin/news", label: "News", icon: FileText },
    { href: "/admin/partners", label: "Partners", icon: Users },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}

