"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Send, Loader2 } from "lucide-react"

export default function AIAssistantPage() {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = () => {
    if (!input) return
    setIsAnalyzing(true)
    // Simulate AI processing delay
    setTimeout(() => {
      setResult("Based on the abstract provided, the primary alignment is SDG 7: Affordable and Clean Energy (92% confidence), with a secondary alignment to SDG 13: Climate Action (78% confidence). The focus on renewable energy grids directly addresses target 7.2.")
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Analysis Assistant</h2>
      </div>

      <Card className="rounded-xl border-blue-200 dark:border-blue-900 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100 dark:border-blue-900/50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Brain className="text-blue-600" />
            Project Abstract Analyzer
          </CardTitle>
          <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
            Paste a student&apos;s project abstract below to get instant AI recommendations on SDG alignments and potential improvements.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all"
            placeholder="Paste project abstract or proposal here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {result && (
            <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 animate-in fade-in slide-in-from-bottom-4">
              <h4 className="flex items-center gap-2 font-bold text-green-800 dark:text-green-400 mb-2">
                <Sparkles size={16} /> Analysis Complete
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                {result}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-100 dark:border-gray-800 p-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-lg shadow-lg shadow-blue-500/20 transition-all"
            onClick={handleAnalyze}
            disabled={!input || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Abstract...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" /> Run AI Analysis
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
