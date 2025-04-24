"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Users, Clock, Calendar, ArrowRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

// Mock data
const mockData = {
  skillGaps: {
    java: { required: 15, available: 10 },
    python: { required: 12, available: 15 },
    react: { required: 20, available: 12 },
    aws: { required: 8, available: 5 }
  },
  staffingMetrics: {
    understaffedProjects: 4,
    overstaffedProjects: 2,
    unassignedConsultants: 8,
    criticalSkillGaps: 3
  },
  utilizationRate: 78, // percentage
  avgTimeToStaff: 14, // days
  historicalUtilization: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [65, 72, 78, 75, 82, 78]
  },
  // New mock data for upcoming staffing needs
  upcomingStaffingNeeds: [
    { 
      project: "Cloud Migration", 
      skill: "AWS", 
      needed: 3, 
      startDate: "May 2", 
      potentialMatches: 2 
    },
    { 
      project: "Mobile App", 
      skill: "React Native", 
      needed: 2, 
      startDate: "May 10", 
      potentialMatches: 1 
    },
    { 
      project: "Data Pipeline", 
      skill: "Python", 
      needed: 4, 
      startDate: "May 15", 
      potentialMatches: 4 
    },
    { 
      project: "Enterprise Portal", 
      skill: "Java", 
      needed: 2, 
      startDate: "May 7", 
      potentialMatches: 0 
    }
  ]
}

// Format historical utilization data for the chart
const utilizationChartData = mockData.historicalUtilization.labels.map((month, index) => ({
  month,
  utilization: mockData.historicalUtilization.data[index]
}))

// Format skill gap data for the chart
const skillGapChartData = Object.entries(mockData.skillGaps).map(([skill, data]) => ({
  skill,
  required: data.required,
  available: data.available,
  gap: data.required - data.available
}))

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card className="border-none bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-background">
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">Resource Analytics</CardTitle>
            <p className="text-muted-foreground text-sm">
              Real-time insights into resource allocation and skill gaps.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Critical Skill Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{mockData.staffingMetrics.criticalSkillGaps}</div>
            <p className="text-xs text-muted-foreground">
              High priority skills needed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{mockData.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Current utilization rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Unassigned Resources</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{mockData.staffingMetrics.unassignedConsultants}</div>
            <p className="text-xs text-muted-foreground">
              Available consultants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Avg. Time to Staff</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{mockData.avgTimeToStaff}d</div>
            <p className="text-xs text-muted-foreground">
              Average staffing time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historical Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={utilizationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Utilization']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="utilization" 
                    name="Utilization Rate" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ fill: '#4f46e5' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    labelFormatter={(label) => `Skill: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="required" name="Required" fill="#8884d8" />
                  <Bar dataKey="available" name="Available" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staffing Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Understaffed Projects</p>
                  <p className="text-sm text-muted-foreground">Projects needing resources</p>
                </div>
                <span className="text-2xl font-bold text-red-500">
                  {mockData.staffingMetrics.understaffedProjects}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overstaffed Projects</p>
                  <p className="text-sm text-muted-foreground">Projects with excess resources</p>
                </div>
                <span className="text-2xl font-bold text-yellow-500">
                  {mockData.staffingMetrics.overstaffedProjects}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Staffing Needs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
              {mockData.upcomingStaffingNeeds.map((need, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{need.project}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                        {need.skill}
                      </span>
                      <span className="text-muted-foreground">
                        • {need.startDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${need.potentialMatches === 0 ? 'text-red-500' : need.potentialMatches >= need.needed ? 'text-green-500' : 'text-amber-500'}`}>
                        {need.potentialMatches}/{need.needed}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Potential matches
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 mt-2 border-t">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all upcoming staffing needs
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}