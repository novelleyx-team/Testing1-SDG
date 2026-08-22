import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Sdg {
  id: number;
  name: string;
}

interface SdgAnalysisCardProps {
  confidenceScore: number;
  recommendedSdgs: Sdg[];
  reasoning: string;
}

export function SdgAnalysisCard({
  confidenceScore,
  recommendedSdgs,
  reasoning,
}: SdgAnalysisCardProps) {
  return (
    <Card className="rounded-[12px] shadow-sm border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">AI Analysis Results</CardTitle>
        <CardDescription className="text-gray-500">
          Sustainable Development Goals identified for this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Confidence Score</span>
            <span className="text-sm font-semibold text-[#2563EB]">{confidenceScore}%</span>
          </div>
          <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-0 ease-in-out"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Recommended SDGs</h4>
          <div className="flex flex-wrap gap-2">
            {recommendedSdgs.map((sdg) => (
              <Badge
                key={sdg.id}
                variant="secondary"
                className="bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-medium rounded-full"
              >
                SDG {sdg.id}: {sdg.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">AI Reasoning</h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-[12px] border border-gray-100">
            {reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
