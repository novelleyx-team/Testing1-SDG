"use client"

import Link from "next/link"
import { Globe2, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#2563EB] flex items-center justify-center">
              <Globe2 className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">NOVELLEYX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
            <Link href="/about" className="text-[#2563EB] font-bold">About Us</Link>
            <Link href="/contact" className="hover:text-[#2563EB] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-flex rounded-full text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">Our Mission</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
          At Novelleyx, our mission is to empower academic institutions worldwide to track, measure, and scale their contributions to the United Nations Sustainable Development Goals (SDGs) through the power of Artificial Intelligence.
        </p>
      </section>

      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Bridging the Gap Between Academia and Global Impact</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              For decades, groundbreaking research and student projects have remained siloed within university walls. We built Novelleyx to ensure that every academic endeavor is analyzed, categorized, and mobilized towards solving the world&apos;s most pressing challenges.
            </p>
            <ul className="space-y-3 text-gray-700 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div> Fully Automated SDG Classification
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div> Hierarchical Institutional Management
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div> Data-Driven Insights and Reporting
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Globe2 className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-600">
              A world where every university, faculty member, and student acts as a catalyst for sustainable development, equipped with the tools to measure their true impact.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Ready to make an impact?</h2>
        <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-12 text-base font-medium transition-colors">
          Join the Platform <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
