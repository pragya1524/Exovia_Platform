import React, { useState } from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartCustomization from './ChartCustomization';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      fill?: boolean;
    }[];
  };
  userId: string;
}

export default function Chart({ type, data, userId }: ChartProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        labels: {
          color: '#6b4f3b' // warm brown for legend labels
        }
      },
      title: {
        display: true,
        text: data.labels?.[0] && data.datasets?.[0]?.label
          ? `${data.labels[0]} vs ${data.datasets[0].label}`
          : 'Chart',
        color: '#5a4635',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: '#fdfaf5',
        titleColor: '#6b4f3b',
        bodyColor: '#7a7066',
        borderColor: '#d0a26c',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: '#e6e0d6'
        },
        ticks: {
          color: '#6b4f3b'
        }
      },
      y: {
        grid: {
          display: showGrid,
          color: '#e6e0d6'
        },
        ticks: {
          color: '#6b4f3b'
        }
      }
    },
    animation: {
      duration: enableAnimation ? 1000 : 0
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={data} options={chartOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  };

  return (
    <div className="space-y-4 bg-[#fdfaf5] p-4 rounded-lg shadow-lg border border-[#e6e0d6]">
      <div className="h-[400px]">
        {renderChart()}
      </div>
      <ChartCustomization
        showGrid={showGrid}
        showLegend={showLegend}
        enableAnimation={enableAnimation}
        onShowGridChange={setShowGrid}
        onShowLegendChange={setShowLegend}
        onEnableAnimationChange={setEnableAnimation}
        onStyleChange={() => {}} 
        onExport={() => {}}      
      />
    </div>
  );
}
