"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { id: 5, title: "Q3 2026 Institutional Impact Assessment", date: "Oct 01, 2026", type: "PDF", size: "3.8 MB" },
    { id: 6, title: "Faculty SDG Integration Survey Results", date: "Sep 20, 2026", type: "Excel", size: "1.4 MB" },
    { id: 1, title: "Q2 2026 Department SDG Impact Summary", date: "Jul 01, 2026", type: "PDF", size: "2.4 MB" },
    { id: 2, title: "Student Participation Metrics", date: "Jun 15, 2026", type: "CSV", size: "1.1 MB" },
    { id: 3, title: "Pending Reviews Audit", date: "Jun 01, 2026", type: "Excel", size: "845 KB" },
    { id: 4, title: "Annual Sustainability Report 2025", date: "Jan 10, 2026", type: "PDF", size: "5.7 MB" },
  ]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Exports</h2>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-blue-500" />
            Generated Reports
          </CardTitle>
          <CardDescription>
            Download historical reports and summaries for your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{report.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {report.date}</span>
                      <span>&bull;</span>
                      <span className="font-semibold">{report.type}</span>
                      <span>&bull;</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
