"use client";

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PdfGeneratorButtonProps {
  reportId: string;
  className?: string;
  text?: string;
}

export function PdfGeneratorButton({ reportId, className = "", text = "Download Official PDF Report" }: PdfGeneratorButtonProps) {
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "completed" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    try {
      setStatus("queued");
      
      // Trigger generation
      const res = await fetch(`http://127.0.0.1:8000/api/reports/${reportId}/pdf`, {
        method: "POST"
      });
      
      if (!res.ok) {
        throw new Error("Failed to start PDF generation");
      }
      
      const { job_id } = await res.json();
      
      // Poll for status
      pollStatus(job_id);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "An error occurred");
    }
  };

  const pollStatus = async (jobId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reports/${reportId}/pdf/status?job_id=${jobId}`);
      if (!res.ok) throw new Error("Status check failed");
      
      const data = await res.json();
      
      if (data.status === "COMPLETED") {
        setStatus("completed");
        // Trigger actual download
        window.open(`http://127.0.0.1:8000/api/reports/${reportId}/pdf/download`, "_blank");
        // Reset after a delay so they can download again if needed
        setTimeout(() => setStatus("idle"), 5000);
      } else if (data.status === "FAILED" || data.status === "ERROR") {
        setStatus("error");
        setErrorMsg(data.error || "Generation failed");
      } else {
        setStatus(data.status.toLowerCase() as any);
        // Continue polling
        setTimeout(() => pollStatus(jobId), 2000);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "queued" || status === "processing") {
    return (
      <button disabled className={`flex items-center justify-center gap-2 opacity-80 cursor-wait ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin" /> 
        {status === "queued" ? "Queued for Generation..." : "Rendering PDF..."}
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
