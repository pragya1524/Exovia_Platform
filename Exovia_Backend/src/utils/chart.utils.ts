import { IAnalysis } from '../models/analysis.model';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

interface ChartConfig {
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  data: any[];
}

export const generateChartImage = async (config: ChartConfig): Promise<Buffer> => {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const chartData: ChartData = {
    labels: config.data.map(item => item[config.xAxis]),
    datasets: [{
      label: config.yAxis,
      data: config.data.map(item => item[config.yAxis]),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${config.yAxis} vs ${config.xAxis}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const configuration = {
    type: config.chartType,
    data: chartData,
    options: chartOptions
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}; 