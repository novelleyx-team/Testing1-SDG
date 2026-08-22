"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Role, ROLE_NAMES, LEADERSHIP_ROLES } from "@/lib/constants/roles";
import { PREDEFINED_USERS } from "@/lib/constants/predefined-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  identifier: z.string().min(5, { message: "Please enter a valid Roll Number, Faculty ID, or Email." }),
  password: z.string().min(1, { message: "Please enter your password." }),
  role: z.nativeEnum(Role, { message: "Please select a valid role." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
      const { registeredUsers } = useAuthStore.getState();

      // For login, HOD and DEAN roles should also match LEADERSHIP predefined users
      const rolesToMatch = LEADERSHIP_ROLES.includes(data.role)
        ? LEADERSHIP_ROLES
        : [data.role];

      const predefinedUser = PREDEFINED_USERS.find(
        (u) =>
          (u.id === data.identifier.toUpperCase() || u.email === data.identifier) &&
          u.passkey === data.password &&
          rolesToMatch.includes(u.role)
      );

      const registeredUser = registeredUsers.find(
        (u) =>
          (u.identifier === data.identifier || u.email === data.identifier) &&
          u.passkey === data.password &&
          rolesToMatch.includes(u.role)
      );

      if (predefinedUser || registeredUser) {
        const userToLogin = predefinedUser || registeredUser;

        login({
          id: userToLogin!.id,
          name: userToLogin!.name,
          email: userToLogin!.email,
          role: userToLogin!.role,
          designation: userToLogin!.designation,
          department: userToLogin!.department,
        });

        const routes: Record<Role, string> = {
          [Role.STUDENT]: "/student",
          [Role.FACULTY]: "/faculty",
          [Role.HOD]: "/leadership",
          [Role.DEAN]: "/leadership",
          [Role.LEADERSHIP]: "/leadership",
          [Role.ADMIN]: "/admin",
        };

        router.push(routes[userToLogin!.role] || "/student");
      } else {
        setError("identifier", { message: "Invalid credentials for this role." });
      }
      setIsLoading(false);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter your details below to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">
            {selectedRole === Role.STUDENT
              ? "Roll Number"
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
                : (selectedRole === Role.FACULTY || selectedRole === Role.HOD || selectedRole === Role.DEAN || selectedRole === Role.LEADERSHIP)
                  ? "e.g., MLRS10001"
                  : "name@institution.edu"
            }
            autoComplete="username"
            {...register("identifier")}
            className={errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}
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
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
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
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              errors.role ? "border-red-500 focus-visible:ring-red-500" : "border-input"
            }`}
          >
            <option value={Role.STUDENT}>{ROLE_NAMES[Role.STUDENT]}</option>
            <option value={Role.FACULTY}>{ROLE_NAMES[Role.FACULTY]}</option>
            <option value={Role.HOD}>{ROLE_NAMES[Role.HOD]}</option>
            <option value={Role.DEAN}>{ROLE_NAMES[Role.DEAN]}</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
          Create an account
        </Link>
      </div>
    </div>
  );
}
