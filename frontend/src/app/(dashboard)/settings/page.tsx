/**
 * YieldSense AI — Settings Page
 */

"use client";

import React, { useState } from "react";
import { Settings, Bell, Shield, Trash2, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Appearance */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-5">
          <Sun className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
            <p className="text-xs text-gray-500">Select your preferred theme</p>
          </div>
          <div className="flex gap-2">
            {["Light", "Dark", "System"].map((theme) => (
              <button
                key={theme}
                className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 transition-all"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-5 w-5 text-blue-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive farm updates via email", enabled: true },
            { label: "Prediction Alerts", desc: "Get notified about new predictions", enabled: true },
            { label: "Weather Warnings", desc: "Severe weather alerts for your farms", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200
                  ${item.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}
                `}
                onClick={() => toast.success(`${item.label} toggled`)}
              >
                <span
                  className={`
                    absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
                    ${item.enabled ? "translate-x-[22px]" : "translate-x-0.5"}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="md" className="border-red-200 dark:border-red-900/50">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-5 w-5 text-red-500" />
          <h2 className="text-base font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Delete Account
            </p>
            <p className="text-xs text-gray-500">
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Account"
        maxWidth="sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This feature is not yet available. Account deletion will be implemented
          in a future milestone.
        </p>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setDeleteDialogOpen(false)}>
            Understood
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
