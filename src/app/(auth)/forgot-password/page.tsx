"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Role } from "@/lib/constants/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  identifier: z.string().min(5, { message: "Please enter a valid Roll Number or Faculty ID." }),
  role: z.enum([Role.STUDENT, Role.FACULTY], { 
    message: "Only students and faculty can reset passwords." 
  }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
      role: Role.STUDENT,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async () => {
    setIsLoading(true);
    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 0);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Check your email
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          We have sent a password reset link to your email address. Please click the link to reset your password.
        </p>
        <div className="pt-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8]">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter your ID and role to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">
            {selectedRole === Role.FACULTY ? "Faculty ID" : "Roll Number"}
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={selectedRole === Role.FACULTY ? "e.g., MLRS10001" : "e.g., 20R11A0501"}
            autoComplete="username"
            {...register("identifier")}
            className={errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.identifier && (
            <p className="text-sm text-red-500 font-medium">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            {...register("role")}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              errors.role ? "border-red-500 focus-visible:ring-red-500" : "border-input"
            }`}
          >
            <option value={Role.STUDENT}>Student</option>
            <option value={Role.FACULTY}>Faculty</option>
          </select>
          <p className="text-[11px] text-gray-500 mt-1">
            Note: System Administrators, Deans, and HODs cannot reset their passwords here.
          </p>
          {errors.role && (
            <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={isLoading}>
          {isLoading ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-[#2563EB] hover:text-[#1d4ed8]">
          Sign in
        </Link>
      </div>
    </div>
  );
}
