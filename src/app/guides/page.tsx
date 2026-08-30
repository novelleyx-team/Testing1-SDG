"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Compass, CheckCircle2, Play, LayoutTemplate, FileSearch, Send, Sparkles } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import Image from "next/image"

const steps = [
  {
    title: "1. Select a Template Structure",
    desc: "Start by choosing the right template for your project (e.g. Minor Project, Research Report). The dynamic form will automatically adapt its fields to ensure you provide the exact metadata the AI engine needs.",
    icon: <LayoutTemplate className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-100"
  },
  {
    title: "2. Input Academic & Project Data",
    desc: "Fill in your roll number, department, and faculty ID. Describe your initiative clearly. Note: Zero-mock policy is enforced, so ensure your data is real and accurate.",
    icon: <FileSearch className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-100"
  },
  {
    title: "3. AI Plagiarism & Analysis",
    desc: "Submit your project to the edge network. Our system executes a 5-phase ingestion and semantic matching process against global SDG targets, checking for plagiarism and integrity.",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-100"
  },
  {
    title: "4. Faculty Notification & Review",
    desc: "Once analyzed, an automated Enterprise SMS and pre-data email are dispatched to your assigned faculty member. You can then download your Official PDF Report with your AI Score.",
    icon: <Send className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-100"
  }
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-xl text-slate-800">Guides & Tutorials</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            How to use Novelleyx <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Perfectly.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            A step-by-step masterclass on navigating the platform, submitting projects, and leveraging the AI engine to maximize your SDG impact.
          </motion.p>
        </div>

        {/* Video Player Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20 relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[16/9] relative bg-slate-900">
            <Image 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80" 
              alt="Dashboard Tutorial" 
              width={1600}
              height={900}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-white/30 transition-all border border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <Play className="w-10 h-10 text-white ml-2" />
              </div>
            </div>
            {/* Custom Video Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4">
              <div className="w-full flex items-center gap-4">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-500"></div>
                </div>
                <span className="text-white text-xs font-semibold font-mono">03:42 / 10:15</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step by step Guide */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">The Perfect Submission Workflow</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-transparent">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border-4 border-slate-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.color}`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completion Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white shadow-[0_20px_60px_rgba(37,99,235,0.2)]"
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
          <p className="text-blue-100 mb-6">You now know the perfect way to utilize the system.</p>
          <a href="/student/projects/new" className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-slate-50 transition-colors">
            Create Your First Project
          </a>
        </motion.div>
      </main>
    </div>
  )
}
