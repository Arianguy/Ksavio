import React, { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import runtimeData from "./runtimeData"; // Local data file
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./styles/RuntimeChart.css";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

// Add annotation plugin for 60-minute reference line
ChartJS.register({
  id: "sixtyMinLine",
  beforeDraw: (chart) => {
    if (chart.options.plugins?.sixtyMinLine?.enabled !== false) {
      const { ctx, chartArea, scales } = chart;
      const yAxis = scales.y;
      const sixtyMinPosition = yAxis.getPixelForValue(60);

      // Only draw if 60 is within the visible range
      if (
        sixtyMinPosition >= chartArea.top &&
        sixtyMinPosition <= chartArea.bottom
      ) {
        // Save the current state
        ctx.save();

        // Set line style
        ctx.beginPath();
        ctx.moveTo(chartArea.left, sixtyMinPosition);
        ctx.lineTo(chartArea.right, sixtyMinPosition);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.setLineDash([5, 5]); // Dotted line
        ctx.stroke();

        // Add label
        ctx.fillStyle = "red";
        ctx.font = "12px Roboto, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("60 min", chartArea.right - 5, sixtyMinPosition - 5);

        // Restore the state
        ctx.restore();
      }
    }
  },
});

function RuntimeChart() {
  const [selectedKVA, setSelectedKVA] = useState("1"); // Default kVA
  const chartRef = useRef(); // Reference to the chart container

  // Get runtime data for the selected kVA
  const chartData = runtimeData[selectedKVA];

  // Correct dataset transformation: (Load in Watts -> X, Time in Minutes -> Y)
  const transformedDatasets = chartData.datasets.map((ds) => ({
    label: ds.label,
    data: chartData.labels.map((load, index) => ({
      x: load, // X-Axis: Load in Watts
      y: ds.data[index], // Y-Axis: Time in Minutes
    })),
    fill: false,
    tension: 0, // Ensures straight lines
    borderWidth: 2,
    borderColor: ds.borderColor,
    backgroundColor: ds.backgroundColor,
  }));

  // Chart.js Data Object
  const dataForChart = {
    datasets: transformedDatasets,
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Load in Watts",
          font: {
            size: 14,
            weight: "bold",
            family: "'Roboto', sans-serif",
          },
          padding: { top: 10, bottom: 10 },
          color: "#555",
        },
        ticks: {
          beginAtZero: false,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 8,
          color: "#666",
          callback: function (value) {
            const numValue = Number(value);
            if (chartData.labels.includes(numValue)) {
              return numValue + "W";
            }
            return null;
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
          drawBorder: false,
          tickLength: 8,
          z: -1,
        },
        border: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          width: 1,
          dash: [0, 0],
        },
        min: chartData.labels[0],
        max: chartData.labels[chartData.labels.length - 1],
        afterBuildTicks: (axis) => {
          axis.ticks = chartData.labels.map((value) => ({
            value: Number(value),
          }));
        },
      },
      y: {
        title: {
          display: true,
          text: "Time in Minutes",
          font: {
            size: 14,
            weight: "bold",
            family: "'Roboto', sans-serif",
          },
          padding: { top: 10, bottom: 10 },
          color: "#555",
        },
        ticks: {
          beginAtZero: false,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 8,
          color: "#666",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
          drawBorder: false,
          tickLength: 8,
          z: -1,
        },
        border: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          width: 1,
          dash: [0, 0],
        },
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const yAxis = chart.scales.y;
          const sixtyMinPosition = yAxis.getPixelForValue(60);

          // Save the current state
          ctx.save();

          // Set line style
          ctx.beginPath();
          ctx.moveTo(yAxis.left, sixtyMinPosition);
          ctx.lineTo(yAxis.right, sixtyMinPosition);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "red";
          ctx.setLineDash([5, 5]); // Dotted line
          ctx.stroke();

          // Add label
          ctx.fillStyle = "red";
          ctx.font = "12px Roboto, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText("60 min", yAxis.right - 5, sixtyMinPosition - 5);

          // Restore the state
          ctx.restore();
        },
      },
    },
    plugins: {
      sixtyMinLine: {
        enabled: true,
      },
      legend: {
        position: "top",
        align: "center",
        labels: {
          padding: 20,
          boxWidth: 15,
          boxHeight: 15,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "white",
        bodyColor: "white",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Roboto', sans-serif",
        },
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        callbacks: {
          title: (items) => `Load: ${items[0].parsed.x} Watts`,
          label: (item) => `${item.dataset.label}: ${item.parsed.y} minutes`,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 2,
      },
      line: {
        tension: 0.1, // Slight curve for more modern look
        borderWidth: 3,
        fill: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 10,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  // Print to PDF Function
  const handlePrint = async () => {
    const input = chartRef.current;

    try {
      // Convert the chart container to an image
      const canvas = await html2canvas(input, {
        scale: 3, // Higher scale for better quality
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      // Load the "VERIFIED" image - works in both local and production
      const verifiedImgPath = process.env.PUBLIC_URL
        ? `${process.env.PUBLIC_URL}/images/verified.png`
        : "/images/verified.png";

      const verifiedImg = await fetch(verifiedImgPath)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        )
        .catch((error) => {
          console.error("Error loading verified image:", error);
          return null;
        });

      // Initialize PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add light background
      pdf.setFillColor(250, 250, 250); // Very light gray background
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Add decorative header with print-friendly gray
      const headerHeight = 30;
      pdf.setFillColor(80, 80, 80); // Dark gray for header
      pdf.rect(0, 0, pageWidth, headerHeight, "F");

      // Add subtle gradient overlay to header
      pdf.setFillColor(60, 60, 60, 0.3); // Slightly darker gray with transparency
      pdf.rect(pageWidth / 2, 0, pageWidth / 2, headerHeight, "F");

      // Add title with better styling
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("Ksavio UPS Runtime Chart", pageWidth / 2, 15, {
        align: "center",
      });

      // Add subtitle
      pdf.setFontSize(12);
      pdf.text("Professional Battery Runtime Analysis", pageWidth / 2, 24, {
        align: "center",
      });

      // Reset text color for the rest of the document
      pdf.setTextColor(60, 60, 60); // Dark gray for better readability

      // Add kVA selection with better styling
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(`Configuration: ${selectedKVA} kVA`, 30, headerHeight + 15);

      // Add date with better styling
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Generated: ${currentDate}`, pageWidth - 30, headerHeight + 15, {
        align: "right",
      });

      // Add horizontal divider
      pdf.setDrawColor(120, 120, 120, 0.5); // Medium gray for divider
      pdf.setLineWidth(0.5);
      pdf.line(25, headerHeight + 20, pageWidth - 25, headerHeight + 20);

      // Add Chart Image - centered with better positioning
      const imgWidth = 150; // Further reduced from 160 to ensure it fits within A4 margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = headerHeight + 30;

      // Add subtle shadow effect for chart (draw a slightly larger black rectangle behind with low opacity)
      pdf.setFillColor(0, 0, 0, 0.08); // Very light shadow
      pdf.roundedRect(
        imgX - 2,
        imgY - 2,
        imgWidth + 4,
        imgHeight + 4,
        3,
        3,
        "F"
      );

      // Add chart with rounded corners (simulate by drawing white rectangle behind)
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(
        imgX - 1,
        imgY - 1,
        imgWidth + 2,
        imgHeight + 2,
        2,
        2,
        "F"
      );

      // Add the actual chart image
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);

      // Add "DUMMY DATA" watermark across the chart with better styling
      pdf.setTextColor(180, 180, 180); // Light gray color for watermark
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(40);
      pdf.setGState(new pdf.GState({ opacity: 0.2 }));

      // Position the watermark diagonally across the chart area
      pdf.text("DUMMY DATA", pageWidth / 2, imgY + imgHeight / 2, {
        align: "center",
        angle: 45,
        renderingMode: "fillThenStroke",
      });

      // Reset opacity and text color
      pdf.setGState(new pdf.GState({ opacity: 1.0 }));
      pdf.setTextColor(80, 80, 80);

      // Add data table below the chart
      const tableY = imgY + imgHeight + 15;

      // Add table title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11); // Reduced from 12
      pdf.text("Runtime Data Table", pageWidth / 2, tableY, {
        align: "center",
      });

      // Get the data for the table
      const labels = chartData.labels;
      const datasets = chartData.datasets;

      // Calculate table dimensions
      const tableStartY = tableY + 8; // Reduced from 10
      const cellPadding = 2; // Reduced from 3
      const modelColWidth = 40; // Wider first column for model names
      const dataColWidth = 16; // Slightly narrower data columns to compensate
      const headerRowHeight = 12; // Reduced from 14
      const dataRowHeight = 8; // Reduced from 10

      // Calculate table width based on number of columns
      const numCols = labels.length + 1; // +1 for the model name column
      const tableWidth = modelColWidth + dataColWidth * labels.length;
      const tableStartX = (pageWidth - tableWidth) / 2;

      // Draw table header background
      pdf.setFillColor(220, 220, 220); // Light gray for header
      pdf.rect(tableStartX, tableStartY, tableWidth, headerRowHeight, "F");

      // Draw table header text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7); // Reduced from 8
      pdf.setTextColor(60, 60, 60);

      // Draw header for model column
      pdf.text(
        "Model / Load",
        tableStartX + cellPadding,
        tableStartY + headerRowHeight - cellPadding
      );

      // Draw headers for each load value
      labels.forEach((load, index) => {
        const x =
          tableStartX + modelColWidth + index * dataColWidth + cellPadding;
        const y = tableStartY + headerRowHeight - cellPadding;
        pdf.text(`${load} W`, x, y);
      });

      // Draw data rows
      datasets.forEach((dataset, rowIndex) => {
        const rowY = tableStartY + headerRowHeight + rowIndex * dataRowHeight;

        // Alternate row background for better readability
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(tableStartX, rowY, tableWidth, dataRowHeight, "F");
        }

        // Draw model name (no truncation)
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6); // Reduced from 7

        // Display full model name without truncation
        pdf.text(
          dataset.label,
          tableStartX + cellPadding,
          rowY + dataRowHeight - cellPadding
        );

        // Draw runtime values
        dataset.data.forEach((value, colIndex) => {
          const x =
            tableStartX + modelColWidth + colIndex * dataColWidth + cellPadding;
          const y = rowY + dataRowHeight - cellPadding;
          pdf.text(`${value} min`, x, y);
        });

        // Draw horizontal grid lines
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.1);
        pdf.line(tableStartX, rowY, tableStartX + tableWidth, rowY);
      });

      // Draw final horizontal line
      const tableEndY =
        tableStartY + headerRowHeight + datasets.length * dataRowHeight;
      pdf.line(tableStartX, tableEndY, tableStartX + tableWidth, tableEndY);

      // Draw vertical grid lines
      // First line after model column
      pdf.line(
        tableStartX + modelColWidth,
        tableStartY,
        tableStartX + modelColWidth,
        tableEndY
      );

      // Remaining data column lines
      for (let i = 1; i <= labels.length; i++) {
        const x = tableStartX + modelColWidth + i * dataColWidth;
        pdf.line(x, tableStartY, x, tableEndY);
      }

      // Draw outer table border
      pdf.setDrawColor(120, 120, 120);
      pdf.setLineWidth(0.5);
      pdf.rect(tableStartX, tableStartY, tableWidth, tableEndY - tableStartY);

      // Add section title for disclaimer (adjust position based on table)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Important Notes:", 30, tableEndY + 15);

      // Add Disclaimer with better styling (adjust position based on table)
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const disclaimerText =
        "Battery runtimes are approximate and may vary with equipment depending on configuration, battery age, temperature, etc. This chart should be used for reference purposes only. For critical applications, please consult with a Ksavio technical representative.";
      pdf.text(disclaimerText, 30, tableEndY + 25, {
        maxWidth: pageWidth - 60,
        align: "justify",
      });

      // Add "VERIFIED" image as a perfect square with better positioning
      if (verifiedImg) {
        // Make it a perfect square with smaller dimensions
        const verifiedSize = 25; // 25mm square
        const verifiedX = 30; // 30mm from the left edge
        const verifiedY = pageHeight - 40; // 40mm from the bottom

        // Add subtle shadow effect
        pdf.setFillColor(0, 0, 0, 0.08); // Very light shadow
        pdf.roundedRect(
          verifiedX - 1,
          verifiedY - 1,
          verifiedSize + 2,
          verifiedSize + 2,
          2,
          2,
          "F"
        );

        // Add the verified image
        pdf.addImage(
          verifiedImg,
          "PNG",
          verifiedX,
          verifiedY,
          verifiedSize,
          verifiedSize
        );

        // Add verification text
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80); // Dark gray for verification text
        pdf.text("VERIFIED", verifiedX + verifiedSize + 5, verifiedY + 15);
      }

      // Add footer with contact information
      pdf.setDrawColor(120, 120, 120); // Medium gray for footer line
      pdf.setLineWidth(0.5);
      pdf.line(30, pageHeight - 15, pageWidth - 30, pageHeight - 15);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120); // Medium gray for footer text
      pdf.text(
        "For more information, visit www.ksavio.com | Contact: support@ksavio.com | Tel: +1-800-KSAVIO",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      // Save PDF with better filename including date
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`Ksavio_UPS_${selectedKVA}kVA_Runtime_Chart_${dateStr}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="card text-center">
      <h2 className="chart-title">UPS Runtime Chart</h2>

      {/* kVA Selection Dropdown */}
      <div className="chart-controls">
        <label htmlFor="kva-select">Select kVA: </label>
        <select
          id="kva-select"
          className="chart-select"
          value={selectedKVA}
          onChange={(e) => setSelectedKVA(e.target.value)}
        >
          <option value="1">1 kVA - MP RT 1k S</option>
          <option value="2">2 kVA - MP RT 2k S</option>
          <option value="3">3 kVA - MP RT 3k S</option>
          <option value="6">6 kVA - MP RT Pro 6K</option>
          <option value="10">10 kVA - MP RT Pro 10K</option>
        </select>
      </div>

      {/* Chart Container */}
      <div ref={chartRef} className="chart-container">
        <Line data={dataForChart} options={options} />
      </div>

      {/* Legend Instruction */}
      <p className="legend-instruction">
        Please click on the battery pack count on the legend to remove the
        unwanted
      </p>

      {/* Disclaimer */}
      <p className="chart-disclaimer">
        Battery runtimes are approximate and may vary with equipment depending
        on configuration, battery age, temperature, etc.
      </p>

      {/* Print Button */}
      <button onClick={handlePrint} className="print-button">
        <span className="print-icon">📄</span> Export as PDF
      </button>
    </div>
  );
}

export default RuntimeChart;
