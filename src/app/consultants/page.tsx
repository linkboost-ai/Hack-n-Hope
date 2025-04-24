"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import { ConsultantCard } from "@/components/consultant-card"
import { consultants } from "@/data/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortBy, setSortBy] = React.useState("score")

  const filteredConsultants = consultants
    .filter(consultant => {
      const searchLower = searchTerm.toLowerCase()
      return (
        consultant.name.toLowerCase().includes(searchLower) ||
        consultant.role.toLowerCase().includes(searchLower) ||
        consultant.skills.some(skill => skill.toLowerCase().includes(searchLower))
      )
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return b.rating - a.rating
    })

  return (
    <main className="p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-2xl">Consultants</CardTitle>
          <CardDescription>
            Browse and manage your consultant pool. Find the perfect match for your projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search consultants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Sort by Score</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Consultant
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map(consultant => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </main>
  )
} 