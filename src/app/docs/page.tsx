"use client"

import * as React from "react"
import { motion } from "motion/react"
import { BookOpen, Search, FileText, ChevronRight, Server, Shield, Zap } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import Link from "next/link"

const docSections = [
  {
    title: "Getting Started",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-100",
    articles: [
      { title: "Introduction to Novelleyx", desc: "Learn about our core mission and platform capabilities." },
      { title: "Setting up your first workspace", desc: "A step-by-step guide to configuring your dashboard." },
      { title: "Inviting team members", desc: "How to manage roles and invite collaborators via email." },
      { title: "Understanding the Dashboard", desc: "Navigating analytics, charts, and activity feeds." },
      { title: "Customizing your profile", desc: "Uploading avatars and setting personal preferences." },
      { title: "Notification Settings", desc: "Configuring SMS and email alert thresholds." },
      { title: "Platform Terminology", desc: "A glossary of SDG and system-specific terms." },
      { title: "Migrating legacy data", desc: "Importing historical projects via CSV/JSON." },
      { title: "System Requirements", desc: "Supported browsers and network configurations." },
      { title: "Quickstart for Students", desc: "The fastest way to submit your first project." },
      { title: "Quickstart for Faculty", desc: "Reviewing and grading your first batch of assignments." },
      { title: "Troubleshooting Login Issues", desc: "Resetting passwords and unlocking frozen accounts." }
    ]
  },
  {
    title: "Project Management",
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-100",
    articles: [
      { title: "Creating new SDG Projects", desc: "Using dynamic templates to submit new initiatives." },
      { title: "Using the AI scoring engine", desc: "How semantic matching calculates your SDG score." },
      { title: "Submitting proposals for review", desc: "The faculty approval and feedback lifecycle." },
      { title: "Exporting GRI reports", desc: "Generating official PDF documents for compliance." },
      { title: "Managing Project Statuses", desc: "Tracking 'Pending', 'Approved', and 'Rejected' states." },
      { title: "Attaching supporting files", desc: "Guidelines for CAD drawings, datasets, and images." },
      { title: "Commenting & Collaboration", desc: "In-line feedback between faculty and students." },
      { title: "Archiving past projects", desc: "Removing old projects from your active dashboard." },
      { title: "Revision History Tracking", desc: "Viewing previous iterations of a submitted document." },
      { title: "Batch Actions", desc: "Approving or rejecting multiple projects simultaneously." },
      { title: "Understanding Radar Charts", desc: "Analyzing multi-dimensional SDG impacts visually." },
      { title: "Drafting Mode", desc: "Saving work in progress before finalizing submission." }
    ]
  },
  {
    title: "Security & Privacy",
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-100",
    articles: [
      { title: "Role-Based Access Control (RBAC)", desc: "Understanding Student, Faculty, HOD, and Admin scopes." },
      { title: "Zero-Mock Data Policy", desc: "Strict enforcement of real-time production data limits." },
      { title: "Data encryption standards", desc: "AES-256 at rest and TLS 1.3 in transit." },
      { title: "Audit logs and compliance", desc: "Tracking user logins and document modifications." },
      { title: "Plagiarism Enforcement", desc: "Our 3-phase automated integrity system." },
      { title: "Managing SSO Integrations", desc: "Configuring Shibboleth or Active Directory." },
      { title: "Two-Factor Authentication", desc: "Enforcing MFA across institutional accounts." },
      { title: "Data Retention Policies", desc: "How long we store user data and backup procedures." },
      { title: "Incident Response Plan", desc: "Steps taken during suspected security breaches." },
      { title: "GDPR Compliance", desc: "Managing user data deletion and export requests." },
      { title: "IP Whitelisting", desc: "Restricting access to campus networks only." },
      { title: "Session Timeouts", desc: "Configuring automatic logout durations for idle users." }
    ]
  },
  {
    title: "API & Integrations",
    icon: <Server className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-100",
    articles: [
      { title: "REST API Quickstart", desc: "Generating API keys and making your first request." },
      { title: "Webhooks configuration", desc: "Subscribing to real-time project lifecycle events." },
      { title: "Supabase real-time syncing", desc: "Connecting custom clients to our WebSocket channels." },
      { title: "Authentication Flow (OAuth)", desc: "Implementing secure token exchange." },
      { title: "Rate Limits & Quotas", desc: "Understanding API limits for your tier." },
      { title: "Handling Webhook Payloads", desc: "Verifying signatures and parsing JSON." },
      { title: "SDK Documentation (Python/Node)", desc: "Using our official client libraries." },
      { title: "Error Codes Dictionary", desc: "Troubleshooting 4xx and 5xx API responses." },
      { title: "GraphQL Layer", desc: "Writing complex queries against our graph endpoint." },
      { title: "LMS Integrations", desc: "Connecting Novelleyx to Canvas, Moodle, and Blackboard." },
      { title: "Custom BI Tooling", desc: "Piping data into Tableau and PowerBI via connectors." },
      { title: "API Deprecation Policy", desc: "How we handle versioning and breaking changes." }
    ]
  }
]

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl text-slate-800">Docs</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Search our comprehensive documentation to learn everything about the platform, from basic setup to advanced API integrations.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-300"></div>
            <div className="relative bg-white border border-slate-200 rounded-full flex items-center px-6 py-4 shadow-sm">
              <Search className="w-6 h-6 text-slate-400 mr-4" />
              <input 
                type="text" 
                placeholder="Search for guides, API references, or settings..." 
                className="w-full bg-transparent border-none outline-none text-slate-800 text-lg placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {docSections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow group flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl ${section.color}`}>
                  {section.icon}
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{section.title}</h2>
              </div>
              
              <ul className="space-y-6 flex-1">
                {section.articles.map((article, i) => (
                  <li key={i}>
                    <Link href={`/docs/${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="flex items-start justify-between group/link">
                      <div>
                        <h4 className="text-slate-800 font-bold mb-1 group-hover/link:text-blue-600 transition-colors">{article.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{article.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:text-blue-600 transition-all shrink-0 mt-1" />
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link href={`/docs/${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2">
                  Browse {section.articles.length} extensive guides <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
