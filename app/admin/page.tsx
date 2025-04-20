import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects } from "./actions/projects"
import { getNews } from "./actions/news"

export default async function AdminDashboard() {
  const { projects = [] } = (await getProjects()) as any
  const { news = [] } = (await getNews()) as any

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      description: "Projects managed through the platform",
    },
    {
      title: "Total Trees",
      value: projects.reduce((acc: number, project: any) => acc + project.trees, 0),
      description: "Trees planted across all projects",
    },
    {
      title: "News Articles",
      value: news.length,
      description: "Published news and blog posts",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xl font-bold">{project.id}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.trees} trees</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xl font-bold">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

