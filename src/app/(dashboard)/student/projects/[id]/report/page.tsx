"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProjectsStore } from "@/store/projects-store";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const allSDGs = [
  { id: 1, name: "SDG 1: No Poverty" },
  { id: 2, name: "SDG 2: Zero Hunger" },
  { id: 3, name: "SDG 3: Health & Well-being" },
  { id: 4, name: "SDG 4: Quality Education" },
  { id: 5, name: "SDG 5: Gender Equality" },
  { id: 6, name: "SDG 6: Clean Water" },
  { id: 7, name: "SDG 7: Clean Energy" },
  { id: 8, name: "SDG 8: Decent Work" },
  { id: 9, name: "SDG 9: Industry & Innovation" },
  { id: 10, name: "SDG 10: Reduced Inequalities" },
  { id: 11, name: "SDG 11: Sustainable Cities" },
  { id: 12, name: "SDG 12: Responsible Consumption" },
  { id: 13, name: "SDG 13: Climate Action" },
  { id: 14, name: "SDG 14: Life Below Water" },
  { id: 15, name: "SDG 15: Life on Land" },
  { id: 16, name: "SDG 16: Peace & Justice" },
  { id: 17, name: "SDG 17: Partnerships" },
];

// Helper to generate a realistic mock score
const generateMockScores = (targetSdgNumber: number) => {
  return allSDGs.map((sdg) => {
    // The target SDG gets a high score
    if (sdg.id === targetSdgNumber) {
      return { ...sdg, score: Math.floor(Math.random() * 15) + 85 }; // 85-100
    }
    // Related SDGs get moderate scores, others get low scores
    return { ...sdg, score: Math.floor(Math.random() * 40) + 10 }; // 10-50
  });
};

export default function ReportPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const projects = useProjectsStore((state) => state.projects);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400">The project you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const targetSdgNumber = parseInt(project.targetSdg.replace(/[^0-9]/g, '')) || 1;
  const scoresData = generateMockScores(targetSdgNumber);
  const matchingData = scoresData.filter(d => d.score >= 40);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      
      {/* --- Screen Only Navigation & Toolbar --- */}
      <div className="max-w-5xl mx-auto pt-8 px-4 print:hidden flex justify-between items-center mb-8">
        <Link href="/student/projects">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Projects
          </Button>
        </Link>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-bold px-6">
          <Printer size={18} /> Print / Save as PDF
        </Button>
      </div>
      {/* -------------------------------------- */}

      {/* --- A4 Report Container --- */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-[20mm] shadow-2xl print:shadow-none print:m-0 print:p-0 print:w-auto overflow-hidden text-[11pt] leading-[1.4] font-serif border border-gray-200">
        
        {/* 1. Letterhead Placeholder */}
        <div className="w-full h-32 border-b-2 border-gray-200 flex items-center justify-center bg-gray-50 mb-8 relative">
          {/* USER: Replace the image below with your actual letterhead */}
          <span className="text-gray-400 font-sans tracking-widest text-xl uppercase absolute z-0">
            [ LETTERHEAD PLACEHOLDER ]
          </span>
          {/* <img src="/your-letterhead.png" alt="Letterhead" className="w-full h-full object-contain z-10" /> */}
        </div>

        {/* 2. Document Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-sans tracking-tight text-gray-900 uppercase">AI-Evaluated SDG Impact Report</h1>
          <p className="text-gray-500 mt-2 font-sans text-sm">Generated securely via AI Assessment Engine</p>
        </div>

        {/* 3. Project Details */}
        <div className="mb-10 grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="font-bold text-gray-400 font-sans text-xs uppercase mb-1">Project Title</p>
            <p className="font-bold text-lg">{project.title}</p>
          </div>
          <div>
            <p className="font-bold text-gray-400 font-sans text-xs uppercase mb-1">Project ID</p>
            <p className="font-mono">{project.id}</p>
          </div>
          <div>
            <p className="font-bold text-gray-400 font-sans text-xs uppercase mb-1">Author Details</p>
            <p className="font-semibold">{project.studentName}</p>
            <p className="text-sm text-gray-600">{project.studentDepartment}</p>
          </div>
          <div>
            <p className="font-bold text-gray-400 font-sans text-xs uppercase mb-1">Evaluation Date</p>
            <p className="font-semibold">{project.date}</p>
            <p className="font-bold text-blue-600 mt-2">Primary Target: {project.targetSdg}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-2 font-sans">Abstract</p>
          <p className="text-gray-700 italic">&ldquo;{project.abstract}&rdquo;</p>
        </div>

        {/* 4. Radar Maps */}
        <div className="mb-12 font-sans break-inside-avoid">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-6 text-gray-900">1. Impact Analysis Radars</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Chart 1: All SDGs */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h3 className="font-bold text-sm text-gray-600 mb-2 uppercase">Global 17 SDG Coverage</h3>
              <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scoresData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="id" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Matching SDGs */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h3 className="font-bold text-sm text-gray-600 mb-2 uppercase">Primary Alignment (Score &gt; 40)</h3>
              <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={matchingData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 17 SDG Marking Grid */}
        <div className="mb-12 break-inside-avoid">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 font-sans text-gray-900">2. Comprehensive SDG Scores</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {scoresData.map((sdg) => (
              <div key={sdg.id} className="flex items-center justify-between border-b border-gray-100 py-1">
                <span className={sdg.score >= 50 ? "font-bold text-blue-700" : "text-gray-600"}>{sdg.name}</span>
                <span className={`font-mono font-bold ${sdg.score >= 80 ? 'text-green-600' : sdg.score >= 40 ? 'text-blue-600' : 'text-gray-400'}`}>
                  {sdg.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Summary & Notes */}
        <div className="mb-16 break-inside-avoid">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 font-sans text-gray-900">3. AI Evaluation Summary</h2>
          <p className="mb-4 text-justify">
            The submitted project heavily targets <strong>{project.targetSdg}</strong>, scoring a strong primary alignment metric. Secondary impacts were recorded across related dimensions, demonstrating a multi-faceted approach to sustainable development. The proposed solutions show significant promise if implemented effectively with adequate resource allocation.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <h4 className="font-bold text-yellow-800 font-sans mb-1 text-sm">Faculty / Reviewer Notes</h4>
            <p className="text-yellow-900 italic text-sm">
              &ldquo;Innovative approach. Consider elaborating on the long-term maintenance requirements to ensure true sustainability and exploring deeper partnerships as outlined in SDG 17.&rdquo;
            </p>
          </div>
        </div>

        {/* 7. Approval Block */}
        <div className="mt-16 pt-8 border-t-2 border-gray-800 break-inside-avoid font-sans">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-bold text-gray-800 text-lg">AI Evaluator Engine</p>
              <p className="text-gray-500 text-sm mt-1">Verified Digital Signature: <span className="font-mono">SYS-{Math.floor(Math.random()*90000)+10000}</span></p>
              <p className="text-gray-500 text-sm">Timestamp: {new Date().toLocaleString()}</p>
            </div>
            
            <div className="w-64 text-center">
              <div className="border-b border-black h-12 mb-2"></div>
              <p className="font-bold text-gray-800 uppercase text-sm">Faculty / Committee Approval</p>
              <p className="text-gray-500 text-xs mt-1">Sign and Date</p>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}
