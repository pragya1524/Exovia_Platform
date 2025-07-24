import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { Loader2, Users, UserCheck, Shield, AlertTriangle, BarChart2, FileUp, BarChart3, PieChart, LineChart, ScatterChart, AreaChart, Radar, Circle, Layers3, TrendingUp, Activity, Database, User, Crown, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ChartContainer, ChartTooltip, ChartLegend } from '../components/ui/chart';
import * as RechartsPrimitive from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  lastActive: string;
  isCurrentlyActive: boolean;
  createdAt: string;
  registrationDate: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    blockedUsers: 0
  });
  const { toast } = useToast();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [chartView, setChartView] = useState<'pie' | 'bar' | 'scroll'>('pie');
  const [activePie, setActivePie] = useState<number | null>(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [userListTab, setUserListTab] = useState<'admin' | 'user'>('user');
  const [showAllUsers, setShowAllUsers] = useState(false);

  // (useEffect, fetchUsers, fetchDashboardStats, toggleUserBlock, updateUserRole — unchanged)

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-[400px] transform animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader>
            <CardTitle className="text-center text-red-500 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
}

