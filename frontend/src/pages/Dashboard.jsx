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
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="cards">

  <StatCard
    icon={<FaTint />}
    title="Weather"
    value="29°C"
    description="Patchy Rain Nearby"
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
    value="Rice"
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