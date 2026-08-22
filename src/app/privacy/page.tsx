"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Calendar, MapPin } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <nav className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-sm text-slate-800 tracking-wide">LEGAL & PRIVACY</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Privacy Policy</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="w-4 h-4 text-blue-500" />
              Effective Date: August 1, 2026
            </div>
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-blue-500" />
              Jurisdiction: Global
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-slate-600">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-6 leading-relaxed">
              We collect information you provide directly to us when you create an account, submit an SDG project, or communicate with us. This includes your name, institutional email address, academic credentials, and any documents uploaded for the purpose of the Zero-Mock Data Policy enforcement and Plagiarism checks.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-6 leading-relaxed">
              We use the information we collect to operate, maintain, and provide the features of the Novelleyx platform. Specifically, data is used to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Process your academic and project submissions for SDG alignment scoring.</li>
              <li>Authenticate your identity against institutional SSO providers (e.g., Azure AD).</li>
              <li>Provide analytics to faculty and administrators regarding campus-wide sustainability efforts.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Data Security & Storage</h2>
            <p className="mb-6 leading-relaxed">
              Security is our highest priority. All data is encrypted at rest using AES-256 encryption. Our databases strictly enforce the live-data mandate, and we utilize secure, multi-region failover clusters to ensure data sovereignty and GDPR compliance.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mt-8">
              <h4 className="font-bold text-blue-900 mb-2">Zero-Mock Data Policy Implications</h4>
              <p className="text-blue-800 text-sm m-0">
                Because we do not use mock data, any data you submit is treated as live production data and is immediately subjected to our automated compliance and indexing protocols. Do not submit sensitive PII (Personally Identifiable Information) unless strictly required by your institution.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
