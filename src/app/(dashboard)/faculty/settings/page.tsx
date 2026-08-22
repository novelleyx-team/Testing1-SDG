"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Mail } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Faculty Settings</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-blue-500" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive updates and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive emails for new project submissions.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Browser Push</h4>
                <p className="text-sm text-gray-500">Get notified directly in your browser.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="text-blue-500" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-gray-300">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-gray-300">
              Enable Two-Factor Authentication (2FA)
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="text-blue-500" />
              Contact Preferences
            </CardTitle>
            <CardDescription>
              How students and admins can reach you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Email</label>
              <input 
                type="email" 
                defaultValue="faculty@mlritm.ac.in" 
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#111827]" 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Office Hours Note (Visible to Students)</label>
              <textarea 
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1F2937] resize-none h-24"
                placeholder="E.g., I am available every Tuesday from 2 PM to 4 PM in Room 402."
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
