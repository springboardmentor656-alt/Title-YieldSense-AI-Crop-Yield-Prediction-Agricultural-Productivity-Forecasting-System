/**
 * YieldSense AI — Dashboard Page
 */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin, Wheat, Ruler, BarChart3, Plus,
  TrendingUp, ArrowRight, Sprout, Cloud,
  Layers, Thermometer, Droplets,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { farmService } from "@/services/farmService";
import { predictionService } from "@/services/predictionService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ROUTES } from "@/utils/constants";
import { formatArea } from "@/utils/formatters";
import type { FarmStats } from "@/types/farm";
import type { ModelInfo } from "@/types/prediction";

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<FarmStats | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, modelData] = await Promise.allSettled([
          farmService.getStats(),
          predictionService.getModelInfo(),
        ]);
        setStats(statsData.status === "fulfilled" ? statsData.value : { total_farms: 0, total_area: 0, unique_crops: 0, crop_list: [] });
        setModelInfo(modelData.status === "fulfilled" ? modelData.value : null);
      } catch {
        setStats({ total_farms: 0, total_area: 0, unique_crops: 0, crop_list: [] });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const modelReady = modelInfo?.status === "ready" && modelInfo?.model_name;

  const statCards = [
    {
      label: "Total Farms",
      value: stats?.total_farms || 0,
      icon: <MapPin className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/20",
      bgLight: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Total Area",
      value: formatArea(stats?.total_area || 0),
      icon: <Ruler className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/20",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Crop Types",
      value: stats?.unique_crops || 0,
      icon: <Wheat className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/20",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "AI Model",
      value: modelReady ? "Ready" : "Not Trained",
      icon: <BarChart3 className="h-5 w-5" />,
      color: modelReady ? "from-purple-500 to-violet-500" : "from-gray-400 to-gray-500",
      shadowColor: modelReady ? "shadow-purple-500/20" : "shadow-gray-400/20",
      bgLight: modelReady ? "bg-purple-50 dark:bg-purple-900/20" : "bg-gray-50 dark:bg-gray-900/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.display_name?.split(" ")[0] || "Farmer"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your farms today.
          </p>
        </div>
        <Link href={ROUTES.FARM_NEW}>
          <Button>
            <Plus className="h-4 w-4" />
            Add Farm
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statCards.map((stat) => (
          <Card key={stat.label} padding="md" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg ${stat.shadowColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.bgLight} rounded-full blur-2xl opacity-60`} />
          </Card>
        ))}
      </div>

      {/* Quick Actions & AI Model Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: "Add a New Farm", href: ROUTES.FARM_NEW, icon: <Plus className="h-4 w-4" />, desc: "Register farm details and soil data" },
              { label: "View All Farms", href: ROUTES.FARMS, icon: <MapPin className="h-4 w-4" />, desc: "Manage and monitor your farms" },
              { label: "AI Predictions", href: ROUTES.PREDICTION, icon: <TrendingUp className="h-4 w-4" />, desc: "Predict crop yields with AI" },
              { label: "Weather Data", href: ROUTES.WEATHER, icon: <Cloud className="h-4 w-4" />, desc: "Live weather for farm locations" },
              { label: "Soil Analysis", href: ROUTES.SOIL, icon: <Layers className="h-4 w-4" />, desc: "Analyze soil health and NPK levels" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        {/* AI Model Status + Active Crops */}
        <div className="space-y-6">
          {/* AI Model Info */}
          {modelReady && modelInfo && (
            <Card padding="md" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" /> AI Model
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium text-gray-900 dark:text-white">{modelInfo.model_name}</span>
                </div>
                {modelInfo.test_r2 !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Accuracy (R²)</span>
                    <Badge variant="success">{(modelInfo.test_r2 * 100).toFixed(1)}%</Badge>
                  </div>
                )}
                {modelInfo.test_mae !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">MAE</span>
                    <span className="font-medium text-gray-900 dark:text-white">{modelInfo.test_mae.toFixed(4)}</span>
                  </div>
                )}
                <Link href={ROUTES.PREDICTION} className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <TrendingUp className="h-4 w-4" /> Make a Prediction
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Active Crops */}
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Crops
            </h2>
            {stats?.crop_list && stats.crop_list.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.crop_list.map((crop) => (
                  <span
                    key={crop}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  >
                    <Sprout className="h-3.5 w-3.5" />
                    {crop}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wheat className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No crops yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add a farm to see your crops here
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
