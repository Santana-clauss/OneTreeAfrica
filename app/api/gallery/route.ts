import { NextResponse } from "next/server"

const galleryImages = [
  { id: 1, src: "/gallery/image1.jpg", alt: "Tree Planting Event", caption: "Tree Planting Event" },
  { id: 2, src: "/gallery/image2.jpg", alt: "Community Engagement", caption: "Community Engagement" },
  { id: 3, src: "/gallery/image3.jpg", alt: "School Eco-Club", caption: "School Eco-Club" },
  { id: 4, src: "/gallery/image4.jpg", alt: "Climate Action Workshop", caption: "Climate Action Workshop" },
  { id: 5, src: "/gallery/image5.jpg", alt: "Tree Adoption Program", caption: "Tree Adoption Program" },
]

export async function GET() {
  return NextResponse.json({ images: galleryImages })
}
