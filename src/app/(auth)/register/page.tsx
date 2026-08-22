"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/lib/constants/roles";
import { VALID_REGISTRATION_IDS } from "@/lib/constants/predefined-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  identifier: z.string().min(5, { message: "Please enter a valid Registration ID." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .endsWith("@mlritm.ac.in", { message: "Only official @mlritm.ac.in college emails are allowed." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  role: z.enum([Role.STUDENT, Role.FACULTY, Role.HOD, Role.DEAN], { message: "Please select a valid role to register." }),
  department: z.string().optional(),
  branch: z.string().optional(),
  phoneNumber: z.string().optional(),
  githubUrl: z.string().optional(),
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });
  }
  if ((data.role === Role.FACULTY || data.role === Role.HOD) && !data.department) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Department is required.",
      path: ["department"],
    });
  }
  if (data.role === Role.STUDENT && !data.branch) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Branch is required for Students.",
      path: ["branch"],
    });
  }

  // Validate registration ID for Faculty, HOD, and Dean
  if (data.role !== Role.STUDENT) {
    const validEntry = VALID_REGISTRATION_IDS.find(
      (entry) => entry.id === data.identifier.toUpperCase() && entry.allowedRole === data.role
    );
    if (!validEntry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid Registration ID for ${data.role} role. Please contact the administrator to obtain a valid ID.`,
        path: ["identifier"],
      });
    }
  }
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      identifier: "",
      email: "",
      password: "",
      role: Role.STUDENT,
      department: "",
      branch: "",
      phoneNumber: "",
      githubUrl: "",
    },
  });

  const selectedRole = watch("role");
  const showDepartment = selectedRole === Role.FACULTY || selectedRole === Role.HOD;
  const isLeadershipRole = selectedRole === Role.HOD || selectedRole === Role.DEAN;

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      const { registerUser } = useAuthStore.getState();

      // For HOD/Dean, auto-fill department from the registration ID entry
      let department = data.department;
      if (data.role === Role.HOD || data.role === Role.DEAN) {
        const entry = VALID_REGISTRATION_IDS.find(
          (e) => e.id === data.identifier.toUpperCase() && e.allowedRole === data.role
        );
        if (entry?.department) {
          department = entry.department;
        }
      }

      registerUser({
        id: data.identifier.toUpperCase(),
        name: data.name,
        email: data.email,
        role: data.role,
        department: department,
        branch: data.branch,
        identifier: data.identifier,
        passkey: data.password,
        phoneNumber: data.phoneNumber,
        githubUrl: data.githubUrl,
      });
      setIsLoading(false);

      const routes: Record<string, string> = {
        [Role.STUDENT]: "/student",
        [Role.FACULTY]: "/faculty",
        [Role.HOD]: "/leadership",
        [Role.DEAN]: "/leadership",
      };
      router.push(routes[data.role] || "/student");
    }, 0);
  };

  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case Role.STUDENT: return "Roll Number";
      case Role.FACULTY: return "Faculty Registration ID";
      case Role.HOD: return "HOD Registration ID";
      case Role.DEAN: return "Dean Registration ID";
      default: return "Identifier";
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (selectedRole) {
      case Role.STUDENT: return "e.g., 20R11A0501";
      case Role.FACULTY: return "e.g., FAC-CSE-001";
      case Role.HOD: return "e.g., HOD-CSE-001";
      case Role.DEAN: return "e.g., DEAN-ACAD-001";
      default: return "Enter your ID";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Join NOVELLEYX to manage your projects
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Register As</Label>
          <select
            id="role"
            {...register("role")}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              errors.role ? "border-red-500 focus-visible:ring-red-500" : "border-input"
            }`}
          >
            <option value={Role.STUDENT}>Student</option>
            <option value={Role.FACULTY}>Faculty</option>
            <option value={Role.HOD}>Head of Department (HOD)</option>
            <option value={Role.DEAN}>Dean</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
          )}
        </div>

        {isLeadershipRole && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              ⚠️ <strong>{selectedRole === Role.HOD ? "HOD" : "Dean"}</strong> registration requires a valid Registration ID issued by the administrator.
            </p>
          </div>
        )}

        {showDepartment && (
          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              {...register("department")}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                errors.department ? "border-red-500 focus-visible:ring-red-500" : "border-input"
              }`}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Computer Science Data (CSD)">Computer Science Data (CSD)</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="MBA">MBA</option>
              {selectedRole === Role.FACULTY && <option value="Other">Other</option>}
            </select>
            {errors.department && (
              <p className="text-sm text-red-500 font-medium">{errors.department.message}</p>
            )}
          </div>
        )}

        {selectedRole === Role.STUDENT && (
          <div className="space-y-1.5">
            <Label htmlFor="branch">Branch / Department</Label>
            <select
              id="branch"
              {...register("branch")}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                errors.branch ? "border-red-500 focus-visible:ring-red-500" : "border-input"
              }`}
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Computer Science Data (CSD)">Computer Science Data (CSD)</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Other">Other</option>
            </select>
            {errors.branch && (
              <p className="text-sm text-red-500 font-medium">{errors.branch.message}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="identifier">
            {getIdentifierLabel()}
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={getIdentifierPlaceholder()}
            autoComplete="username"
            {...register("identifier")}
            className={errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.identifier && (
            <p className="text-sm text-red-500 font-medium">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="e.g., 9876543210"
            {...register("phoneNumber")}
            className={errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 font-medium">{errors.phoneNumber.message}</p>
          )}
        </div>

        {selectedRole === Role.STUDENT && (
          <div className="space-y-1.5">
            <Label htmlFor="githubUrl">GitHub ID or URL</Label>
            <Input
              id="githubUrl"
              type="text"
              placeholder="e.g., https://github.com/username or username"
              {...register("githubUrl")}
              className={errors.githubUrl ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.githubUrl && (
              <p className="text-sm text-red-500 font-medium">{errors.githubUrl.message}</p>
            )}
          </div>
        )}


        <div className="space-y-1.5">
          <Label htmlFor="email">College Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@mlritm.ac.in"
            autoComplete="email"
            {...register("email")}
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : `Register as ${
            selectedRole === Role.STUDENT ? "Student" :
            selectedRole === Role.FACULTY ? "Faculty" :
            selectedRole === Role.HOD ? "HOD" : "Dean"
          }`}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </div>
    </div>
  );
}
