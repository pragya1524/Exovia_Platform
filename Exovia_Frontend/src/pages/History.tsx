import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Download,
  Eye,
  Loader2,
  BarChart3,
  History as HistoryIcon,
  FileText,
  PieChart,
  TrendingUp,
  Calendar,
  HardDrive,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  LineChart,
  ScatterChart,
  AreaChart,
  Radar,
  Circle,
  Layers3,
  Target,
  Zap,
  Globe,
  Box,
  Activity,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const History = () => {
  const { excelFiles, charts, deleteFile, deleteChart, loadFileData, loading } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showAllFiles, setShowAllFiles] = useState(false);
  const [showAllCharts, setShowAllCharts] = useState(false);

  const recentFiles = excelFiles.slice(0, 5);
  const recentCharts = charts.slice(0, 5);

  const displayedFiles = showAllFiles ? excelFiles : recentFiles;
  const displayedCharts = showAllCharts ? charts : recentCharts;

  const handleDeleteFile = async (id: string, fileName: string) => {
    try {
      await deleteFile(id);
      toast({
        title: 'File Deleted',
        description: `${fileName} has been removed`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteChart = async (id: string) => {
    try {
      await deleteChart(id);
      toast({
        title: 'Chart Deleted',
        description: 'Chart has been removed from history',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete chart',
        variant: 'destructive',
      });
    }
  };

  const handleReAnalyzeFile = async (fileId: string, fileName: string) => {
    try {
      await loadFileData(fileId);
      toast({
        title: 'File Loaded',
        description: `${fileName} is now active for analysis`,
      });
      navigate('/analytics');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load file for analysis',
        variant: 'destructive',
      });
    }
  };

  const handleViewChart = (chart: any) => {
    try {
      navigate('/chart-viewer', { state: { chart } });
      toast({
        title: 'Chart Opened',
        description: `${chart.chartType} chart is now open for viewing`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to open chart',
        variant: 'destructive',
      });
    }
  };

  const getChartIcon = (chartType: string) => {
    switch (chartType.toLowerCase()) {
      case 'bar':
      case '3d-bar':
        return BarChart3;
      case 'line':
      case '3d-line':
        return LineChart;
      case 'pie':
      case '3d-pie':
        return PieChart;
      case 'scatter':
      case '3d-scatter':
        return ScatterChart;
      case 'area':
        return AreaChart;
      case 'radar':
      case 'spider':
        return Radar;
      case 'bubble':
        return Circle;
      case 'histogram':
        return BarChart3;
      case '3d-surface':
        return Layers3;
      case 'doughnut':
        return Target;
      case 'funnel':
        return Zap;
      case 'map':
        return Globe;
      default:
        return BarChart3;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#FAF3E0] min-h-screen">
      <div className="bg-gradient-to-r from-[#6D4C41] via-[#5D4037] to-[#4E342E] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <HistoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">History & Analytics 📊</h1>
              <p className="text-[#FFE2B2]">View your uploaded files and created charts</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
              <FileText className="w-3 h-3 inline mr-1 text-[#FFE2B2]" />
              {excelFiles.length} files
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
              <BarChart3 className="w-3 h-3 inline mr-1 text-[#FFE2B2]" />
              {charts.length} charts
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
              <Activity className="w-3 h-3 inline mr-1 text-[#FFE2B2]" />
              Recent activity
            </div>
          </div>
        </div>
      </div>

      {/* Your cards for files/charts/history go here */}
      {/* Example:
      <Card className="bg-[#FFFDF8] border-0 shadow-md ..."> ... </Card>
      */}
    </div>
  );
};

export default History;
