"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/lib/constants/roles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [step, setStep] = useState<1 | 2>(1);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [secondPin, setSecondPin] = useState("");
  const [error, setError] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === "ADMIN" && password === "Mlrs@1234") {
      setError("");
      setStep(2);
    } else {
      setError("Invalid Admin ID or Password");
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secondPin === "Mlrs@123") {
      // Success, log in
      login({
        id: "admin-system",
        name: "Super Admin",
        role: Role.ADMIN,
        email: "admin@sdgplatform.local",
      });
      router.push("/admin/dashboard");
    } else {
      setError("Invalid Secondary PIN");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border-slate-200 text-slate-900 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Admin Portal</CardTitle>
          <CardDescription className="text-slate-500 text-center">
            {step === 1 ? "Secure Login Area" : "2-Step Verification"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleStep1Submit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="adminId" className="text-slate-700">Admin ID</Label>
                  <Input
                    id="adminId"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 focus-visible:ring-purple-500 placeholder:text-slate-400"
                    placeholder="Enter Admin ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 focus-visible:ring-purple-500 placeholder:text-slate-400"
                    placeholder="Enter password"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md">
                  Verify Credentials
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleStep2Submit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="secondPin" className="text-slate-700">Secondary PIN</Label>
                  <Input
                    id="secondPin"
                    type="password"
                    value={secondPin}
                    onChange={(e) => setSecondPin(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 focus-visible:ring-purple-500 placeholder:text-slate-400"
                    placeholder="Enter Secondary PIN"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md">
                  Authenticate & Login
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-500 hover:text-slate-800"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                >
                  Back to Step 1
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
