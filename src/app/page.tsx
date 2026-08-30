"use client"

import * as React from "react"
import { motion, useInView, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowRight, BarChart3, ShieldCheck, Zap, Globe2, Building, Target, Lock, Mail, MapPin, Phone } from "lucide-react"
import { useSuggestionsStore } from "@/store/suggestions-store"
import { contentConfig } from "@/config/content"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = React.useState(0)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  React.useEffect(() => {
    if (!isInView) return;
    
    let start = 0
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, isInView])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const phrases = [
  "Global Goals",
  "Sustainable Development",
  "Real-World Impact",
  "Future Innovations"
];

function SuggestionsTablet() {
  const addSuggestion = useSuggestionsStore(state => state.addSuggestion);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addSuggestion({
      authorType: formData.get('authorType') as 'Student' | 'Faculty' | 'Admin',
      name: formData.get('name') as string,
      topic: formData.get('topic') as string,
      content: formData.get('content') as string
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    e.currentTarget.reset();
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50/50 transform -skew-y-2 origin-top-left z-0"></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#2563EB] text-sm font-bold mb-4">
            <Mail className="w-4 h-4" /> {contentConfig.landingPage.suggestionsTitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{contentConfig.landingPage.suggestionsHeading}</h2>
          <p className="text-gray-600">{contentConfig.landingPage.suggestionsDescription}</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-16 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Suggestion Sent Successfully!</h3>
              <p className="text-gray-500">Thank you for your feedback. Our administrative team will review your report shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">I am a...</label>
                  <select name="authorType" required className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors outline-none font-medium">
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input name="name" type="text" required placeholder="e.g. Jane Doe" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors outline-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Topic / Subject</label>
                <input name="topic" type="text" required placeholder="e.g. Request for new Engineering Template" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Detailed Suggestion</label>
                <textarea name="content" required placeholder="Describe your feature request or update idea..." className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors outline-none resize-none"></textarea>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                Submit Report to Admin
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [phraseIndex, setPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#2563EB] flex items-center justify-center">
              <Globe2 className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">NOVELLEYX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#2563EB] transition-colors">About Us</Link>
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
            <a href="#modules" className="hover:text-[#2563EB] transition-colors">Modules</a>
            <Link href="/contact" className="hover:text-[#2563EB] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-flex rounded-full text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
            <Link href="/register" className={buttonVariants({ className: "rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white" })}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden w-full border-b border-gray-100">
        {/* Faded Grid Background Image with Dark Blue Tint */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.6] bg-center bg-cover bg-no-repeat bg-blue-900/30 bg-blend-multiply" 
          style={{ backgroundImage: "url('/academic_background.png')" }} 
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#F8FAFC]" />
        
        <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-sm font-semibold mb-6 border border-blue-100 shadow-sm">
                <Zap className="w-4 h-4" />
                Introducing the AI SDG Engine
              </span>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight min-h-[120px] md:min-h-[160px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Align Academic Projects with{" "}
              <span className="block mt-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#2563EB] inline-block"
                  >
                    {phrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The enterprise platform for managing research, empowering students, and utilizing AI to map institutional efforts to Sustainable Development Goals.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/register" className={buttonVariants({ className: "rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-12 text-base w-full sm:w-auto shadow-md" })}>
                Start Building
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", className: "rounded-full px-8 h-12 text-base w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 bg-white/80 backdrop-blur-sm" })}>
                Sign In to Dashboard
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200/60 pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { label: "Active Students", value: 10000, suffix: "+" },
              { label: "Faculty Members", value: 500, suffix: "+" },
              { label: "Projects Analyzed", value: 25000, suffix: "+" },
              { label: "Institutions", value: 50, suffix: "+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything your institution needs to scale academic excellence and measure real-world impact.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6 text-[#2563EB]" />,
                title: "AI-Powered SDG Mapping",
                desc: "Automatically analyze project abstracts and map them to relevant Sustainable Development Goals with high accuracy."
              },
              {
                icon: <Building className="w-6 h-6 text-[#2563EB]" />,
                title: "Multi-Institution Hierarchy",
                desc: "Scalable architecture supporting Super Admins, Deans, HODs, Faculty, and Students across multiple campuses."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-[#2563EB]" />,
                title: "Real-time Analytics",
                desc: "Comprehensive dashboards providing actionable insights into project progress and institutional impact."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="p-8 rounded-[12px] bg-[#F8FAFC] border border-gray-100 hover:shadow-md transition-shadow"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="w-12 h-12 rounded-[8px] bg-blue-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              className="flex-1"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Comprehensive Modules for Every Need</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our platform integrates all essential academic workflows into a single, cohesive experience. Manage resources, track progress, and leverage AI seamlessly.
              </p>
              <ul className="space-y-4">
                {[
                  "Project & Research Management",
                  "SDG Tracking & Compliance Reporting",
                  "AI Assistance & Reasoning Engine",
                  "Resource Allocation & Budgeting"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Target className="w-3 h-3 text-[#2563EB]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-10 rounded-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 h-12 px-6">
                Explore All Modules
              </Button>
            </motion.div>
            <motion.div 
              className="flex-1 w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-900">AI Analysis Engine</h4>
                    <p className="text-sm text-gray-500">Live preview</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-[8px] border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-semibold text-sm text-[#2563EB]">SDG 4: Quality Education Identified</span>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full w-full mt-3">
                      <div className="h-full bg-[#2563EB] rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From project submission to global impact reporting in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-blue-100 -z-10"></div>
            {[
              { step: "01", title: "Submit & Analyze", desc: "Students submit project abstracts. Our AI instantly analyzes the text to identify key SDG alignments and generates a confidence score." },
              { step: "02", title: "Faculty Review", desc: "Supervisors review the AI's recommendations, provide feedback, and officially approve the project's alignment." },
              { step: "03", title: "Track & Report", desc: "HODs and Deans track institutional progress in real-time, instantly generating compliance and impact reports." }
            ].map((item, i) => (
              <div key={i} className="text-center bg-white">
                <div className="w-24 h-24 mx-auto bg-[#2563EB] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20 mb-6 border-8 border-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-14 text-lg shadow-lg shadow-blue-500/20" })}>
              Create Your Institution Account
            </Link>
          </div>
        </div>
      </section>
      <section id="security" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <ShieldCheck className="w-16 h-16 text-[#2563EB] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Security</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Your institution&apos;s data is protected by state-of-the-art encryption, strict role-based access controls, and compliance with global data protection standards.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              {[
                { title: "End-to-End Encryption", desc: "Data is encrypted at rest and in transit using industry standard protocols." },
                { title: "Role-Based Access", desc: "Granular permissions ensure users only see data relevant to their specific roles." },
                { title: "Compliance Ready", desc: "Built to comply with GDPR, FERPA, and other global educational standards." }
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-[12px] border border-gray-700">
                  <Lock className="w-6 h-6 text-[#2563EB] mb-4" />
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Suggestions Tablet */}
      <SuggestionsTablet />

      {/* FAQ Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about the platform and how it works.</p>
          </div>
          <div className="space-y-6">
            {[
              { q: "Who can register on the platform?", a: "Currently, access is restricted to verified students, faculty members, HODs, Deans, and Admins from partnered institutions." },
              { q: "How does the AI SDG Engine work?", a: "The AI engine analyzes your project abstracts and proposals using advanced NLP, matching key themes against the UN's 17 Sustainable Development Goals to suggest alignments." },
              { q: "Is the data secure?", a: "Yes, we employ enterprise-grade end-to-end encryption. Each user only has access to the modules and data relevant to their specific role." },
              { q: "Can I change my department after registration?", a: "No, to maintain institutional integrity, your department and role are fixed upon registration. Please contact your administrator for any corrections." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 group cursor-pointer w-fit">
                <Globe2 className="text-[#2563EB] h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-[#2563EB] transition-colors duration-300">NOVELLEYX</span>
              </div>
              <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
                Empowering institutions to align their academic and research efforts with global Sustainable Development Goals through advanced AI and intuitive management tools.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#2563EB] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md font-bold text-sm">
                  X
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#2563EB] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md font-bold text-sm">
                  IN
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#2563EB] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md font-bold text-sm">
                  GH
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-[#2563EB] after:rounded-full">Product</h4>
              <ul className="space-y-4 text-sm text-gray-600 mt-4">
                <li><Link href="/features" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Features</span></Link></li>
                <li><Link href="/modules" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Modules</span></Link></li>
                <li><Link href="/security" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Security</span></Link></li>
                <li><Link href="/pricing" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Pricing</span></Link></li>
                <li><Link href="/changelog" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Changelog</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-[#2563EB] after:rounded-full">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-600 mt-4">
                <li><Link href="/docs" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Documentation</span></Link></li>
                <li><Link href="/webinars" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Webinars</span></Link></li>
                <li><Link href="/help" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span></Link></li>
                <li><Link href="/community" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Community</span></Link></li>
                <li><Link href="/guides" className="group flex items-center gap-2 hover:text-[#2563EB] transition-colors"><span className="group-hover:translate-x-1 transition-transform duration-200">Guides & Tutorials</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-[#2563EB] after:rounded-full">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-600 mt-4">
                <li className="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#2563EB] transition-colors mt-0.5" />
                  <span className="group-hover:text-gray-900 transition-colors leading-relaxed">123 Innovation Drive, Tech District<br/>San Francisco, CA 94105</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#2563EB] transition-colors" />
                  <span className="group-hover:text-gray-900 transition-colors">+1 (800) 555-0199</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-[#2563EB] transition-colors" />
                  <a href="mailto:support@novelleyx.com" className="group-hover:text-[#2563EB] transition-colors font-medium">support@novelleyx.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Novelleyx Platform. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
              <Link href="/privacy" className="hover:text-[#2563EB] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#2563EB] transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-[#2563EB] transition-colors">Cookie Policy</Link>
              <Link href="/admin/login" className="hover:text-[#2563EB] transition-colors text-[#2563EB]/80 font-bold ml-2">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
