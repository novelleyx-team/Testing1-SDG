"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Briefcase, Building, ShieldCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileImageManager } from "@/components/shared/profile-image-manager";

export default function LeadershipProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted || !user) return null;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;
    const newEmail = formData.get("email") as string;
    const newDesignation = formData.get("designation") as string;
    const newDepartment = formData.get("department") as string;
    
    if (newName && newName.trim() !== "") {
      updateProfile({ 
        name: newName, 
        email: newEmail,
        designation: newDesignation,
        department: newDepartment 
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-3">
            <UserCircle className="text-blue-600 dark:text-blue-500" size={32} />
            My Profile
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-2xl">
            View your leadership profile details and authorization level.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937] h-full overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 w-full mb-12 relative">
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                 <ProfileImageManager size="md" showDeleteButton={isEditing} />
               </div>
            </div>
            <CardContent className="p-6 pt-0 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{user.name}</h2>
              <p className="text-slate-500 dark:text-gray-400 font-mono text-sm mt-1">{user.id}</p>
              
              <span className="mt-4 inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {user.role}
              </span>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937] h-full">
            <CardHeader className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-gray-100 flex justify-between items-center">
                <span>Professional Information</span>
                {saveSuccess && (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">✓ Saved successfully</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400">
                      <Mail size={16} /> Email Address
                    </div>
                    <div className="text-base font-semibold text-slate-900 dark:text-gray-100">{user.email}</div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400">
                      <Briefcase size={16} /> Designation
                    </div>
                    <div className="text-base font-semibold text-slate-900 dark:text-gray-100">{user.designation}</div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400">
                      <Building size={16} /> Department / Scope
                    </div>
                    <div className="text-base font-semibold text-slate-900 dark:text-gray-100">{user.department || "College-wide"}</div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400">
                      <ShieldCheck size={16} /> Data Access Level
                    </div>
                    <div className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                      {user.designation?.includes("Dean") ? "Full Administrative Access" : "Department-level Access"}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 dark:text-gray-300">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        defaultValue={user.name} 
                        className="bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        defaultValue={user.email} 
                        className="bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-slate-700 dark:text-gray-300">Designation</Label>
                      <select
                        id="designation"
                        name="designation"
                        defaultValue={user.designation || ""}
                        className="flex h-10 w-full rounded-md border bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <option value="HOD">Head of Department (HOD)</option>
                        <option value="Dean of Academics">Dean of Academics</option>
                        <option value="Dean of Student Affairs">Dean of Student Affairs</option>
                        <option value="Principal">Principal</option>
                        <option value="Director">Director</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-700 dark:text-gray-300">Department Scope</Label>
                      <select
                        id="department"
                        name="department"
                        defaultValue={user.department || ""}
                        className="flex h-10 w-full rounded-md border bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-gray-700 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <option value="">College-wide (No specific dept)</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="MBA">MBA</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-gray-800">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
