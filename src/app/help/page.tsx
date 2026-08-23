"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LifeBuoy, Search, MessageCircle, PhoneCall, Mail, ChevronDown, Play, ExternalLink } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import Image from "next/image";

const faqs = [
  {
    question: "How do I reset my institutional password?",
    answer: "Your institutional password is managed by your university's IT department via SSO (Single Sign-On). Please visit your campus portal to reset your credentials. If you are using a local account, click the 'Forgot Password' link on the login screen."
  },
  {
    question: "Why was my project flagged by the AI engine?",
    answer: "The AI engine flags projects based on semantic similarity to existing global SDG targets or previously submitted works to enforce our Zero-Mock Data Policy and Plagiarism rules. Check your detailed PDF report to see the exact matched sources."
  },
  {
    question: "How long does faculty approval usually take?",
    answer: "Approval times vary by department, but the system SLA mandates faculty to review within 72 hours of submission. You will receive an automated SMS and email once the status changes."
  },
  {
    question: "Can I export my dashboard data to Excel?",
    answer: "Yes. Navigate to the Analytics tab and click the 'Download CSV' button in the top right corner of any chart card to export the underlying dataset."
  }
];

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
          <LifeBuoy className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-sm text-slate-800 tracking-wide">HELP CENTER</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* Header Hero */}
        <div className="text-center mb-16 pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            We&apos;re here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">help.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Get support, read FAQs, and watch embedded video walkthroughs to resolve any issues you encounter on the platform.
          </motion.p>
          
          {/* Interactive Search */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full group-hover:bg-rose-500/30 transition-all duration-300"></div>
            <div className="relative bg-white border border-slate-200 rounded-full flex items-center px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.1)] transition-shadow">
              <Search className="w-6 h-6 text-slate-400 mr-4 group-focus-within:text-rose-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Describe your issue (e.g. 'Cannot submit project')" 
                className="w-full bg-transparent border-none outline-none text-slate-800 text-lg placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Contact Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer text-center">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-500 text-sm mb-4">Chat with our support engineers directly from your dashboard.</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Start Chat &rarr;</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-rose-50 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                <PhoneCall className="w-8 h-8 text-rose-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">Call Us</h3>
              <p className="text-slate-500 group-hover:text-rose-100 text-sm mb-4 transition-colors">For urgent issues and institutional support.</p>
              <span className="text-rose-600 group-hover:text-white font-black text-lg transition-colors">(+91) 7075853225</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-500 text-sm mb-4">Create a ticket via email. Expected response time: 2 hours.</p>
            <span className="text-emerald-600 font-semibold group-hover:underline">novelleyx@gmail.com</span>
          </motion.div>
        </div>

        {/* Embedded Interactive Data / Video Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Video Support</h2>
              <p className="text-slate-500">Embedded diagnostic tools and visual walkthroughs</p>
            </div>
            <button className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">View Library <ExternalLink className="w-4 h-4" /></button>
          </div>
          
          <div className="bg-slate-900 rounded-[2rem] p-2 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="aspect-[21/9] relative rounded-[1.5rem] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80" alt="Support Diagnostic Tool" fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all group/play shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <Play className="w-8 h-8 text-white group-hover/play:text-slate-900 ml-1 transition-colors" />
                </button>
              </div>
              <div className="absolute bottom-6 left-8">
                <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full mb-3 inline-block">SYSTEM DIAGNOSTICS</span>
                <h3 className="text-2xl font-bold text-white drop-shadow-md">How to resolve &quot;Network Disconnected&quot; Error Code 503</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Accordion FAQs */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-rose-300 shadow-[0_8px_30px_rgba(244,63,94,0.1)]' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-800 pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-rose-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
