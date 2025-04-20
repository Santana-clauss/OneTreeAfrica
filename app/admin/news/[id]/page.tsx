import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { news } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NewsForm } from "../components/news-form"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  // Get news
  const newsItem = await db.query.news.findFirst({
    where: eq(news.id, id),
  })

  if (!newsItem) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <NewsForm
        news={{
          id: newsItem.id,
          title: newsItem.title,
          excerpt: newsItem.excerpt,
          content: newsItem.content,
          imageUrl: newsItem.imageUrl,
          link: newsItem.link || undefined,
          color: newsItem.color,
        }}
      />
    </div>
  )
}

