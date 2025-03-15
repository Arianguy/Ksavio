import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import runtimeData from "./runtimeData"; // Import local data
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

// Register chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function RuntimeChart() {
  const [selectedKVA, setSelectedKVA] = useState("1"); // Default selection

  // Fetch data from our local runtimeData object
  const chartData = runtimeData[selectedKVA];

  const dataForChart = {
    labels: chartData.labels, // X-axis labels (Load in Watts)
    datasets: chartData.datasets.map((ds) => ({
      ...ds,
      fill: false,
      tension: 0.4, // Smooth lines
      borderWidth: 2,
      pointRadius: 4
    }))
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>UPS Runtime Chart</h2>

      {/* KVA Selection Dropdown */}
      <label>
        Select kVA:{" "}
        <select value={selectedKVA} onChange={(e) => setSelectedKVA(e.target.value)}>
          <option value="1">1 kVA</option>
          <option value="2">2 kVA</option>
          {/* Add more options as needed */}
        </select>
      </label>

      {/* Chart */}
      <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
        <Line data={dataForChart} />
      </div>
    </div>
  );
}

export default RuntimeChart;
