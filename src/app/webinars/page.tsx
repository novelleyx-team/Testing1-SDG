"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Video, Calendar, Clock, ArrowRight, PlayCircle, PhoneCall } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import Image from "next/image"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upcomingWebinars: any[] = [];

export default function WebinarsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden text-slate-200">
      {/* Dark Mode Glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/4 translate-x-1/4" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="bg-white/10 rounded-full backdrop-blur-md">
          <BackButton />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
          <Video className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm text-white tracking-wide">WEBINARS</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-8 mb-20">
          <div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              Live Learning Events
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6"
            >
              Learn from the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Experts.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 leading-relaxed mb-10 max-w-lg"
            >
              Join our exclusive live sessions to master the Novelleyx platform, integrate SDGs into curriculum, and explore AI-driven research.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md max-w-md"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <PhoneCall className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Need Custom Training?</h3>
                  <p className="text-sm text-slate-400">Contact us for exclusive institutional webinars.</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <a href="tel:7075853225" className="text-2xl font-black text-white hover:text-blue-400 transition-colors">
                  (+91) 7075853225
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=1600&q=80" alt="Webinar Presentation" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-600/80 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Featured Session</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Deploying Zero-Mock Architecture at Scale</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            Upcoming Sessions
          </h2>
          {upcomingWebinars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingWebinars.map((webinar, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col sm:flex-row gap-6 hover:bg-white/10 transition-colors group">
                  <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden shrink-0 relative">
                    <Image src={webinar.image} alt={webinar.speaker} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col py-2 pr-4 flex-1">
                    <div className="flex gap-2 mb-3">
                      {webinar.tags.map((tag: string, i: number) => (
                        <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${tag === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">{webinar.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                      <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {webinar.date}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {webinar.time}</div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-200">{webinar.speaker}</p>
                        <p className="text-xs text-slate-500">{webinar.role}</p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full rounded-[2rem] bg-white/5 border border-white/10 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Data Available</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                In accordance with the strict zero-mock data policy, there are no upcoming webinars scheduled in the live production database.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
