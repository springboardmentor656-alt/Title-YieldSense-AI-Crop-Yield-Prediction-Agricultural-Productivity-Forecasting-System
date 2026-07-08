import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import YieldChart from "@/components/dashboard/YieldChart";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import RecommendationPanel from "@/components/dashboard/RecommendationPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivities from "@/components/dashboard/RecentActivities";
import FarmOverview from "@/components/dashboard/FarmOverview";
import { ok } from "assert";

export default function DashboardPage() {

    return (

        <div className="space-y-8">

            <DashboardHeader />

            <StatsGrid />

            <FarmOverview />

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">

                    <YieldChart />

                </div>

                <WeatherWidget />

            </div>

            <RecommendationPanel />

            <div className="grid lg:grid-cols-2 gap-6">

                <QuickActions />

                <RecentActivities />

            </div>

        </div>

    );

}