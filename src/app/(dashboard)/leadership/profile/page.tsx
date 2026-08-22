"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Briefcase, Building, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeadershipProfilePage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted || !user) return null;

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <UserCircle className="text-blue-600" size={32} />
            My Profile
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            View your leadership profile details and authorization level.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-slate-200 h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <UserCircle size={48} className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 font-mono text-sm mt-1">{user.id}</p>
              
              <span className="mt-4 inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {user.role}
              </span>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-slate-200 h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Mail size={16} /> Email Address
                  </div>
                  <div className="text-base font-semibold text-slate-900">{user.email}</div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Briefcase size={16} /> Designation
                  </div>
                  <div className="text-base font-semibold text-slate-900">{user.designation}</div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Building size={16} /> Department / Scope
                  </div>
                  <div className="text-base font-semibold text-slate-900">{user.department || "College-wide"}</div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <ShieldCheck size={16} /> Data Access Level
                  </div>
                  <div className="text-base font-semibold text-emerald-600">
                    {user.designation?.includes("Dean") ? "Full Administrative Access" : "Department-level Access"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
