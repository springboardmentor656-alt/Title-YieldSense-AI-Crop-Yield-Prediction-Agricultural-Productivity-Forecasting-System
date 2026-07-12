/**
 * YieldSense AI — Auth Layout
 */

import React from "react";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/10 px-4 py-12">
      {/* Background decoration */}
      <div className="fixed top-20 right-20 w-[400px] h-[400px] bg-green-200/20 dark:bg-green-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-[300px] h-[300px] bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gradient">YieldSense AI</span>
      </Link>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
