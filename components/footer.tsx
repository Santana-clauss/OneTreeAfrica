import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">One Child One Tree</h3>
            <p className="text-sm">
              Creating a platform for the next generation to take climate action through education, conservation, and tree planting.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <Link href="#about" className="text-sm hover:text-[#FF6B35]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#what-we-do" className="text-sm hover:text-[#FF6B35]">
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-sm hover:text-[#FF6B35]">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#news" className="text-sm hover:text-[#FF6B35]">
                  News & Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Contact Info</h4>
            <ul className="space-y-1 text-sm">
              <li>P.O Box 937-30100</li>
              <li>Eldoret, Kenya</li>
              <li>info@onechildonetree.africa</li>
              <li>+254101246715</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/onechildonetree"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6B35]"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/onechildonetree"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6B35]"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/OneChildOneTreeAfrica"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6B35]"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} One Child One Tree Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

