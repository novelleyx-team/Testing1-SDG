"use client";

import React from "react";
import { motion } from "motion/react";
import { Scale, Calendar, MapPin } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <nav className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
          <Scale className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-sm text-slate-800 tracking-wide">LEGAL TERMS</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Terms of Service</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="w-4 h-4 text-rose-500" />
              Effective Date: August 1, 2026
            </div>
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-rose-500" />
              Jurisdiction: Global
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-slate-600">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 leading-relaxed">
              By accessing and using the Novelleyx SDG Platform, you accept and agree to be bound by the terms and provisions of this agreement. Furthermore, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Zero-Mock Data Policy & Plagiarism</h2>
            <p className="mb-6 leading-relaxed">
              Users are strictly bound by the platform's Zero-Mock Data Policy. Uploading dummy files, placeholder texts, or test resources into the production environment is a violation of these terms. Additionally, all submissions are scanned for plagiarism. Any work found to violate intellectual property rights will be immediately flagged and reported to your associated institution.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You must maintain the confidentiality of your institutional login credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You agree not to attempt to circumvent any security features or API rate limits.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="mb-6 leading-relaxed">
              The Novelleyx platform, including its original content, features, AI scoring algorithms, and functionality, are owned by Novelleyx Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Termination</h2>
            <p className="mb-6 leading-relaxed">
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
