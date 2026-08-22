"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Camera, Save } from "lucide-react";
import { useRef } from "react";

import Image from "next/image";

export default function FacultyProfilePage() {
  const { user, updateProfileImage } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfileImage(imageUrl);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;
    const newEmail = formData.get("email") as string;
    
    if (newName && newName.trim() !== "") {
      useAuthStore.getState().updateProfile({ name: newName, email: newEmail });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <UserCircle className="text-blue-600" size={32} /> Faculty Profile
        </h1>
        <p className="text-gray-500 mt-1">Manage your professional information and academic identity.</p>
      </div>

      <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 bg-white overflow-hidden">
        
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer"
            >
              {user?.profileImage ? (
                <Image src={user.profileImage} alt="Profile" fill className="object-cover" />
              ) : (
                <span className="text-3xl font-black text-gray-400 group-hover:opacity-0 transition-opacity">
                  {user?.name?.charAt(0) || 'F'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  defaultValue={user?.name || ""} 
                  className="bg-gray-50/50 border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id" className="text-gray-700 font-semibold">Faculty ID</Label>
                <Input 
                  id="id" 
                  defaultValue={user?.email ? user.email.split('@')[0].toUpperCase() : ""} 
                  readOnly 
                  className="bg-gray-100 border-transparent text-gray-500 font-medium uppercase cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Academic Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  defaultValue={user?.email || ""} 
                  className="bg-gray-50/50 border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700 font-semibold">Department / Branch</Label>
                <Input 
                  id="department" 
                  defaultValue={user?.department || "N/A"} 
                  readOnly 
                  className="bg-gray-100 border-transparent text-gray-500 font-medium cursor-not-allowed" 
                />
                <p className="text-xs text-gray-400 mt-1">Department is fixed based on your registration and cannot be modified.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
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
