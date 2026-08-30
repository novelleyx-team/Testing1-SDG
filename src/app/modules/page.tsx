"use client"

import * as React from "react"
import { motion } from "motion/react"
import { BookOpen, FlaskConical, GraduationCap, Building2, Leaf, FileText } from "lucide-react"
import { BackButton } from "@/components/BackButton"

const modules = [
  {
    icon: <BookOpen className="w-10 h-10 text-white" />,
    color: "from-blue-500 to-blue-600",
    title: "Academic Curriculum Module",
    description: "Map courses and syllabi directly to relevant SDGs. Track student engagement with sustainability topics across disciplines."
  },
  {
    icon: <FlaskConical className="w-10 h-10 text-white" />,
    color: "from-purple-500 to-purple-600",
    title: "Research & Innovation",
    description: "Catalog research papers, grants, and patents. Automatically analyze abstracts to classify SDG alignment using our NLP engine."
  },
  {
    icon: <Building2 className="w-10 h-10 text-white" />,
    color: "from-emerald-500 to-emerald-600",
    title: "Campus Operations",
    description: "Monitor energy consumption, waste management, and carbon footprint. Set reduction targets and track progress in real-time."
  },
  {
    icon: <Leaf className="w-10 h-10 text-white" />,
    color: "from-green-500 to-green-600",
    title: "Community Outreach",
    description: "Document local partnerships, volunteer hours, and community projects. Measure real-world social impact beyond the campus."
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-white" />,
    color: "from-orange-500 to-orange-600",
    title: "Student Life & Societies",
    description: "Empower student-led initiatives. Track participation in sustainability clubs, events, and awareness campaigns."
  },
  {
    icon: <FileText className="w-10 h-10 text-white" />,
    color: "from-red-500 to-red-600",
    title: "Reporting & Compliance",
    description: "Generate comprehensive sustainability reports compliant with international standards (GRI, STARS, THE Impact Rankings) with one click."
  }
]

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 overflow-hidden relative">
      <div className="absolute top-8 left-8 z-20">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white shadow-sm border border-gray-100 px-6 py-2 rounded-full text-sm font-bold text-gray-600 tracking-wider mb-6"
          >
            COMPREHENSIVE ECOSYSTEM
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Modular Architecture for <br />
            <span className="text-[#2563EB]">Complete Coverage</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Our interconnected modules ensure every aspect of your institution—from the classroom to campus operations—is aligned, measured, and optimized.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-8 shadow-lg transform group-hover:-rotate-6 group-hover:scale-110 transition-all duration-300`}>
                {mod.icon}
              </div>
              
              <h3 className="relative text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#2563EB] transition-colors">{mod.title}</h3>
              <p className="relative text-gray-600 leading-relaxed">
                {mod.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                Explore Module 
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
