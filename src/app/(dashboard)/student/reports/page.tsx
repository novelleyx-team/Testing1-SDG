"use client";

import { Card } from "@/components/ui/card";
import { FileText, Download, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReports = [
  { id: "REP-995", title: "Global Climate Action Initiative", type: "Full Report", date: "Nov 20, 2026", status: "Ready", size: "3.1 MB" },
  { id: "REP-994", title: "Renewable Energy Certificate - SDG 7", type: "Certificate", date: "Nov 10, 2026", status: "Ready", size: "1.5 MB" },
  { id: "REP-993", title: "Community Education Outreach", type: "Interim", date: "Nov 01, 2026", status: "Processing", size: "--" },
  { id: "REP-992", title: "Official SDG Certificate - SDG 6", type: "Certificate", date: "Oct 15, 2026", status: "Ready", size: "1.2 MB" },
  { id: "REP-991", title: "Clean Water Filtration Impact Report", type: "Full Report", date: "Oct 14, 2026", status: "Ready", size: "4.5 MB" },
  { id: "REP-884", title: "Campus Vertical Farming Analysis", type: "Full Report", date: "Jul 05, 2026", status: "Ready", size: "3.8 MB" },
  { id: "REP-882", title: "Smart Grid Interim Review", type: "Interim", date: "Sep 30, 2026", status: "Processing", size: "--" },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Reports & Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Download your officially formatted AI impact reports and SDG certificates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReports.map((report) => (
          <Card key={report.id} className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex flex-col group relative overflow-hidden">
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              {report.status === "Ready" ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} /> READY
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                  <Clock size={12} /> PROCESSING
                </span>
              )}
            </div>

            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 dark:border-orange-800/50">
              <FileText size={24} className="text-orange-500 dark:text-orange-400" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight pr-16">{report.title}</h3>
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-4">{report.type}</p>
            
            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Issued: {report.date}</p>
                <p className="text-xs text-gray-400 font-medium">Size: {report.size}</p>
              </div>
              {report.status === "Ready" ? (
                <a href="/sample-sdg-report.pdf" download={`${report.title}.pdf`} className="block">
                  <Button 
                    className="rounded-full shadow-sm w-10 h-10 p-0 flex items-center justify-center transition-transform bg-blue-600 hover:bg-blue-700 hover:scale-105"
                  >
                    <Download size={16} />
                  </Button>
                </a>
              ) : (
                <Button 
                  disabled
                  variant="secondary"
                  className="rounded-full shadow-sm w-10 h-10 p-0 flex items-center justify-center"
                >
                  <Download size={16} />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
