import {
  FaLeaf,
  FaTint,
  FaSeedling,
  FaChartLine,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import FarmHealth from "../components/FarmHealth";
import WeatherChart from "../components/WeatherChart";
import AIRecommendation from "../components/AIRecommendation";
import YieldChart from "../components/YieldChart";
import CropPieChart from "../components/CropPieChart";
import RainfallChart from "../components/RainfallChart";
import RecentActivity from "../components/RecentActivity";
import FarmingTip from "../components/FarmingTip";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [recommendedCrop, setRecommendedCrop] = useState("Rice");
  const [temperature, setTemperature] = useState("--");
  const [condition, setCondition] = useState("Loading...");

useEffect(() => {
  const crop = localStorage.getItem("recommendedCrop");

  if (crop) {
    setRecommendedCrop(crop);
  }
}, []);

useEffect(() => {
  const fetchWeather = async () => {
    try {
      const response = await api.get("/weather");

      setTemperature(`${response.data.temperature}°C`);
      setCondition(response.data.condition);
    } catch (error) {
      console.error("Weather fetch failed:", error);
    }
  };

  fetchWeather();
}, []);

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="cards">

  <StatCard
  icon={<FaTint />}
  title="Weather"
  value={temperature}
  description={condition}
/>

  <StatCard
    icon={<FaLeaf />}
    title="Farm Health"
    value="92%"
    description="Excellent"
  />

  <StatCard
  icon={<FaSeedling />}
  title="Best Crop"
  value={recommendedCrop}
  description="95% Match"
/>

  <StatCard
    icon={<FaChartLine />}
    title="Expected Yield"
    value="4.8 Tons"
    description="This Season"
  />

</div>

        {/* Row 1 */}

<div className="dashboard-grid">

  <FarmHealth />

  <AIRecommendation />

</div>

{/* Row 2 */}

<div className="dashboard-grid">

  <WeatherChart />

  <YieldChart />

</div>

{/* Row 3 */}

<div className="dashboard-grid">

  <CropPieChart />

  <RainfallChart />

</div>

{/* Row 4 */}

<div className="dashboard-grid">

  <RecentActivity />

  <FarmingTip />

</div>
        </div>
  </div>
       
  );
}

export default Dashboard;