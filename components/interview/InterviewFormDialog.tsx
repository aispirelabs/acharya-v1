"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createInterview } from "@/lib/actions/general.action";
import { toast } from "sonner";

interface InterviewFormDialogProps {
  trigger?: React.ReactNode;
}

interface CreateInterviewData {
  role: string;
  type: string;
  level: string;
  techstack: string[];
  max_questions: number;
}

export default function InterviewFormDialog({ trigger }: InterviewFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<CreateInterviewData>({
    role: "",
    type: "technical",
    level: "beginner",
    techstack: [],
    max_questions: 10,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        techstack: formData.techstack, // Send as array directly
      };

      const accessToken = localStorage.getItem('access_token');
      const response = await createInterview(data, accessToken);
      
      if (response.success && response.interview) {
        toast.success("Interview created successfully!");
        setOpen(false);
        router.push(`/interview/${response.interview.id}`);
      } else {
        toast.error(response.error || "Failed to create interview");
      }
    } catch (error) {
      toast.error("An error occurred while creating the interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            Create New Interview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create New Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Software Engineer"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              name="type" 
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select 
              name="level" 
              value={formData.level}
              onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="techstack">Tech Stack (comma-separated)</Label>
            <Input
              id="techstack"
              name="techstack"
              value={formData.techstack.join(", ")}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                techstack: e.target.value.split(",").map(tech => tech.trim()).filter(Boolean)
              }))}
              placeholder="e.g., React, Node.js, TypeScript"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_questions">Maximum Questions</Label>
            <Input
              id="max_questions"
              name="max_questions"
              type="number"
              min="1"
              max="20"
              value={formData.max_questions}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                max_questions: parseInt(e.target.value) 
              }))}
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Number of questions to generate (1-20)
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 