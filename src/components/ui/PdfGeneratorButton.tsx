"use client";

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProjectsStore } from '@/store/projects-store';

interface PdfGeneratorButtonProps {
  reportId: string;
  className?: string;
  text?: string;
}

export function PdfGeneratorButton({ reportId, className = "", text = "Download Official PDF Report" }: PdfGeneratorButtonProps) {
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "completed" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { projects } = useProjectsStore();

  const handleGenerate = async () => {
    try {
      setStatus("processing");
      
      const project = projects.find(p => p.id === reportId) || {
        title: "Unknown Project",
        studentName: "Unknown Student",
        studentId: reportId,
        studentDepartment: "Unknown Department",
        abstract: "No abstract available.",
        aiScore: "85",
        targetSdg: "SDG 9"
      };

      // Fetch the generated PDF directly from the Next.js API
      const res = await fetch(`/api/pdf/generate?projectId=${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      // Download the PDF blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from Content-Disposition header if available, otherwise fallback
      const disposition = res.headers.get('content-disposition');
      let filename = `Report_${reportId}.pdf`;
      if (disposition && disposition.indexOf('filename=') !== -1) {
          const matches = /filename="([^"]*)"/.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1];
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setStatus("completed");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      const e = err as Error;
      console.error(e);
      setStatus("error");
      setErrorMsg(e.message || "An error occurred");
    }
  };

  if (status === "queued" || status === "processing") {
    return (
      <button disabled className={`flex items-center justify-center gap-2 opacity-80 cursor-wait ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin" /> 
        {status === "queued" ? "Queued for Generation..." : "Analyzing with AI & Rendering PDF..."}
      </button>
    );
  }

  if (status === "completed") {
    return (
      <button disabled className={`flex items-center justify-center gap-2 bg-green-600 text-white ${className}`}>
        <CheckCircle2 className="w-5 h-5" /> Download Complete
      </button>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-1 w-full">
        <button onClick={handleGenerate} className={`flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white ${className}`}>
          <AlertCircle className="w-5 h-5" /> Retry PDF Generation
        </button>
        <span className="text-xs text-red-500">{errorMsg}</span>
      </div>
    );
  }

  return (
    <button onClick={handleGenerate} className={`flex items-center justify-center gap-2 ${className}`}>
      <Download className="w-5 h-5" /> {text}
    </button>
  );
}
