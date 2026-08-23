"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Activity, Users2 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Trends</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Submission Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">+24%</div>
            <p className="text-xs text-green-600 font-medium mt-1">Increasing this month</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg AI Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">8.4/10</div>
            <p className="text-xs text-gray-500 mt-1">High accuracy in SDG mapping</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
            <Users2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">86%</div>
            <p className="text-xs text-gray-500 mt-1">Of mentored students are active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Submission Activity (Last 6 Months)</CardTitle>
          <CardDescription>
            Overview of project submissions and reviews in your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-10 px-4">
            {/* Mock Bar Chart */}
            {[0, 0, 0, 0, 0, 0].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded font-bold">
                  {height * 2} Submissions
                </div>
                <div 
                  className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-md hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-blue-600 opacity-20 h-full"></div>
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
