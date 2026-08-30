"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Clock, Calendar, ThumbsUp, ThumbsDown, Share2, AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Generate unique-looking data based on the slug
function getArticleData(title: string) {
  const isSecurity = title.toLowerCase().includes("security") || title.toLowerCase().includes("policy") || title.toLowerCase().includes("auth");
  const isApi = title.toLowerCase().includes("api") || title.toLowerCase().includes("webhook") || title.toLowerCase().includes("integration");
  const isProject = title.toLowerCase().includes("project") || title.toLowerCase().includes("scoring") || title.toLowerCase().includes("report");

  let introText = `This extensive guide covers everything you need to know about ${title}. By following the instructions below, you will optimize your workflow within the Novelleyx platform.`;
  let tipText = "Always ensure you save your progress before navigating away from this section.";
  
  if (isSecurity) {
    introText = `Security is paramount at Novelleyx. This document outlines the protocols and configurations regarding ${title} to ensure maximum compliance and safety for your institutional data.`;
    tipText = "Security policies take effect immediately upon saving. Ensure no active sessions are disrupted unintentionally.";
  } else if (isApi) {
    introText = `For developers and system administrators, understanding ${title} is critical for robust integrations. This guide provides technical specifications, payload formats, and edge-case handling.`;
    tipText = "Test all API interactions in your staging environment before deploying to production.";
  } else if (isProject) {
    introText = `Managing the lifecycle of your initiatives is easy with Novelleyx. This article explores ${title} to help you maximize your SDG alignment and streamline faculty reviews.`;
    tipText = "Utilize the drafting mode to refine your submissions over multiple sessions.";
  }

  const steps = [
    `Navigate to the relevant module associated with ${title}.`,
    `Review the active configurations and ensure they align with your current requirements.`,
    `Apply the necessary parameters. If you are modifying global variables, check the preview panel.`,
    `Submit your changes. The system will process this via the edge network within 400ms.`
  ];

  return { introText, tipText, steps, isSecurity, isApi };
}

export default function DocArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const title = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const data = getArticleData(title);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/docs" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <BookOpen className="w-4 h-4" />
              <span>Docs</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 truncate max-w-[200px]">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-6">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">NX</div>
              <span className="font-semibold text-slate-700">Novelleyx Team</span>
            </div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>Updated recently</span></div>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>5 min read</span></div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
              {data.introText}
            </p>

            <div className={`border rounded-2xl p-6 mb-8 flex items-start gap-4 ${data.isSecurity ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
              <div className="shrink-0">
                {data.isSecurity ? <AlertTriangle className="w-6 h-6 text-amber-600" /> : <Lightbulb className="w-6 h-6 text-blue-600" />}
              </div>
              <div>
                <h4 className={`font-bold m-0 mb-1 ${data.isSecurity ? 'text-amber-900' : 'text-blue-900'}`}>Important Notice</h4>
                <p className={`text-sm m-0 leading-relaxed ${data.isSecurity ? 'text-amber-800' : 'text-blue-800'}`}>
                  {data.tipText}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Core Concepts</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              To fully utilize <strong>{title}</strong>, it&apos;s critical to understand how the platform processes the underlying data. 
              {data.isApi ? " Ensure your headers contain the correct Bearer tokens and you are pointing to the v2 endpoints." : " Our infrastructure is built on a real-time event-driven architecture, ensuring that every action you take is immediately reflected across all authorized dashboards."}
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Implementation Steps</h3>
            <div className="space-y-4 mb-8">
              {data.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 m-0 pt-1">{step}</p>
                </div>
              ))}
            </div>

            {data.isApi && (
              <div className="my-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Example Payload</h4>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-emerald-400 text-sm m-0 font-mono">
{`{
  "event": "${slug}",
  "timestamp": "${new Date().toISOString()}",
  "status": "success",
  "metadata": {
    "version": "2.0.4",
    "processed": true
  }
}`}
                  </pre>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Troubleshooting & Best Practices</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              If you encounter unexpected behavior while working with {title}, first verify your network connection and ensure no firewall rules are blocking the connections. For advanced edge cases, consult your institutional IT administrator.
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Was this article helpful?</h3>
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-semibold transition-all">
                <ThumbsUp className="w-5 h-5" /> Yes
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold transition-all">
                <ThumbsDown className="w-5 h-5" /> No
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
