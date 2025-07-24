import { useData } from '@/context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FirstLoginNotification } from '@/components/FirstLoginNotification';
import { 
  BarChart3, LineChart, PieChart, ScatterChart, AreaChart, Radar, 
  Circle, Layers3, Globe, Zap, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { excelFiles, charts } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showAllCharts, setShowAllCharts] = useState(false);
  const [showFirstLoginNotification, setShowFirstLoginNotification] = useState(false);

  useEffect(() => {
    if (user?.isFirstLogin) {
      setShowFirstLoginNotification(true);
    }
  }, [user?.isFirstLogin]);

  const recentFiles = excelFiles
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 5);

  const recentCharts = charts
    .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
    .slice(0, 5);

  const displayedCharts = showAllCharts ? charts : recentCharts;

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('.xlsx') || fileName.includes('.xls')) return '📊';
    if (fileName.includes('.csv')) return '📋';
    if (fileName.includes('.json')) return '📄';
    return '📁';
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

  const getChartColor = (chartType: string) => {
    switch (chartType.toLowerCase()) {
      case 'bar':
      case '3d-bar':
        return 'from-blue-500 to-blue-600';
      case 'line':
      case '3d-line':
        return 'from-green-500 to-green-600';
      case 'pie':
      case '3d-pie':
        return 'from-purple-500 to-purple-600';
      case 'scatter':
      case '3d-scatter':
        return 'from-orange-500 to-orange-600';
      case 'area':
        return 'from-teal-500 to-teal-600';
      case 'radar':
      case 'spider':
        return 'from-pink-500 to-pink-600';
      case 'bubble':
        return 'from-indigo-500 to-indigo-600';
      case 'histogram':
        return 'from-cyan-500 to-cyan-600';
      case '3d-surface':
        return 'from-violet-500 to-violet-600';
      case 'doughnut':
        return 'from-amber-500 to-amber-600';
      case 'funnel':
        return 'from-red-500 to-red-600';
      case 'map':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-gray-500 to-gray-600';
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

  const handleViewAllCharts = () => {
    navigate('/history');
  };

  return (
    <div className="space-y-8 p-6">
      {showFirstLoginNotification && (
        <FirstLoginNotification onDismiss={() => setShowFirstLoginNotification(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          {recentFiles.length === 0 ? (
            <p className="text-sm text-gray-500">No files uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentFiles.map(file => (
                <li key={file.id} className="flex items-center gap-2">
                  <span>{getFileIcon(file.fileName)}</span>
                  <span>{file.fileName}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Charts</CardTitle>
        </CardHeader>
        <CardContent>
          {displayedCharts.length === 0 ? (
            <p className="text-sm text-gray-500">No charts created yet.</p>
          ) : (
            <ul className="space-y-2">
              {displayedCharts.map(chart => {
                const Icon = getChartIcon(chart.chartType);
                const gradient = getChartColor(chart.chartType);
                return (
                  <li
                    key={chart.id}
                    className={`p-2 rounded bg-gradient-to-r ${gradient} text-white cursor-pointer`}
                    onClick={() => handleViewChart(chart)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{chart.chartType} Chart</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {charts.length > 5 && (
            <Button variant="ghost" onClick={handleViewAllCharts}>
              View All Charts
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
