"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe2, Target, TrendingUp } from "lucide-react"

export default function SDGTrackingPage() {
  const sdgData: { id: string, name: string, count: number, color: string }[] = [];

  const totalProjects = sdgData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SDG Tracking</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total SDGs Addressed</CardTitle>
            <Globe2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">0 / 17</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across all department projects</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Top Focus Area</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">None</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">N/A (0%)</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-purple-100 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Impact Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">+0%</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">vs last semester</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>SDG Distribution</CardTitle>
          <CardDescription>
            The breakdown of Sustainable Development Goals targeted by projects in your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {sdgData.map((sdg) => {
              const percentage = Math.round((sdg.count / totalProjects) * 100)
              return (
                <div key={sdg.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{sdg.id}: {sdg.name}</span>
                    <span className="text-gray-500 font-medium">{sdg.count} Projects ({percentage}%)</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${sdg.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
