# KSTAR UPS Runtime Chart

A modern, interactive web application for visualizing UPS battery runtime data. This tool helps users understand how long their UPS systems will run under different load conditions.

![KSTAR UPS Runtime Chart](https://via.placeholder.com/800x400?text=KSTAR+UPS+Runtime+Chart)

## Features

- **Interactive Charts**: Visualize runtime data with interactive charts
- **Multiple UPS Models**: Support for different kVA ratings and battery configurations
- **PDF Export**: Generate professional PDF reports with runtime data
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React**: Frontend UI library
- **Chart.js**: Chart visualization
- **jsPDF & html2canvas**: PDF generation
- **CSS3**: Modern styling with CSS variables and responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/kstar-runtime-chart.git
   cd kstar-runtime-chart
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

1. Select the kVA rating from the dropdown menu
2. View the runtime chart showing different battery configurations
3. Export the chart as a PDF by clicking the "Export as PDF" button

## Project Structure

```
kstar-runtime-chart/
├── public/                  # Static files
│   ├── images/              # Image assets
│   └── index.html           # HTML template
├── src/                     # Source code
│   ├── styles/              # CSS files
│   │   ├── global.css       # Global styles
│   │   ├── App.css          # App component styles
│   │   └── RuntimeChart.css # Chart component styles
│   ├── App.jsx              # Main App component
│   ├── RuntimeChart.jsx     # Chart component
│   ├── runtimeData.js       # Chart data
│   └── index.js             # Application entry point
└── package.json             # Dependencies and scripts
```

## Customization

### Adding New UPS Models

To add new UPS models, edit the `runtimeData.js` file and add a new entry to the `runtimeData` object:

```javascript
"3": {  // 3kVA model
  labels: [0, 200, 400, 600, 800, 1000, 1200],
  datasets: [
    {
      label: "3kVA Standard Battery",
      data: [180, 120, 90, 60, 45, 30],
      borderColor: COLORS.blue.border,
      backgroundColor: COLORS.blue.background
    }
  ]
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- KSTAR for providing the UPS runtime data
- Chart.js team for the excellent charting library
- React team for the frontend framework
