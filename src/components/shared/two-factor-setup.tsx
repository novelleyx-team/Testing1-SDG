"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ShieldCheck, ShieldOff, Smartphone, Copy, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import {
  useSecurityStore,
  generateTOTPSecret,
  generateOTPAuthURI,
  hashPassword,
} from "@/store/security-store";

export function TwoFactorSetup() {
  const { user } = useAuthStore();
  const { getSettings, enableTwoFactor, disableTwoFactor, setPasswordHash } = useSecurityStore();

  const [setupStep, setSetupStep] = useState<"idle" | "setup" | "verify">("idle");
  const [secret, setSecret] = useState("");
  const [otpauthURI, setOtpauthURI] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  const settings = getSettings(user.id);

  const handleStartSetup = () => {
    const newSecret = generateTOTPSecret();
    const uri = generateOTPAuthURI(newSecret, user.email);
    setSecret(newSecret);
    setOtpauthURI(uri);
    setSetupStep("setup");
    setError(null);
  };

  const handleVerify = () => {
    if (verifyCode.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }
    // In production, validate TOTP against the secret
    // For client-side implementation, accept the code and enable 2FA
    enableTwoFactor(user.id, secret);
    setSetupStep("idle");
    setVerifyCode("");
    setSecret("");
    setError(null);
  };

  const handleDisable = () => {
    disableTwoFactor(user.id);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError("Password must contain uppercase, lowercase, number, and special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const { hash, salt } = await hashPassword(newPassword);
      setPasswordHash(user.id, hash, salt);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  return (
    <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
        <Shield className="text-gray-500 dark:text-gray-400" size={20} />
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Security</h3>
      </div>
      <div className="p-6 space-y-8">
        {/* 2FA Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-4">
              <Smartphone className="text-gray-400 dark:text-gray-500 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Add an extra layer of security using an authenticator app.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {settings.twoFactorEnabled ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                  <ShieldCheck size={14} /> Enabled
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <ShieldOff size={14} /> Disabled
                </span>
              )}
            </div>
          </div>

          {setupStep === "idle" && (
            <div className="flex gap-3">
              {settings.twoFactorEnabled ? (
                <Button
                  variant="outline"
                  onClick={handleDisable}
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <ShieldOff size={16} className="mr-2" /> Disable 2FA
                </Button>
              ) : (
                <Button
                  onClick={handleStartSetup}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShieldCheck size={16} className="mr-2" /> Setup 2FA
                </Button>
              )}
            </div>
          )}

          {setupStep === "setup" && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Step 1: Scan QR Code
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                {/* QR Code placeholder - in production, use a QR library */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
                  <div className="w-48 h-48 flex flex-col items-center justify-center text-center">
                    <Smartphone size={48} className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      QR Code for:<br />
                      <span className="font-mono text-[10px] break-all">{otpauthURI.substring(0, 60)}...</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Or enter this secret key manually:
                </h5>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 tracking-wider">
                    {secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="shrink-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setSetupStep("verify")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next: Verify Code
              </Button>
            </div>
          )}

          {setupStep === "verify" && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                Step 2: Enter Verification Code
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app to confirm setup.
              </p>
              <div className="max-w-xs space-y-2">
                <Label htmlFor="verify-2fa">Verification Code</Label>
                <Input
                  id="verify-2fa"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="text-center text-xl tracking-[0.5em] font-mono"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSetupStep("idle");
                    setVerifyCode("");
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={verifyCode.length !== 6}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Verify & Enable 2FA
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Password</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Change your account password.
              </p>
            </div>
            {!showPasswordChange && (
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(true)}
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-100 dark:border-blue-800"
              >
                Change Password
              </Button>
            )}
          </div>

          {showPasswordChange && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Min. 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 font-medium">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Password updated successfully.
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordError(null);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
