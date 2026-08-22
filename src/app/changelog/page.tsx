"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Sparkles, Bug, Wrench, ArrowUpCircle } from "lucide-react"
import { BackButton } from "@/components/BackButton"

const updates = [
  {
    version: "v2.4.0",
    date: "July 23, 2026",
    title: "AI Predictive Modeling & Multi-Campus Expansion",
    tag: "Major Release",
    tagColor: "bg-blue-100 text-blue-700",
    changes: [
      { type: "feature", icon: <Sparkles className="w-4 h-4 text-emerald-500" />, text: "Introduced advanced AI predictive analytics for SDG trajectory forecasting." },
      { type: "feature", icon: <Sparkles className="w-4 h-4 text-emerald-500" />, text: "Added Multi-Campus Unified Dashboard for 'Institutional Prestige' users." },
      { type: "improvement", icon: <ArrowUpCircle className="w-4 h-4 text-blue-500" />, text: "Enhanced NLP extraction accuracy for research paper abstracts by 24%." },
      { type: "bugfix", icon: <Bug className="w-4 h-4 text-red-500" />, text: "Fixed an issue where PDF exports for the GRI report were occasionally misaligned." }
    ],
    metrics: [
      { label: "NLP Accuracy", value: "+24%", trend: "up" },
      { label: "Processing Speed", value: "1.2s", trend: "up" }
    ]
  },
  {
    version: "v2.3.5",
    date: "June 14, 2026",
    title: "Security Enhancements & SSO Integrations",
    tag: "Update",
    tagColor: "bg-emerald-100 text-emerald-700",
    changes: [
      { type: "feature", icon: <Sparkles className="w-4 h-4 text-emerald-500" />, text: "Native support for Shibboleth and Azure AD SSO integration." },
      { type: "improvement", icon: <ArrowUpCircle className="w-4 h-4 text-blue-500" />, text: "Upgraded all databases to AES-256 encryption at rest." },
      { type: "maintenance", icon: <Wrench className="w-4 h-4 text-gray-500" />, text: "Routine server maintenance and database query optimizations." }
    ],
    metrics: [
      { label: "Query Latency", value: "-45ms", trend: "down" },
      { label: "Security Score", value: "A+", trend: "up" }
    ]
  },
  {
    version: "v2.3.0",
    date: "May 02, 2026",
    title: "Community Outreach Module Overhaul",
    tag: "Minor Release",
    tagColor: "bg-purple-100 text-purple-700",
    changes: [
      { type: "feature", icon: <Sparkles className="w-4 h-4 text-emerald-500" />, text: "Completely redesigned the Community Outreach tracking interface." },
      { type: "feature", icon: <Sparkles className="w-4 h-4 text-emerald-500" />, text: "New volunteer hours logging system with mobile-friendly forms." },
      { type: "bugfix", icon: <Bug className="w-4 h-4 text-red-500" />, text: "Resolved a timezone synchronization bug in event scheduling." }
    ],
    metrics: [
      { label: "Mobile Usage", value: "+300%", trend: "up" },
      { label: "Sync Errors", value: "0%", trend: "down" }
    ]
  }
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 relative">
      <div className="absolute top-8 left-8 z-20">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white shadow-sm border border-gray-100 px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 tracking-wide mb-6"
          >
            WHAT&apos;S NEW
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Changelog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            New updates and improvements to the Novelleyx platform. We are constantly evolving to provide the best SDG management experience.
          </motion.p>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-4 md:ml-0 md:pl-8 space-y-16">
          {updates.map((update, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] md:-left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#2563EB] shadow-sm hidden md:block"></div>
              
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{update.version}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${update.tagColor}`}>
                        {update.tag}
                      </span>
                    </div>
                    <h3 className="text-xl text-gray-700 font-semibold">{update.title}</h3>
                  </div>
                  <div className="text-gray-500 font-medium text-sm bg-gray-50 px-4 py-2 rounded-lg self-start">
                    {update.date}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {update.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <div className="mt-1 bg-gray-50 p-1.5 rounded-md shadow-sm border border-gray-100">
                        {change.icon}
                      </div>
                      <span className="leading-relaxed">{change.text}</span>
                    </li>
                  ))}
                </ul>

                {update.metrics && (
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                    {update.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-gray-900">{metric.value}</span>
                          {metric.trend === 'up' ? (
                            <span className="flex items-center text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                              &uarr;
                            </span>
                          ) : (
                            <span className="flex items-center text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                              &darr;
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
