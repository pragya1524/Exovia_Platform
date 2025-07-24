import { useState, useRef, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, Legend, ScatterChart as ReScatterChart, Scatter, ZAxis, RadarChart as ReRadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart3D from '@/components/Chart3D';
import DataSummaryPanel from '@/components/DataSummaryPanel';
import ChartCustomization from '@/components/ChartCustomization';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileImage, BarChart3, Sparkles, Box, ChevronDown, ChevronUp } from 'lucide-react';




const COLORS = ['#A1887F', '#D7CCC8', '#FFAB91', '#8D6E63', '#5D4037'];

const Analytics = () => {
  const { currentData, fileName, createChart } = useData();
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [isExporting, setIsExporting] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [chart3DType, setChart3DType] = useState<'3d-bar' | '3d-scatter' | '3d-surface'>('3d-bar');
  const [chartStyle, setChartStyle] = useState({
    color: '#A1887F',
    fontSize: '12',
    fontFamily: 'Arial',
    gridLines: true,
    legend: true,
    animation: true,
    chartOpacity: 1,
    axisLabelRotation: 0,
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1
  });
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [showCleaner, setShowCleaner] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  if (!currentData || !fileName) {
    return (
      <div className="space-y-6 p-6 min-h-screen bg-[#FAF3E0] text-[#5D4037]">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-[#6D4C41] via-[#5D4037] to-[#4E342E] text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Exovia Analytics Dashboard 📊</h1>
              <p className="text-brown-100">Transform your data into beautiful visualizations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 px-3 py-1 rounded-full text-sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Ready to Create
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D7CCC8] to-[#A1887F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BarChart3 className="w-10 h-10 text-[#5D4037]" />
          </div>
          <h3 className="text-xl font-semibold text-[#3E2723] mb-3">Ready to Create Amazing Charts?</h3>
          <p className="text-[#5D4037] text-lg mb-6 max-w-md mx-auto">
            Upload an Excel file to unlock powerful analytics and visualization tools.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#8D6E63]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FFAB91] rounded-full animate-pulse"></div>
              Multiple Chart Types
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#A1887F] rounded-full animate-pulse"></div>
              2D & 3D Visualizations
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D7CCC8] rounded-full animate-pulse"></div>
              AI-Powered Insights
            </div>
          </div>
        </div>
        <DataSummaryPanel data={[]} fileName="" />
      </div>
    );
  }

  const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

  useEffect(() => {
    if (columns.length > 0) setSelectedColumns(columns);
  }, [fileName, columns.length]);

  useEffect(() => {
    if (selectedXAxis && !selectedColumns.includes(selectedXAxis)) setSelectedXAxis('');
    if (selectedYAxis && !selectedColumns.includes(selectedYAxis)) setSelectedYAxis('');
  }, [selectedColumns]);

  const processChartData = () => {
    if (!selectedXAxis || !selectedYAxis) return [];
    
    return currentData.map((row: any) => {
      const filteredRow: any = {};
      selectedColumns.forEach(col => { filteredRow[col] = row[col]; });
      return {
        name: String(row[selectedXAxis]),
        value: Number(row[selectedYAxis]) || 0,
        ...filteredRow
      };
    });
  };

  const chartData = processChartData();

  const handleCreateChart = async () => {
    if (!selectedXAxis || !selectedYAxis) {
      toast({
        title: 'Missing Selection',
        description: 'Please select both X and Y axes',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createChart({
        fileName: fileName,
        chartType,
        xAxis: selectedXAxis,
        yAxis: selectedYAxis,
        data: chartData,
      });

      toast({
        title: 'Chart Created Successfully! 🎉',
        description: 'Your chart has been saved to history',
      });
    } catch (error) {
      toast({
        title: 'Error Creating Chart',
        description: 'Failed to save chart to history',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async (format: string) => {
    if (!chartRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current);
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `Exovia-chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Exovia-chart-${Date.now()}.pdf`);
      }
      
      toast({
        title: 'Export Successful! 📁',
        description: `Chart exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: `Failed to export chart as ${format.toUpperCase()}`,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
const renderChart = () => {
  if (chartData.length === 0) return null;

  if (show3D) {
    if (chart3DType === '3d-surface') {
      return (
        <div className="flex items-center justify-center h-64 sm:h-80 lg:h-96 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Box className="w-6 h-6 text-white" />
            </div>
            <p className="text-purple-700 text-sm font-semibold">3D Surface Chart Coming Soon</p>
          </div>
        </div>
      );
    }
    return <Chart3D data={chartData} type={chart3DType} color={chartStyle.color} />;
  }

  const chartProps = {
    style: { 
      fontFamily: chartStyle.fontFamily, 
      fontSize: parseInt(chartStyle.fontSize),
      opacity: chartStyle.chartOpacity || 1
    }
  };

  const fontSize = parseInt(chartStyle.fontSize);

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} {...chartProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
              angle={chartStyle.axisLabelRotation || 0}
              textAnchor={chartStyle.axisLabelRotation > 0 ? 'end' : 'middle'}
              height={chartStyle.axisLabelRotation !== 0 ? 80 : 60}
            />
            <YAxis 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: chartStyle.fontFamily,
                fontSize: fontSize 
              }}
            />
            {showLegend && <Legend />}
            <Bar dataKey="value" fill={chartStyle.color} />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} {...chartProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
              angle={chartStyle.axisLabelRotation || 0}
              textAnchor={chartStyle.axisLabelRotation > 0 ? 'end' : 'middle'}
              height={chartStyle.axisLabelRotation !== 0 ? 80 : 60}
            />
            <YAxis 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: chartStyle.fontFamily,
                fontSize: fontSize 
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartStyle.color} 
              strokeWidth={2}
              animationDuration={enableAnimation ? 1000 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} {...chartProps} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
              angle={chartStyle.axisLabelRotation || 0}
              textAnchor={chartStyle.axisLabelRotation > 0 ? 'end' : 'middle'}
              height={chartStyle.axisLabelRotation !== 0 ? 80 : 60}
            />
            <YAxis 
              tick={{ fontSize: fontSize }}
              style={{ fontFamily: chartStyle.fontFamily }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: chartStyle.fontFamily,
                fontSize: fontSize 
              }}
            />
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartStyle.color} 
              fill={chartStyle.color}
              animationDuration={enableAnimation ? 1000 : 0}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
      
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart {...chartProps}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill={chartStyle.color}
              dataKey="value"
              animationDuration={enableAnimation ? 1000 : 0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                fontFamily: chartStyle.fontFamily,
                fontSize: fontSize 
              }}
            />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );
      
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ReScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" tick={{ fontSize: fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <YAxis tick={{ fontSize: fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <ZAxis dataKey="value" range={[0, 100]} />
            <Tooltip contentStyle={{ fontFamily: chartStyle.fontFamily, fontSize: fontSize }} />
            {showLegend && <Legend />}
            <Scatter name="Data" dataKey="value" fill={chartStyle.color} />
          </ReScatterChart>
        </ResponsiveContainer>
      );
      
    case 'radar':
      if (selectedColumns.length < 3) {
        return <div className="text-center text-xs text-gray-500">Select at least 3 columns for Radar Chart</div>;
      }
      const radarData = selectedColumns.map(col => ({
        axis: col,
        value: Number(currentData[0]?.[col]) || 0
      }));
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ReRadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="axis" style={{ fontFamily: chartStyle.fontFamily, fontSize }} />
            <PolarRadiusAxis angle={30} domain={[0, Math.max(...radarData.map(d => d.value), 1)]} />
            <Radar name="Row 1" dataKey="value" stroke={chartStyle.color} fill={chartStyle.color} fillOpacity={0.6} />
            <Tooltip />
          </ReRadarChart>
        </ResponsiveContainer>
      );
      
    case 'bubble': {
      const sizeKey = selectedColumns.find(col => col !== selectedXAxis && col !== selectedYAxis && typeof currentData[0]?.[col] === 'number');
      if (!selectedXAxis || !selectedYAxis || !sizeKey) {
        return <div className="text-center text-xs text-gray-500">Select X, Y, and at least one more numeric column for Bubble Chart</div>;
      }
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ReScatterChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={selectedXAxis} tick={{ fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <YAxis dataKey={selectedYAxis} tick={{ fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <ZAxis dataKey={sizeKey} range={[50, 400]} name={sizeKey} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {showLegend && <Legend />}
            <Scatter name="Data" fill={chartStyle.color} />
          </ReScatterChart>
        </ResponsiveContainer>
      );
    }
    case 'histogram': {
      const histKey = selectedYAxis || selectedColumns.find(col => typeof currentData[0]?.[col] === 'number');
      if (!histKey) {
        return <div className="text-center text-xs text-gray-500">Select a numeric column for Histogram</div>;
      }
      const values = currentData.map(row => Number(row[histKey])).filter(v => !isNaN(v));
      if (values.length === 0) {
        return <div className="text-center text-xs text-gray-500">No numeric data for Histogram</div>;
      }
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = 10;
      const binSize = (max - min) / binCount || 1;
      const bins = Array.from({ length: binCount }, (_, i) => ({
        bin: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`,
        count: 0
      }));
      values.forEach(v => {
        const idx = Math.min(Math.floor((v - min) / binSize), binCount - 1);
        bins[idx].count++;
      });
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bin" tick={{ fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <YAxis tick={{ fontSize }} style={{ fontFamily: chartStyle.fontFamily }} />
            <Tooltip />
            <Bar dataKey="count" fill={chartStyle.color} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    default:
      return null;
  }
};

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-[#6D4C41] via-[#5D4037] to-[#4E342E] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Exovia Analytics Dashboard 📊</h1>
              <p className="text-[#FAF3E0]">Creating charts from: <span className="font-semibold">{fileName}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-3 h-3 inline mr-1" />
              {currentData.length} records
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              <BarChart3 className="w-3 h-3 inline mr-1" />
              {Object.keys(currentData[0] || {}).length} columns
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Enhanced Chart Configuration Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#A1887F] to-[#5D4037] rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Chart Configuration</h2>
                  <p className="text-sm text-gray-500">Configure your visualization settings</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chart Type</label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="scatter">Scatter Plot</SelectItem>
                      <SelectItem value="radar">Radar/Spider Chart</SelectItem>
                      <SelectItem value="bubble">Bubble Chart</SelectItem>
                      <SelectItem value="histogram">Histogram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">X Axis</label>
                  <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                    <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                      <SelectValue placeholder="Select X axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Y Axis</label>
                  <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                    <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                      <SelectValue placeholder="Select Y axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <Button 
                    onClick={handleCreateChart}
                    className="w-full h-10 bg-gradient-to-r from-[#6D4C41] to-[#5D4037] hover:from-[#5D4037] hover:to-[#4E342E] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    disabled={!selectedXAxis || !selectedYAxis}
                  >
                  Save to History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-9 mt-1 text-xs border-[#A1887F] text-[#5D4037] hover:bg-[#FAF3E0] transition-colors"
                    onClick={() => setShowCleaner(true)}
                  >
                  Preview & Clean Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chart Display Card */}
          {chartData.length > 0 && (
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-in fade-in duration-500">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      {show3D ? <Box className="h-5 w-5 text-white" /> : <BarChart3 className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {show3D ? `3D ${chart3DType.replace('3d-', '').replace('-', ' ')} Chart` : 
                        `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`}
                      </h2>
                      <p className="text-sm text-gray-500">Live preview of your visualization</p>
                    </div>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={show3D ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShow3D(!show3D)}
                      className="text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                    >
                      {show3D ? '2D View' : '3D View'}
                    </Button>
                      {show3D && (
                      <Select value={chart3DType} onValueChange={(value: '3d-bar' | '3d-scatter' | '3d-surface') => setChart3DType(value)}>
                      <SelectTrigger className="w-32 h-8 border-[#A1887F] text-[#5D4037] bg-[#FFFDF8] hover:bg-[#FAF3E0] transition-colors rounded-lg shadow">
                      <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#FFFDF8] text-[#5D4037] border border-[#A1887F]">
                      <SelectItem value="3d-bar">3D Bar</SelectItem>
                      <SelectItem value="3d-scatter">3D Scatter</SelectItem>
                      <SelectItem value="3d-surface">3D Surface</SelectItem>
                      </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={chartRef} 
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
                  style={{
                    backgroundColor: chartStyle.backgroundColor || '#ffffff',
                    border: `${chartStyle.borderWidth || 1}px solid ${chartStyle.borderColor || '#e5e7eb'}`,
                    opacity: chartStyle.chartOpacity || 1
                  }}
                >
                  {renderChart()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Enhanced Chart Customization Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
              onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A1887F] to-[#5D4037] rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Customize Chart Style</h3>
                    <p className="text-sm text-gray-500">Personalize your visualization</p>
                  </div>
                </CardTitle>
                {isCustomizeOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
                )}
              </div>
            </CardHeader>
            {isCustomizeOpen && (
              <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                <ChartCustomization 
                  onStyleChange={setChartStyle}
                  onExport={handleExport}
                  showGrid={showGrid}
                  showLegend={showLegend}
                  enableAnimation={enableAnimation}
                  onShowGridChange={setShowGrid}
                  onShowLegendChange={setShowLegend}
                  onEnableAnimationChange={setEnableAnimation}
                />
              </CardContent>
            )}
          </Card>

          {/* Enhanced AI Data Summary Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-[#FFAB91] via-[#A1887F] to-[#5D4037] hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-white/10 transition-colors rounded-t-lg"
              onClick={() => setIsAISummaryOpen(!isAISummaryOpen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFAB91] to-[#A1887F] rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#5D4037] animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      AI Data Summary
                      <Badge className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold">AI</Badge>
                    </CardTitle>
                    <p className="text-sm text-white/80">Smart analysis and insights</p>
                  </div>
                </div>
                {isAISummaryOpen ? (
                  <ChevronUp className="h-5 w-5 text-white transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white transition-transform duration-200" />
                )}
              </div>
            </CardHeader>
            {isAISummaryOpen && (
              <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                <div className="max-h-[300px] overflow-y-auto">
                  <DataSummaryPanel data={currentData} fileName={fileName} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Data Cleaner Modal */}
      <Dialog open={showCleaner} onOpenChange={setShowCleaner}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview & Clean Data</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-2 py-1 border-b bg-gray-50 dark:bg-gray-800">
                      <Checkbox
                        checked={selectedColumns.includes(col)}
                        onCheckedChange={checked => {
                          setSelectedColumns(checked
                            ? [...selectedColumns, col]
                            : selectedColumns.filter(c => c !== col)
                          );
                        }}
                        id={`col-check-${col}`}
                      />
                      <label htmlFor={`col-check-${col}`} className="ml-1 cursor-pointer">{col}</label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-t">
                    {columns.map(col => (
                      <td key={col} className="px-2 py-1 text-center truncate max-w-[120px]">{String(row[col])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2">Showing first 10 rows. Uncheck columns to exclude from chart data.</div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button size="sm" onClick={() => setShowCleaner(false)}>
                Done
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analytics;
