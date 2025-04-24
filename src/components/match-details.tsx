"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Match } from "@/lib/supabase"
import { useState, useEffect } from "react"

interface MatchDetailsProps {
  match: Match
}

interface MatchScoreDetails {
  technologyMatch: number
  seniorityMatch: number
  languageMatch: number
  certificateMatch: number
  matchedTechnologies: string[]
  matchedRequirements: string[]
}

export function MatchDetails({ match }: MatchDetailsProps) {
  const [details, setDetails] = useState<MatchScoreDetails | null>(null)

  useEffect(() => {
    try {
      // Parse the description field which contains the JSON string of match details
      const parsedDetails = JSON.parse(match.description) as MatchScoreDetails
      setDetails(parsedDetails)
    } catch (error) {
      console.error("Error parsing match details:", error)
    }
  }, [match])

  if (!details) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Match Score
          <Badge variant={match.score >= 80 ? "default" : "secondary"}>
            {match.score}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technology Match</span>
              <span>{details.technologyMatch}%</span>
            </div>
            <Progress value={details.technologyMatch} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Seniority Match</span>
              <span>{details.seniorityMatch}%</span>
            </div>
            <Progress value={details.seniorityMatch} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Language Match</span>
              <span>{details.languageMatch}%</span>
            </div>
            <Progress value={details.languageMatch} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Certificate Match</span>
              <span>{details.certificateMatch}%</span>
            </div>
            <Progress value={details.certificateMatch} />
          </div>
        </div>

        {details.matchedTechnologies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Matched Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {details.matchedTechnologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {details.matchedRequirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Matched Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {details.matchedRequirements.map((req) => (
                <Badge key={req} variant="secondary">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 