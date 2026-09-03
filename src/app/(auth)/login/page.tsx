"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, User } from "@/store/auth-store";
import { Role, ROLE_NAMES, LEADERSHIP_ROLES } from "@/lib/constants/roles";
import { PREDEFINED_USERS, VALID_REGISTRATION_IDS } from "@/lib/constants/predefined-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- SCHEMAS ---

const loginSchema = z.object({
  identifier: z.string().min(5, { message: "Please enter a valid Roll Number, Faculty ID, or Email." }),
  password: z.string().min(1, { message: "Please enter your password." }),
  role: z.nativeEnum(Role, { message: "Please select a valid role." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
  phoneNumber: z.string().min(10, { message: "Phone number is required (at least 10 digits)." }),
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
  if (data.role === Role.STUDENT && (!data.githubUrl || data.githubUrl.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "GitHub ID or URL is required for Students.",
      path: ["githubUrl"],
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

// --- COMPONENTS ---

function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [pendingUser, setPendingUser] = useState<LoginFormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      role: Role.STUDENT,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      const rolesToMatch = LEADERSHIP_ROLES.includes(data.role)
        ? LEADERSHIP_ROLES
        : [data.role];

      const predefinedUser = PREDEFINED_USERS.find(
        (u) =>
          (u.id === data.identifier.toUpperCase() || u.email === data.identifier) &&
          u.passkey === data.password &&
          rolesToMatch.includes(u.role)
      );

      // In a real app this would call the backend API first
      // For now, we fallback to predefined users if backend isn't available
      if (predefinedUser) {
        const userToLogin = predefinedUser;

        // Check if user has 2FA enabled
        const securityData = localStorage.getItem('novelleyx-security');
        if (securityData) {
          try {
            const parsed = JSON.parse(securityData);
            const userSecurity = parsed?.state?.userSettings?.[userToLogin!.id];
            if (userSecurity?.twoFactorEnabled) {
              setPendingUser(data);
              setTwoFactorRequired(true);
              setIsLoading(false);
              return;
            }
          } catch {
            // Continue with login if parsing fails
          }
        }

        completeLogin(userToLogin!);
      } else {
        setError("identifier", { message: "Invalid credentials for this role." });
      }
      setIsLoading(false);
    }, 0);
  };

  const completeLogin = (userToLogin: User) => {
    login({
      id: userToLogin.id,
      name: userToLogin.name,
      email: userToLogin.email,
      role: userToLogin.role,
      designation: userToLogin.designation,
      department: userToLogin.department,
    });

    const routes: Record<Role, string> = {
      [Role.STUDENT]: "/student",
      [Role.FACULTY]: "/faculty",
      [Role.HOD]: "/leadership",
      [Role.DEAN]: "/leadership",
      [Role.LEADERSHIP]: "/leadership",
      [Role.ADMIN]: "/admin/dashboard",
    };

    router.push(routes[userToLogin.role as Role] || "/student");
  };

  const handleTwoFactorVerify = () => {
    if (!pendingUser || twoFactorCode.length !== 6) return;
    
    setIsLoading(true);
    // Verify TOTP code
    const rolesToMatch = LEADERSHIP_ROLES.includes(pendingUser.role) ? LEADERSHIP_ROLES : [pendingUser.role];
    
    const predefinedUser = PREDEFINED_USERS.find(
      (u) =>
        (u.id === pendingUser.identifier.toUpperCase() || u.email === pendingUser.identifier) &&
        u.passkey === pendingUser.password &&
        rolesToMatch.includes(u.role)
    );
    
    const userToLogin = predefinedUser;
    if (userToLogin) {
      // Validate TOTP - in production this would use a real TOTP library
      // For now, accept any 6-digit code as the secret is stored client-side
      const securityData = localStorage.getItem('novelleyx-security');
      if (securityData) {
        try {
          const parsed = JSON.parse(securityData);
          const userSecurity = parsed?.state?.userSettings?.[userToLogin.id];
          if (userSecurity?.twoFactorEnabled && twoFactorCode.length === 6) {
            completeLogin(userToLogin);
            setTwoFactorRequired(false);
            setPendingUser(null);
            setTwoFactorCode("");
            setIsLoading(false);
            return;
          }
        } catch {
          // Fall through to error
        }
      }
    }
    
    setError("identifier", { message: "Invalid 2FA code." });
    setIsLoading(false);
  };

  if (twoFactorRequired) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="twoFactorCode">Verification Code</Label>
            <Input
              id="twoFactorCode"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
            />
          </div>
          {errors.identifier && (
            <p className="text-sm text-red-500 font-medium">{errors.identifier.message}</p>
          )}
          <Button 
            onClick={handleTwoFactorVerify} 
            className="w-full" 
            disabled={isLoading || twoFactorCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setTwoFactorRequired(false);
              setPendingUser(null);
              setTwoFactorCode("");
            }}
            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Enter your details below to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">
            {selectedRole === Role.STUDENT
              ? "Roll Number"
              : selectedRole === Role.ADMIN
                ? "Admin ID / Email"
                : (selectedRole === Role.FACULTY || selectedRole === Role.HOD || selectedRole === Role.DEAN || selectedRole === Role.LEADERSHIP)
                  ? "Faculty ID / Email"
                  : "Email Address"}
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={
              selectedRole === Role.STUDENT
                ? "e.g., 20R11A0501"
                : selectedRole === Role.ADMIN
                  ? "e.g., ADMIN_01"
                  : (selectedRole === Role.FACULTY || selectedRole === Role.HOD || selectedRole === Role.DEAN || selectedRole === Role.LEADERSHIP)
                    ? "e.g., MLRS10001"
                    : "name@institution.edu"
            }
            autoComplete="username"
            {...register("identifier")}
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.identifier && (
            <p className="text-sm text-red-500 font-medium">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            {...register("role")}
            className={`flex h-10 w-full rounded-md border bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/40 dark:border-gray-700/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 focus:bg-white/80 dark:focus:bg-gray-900/80 ${
              errors.role ? "border-red-500 focus-visible:ring-red-500" : "border-input"
            }`}
          >
            <option value={Role.STUDENT}>{ROLE_NAMES[Role.STUDENT]}</option>
            <option value={Role.FACULTY}>{ROLE_NAMES[Role.FACULTY]}</option>
            <option value={Role.HOD}>{ROLE_NAMES[Role.HOD]}</option>
            <option value={Role.DEAN}>{ROLE_NAMES[Role.DEAN]}</option>
            <option value={Role.ADMIN}>{ROLE_NAMES[Role.ADMIN]}</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm shadow-lg shadow-blue-600/20 transition-all duration-300" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
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
      confirmPassword: "",
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

      let department = data.department;
      if (data.role === Role.STUDENT) {
        department = data.branch;
      } else if (data.role === Role.HOD || data.role === Role.DEAN) {
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
        identifier: data.identifier,
        passkey: data.password,
        phoneNumber: data.phoneNumber,
        githubUrl: data.githubUrl,
      });
      setIsLoading(false);

      // Call onSuccess to switch to login tab instead of auto-logging in
      onSuccess();
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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Join NOVELLEYX to manage your projects
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            autoComplete="name"
            {...register("name")}
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
            className={`flex h-10 w-full rounded-md border bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/40 dark:border-gray-700/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 focus:bg-white/80 dark:focus:bg-gray-900/80 ${
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
          <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-sm text-amber-800 dark:text-amber-300">
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
              className={`flex h-10 w-full rounded-md border bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/40 dark:border-gray-700/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 focus:bg-white/80 dark:focus:bg-gray-900/80 ${
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
              className={`flex h-10 w-full rounded-md border bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/40 dark:border-gray-700/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 focus:bg-white/80 dark:focus:bg-gray-900/80 ${
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
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
              className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.githubUrl ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
            className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm shadow-lg shadow-blue-600/20 transition-all duration-300" disabled={isLoading}>
          {isLoading ? "Creating account..." : `Register as ${
            selectedRole === Role.STUDENT ? "Student" :
            selectedRole === Role.FACULTY ? "Faculty" :
            selectedRole === Role.HOD ? "HOD" : "Dean"
          }`}
        </Button>
      </form>
    </div>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  return (
    <div className="space-y-6">
      <div className="flex bg-white/30 dark:bg-gray-800/40 backdrop-blur-md p-1.5 rounded-xl shadow-inner border border-white/30 dark:border-gray-700/50">
        <button 
          type="button"
          onClick={() => setMode("login")} 
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === "login" ? "bg-white/90 dark:bg-gray-700/90 shadow-md text-blue-700 dark:text-blue-400 scale-100" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/50 scale-[0.98]"}`}
        >
          Sign In
        </button>
        <button 
          type="button"
          onClick={() => setMode("register")} 
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === "register" ? "bg-white/90 dark:bg-gray-700/90 shadow-md text-blue-700 dark:text-blue-400 scale-100" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/50 scale-[0.98]"}`}
        >
          Create Account
        </button>
      </div>

      <div className="mt-6">
        {mode === "login" ? <LoginForm /> : <RegisterForm onSuccess={() => setMode("login")} />}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center text-gray-400 dark:text-gray-500">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
