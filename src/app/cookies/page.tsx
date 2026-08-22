"use client";

import React from "react";
import { motion } from "motion/react";
import { Cookie, Calendar, Info } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <nav className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
          <Cookie className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-sm text-slate-800 tracking-wide">COOKIE POLICY</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-slate-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Cookie Policy</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="w-4 h-4 text-amber-500" />
              Effective Date: August 1, 2026
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Info className="w-4 h-4 text-amber-500" />
              GDPR Compliant
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-slate-600">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What Are Cookies?</h2>
            <p className="mb-6 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Cookies</h2>
            <p className="mb-6 leading-relaxed">
              The Novelleyx platform uses cookies for several vital functions:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the operation of our platform. They include, for example, cookies that enable you to log into secure institutional areas of our website.</li>
              <li><strong>Analytical/Performance Cookies:</strong> These allow us to recognize and count the number of visitors and see how visitors move around our platform.</li>
              <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website, allowing us to personalize content and remember preferences (e.g., your dashboard layout).</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Managing Your Cookies</h2>
            <p className="mb-6 leading-relaxed">
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website—specifically authenticated faculty and admin dashboards—may be severely restricted.
            </p>
            
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mt-8">
              <h4 className="font-bold text-amber-900 mb-2">Third-Party Tracking</h4>
              <p className="text-amber-800 text-sm m-0">
                Novelleyx strictly prohibits third-party advertising trackers on our platform. The only external cookies used are related to secure institutional SSO providers (such as Microsoft Azure or Okta) required for authentication.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
