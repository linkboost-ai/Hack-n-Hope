"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Requirement {
  skill: string;
  amount: number;
  recommendedSeniority: string | number;
}

export default function ProjectRequest() {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { skill: "", amount: 1, recommendedSeniority: "" },
  ]);

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { skill: "", amount: 1, recommendedSeniority: "" },
    ]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      projectApplication: {
        applicationStatus: "pending",
        businessDetails: "550e8400-e29b-41d4-a716-446655440000", // Dummy UUID
        projectDetails: {
          projectName: (document.getElementById("projectName") as HTMLInputElement).value,
          description: (document.getElementById("description") as HTMLInputElement).value,
          location: (document.getElementById("location") as HTMLInputElement).value,
          requirements: requirements.map((_, index) => ({
            skill: (document.getElementById(`skill-${index}`) as HTMLInputElement).value,
            amount: parseInt((document.getElementById(`amount-${index}`) as HTMLInputElement).value),
            recommendedSeniority: (document.getElementById(`seniority-${index}`) as HTMLInputElement).value,
          })),
          budget: parseFloat((document.getElementById("budget") as HTMLInputElement).value),
          startDate: (document.getElementById("startDate") as HTMLInputElement).value,
          endDate: (document.getElementById("endDate") as HTMLInputElement).value,
        }
      }
    };

    try {
      const response = await fetch("https://exxeta.app.n8n.cloud/webhook-test/0457cf40-f02a-4dd9-b09a-e527ae7b4ea8", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Handle successful submission
      alert("Project request submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit project request. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 pl-64">
      <Card>
        <CardHeader>
          <CardTitle>Project Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" min="0" required />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Requested Consultants</h3>
                <Button type="button" onClick={addRequirement} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Consultant
                </Button>
              </div>

              {requirements.map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Skill</Label>
                    <Input id={`skill-${index}`} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input id={`amount-${index}`} type="number" min="1" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Seniority</Label>
                    <Input id={`seniority-${index}`} required />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeRequirement(index)}
                    className="h-10"
                    disabled={requirements.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Submit Project Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 