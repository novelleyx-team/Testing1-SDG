import * as React from "react"
import { ShieldAlert, Fingerprint, Lock, Shield, Eye, Target } from "lucide-react"
import { BackButton } from "@/components/BackButton"

const guidelines = [
  {
    icon: <Fingerprint className="w-8 h-8 text-amber-500" />,
    title: "1. Universal Plagiarism Rules",
    items: [
      {
        subtitle: "Direct Duplication",
        desc: "Submitting another creator's exact text, code, or design as original work is strictly prohibited."
      },
      {
        subtitle: "Paraphrasing Without Credit",
        desc: "Rewriting source material or slightly modifying technical specifications without proper citation constitutes plagiarism."
      },
      {
        subtitle: "Self-Plagiarism",
        desc: "Reusing previous original work for new project deliverables without disclosing its prior use is not allowed."
      },
      {
        subtitle: "Improper Licensing",
        desc: "Failing to adhere to Open Source, Creative Commons, or proprietary licenses when utilizing third-party assets."
      }
    ]
  },
  {
    icon: <Target className="w-8 h-8 text-blue-500" />,
    title: "2. Domain-Specific Integrity Guidelines",
    items: [
      {
        subtitle: "Engineering and Hardware Design",
        desc: "CAD and 3D Modeling: Downloading external AutoCAD, CATIA, or Autodesk files and presenting them as original geometry is forbidden. Third-party standard parts must be documented. Technical Specs: Borrowing parameters or flowcharts requires formal citations."
      },
      {
        subtitle: "Software and Scripting",
        desc: "Code Repositories: Copying scripts or automation frameworks without maintaining license headers is plagiarism. Algorithmic Logic: Using proprietary algorithms or reverse-engineered logic without attribution is a violation."
      },
      {
        subtitle: "Digital Media and Content Creation",
        desc: "Visual Assets: Utilizing graphics or templates without appropriate commercial licenses. Audio Assets: Integrating unlicensed background music or copyrighted audio into media productions."
      }
    ]
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-emerald-500" />,
    title: "3. Prevention and Detection System",
    items: [
      {
        subtitle: "Phase A: Prevention Protocol",
        desc: "Citation Standardization: Mandate a specific citation format. Version Control: Require detailed version history. Sudden appearances of complex modules trigger a review."
      },
      {
        subtitle: "Phase B: Detection Mechanisms",
        desc: "Textual Analysis: Turnitin, Grammarly Premium. Code Review: MOSS for scripts. Design Audits: Inspect metadata of CAD files and visual graphics for original creation dates."
      },
      {
        subtitle: "Phase C: Enforcement and Consequences",
        desc: "Level 1: Accidental omission (Warning). Level 2: Deliberate copying of a core component (Immediate rejection & probationary period). Level 3: Submitting hijacked project (Removal from team & escalation)."
      }
    ]
  }
]

export default function PlagiarismRulesPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <BackButton />
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          <span className="font-bold text-xl text-slate-800 tracking-tight">System Integrity</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-6">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Comprehensive Project <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
              Integrity & Plagiarism System
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A robust plagiarism system ensures original work, protects intellectual property, and maintains professional standards across technical and creative domains. Here is our formal framework.
          </p>
        </div>

        <div className="space-y-12">
          {guidelines.map((section, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-100 rounded-2xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{section.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      {item.subtitle}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold">
            <Eye className="w-4 h-4" /> Policy is currently active and strictly enforced.
          </div>
        </div>
      </main>
    </div>
  )
}
