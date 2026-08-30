"use client"

import * as React from "react"
import Link from "next/link"
import { Globe2, Mail, Phone, Send, Search } from "lucide-react"

const directoryData = [
  { sNo: 1, name: "Dr. P Sridhar", designation: "Director", email: "director@mlritm.ac.in", phone: "040-29556182" },
  { sNo: 2, name: "Dr. R Murali Prasad", designation: "Principal", email: "principal@mlritm.ac.in", phone: "040-29556182" },
  { sNo: 3, name: "Mr. Bhushan Kundeti", designation: "Controller of Examinations", email: "coe@mlritm.ac.in", phone: "9985795785" },
  { sNo: 4, name: "Dr. Amarendra Reddy Panyala", designation: "Additional Controller of Examinations-1", email: "ace1@mlritm.ac.in", phone: "9985794225" },
  { sNo: 5, name: "Mr. K Nagaraju", designation: "Additional Controller of Examinations-2", email: "ace2@mlritm.ac.in", phone: "7989100475" },
  { sNo: 6, name: "Dr. I Adum Babu", designation: "Dean HR", email: "deanhr@mlritm.ac.in", phone: "9440456864" },
  { sNo: 7, name: "Dr. B Ravi Prasad", designation: "Dean Academics & HOD-CSE (AI & ML)", email: "hodcsm@mlritm.ac.in", phone: "9849356732" },
  { sNo: 8, name: "Mr. Y Appa Rao", designation: "Dean Student Affairs", email: "deanstudentaffairs@mlritm.ac.in", phone: "9492756360" },
  { sNo: 9, name: "Dr. S P Jani", designation: "Dean IIC", email: "deaniic@mlritm.ac.in", phone: "9488545500" },
  { sNo: 10, name: "Dr. K Chaithanya", designation: "Dean IQAC", email: "deaniqac@mlritm.ac.in", phone: "9550035671" },
  { sNo: 11, name: "Dr. G Narsinga Rao", designation: "Dean R&D", email: "deanrnd@mlritm.ac.in", phone: "8008092417" },
  { sNo: 12, name: "Ms. Ila Chandana Kumari", designation: "Training Head & Corporate Relations", email: "traininghead@mlritm.ac.in", phone: "9985829666" },
  { sNo: 13, name: "Mr. B N Srinivas", designation: "Placement Officer", email: "tpo@mlritm.ac.in", phone: "9849872510" },
  { sNo: 14, name: "Dr. K Sravanthi", designation: "In charge clubs and Internal Complaints Committee", email: "icc@mlritm.ac.in", phone: "9642500717" },
  { sNo: 15, name: "Ms. Ch Hemalatha", designation: "Vigilance Officer", email: "hemalathach73@gmail.com", phone: "9441117899" },
  { sNo: 16, name: "Dr. K Ashok", designation: "HOD-FE & I/C Student Grievance Cell", email: "hodhs@mlritm.ac.in", phone: "8247516005" },
  { sNo: 17, name: "Dr. K Abdul Basith", designation: "HOD-CSE & I/C Faculty Grievance Cell", email: "hodcse@mlritm.ac.in", phone: "9703242132" },
  { sNo: 18, name: "Dr. A Arun Kumar", designation: "HOD-CSE (DS)", email: "hodcsd@mlritm.ac.in", phone: "9182367705" },
  { sNo: 19, name: "Dr. M Venkat Reddy", designation: "HOD-CSE (CS)", email: "hodcsc@mlritm.ac.in", phone: "9398564429" },
  { sNo: 20, name: "Dr. M Naga Lakshmi", designation: "HOD-IT & CSIT", email: "hodit@mlritm.ac.in", phone: "7036089991" },
  { sNo: 21, name: "Dr. N Srinivas", designation: "HOD-ECE", email: "hodece@mlritm.ac.in", phone: "9154334563" },
  { sNo: 22, name: "Dr. A Vinod", designation: "HOD-EEE", email: "hodeee@mlritm.ac.in", phone: "8135817016" },
  { sNo: 23, name: "Dr. K Murali", designation: "HOD-Civil Engineering", email: "hodcivil@mlritm.ac.in", phone: "8074475825" },
  { sNo: 24, name: "Dr. U Sudhakar", designation: "HOD-Mechanical Engineering", email: "hodmech@mlritm.ac.in", phone: "9912896727" },
  { sNo: 25, name: "Dr. K. Veeraiah", designation: "HOD-MBA & Finance Officer", email: "hodmba@mlritm.ac.in", phone: "9885650478" },
  { sNo: 26, name: "Dr. B Koteswara Rao", designation: "I/C Alumni & Higher Education", email: "ksrao123@mlritm.ac.in", phone: "9700941151" },
  { sNo: 27, name: "Mr. M Venkatesh", designation: "System Administrator & Online Services", email: "medaboina.venkatesh@mlritm.ac.in", phone: "9000064443" },
  { sNo: 28, name: "Mr. K Narendar", designation: "Administrative Officer", email: "ao@mlritm.ac.in", phone: "9866755144" },
  { sNo: 29, name: "Mr. B Siva Bala Prasad", designation: "Scholarships", email: "scholarship@mlritm.ac.in", phone: "9866383999" },
  { sNo: 30, name: "Mr. M Vara Prasad", designation: "Librarian", email: "librarian@mlritm.ac.in", phone: "9573398916" },
  { sNo: 31, name: "Dr. K Veera Raghavulu", designation: "Transport In Charge", email: "transport@mlritm.ac.in", phone: "9640905221" },
  { sNo: 32, name: "Mr. B Shiva Shankar", designation: "Electrical Maintenance In Charge", email: "electricalmaintenance@mlritm.ac.in", phone: "7013750532" }
];

export default function ContactPage() {
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle")
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = directoryData.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setTimeout(() => {
      setStatus("sent")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
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
            <Link href="/about" className="hover:text-[#2563EB] transition-colors">About Us</Link>
            <Link href="/contact" className="text-[#2563EB] font-bold">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-flex rounded-full text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Whether you are looking to onboard your university or need technical support, our team is here to help you integrate seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Phone Directory List */}
          <div className="flex flex-col h-[520px]">
            <div className="bg-white p-6 rounded-t-2xl shadow-sm border border-gray-100 border-b-0 shrink-0">
              <h3 className="text-xl font-bold mb-4">Phone Directory</h3>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or designation..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-gray-100 flex-1 overflow-y-auto space-y-3">
              {filteredData.length > 0 ? (
                filteredData.map((contact) => (
                  <div key={contact.sNo} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
                    <h4 className="font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{contact.name}</h4>
                    <p className="text-sm text-gray-600 font-medium mb-3">{contact.designation}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                          <Phone className="w-3 h-3 text-[#2563EB]" />
                        </div>
                        <span className="font-medium text-gray-700">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                          <Mail className="w-3 h-3 text-[#2563EB]" />
                        </div>
                        <a href={`mailto:${contact.email}`} className="hover:text-[#2563EB] transition-colors truncate block">{contact.email}</a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No contacts found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We will get back to you shortly.</p>
                <button onClick={() => setStatus("idle")} className="mt-8 text-[#2563EB] font-medium hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" placeholder="john@university.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" disabled={status === "sending"} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70">
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>


      </section>
    </div>
  )
}
