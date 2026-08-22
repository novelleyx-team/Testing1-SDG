"use client"

import * as React from "react"
import { motion } from "motion/react"
import { BarChart3, Target, Zap, ShieldCheck, Database, Globe2, Layout, Users } from "lucide-react"
import { BackButton } from "@/components/BackButton"

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-[#2563EB]" />,
    title: "Advanced Analytics",
    description: "Real-time dashboards providing deep insights into institutional SDG performance with predictive modeling."
  },
  {
    icon: <Target className="w-8 h-8 text-[#2563EB]" />,
    title: "Goal Tracking",
    description: "Automated tracking against 17 UN SDGs with granular KPIs tailored for educational environments."
  },
  {
    icon: <Zap className="w-8 h-8 text-[#2563EB]" />,
    title: "AI-Powered Automation",
    description: "Reduce manual data entry by 80% using our proprietary AI data extraction and classification engine."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#2563EB]" />,
    title: "Enterprise Security",
    description: "End-to-end encryption with role-based access control ensuring your institutional data remains private."
  },
  {
    icon: <Database className="w-8 h-8 text-[#2563EB]" />,
    title: "Centralized Data Hub",
    description: "A single source of truth for all research, publications, and academic activities across departments."
  },
  {
    icon: <Globe2 className="w-8 h-8 text-[#2563EB]" />,
    title: "Global Benchmarking",
    description: "Compare your institution's impact against global peers using anonymized aggregated data."
  },
  {
    icon: <Layout className="w-8 h-8 text-[#2563EB]" />,
    title: "Customizable Workflows",
    description: "Adapt the platform to your specific institutional processes without needing engineering support."
  },
  {
    icon: <Users className="w-8 h-8 text-[#2563EB]" />,
    title: "Stakeholder Engagement",
    description: "Tools to transparently report progress to students, alumni, and funding bodies."
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white pt-12 pb-24 relative">
      <div className="absolute top-8 left-8 z-10">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-blue-50 text-[#2563EB] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6"
          >
            PLATFORM FEATURES
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Everything you need to <span className="text-[#2563EB] relative whitespace-nowrap">
              drive impact
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Discover the powerful tools included in the Novelleyx dashboard designed specifically for academic institutions aiming for global excellence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-gray-100 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
