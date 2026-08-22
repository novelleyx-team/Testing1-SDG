"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AnalysisFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [text, setText] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAnalyze(text)
    }
  }

  return (
    <Card className="rounded-[12px] shadow-sm border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#2563EB]" />
          Project Analysis
        </CardTitle>
        <CardDescription className="text-gray-500 text-sm">
          Enter your project abstract or title to get AI-powered SDG recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="e.g. A platform to optimize water usage in agriculture using IoT sensors..."
            className="min-h-[140px] rounded-[12px] resize-none border-gray-200 focus-visible:ring-[#2563EB]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 h-11 transition-colors"
            >
              {isLoading ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Project
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
