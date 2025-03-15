/**
 * UPS Runtime Data
 *
 * This file contains the runtime data for different UPS models.
 * The data is organized by kVA rating.
 *
 * Structure:
 * - Each kVA rating has its own object with labels (load in watts) and datasets
 * - Each dataset represents a different battery configuration
 * - Data points represent runtime in minutes at the corresponding load
 */

const COLORS = {
  blue: {
    border: "rgb(54, 162, 235)",
    background: "rgba(54, 162, 235, 0.1)",
  },
  purple: {
    border: "rgb(153, 102, 255)",
    background: "rgba(153, 102, 255, 0.1)",
  },
  green: {
    border: "rgb(75, 192, 192)",
    background: "rgba(75, 192, 192, 0.1)",
  },
  red: {
    border: "rgb(255, 99, 132)",
    background: "rgba(255, 99, 132, 0.1)",
  },
  orange: {
    border: "rgb(255, 159, 64)",
    background: "rgba(255, 159, 64, 0.1)",
  },
  yellow: {
    border: "rgb(255, 205, 86)",
    background: "rgba(255, 205, 86, 0.1)",
  },
  teal: {
    border: "rgb(0, 128, 128)",
    background: "rgba(0, 128, 128, 0.1)",
  },
  pink: {
    border: "rgb(255, 105, 180)",
    background: "rgba(255, 105, 180, 0.1)",
  },
};

const runtimeData = {
  1: {
    labels: [150, 300, 450, 600, 800, 900],
    datasets: [
      {
        label: "MP RT 1k S (Internal batteries only)",
        data: [60, 30, 15, 12, 7, 5],
        borderColor: COLORS.blue.border,
        backgroundColor: COLORS.blue.background,
      },
      {
        label: "MP RT 1k S + 1 EBP (BR04024C)",
        data: [150, 90, 60, 45, 35, 25],
        borderColor: COLORS.purple.border,
        backgroundColor: COLORS.purple.background,
      },
      {
        label: "MP RT 1k S + 2 EBP (BR04024C)",
        data: [250, 163, 100, 75, 60, 45],
        borderColor: COLORS.green.border,
        backgroundColor: COLORS.green.background,
      },
    ],
  },
  2: {
    labels: [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
    datasets: [
      {
        label: "MP RT 2k S (Internal batteries only)",
        data: [60, 30, 17, 12, 8, 6, 5, 4, 2.14],
        borderColor: COLORS.red.border,
        backgroundColor: COLORS.red.background,
      },
      {
        label: "MP RT 2k S + 1 EBP (BR08048C)",
        data: [200, 120, 80, 45, 40, 30, 25, 20, 18],
        borderColor: COLORS.orange.border,
        backgroundColor: COLORS.orange.background,
      },
      {
        label: "MP RT 2k S + 2 EBP (BR08048C)",
        data: [300, 200, 140, 90, 80, 60, 45, 40, 30],
        borderColor: COLORS.green.border,
        backgroundColor: COLORS.green.background,
      },
      {
        label: "MP RT 2k S + 3 EBP (BR08048C)",
        data: [500, 300, 200, 140, 100, 90, 80, 60, 50],
        borderColor: COLORS.purple.border,
        backgroundColor: COLORS.purple.background,
      },
    ],
  },
  3: {
    labels: [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700],
    datasets: [
      {
        label: "MP RT 3k S (Internal batteries only)",
        data: [60, 30, 17, 12, 8, 6, 5, 4, 2.14],
        borderColor: COLORS.blue.border,
        backgroundColor: COLORS.blue.background,
      },
      {
        label: "MP RT 3k S + 1 EBP (BR12072C)",
        data: [240, 120, 80, 45, 40, 30, 25, 20, 18],
        borderColor: COLORS.purple.border,
        backgroundColor: COLORS.purple.background,
      },
      {
        label: "MP RT 3k S + 2 EBP (BR12072C)",
        data: [300, 200, 140, 90, 80, 60, 45, 40, 30],
        borderColor: COLORS.green.border,
        backgroundColor: COLORS.green.background,
      },
      {
        label: "MP RT 3k S + 3 EBP (BR12072C)",
        data: [500, 300, 200, 140, 120, 90, 80, 60, 50],
        borderColor: COLORS.orange.border,
        backgroundColor: COLORS.orange.background,
      },
    ],
  },
  6: {
    labels: [900, 1800, 2700, 3600, 4500, 5400],
    datasets: [
      {
        label: "MP RT Pro 6K + 1 EBP (MP BR20240)",
        data: [80, 37, 23, 16, 13, 10],
        borderColor: COLORS.blue.border,
        backgroundColor: COLORS.blue.background,
      },
      {
        label: "MP RT Pro 6K + 2 EBP (MP BR20240)",
        data: [163, 80, 50, 35, 28, 23],
        borderColor: COLORS.purple.border,
        backgroundColor: COLORS.purple.background,
      },
      {
        label: "MP RT Pro 6K + 3 EBP (MP BR20240)",
        data: [245, 122, 80, 55, 45, 35],
        borderColor: COLORS.green.border,
        backgroundColor: COLORS.green.background,
      },
      {
        label: "MP RT Pro 6K + 4 EBP (MP BR20240)",
        data: [328, 163, 109, 80, 60, 50],
        borderColor: COLORS.orange.border,
        backgroundColor: COLORS.orange.background,
      },
      {
        label: "MP RT Pro 6K + 5 EBP (MP BR20240)",
        data: [410, 204, 136, 102, 80, 68],
        borderColor: COLORS.red.border,
        backgroundColor: COLORS.red.background,
      },
    ],
  },
  10: {
    labels: [1500, 3000, 4500, 6000, 7500, 9000],
    datasets: [
      {
        label: "MP RT Pro 10K + 1 EBP (MP BR20240)",
        data: [45, 21, 13, 9, 7, 5],
        borderColor: COLORS.blue.border,
        backgroundColor: COLORS.blue.background,
      },
      {
        label: "MP RT Pro 10K + 2 EBP (MP BR20240)",
        data: [98, 45, 28, 21, 15, 13],
        borderColor: COLORS.purple.border,
        backgroundColor: COLORS.purple.background,
      },
      {
        label: "MP RT Pro 10K + 3 EBP (MP BR20240)",
        data: [148, 68, 45, 31, 25, 21],
        borderColor: COLORS.green.border,
        backgroundColor: COLORS.green.background,
      },
      {
        label: "MP RT Pro 10K + 4 EBP (MP BR20240)",
        data: [197, 98, 60, 45, 33, 28],
        borderColor: COLORS.orange.border,
        backgroundColor: COLORS.orange.background,
      },
      {
        label: "MP RT Pro 10K + 5 EBP (MP BR20240)",
        data: [247, 123, 80, 56, 45, 37],
        borderColor: COLORS.red.border,
        backgroundColor: COLORS.red.background,
      },
      {
        label: "MP RT Pro 10K + 6 EBP (MP BR20240)",
        data: [296, 148, 98, 74, 54, 45],
        borderColor: COLORS.yellow.border,
        backgroundColor: COLORS.yellow.background,
      },
      {
        label: "MP RT Pro 10K + 7 EBP (MP BR20240)",
        data: [345, 172, 115, 86, 69, 53],
        borderColor: COLORS.teal.border,
        backgroundColor: COLORS.teal.background,
      },
      {
        label: "MP RT Pro 10K + 8 EBP (MP BR20240)",
        data: [395, 197, 131, 98, 79, 65],
        borderColor: COLORS.pink.border,
        backgroundColor: COLORS.pink.background,
      },
    ],
  },
};

export default runtimeData;
