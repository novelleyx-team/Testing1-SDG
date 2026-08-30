"use client";

import { Camera, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

interface ProfileImageManagerProps {
  size?: "sm" | "md" | "lg";
  showDeleteButton?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ProfileImageManager({ size = "lg", showDeleteButton = true }: ProfileImageManagerProps) {
  const { user, updateProfileImage, deleteProfileImage } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Convert to base64 for persistence
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    deleteProfileImage();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`${sizeClasses[size]} rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer`}
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <span
            className={`${textSizeClasses[size]} font-black text-gray-400 dark:text-gray-500 group-hover:opacity-0 transition-opacity`}
          >
            {user?.name?.charAt(0) || <User className="h-8 w-8" />}
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={20} className="text-white mb-1" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            Change
          </span>
        </div>
      </div>

      {showDeleteButton && user?.profileImage && (
        <button
          onClick={handleDelete}
          className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={12} />
          Remove Photo
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium text-center max-w-[200px]">
          {error}
        </p>
      )}
    </div>
  );
}
