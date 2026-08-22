"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Shield, Lock, Eye, Server, Key, AlertTriangle } from "lucide-react"
import { BackButton } from "@/components/BackButton"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-12 pb-24 text-white relative">
      <div className="absolute top-8 left-8 z-20">
        <BackButton className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white" />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">ENTERPRISE SECURITY</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Real-Time Protection for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Institutional Data</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            We employ bank-grade security protocols, continuous monitoring, and automated threat detection to ensure your academic and research data remains uncompromised.
          </motion.p>
        </div>

        {/* Real-time Status Dashboard Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-3xl p-8 mb-20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500"></div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Security Status</h2>
              <p className="text-slate-400 text-sm">System integrity checks running globally.</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-mono font-bold tracking-wider">ALL SYSTEMS SECURE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Threats Blocked (24h)</div>
              <div className="text-3xl font-bold font-mono text-white">14,298</div>
              <div className="text-emerald-400 text-xs mt-2 flex items-center gap-1">↓ 12% from yesterday</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Encryption Standard</div>
              <div className="text-3xl font-bold font-mono text-white">AES-256</div>
              <div className="text-slate-500 text-xs mt-2">End-to-End applied</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Active Firewalls</div>
              <div className="text-3xl font-bold font-mono text-white">128</div>
              <div className="text-emerald-400 text-xs mt-2 flex items-center gap-1">Global edge network</div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-2">Uptime (30d)</div>
              <div className="text-3xl font-bold font-mono text-white">99.99%</div>
              <div className="text-slate-500 text-xs mt-2">Enterprise SLA</div>
            </div>
          </div>
        </motion.div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Lock className="w-8 h-8" />, title: "Zero-Trust Architecture", desc: "Every access request is rigorously authenticated and authorized, regardless of origin." },
            { icon: <Eye className="w-8 h-8" />, title: "Continuous Monitoring", desc: "24/7 AI-driven behavioral analysis detects and isolates anomalies instantly." },
            { icon: <Server className="w-8 h-8" />, title: "Data Sovereignty", desc: "Choose your data residency. Fully compliant with GDPR, CCPA, and regional education data laws." },
            { icon: <Key className="w-8 h-8" />, title: "SSO & MFA", desc: "Seamlessly integrate with your existing Identity Providers (Okta, Azure AD, Shibboleth)." },
            { icon: <Shield className="w-8 h-8" />, title: "Regular Pen-Testing", desc: "Quarterly audits and penetration testing by independent CREST-certified security firms." },
            { icon: <AlertTriangle className="w-8 h-8" />, title: "Automated Backups", desc: "Encrypted, geo-redundant backups ensure your data is safe from ransomware or disasters." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300 border border-slate-700">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
