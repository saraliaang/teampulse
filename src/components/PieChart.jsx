import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import './PieChart.css'

const chartConfig = {
  mood: {
    title: "Mood Mix - current week",
    // Peach/orange gradient: Angry (darkest) → Anxious → Calm → Empowered (lightest)
    colors: ["#8a5a44", "#b07d62", "#d69f7e", "#edc4b3"]
  },
  workload: {
    title: "Workload Mix - current week",
    // Blue gradient: Overwhelmed (darkest) → Under Pressure → Manageable → Light (lightest)
    colors: ["#415d43", "#709775", "#8fb996", "#a1cca5"]
  }
};

ChartJS.register(ArcElement, Tooltip, Legend);

const donutAnimationPlugin = {
  id: 'donutAnimation',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea: { left, top, width, height } } = chart;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Get current animation frame (0 to 1)
    const animationFrame = chart.animationStatus?.progress ?? 1;
    
    if (animationFrame < 1) {
      ctx.save();
      ctx.globalAlpha = animationFrame;
      
      // Create a rotation animation effect
      ctx.translate(centerX, centerY);
      ctx.rotate((animationFrame * Math.PI * 2) * 0.3); // Rotate up to ~108 degrees
      ctx.translate(-centerX, -centerY);
      
      ctx.restore();
    }
  }
};

export default function PieChart({ chartType = "workload", logs = [], isLoading = false }) {
  const [chartData, setChartData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const config = chartConfig[chartType];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!logs || logs.length === 0) {
      // Don't show any data if no logs provided
      setChartData(null);
      return;
    }

    // Calculate distribution from actual logs
    const moodMap = { 1: "Angry", 2: "Anxious", 3: "Calm", 4: "Empowered" };
    const workloadMap = { 1: "Overwhelmed", 2: "Under Pressure", 3: "Manageable", 4: "Light" };
    
    const valueKey = chartType === "mood" ? "mood_value" : "workload_value";
    const valueMap = chartType === "mood" ? moodMap : workloadMap;

    // Count occurrences
    const counts = {};
    logs.forEach(log => {
      const value = log[valueKey];
      const label = valueMap[value];
      counts[label] = (counts[label] || 0) + 1;
    });

    // Get labels in correct order
    const labels = Object.values(valueMap);
    const data = labels.map(label => counts[label] || 0);

    setChartData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: config.colors,
          borderWidth: 0
        }
      ]
    });
  }, [chartType, logs]);

  if (!chartData) {
    if (isLoading) {
      // Don't show anything while loading
      return (
        <div className="pie-chart-container">
          <h3>{config.title}</h3>
        </div>
      );
    }
    
    // Only show error message if we have logs but no data (after loading)
    if (logs && logs.length > 0) {
      return (
        <div className="pie-chart-container">
          <h3>{config.title}</h3>
          <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No data available. Waiting for team check-ins...</p>
        </div>
      );
    }
    
    // Show empty state if still loading or no logs yet
    return (
      <div className="pie-chart-container">
        <h3>{config.title}</h3>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <h3>{config.title}</h3>
      <div className="chart-wrapper">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1000,
              easing: 'easeInOutQuart'
            },
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: { 
                  usePointStyle: true, 
                  padding: isMobile ? 10 : 20,
                  font: {
                    size: isMobile ? 13 : 16,
                    weight: '400'
                  }
                }
              },
              tooltip: {
                enabled: true
              }
            }
          }}
          plugins={[donutAnimationPlugin]}
        />
      </div>
    </div>
  );
}