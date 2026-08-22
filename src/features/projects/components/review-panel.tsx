"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, MessageSquare, AlertCircle } from "lucide-react"

interface ReviewPanelProps {
  projectId: string
  projectTitle: string
  onReviewSubmit: (status: 'approved' | 'rejected', feedback: string) => void
}

export function ReviewPanel({ projectId, projectTitle, onReviewSubmit }: ReviewPanelProps) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAction = (status: 'approved' | 'rejected') => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      onReviewSubmit(status, feedback)
      setIsSubmitting(false)
    }, 0)
  }

  return (
    <Card className="rounded-[12px] shadow-sm border-neutral-200/60 bg-white overflow-hidden">
      <CardHeader className="pb-6 pt-6 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="pt-1">
            <CardTitle className="text-xl font-semibold tracking-tight text-neutral-900">Faculty Review Panel</CardTitle>
            <CardDescription className="text-[14px] text-neutral-500 mt-1.5 leading-relaxed">
              Reviewing: <span className="font-semibold text-neutral-900">{projectTitle}</span> (ID: {projectId})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6 pb-6 px-6">
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-[10px] p-4 flex gap-3.5 text-[13px] text-amber-900/90 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Review Guidelines</p>
            <p className="text-amber-800/80 leading-relaxed">Please ensure this project aligns with the institution&apos;s SDG objectives before approval. Detailed feedback is required for rejections.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="feedback" className="text-sm font-semibold text-neutral-800">Evaluation Feedback</Label>
          <Textarea 
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your detailed feedback, suggestions for improvement, or specific reasons for rejection here..."
            className="min-h-[140px] resize-none rounded-[8px] shadow-sm border-neutral-200/80 focus-visible:ring-neutral-900 text-[14px] p-4 leading-relaxed transition-shadow"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3.5 pt-5 pb-5 px-6 border-t border-neutral-100 bg-neutral-50/80">
        <Button 
          variant="outline" 
          className="rounded-[8px] shadow-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 border-red-200/60 hover:border-red-300 transition-colors h-10 px-5"
          onClick={() => handleAction('rejected')}
          disabled={isSubmitting || (feedback.trim() === '')}
        >
          <XCircle className="w-4 h-4 mr-2 opacity-80" />
          Reject Project
        </Button>
        <Button 
          className="rounded-[8px] shadow-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all hover:shadow-md h-10 px-6"
          onClick={() => handleAction('approved')}
          disabled={isSubmitting}
        >
          <CheckCircle2 className="w-4 h-4 mr-2 opacity-80" />
          Approve Project
        </Button>
      </CardFooter>
    </Card>
  )
}
