"use client";

import { use } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, GraduationCap, MapPin, ArrowLeft, Briefcase, Award } from "lucide-react";
import Link from "next/link";
import { PREDEFINED_USERS } from "@/lib/constants/predefined-users";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  
  // Find student in predefined users (temporary fallback until full API integration)
  const student = PREDEFINED_USERS.find(
    u => u.id === studentId || u.id === decodeURIComponent(studentId)
  );

  if (!student) {
    return (
      <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
        <Link href="/leadership/students" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline w-fit">
          <ArrowLeft size={16} className="mr-2" /> Back to Students
        </Link>
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <User size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Student Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">The requested student ID ({decodeURIComponent(studentId)}) could not be found in the system.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <Link href="/leadership/students" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline w-fit">
        <ArrowLeft size={16} className="mr-2" /> Back to Students
      </Link>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary Card */}
        <Card className="w-full md:w-1/3 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-2xl mb-4 overflow-hidden">
              {student.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.profileImage} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                student.name.charAt(0)
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{student.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">{student.id}</p>
            
            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                <span>{student.department || "No Department"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Area */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Briefcase size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Total Projects</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">0</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><Award size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Badges Earned</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">0</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937] flex-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
                <Briefcase size={48} className="text-gray-300 dark:text-gray-600" />
                <p>No projects submitted by this student yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
