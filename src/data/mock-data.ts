export interface Consultant {
  id: string
  name: string
  avatar: string
  role: string
  skills: string[]
  score: number
  availability: string[]
  experience: number
  completedProjects: number
  rating: number
  metrics: {
    successRate: number
    onTimeDelivery: number
    clientSatisfaction: number
    projectsCompleted: number
  }
  bio: string
  recentProjects: string[]
}

export interface Project {
  id: string
  title: string
  client: string
  duration: string
  skills: string[]
  status: "Not Started" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  consultantsNeeded: number
  description: string
  startDate: string
  budget: string
  location: string
  metrics?: {
    progress: number
    tasksCompleted: number
    totalTasks: number
    hoursLogged: number
  }
}

export interface Analytics {
  consultantMetrics: {
    totalConsultants: number
    activeConsultants: number
    averageRating: number
    skillDistribution: Record<string, number>
  }
  projectMetrics: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    successRate: number
  }
  monthlyStats: Array<{
    month: string
    projectsStarted: number
    projectsCompleted: number
    activeConsultants: number
  }>
  skillDemand: Array<{
    skill: string
    demand: number
    availableConsultants: number
  }>
}

export const consultants: Consultant[] = [
  {
    id: "c1",
    name: "Sarah Chen",
    avatar: "/avatars/sarah-chen.jpg",
    role: "Senior Software Engineer",
    skills: ["React", "TypeScript", "Node.js", "AWS", "Python"],
    score: 92,
    availability: ["Available", "Remote"],
    experience: 8,
    completedProjects: 24,
    rating: 4.8,
    metrics: {
      successRate: 95,
      onTimeDelivery: 98,
      clientSatisfaction: 4.9,
      projectsCompleted: 24
    },
    bio: "Full-stack developer with expertise in cloud architecture and scalable applications",
    recentProjects: ["p1", "p3", "p5"]
  },
  {
    id: "c2",
    name: "Michael Rodriguez",
    avatar: "/avatars/michael-rodriguez.jpg",
    role: "Data Scientist",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization"],
    score: 88,
    availability: ["Available", "Hybrid"],
    experience: 5,
    completedProjects: 16,
    rating: 4.6,
    metrics: {
      successRate: 92,
      onTimeDelivery: 95,
      clientSatisfaction: 4.7,
      projectsCompleted: 16
    },
    bio: "Data scientist specializing in machine learning and predictive analytics",
    recentProjects: ["p2", "p4"]
  },
  {
    id: "c3",
    name: "Emma Watson",
    avatar: "/avatars/emma-watson.jpg",
    role: "UX/UI Designer",
    skills: ["UI Design", "User Research", "Figma", "Adobe XD", "Prototyping"],
    score: 90,
    availability: ["Available", "On-site"],
    experience: 6,
    completedProjects: 32,
    rating: 4.9,
    metrics: {
      successRate: 97,
      onTimeDelivery: 96,
      clientSatisfaction: 4.8,
      projectsCompleted: 32
    },
    bio: "Creative designer focused on user-centered design and accessibility",
    recentProjects: ["p6", "p7"]
  }
]

export const projects: Project[] = [
  {
    id: "p1",
    title: "E-commerce Platform Redesign",
    client: "ShopMax Inc.",
    duration: "4 months",
    skills: ["React", "TypeScript", "UI Design", "Node.js"],
    status: "In Progress",
    priority: "High",
    consultantsNeeded: 3,
    description: "Modernize the existing e-commerce platform with improved UX and performance",
    startDate: "2024-02-01",
    budget: "$120,000",
    location: "Remote",
    metrics: {
      progress: 65,
      tasksCompleted: 45,
      totalTasks: 78,
      hoursLogged: 620
    }
  },
  {
    id: "p2",
    title: "Customer Analytics Dashboard",
    client: "DataCorp",
    duration: "3 months",
    skills: ["Python", "Machine Learning", "Data Visualization", "SQL"],
    status: "Not Started",
    priority: "Medium",
    consultantsNeeded: 2,
    description: "Build a comprehensive analytics dashboard for customer behavior analysis",
    startDate: "2024-03-15",
    budget: "$85,000",
    location: "Hybrid"
  },
  {
    id: "p3",
    title: "Cloud Migration Project",
    client: "TechFlow Systems",
    duration: "6 months",
    skills: ["AWS", "DevOps", "Python", "Kubernetes"],
    status: "Not Started",
    priority: "High",
    consultantsNeeded: 4,
    description: "Migrate legacy systems to cloud infrastructure with zero downtime",
    startDate: "2024-04-01",
    budget: "$200,000",
    location: "Remote"
  }
]

export const analytics: Analytics = {
  consultantMetrics: {
    totalConsultants: 45,
    activeConsultants: 32,
    averageRating: 4.7,
    skillDistribution: {
      "React": 15,
      "Python": 12,
      "AWS": 10,
      "TypeScript": 14,
      "Machine Learning": 8,
      "UI Design": 7
    }
  },
  projectMetrics: {
    totalProjects: 28,
    activeProjects: 12,
    completedProjects: 16,
    successRate: 92
  },
  monthlyStats: [
    {
      month: "Jan 2024",
      projectsStarted: 5,
      projectsCompleted: 3,
      activeConsultants: 28
    },
    {
      month: "Feb 2024",
      projectsStarted: 7,
      projectsCompleted: 4,
      activeConsultants: 32
    },
    {
      month: "Mar 2024",
      projectsStarted: 4,
      projectsCompleted: 6,
      activeConsultants: 30
    }
  ],
  skillDemand: [
    {
      skill: "React",
      demand: 85,
      availableConsultants: 12
    },
    {
      skill: "Python",
      demand: 78,
      availableConsultants: 8
    },
    {
      skill: "AWS",
      demand: 92,
      availableConsultants: 6
    },
    {
      skill: "UI Design",
      demand: 70,
      availableConsultants: 5
    }
  ]
} 