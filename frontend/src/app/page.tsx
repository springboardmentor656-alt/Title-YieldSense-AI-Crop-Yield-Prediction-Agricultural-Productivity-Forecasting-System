/**
 * YieldSense AI — Landing Page
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout, BarChart3, Cloud, Layers, ArrowRight,
  Shield, Zap, Globe, ChevronRight,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "AI Yield Prediction",
    description: "Predict crop yields with machine learning models trained on historical agricultural data.",
    color: "from-green-500 to-emerald-500",
    shadowColor: "shadow-green-500/20",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Weather Integration",
    description: "Real-time weather data and forecasts to optimize planting and harvesting decisions.",
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Soil Analysis",
    description: "Comprehensive soil health monitoring with NPK analysis and pH tracking.",
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Farm Management",
    description: "Manage multiple farms with detailed crop, soil, and location data in one place.",
    color: "from-purple-500 to-violet-500",
    shadowColor: "shadow-purple-500/20",
  },
];

const steps = [
  { step: "01", title: "Create Account", description: "Sign up in seconds and set up your farm profile." },
  { step: "02", title: "Add Your Farms", description: "Enter farm details including location, soil data, and crops." },
  { step: "03", title: "Get Predictions", description: "Receive AI-powered yield forecasts and recommendations." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">YieldSense AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href={ROUTES.SIGNUP}>
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-green-200/30 dark:bg-green-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/30 dark:bg-emerald-800/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-32 lg:pb-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 mb-8">
              <Zap className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                AI-Powered Agriculture
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Predict Crop Yields with{" "}
              <span className="text-gradient">Artificial Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Harness the power of machine learning to forecast agricultural productivity,
              optimize farming decisions, and maximize your harvest potential.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={ROUTES.SIGNUP}>
                <Button size="lg" className="text-base px-8">
                  Start Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" size="lg" className="text-base px-8">
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { value: "50+", label: "Crop Types" },
                { value: "95%", label: "Accuracy" },
                { value: "Free", label: "Forever" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for{" "}
              <span className="text-gradient">Smart Farming</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive platform that combines AI predictions, weather data,
              and soil analysis to help farmers make data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl ${feature.shadowColor} transition-all duration-500 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg ${feature.shadowColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-green-300 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 text-green-600 text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-animated p-12 sm:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of farmers using AI to improve crop yields and make smarter agricultural decisions.
              </p>
              <Link href={ROUTES.SIGNUP}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-green-700 hover:bg-gray-100 shadow-xl text-base px-8"
                >
                  Get Started — It&apos;s Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gradient">YieldSense AI</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} YieldSense AI. Built for smarter agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
