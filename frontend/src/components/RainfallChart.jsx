import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { rainfallData } from "../data/dashboardData";
import "../styles/RainfallChart.css";

function RainfallChart() {
  return (
    <div className="rainfall-chart">

      <h2>🌧 Weekly Rainfall Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rainfallData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="rainfall"
            stroke="#2e7d32"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default RainfallChart;