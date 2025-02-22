"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "What We Do", href: "#what-we-do" },
  { name: "Projects", href: "#projects" },
  { name: "Team", href: "#team" },
  { name: "News", href: "#news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Partners", href: "#partners" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (href === "/gallery") {
      window.location.href = href
      return
    }

    if (mounted) {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl text-[#FF6B35]" onClick={(e) => scrollToSection(e, "/")}>
            One Child One Tree Africa
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-[#FF6B35] transition-colors duration-200"
                onClick={(e) => scrollToSection(e, item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild className="hidden md:inline-flex bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
              <Link href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
                Contact Us
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium hover:text-[#FF6B35] transition-colors duration-200"
                      onClick={(e) => {
                        scrollToSection(e, item.href)
                        const closeButton = document.querySelector(
                          'button[aria-label="Close"]',
                        ) as HTMLButtonElement | null
                        if (closeButton) closeButton.click()
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

