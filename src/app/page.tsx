"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analytics, consultants, projects } from "@/data/mock-data"
import { AreaChart, BarChart, DonutChart } from "@tremor/react"
import { UserPlus, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConsultantCard } from "@/components/consultant-card"
import { ProjectCard } from "@/components/project-card"
import { useState } from "react"

// Define chart data types
interface ChartData {
  [key: string]: string | number
}

interface ProjectActivityData extends ChartData {
  month: string
  "Projects Started": number
  "Projects Completed": number
  "Active Consultants": number
}

interface SkillDemandData extends ChartData {
  skill: string
  Demand: number
  "Available Consultants": number
  "Skill Gap": number
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const consultantSortBy = "score"
  const projectSortBy = "priority"

  // Calculate metrics
  const highPriorityProjects = projects.filter(p => p.priority === "High").length
  const availableConsultants = consultants.filter(c => c.availability.includes("Available")).length

  // Prepare chart data
  const monthlyProjectData: ProjectActivityData[] = analytics.monthlyStats.map(stat => ({
    month: stat.month,
    "Projects Started": stat.projectsStarted,
    "Projects Completed": stat.projectsCompleted,
    "Active Consultants": stat.activeConsultants
  }))

  const skillDemandData: SkillDemandData[] = analytics.skillDemand.map(skill => ({
    skill: skill.skill,
    Demand: skill.demand,
    "Available Consultants": skill.availableConsultants,
    "Skill Gap": Math.max(0, skill.demand - skill.availableConsultants)
  }))

  // Calculate total skill gap percentage for donut chart
  const totalSkillGap = skillDemandData.reduce((acc, curr) => acc + curr["Skill Gap"], 0)
  const totalDemand = skillDemandData.reduce((acc, curr) => acc + curr.Demand, 0)
  const skillGapPercentage = (totalSkillGap / totalDemand) * 100

  const skillGapDonutData = [
    { name: "Covered", value: 100 - skillGapPercentage },
    { name: "Gap", value: skillGapPercentage }
  ]

  // Filter consultants and projects based on search
  const filteredConsultants = consultants
    .filter(consultant => 
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (consultantSortBy === "score") return b.score - a.score
      if (consultantSortBy === "rating") return b.rating - a.rating
      return b.experience - a.experience
    })

  const filteredProjects = projects
    .filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const priorityMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
      if (projectSortBy === "priority") 
        return priorityMap[b.priority] - priorityMap[a.priority]
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">Dashboard</CardTitle>
            <p className="text-muted-foreground text-sm">
              Overview of your consultants, projects, and key metrics.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{analytics.consultantMetrics.totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              {availableConsultants} currently available
            </p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{analytics.projectMetrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {highPriorityProjects} high priority
            </p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{analytics.consultantMetrics.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Across all consultants
            </p>
          </CardContent>
        </Card>
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{analytics.projectMetrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.projectMetrics.completedProjects} projects completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3 card-gradient">
          <CardHeader className="relative">
            <CardTitle>Project Activity</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <AreaChart
              data={monthlyProjectData}
              index="month"
              categories={["Projects Started", "Projects Completed", "Active Consultants"]}
              colors={["#0F172A", "#334155", "#64748B"]}
              className="h-72"
            />
          </CardContent>
        </Card>
        <Card className="col-span-2 card-gradient">
          <CardHeader className="relative">
            <CardTitle>Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <BarChart
              data={skillDemandData}
              index="skill"
              categories={["Demand", "Available Consultants", "Skill Gap"]}
              colors={["#0F172A", "#334155", "#64748B"]}
              className="h-72"
            />
          </CardContent>
        </Card>
        <Card className="col-span-2 card-gradient">
          <CardHeader className="relative">
            <CardTitle>Overall Skill Coverage</CardTitle>
          </CardHeader>
          <CardContent className="relative flex flex-col items-center">
            <DonutChart
              data={skillGapDonutData}
              category="value"
              index="name"
              colors={["#0F172A", "#64748B"]}
              className="h-72"
            />
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {skillGapPercentage.toFixed(1)}% skill gap across all projects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search consultants or projects..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-x-2">
            <Button className="btn-primary">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Consultant
            </Button>
            <Button className="btn-primary">
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        <Tabs defaultValue="consultants" className="space-y-4">
          <TabsList className="bg-gradient-primary">
            <TabsTrigger value="consultants" className="data-[state=active]:bg-white/10">Consultants</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white/10">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="consultants" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConsultants.map(consultant => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
