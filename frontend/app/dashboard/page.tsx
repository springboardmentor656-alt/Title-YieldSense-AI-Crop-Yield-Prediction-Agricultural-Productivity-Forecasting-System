"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import YieldChart from "@/components/dashboard/YieldChart";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import RecommendationPanel from "@/components/dashboard/RecommendationPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivities from "@/components/dashboard/RecentActivities";
import FarmOverview from "@/components/dashboard/FarmOverview";
import YieldTrendChart from "@/components/dashboard/YieldTrendChart";
import ProductivityScore from "@/components/dashboard/ProductivityScore";
import SeasonalComparisonChart from "@/components/dashboard/SeasonalComparisonChart";
import FarmComparisonChart from "@/components/dashboard/FarmComparisonChart";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {

    const { summary, loading, error } = useDashboard();

    return (

        <div className="space-y-8">

            <DashboardHeader />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <StatsGrid />

            <FarmOverview />

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">

                    <YieldChart />

                </div>

                <WeatherWidget />

            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">

                    <YieldTrendChart points={summary?.yield_trend ?? []} loading={loading} />

                </div>

                <ProductivityScore data={summary?.productivity_score} loading={loading} />

            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                <SeasonalComparisonChart points={summary?.seasonal_comparison ?? []} loading={loading} />

                <FarmComparisonChart farms={summary?.farm_comparison ?? []} loading={loading} />

            </div>

            <RecommendationPanel />

            <div className="grid lg:grid-cols-2 gap-6">

                <QuickActions />

                <RecentActivities />

            </div>

        </div>

    );

}
