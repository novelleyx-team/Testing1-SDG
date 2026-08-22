"use client"

import * as React from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { CheckCircle2, Phone, Mail } from "lucide-react"
import { BackButton } from "@/components/BackButton"

const pricingPlans = [
  {
    name: "Enterprise Core",
    price: "₹40,00,000",
    period: "/ year",
    description: "Essential tools for mid-sized institutions to align with SDGs.",
    features: [
      "Access to core SDG modules",
      "Up to 10,000 active users",
      "Standard analytics dashboard",
      "Email support (24/5)",
      "Basic security features",
    ],
    highlighted: false,
    ctaText: "novelleyx@gmail.com",
    ctaLink: "mailto:novelleyx@gmail.com",
    icon: <Mail className="w-5 h-5" />
  },
  {
    name: "Global Leader",
    price: "₹75,00,000",
    period: "/ year",
    description: "Advanced AI capabilities and comprehensive management for large universities.",
    features: [
      "All modules unlocked",
      "Unlimited active users",
      "Advanced AI predictive analytics",
      "Dedicated account manager",
      "Real-time security & compliance",
      "Custom integration API",
    ],
    highlighted: true,
    ctaText: "7075853225",
    ctaLink: "tel:+917075853225",
    icon: <Phone className="w-5 h-5" />
  },
  {
    name: "Institutional Prestige",
    price: "₹1,20,00,000",
    period: "/ year",
    description: "The ultimate platform for multi-campus networks and global research centers.",
    features: [
      "Everything in Global Leader",
      "Multi-campus unified dashboard",
      "White-label branding",
      "On-premise deployment option",
      "24/7 priority phone support",
      "Executive quarterly reviews",
    ],
    highlighted: false,
    ctaText: "novelleyx@gmail.com",
    ctaLink: "mailto:novelleyx@gmail.com",
    icon: <Mail className="w-5 h-5" />
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 relative">
      <div className="absolute top-8 left-8">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Transparent Pricing for <span className="text-[#2563EB]">Global Impact</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Invest in the future of your institution with our scalable, enterprise-grade SDG management solutions. Choose the plan that best fits your scale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative rounded-3xl p-8 bg-white border ${plan.highlighted ? 'border-[#2563EB] shadow-2xl shadow-blue-900/10 scale-105 z-10' : 'border-gray-200 shadow-sm'} flex flex-col`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2563EB] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-2 font-medium">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-[#2563EB]' : 'text-green-500'}`} />
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a href={plan.ctaLink} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${plan.highlighted ? 'bg-[#2563EB] text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                {plan.icon}
                {plan.ctaText}
              </a>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500 font-medium">Looking for a custom solution? <Link href="/contact" className="text-[#2563EB] font-bold hover:underline">Contact our enterprise team</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
