"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import { ConsultantCard } from "@/components/consultant-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { getConsultants } from "@/lib/data-service"
import type { Consultant } from "@/lib/supabase"

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const data = await getConsultants()
        setConsultants(data)
      } catch (error) {
        console.error('Error fetching consultants:', error)
        setError(error instanceof Error ? error.message : 'Failed to load consultants')
        setConsultants([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredConsultants = consultants
    .filter(consultant => {
      if (!searchTerm) return true
      
      const searchLower = searchTerm.toLowerCase()
      const name = consultant.name?.toLowerCase() ?? ''
      const industry = consultant.industry?.toLowerCase() ?? ''
      const location = consultant.location?.toLowerCase() ?? ''
      
      return (
        name.includes(searchLower) ||
        industry.includes(searchLower) ||
        location.includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      }
      if (sortBy === "name") {
        return (a.name || '').localeCompare(b.name || '')
      }
      return (a.name || '').localeCompare(b.name || '')
    })

  if (loading) {
    return (
      <main className="p-6 space-y-6">
        <Card>
          <CardContent className="py-20">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6 space-y-6">
        <Card className="bg-red-50">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Consultants</h2>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

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
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
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