import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { yieldData } from "../data/dashboardData";
import "../styles/YieldChart.css";

function YieldChart() {
  return (
    <div className="yield-chart">

      <h2>📊 Monthly Yield Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={yieldData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="yield" fill="#2e7d32" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default YieldChart;