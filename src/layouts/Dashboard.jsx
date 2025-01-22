import React from "react";
import PieChart from "./PieChart";
import BarChart from "./Barchart";
import Statistics from "./Statistics";

const Dashboard = () => {
  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
      }}
    >
      {/* Overview Section */}
      <h2 style={{ marginBottom: 20 }}>Overview</h2>
      <div style={{ marginBottom: 30 }}>
        <Statistics />
      </div>
      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom:30,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ marginBottom: 20 }}>Sales by Categories</h4>
          <PieChart />
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ marginBottom: "20px" }}>Sales Summary</h4>
          <BarChart />
        </div>
      </div>
      {/* Table Section */}

    </div>
  );
};
export default Dashboard;
