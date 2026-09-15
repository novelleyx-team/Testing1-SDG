"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save } from "lucide-react";
import { useState } from "react";
import { ProfileImageManager } from "@/components/shared/profile-image-manager";
import { DepartmentSelect } from "@/components/ui/department-select";

export default function FacultyProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;
    const newEmail = formData.get("email") as string;
    const newDepartment = formData.get("department") as string;
    const newDepartmentIdStr = formData.get("departmentId") as string;
    const newDepartmentId = newDepartmentIdStr ? parseInt(newDepartmentIdStr, 10) : undefined;
    
    if (newName && newName.trim() !== "") {
      updateProfile({ 
        name: newName, 
        email: newEmail,
        department: newDepartment,
        departmentId: newDepartmentId
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
          <UserCircle className="text-blue-600" size={32} /> Faculty Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your professional information and academic identity.</p>
      </div>

      <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
        
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <ProfileImageManager size="lg" showDeleteButton={true} />
          </div>
        </div>

        <div className="pt-16 p-8">
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  defaultValue={user?.name || ""} 
                  className="bg-gray-50/50 dark:bg-[#111827] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id" className="text-gray-700 dark:text-gray-300 font-semibold">Faculty ID</Label>
                <Input 
                  id="id" 
                  defaultValue={user?.email ? user.email.split('@')[0].toUpperCase() : ""} 
                  readOnly 
                  className="bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 font-medium uppercase cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">Academic Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  defaultValue={user?.email || ""} 
                  className="bg-gray-50/50 dark:bg-[#111827] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700 dark:text-gray-300 font-semibold">Department / Branch</Label>
                <DepartmentSelect value={user?.departmentId} />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Select the primary department you are associated with.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              {saveSuccess && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Profile updated successfully.
                </p>
              )}
              {!saveSuccess && <div />}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-bold shadow-sm transition-all hover:shadow-md">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
