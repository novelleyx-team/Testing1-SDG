"use client";

import { Card } from "@/components/ui/card";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockTemplates = [
  { id: "TPL-1", title: "Standard SDG Research Report", desc: "The official Dean-approved formatting for final semester submissions. Includes mandatory AI analysis sections.", format: "DOCX / LaTeX" },
  { id: "TPL-2", title: "Campus Impact Proposal", desc: "A shorter format designed specifically for campus-level sustainability initiatives. Requires HOD approval.", format: "PDF Form" },
  { id: "TPL-3", title: "Engineering Blueprint Attachment", desc: "Standardized title block and legend formats for submitting CAD or architectural diagrams alongside SDG data.", format: "DWG / PDF" },
  { id: "TPL-4", title: "Data Collection Logbook", desc: "Excel spreadsheet template pre-configured with formulas for tracking daily environmental metrics (e.g. water usage, power draw).", format: "XLSX" },
  { id: "TPL-MAJOR", title: "Major Project Submission", desc: "Comprehensive final year or semester-end major project report. Includes deep AI analysis and SDG targeting.", format: "DOCX / PDF" },
  { id: "TPL-MINOR", title: "Minor Project Submission", desc: "Shorter format for mid-semester or supplementary minor projects.", format: "PDF" },
  { id: "TPL-CASUAL", title: "Casual Faculty Project", desc: "Direct assignment submitted to faculty for instant marks. Includes rigorous plagiarism testing.", format: "Direct Entry" },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Templates Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Download official document structures to ensure fast faculty approvals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex flex-col md:flex-row gap-6 group hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
              <Files size={28} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{template.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded shrink-0">
                  {template.format}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                {template.desc}
              </p>
              
              <div className="flex items-center">
                <Link href={`/student/projects/new?template=${template.id}`} className="w-full">
                  <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] h-10 transition-all">
                    Use Template
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
