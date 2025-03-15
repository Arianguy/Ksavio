import React from "react";
import RuntimeChart from "./RuntimeChart";
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      {/* Header with Company Logo */}
      <header className="app-header">
        <div className="app-logo">
          <h1>Ksavio</h1>
        </div>
        <nav>{/* Navigation could be added here in the future */}</nav>
      </header>

      <main className="app-main">
        <div className="container">
          <RuntimeChart />
        </div>
      </main>
    </div>
  );
}

export default App;
