"use client"

import Link from "next/link"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">Admin Dashboard</div>
        <nav className="flex-grow p-4 space-y-4">
          <Link href="/admin/projects" className="block hover:text-[#FF6B35]">
            Manage Projects
          </Link>
          <Link href="/admin/blogs" className="block hover:text-[#FF6B35]">
            Manage Blogs
          </Link>
          <Link href="/admin/events" className="block hover:text-[#FF6B35]">
            Manage Events
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-6 bg-gray-100">{children}</main>
    </div>
  )
}
