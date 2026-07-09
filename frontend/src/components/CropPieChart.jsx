import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { cropData } from "../data/dashboardData";
import "../styles/CropPieChart.css";

const COLORS = [
  "#2e7d32",
  "#66bb6a",
  "#81c784",
  "#a5d6a7",
];

function CropPieChart() {
  return (
    <div className="crop-chart">

      <h2>🥧 Crop Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={cropData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {cropData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default CropPieChart;