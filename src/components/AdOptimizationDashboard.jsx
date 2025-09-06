// ============================================
// AD OPTIMIZATION DASHBOARD
// ============================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Users,
  Clock,
  Target,
  RefreshCw
} from 'lucide-react';

export function AdOptimizationDashboard() {
  const [banditState, setBanditState] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [banditRes, metricsRes, revenueRes] = await Promise.all([
        fetch('/api/bandit/state'),
        fetch('/api/metrics/summary'),
        fetch('/api/metrics/revenue')
      ]);
      
      if (banditRes.ok) setBanditState(await banditRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (revenueRes.ok) setRevenueData(await revenueRes.json());
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSuccessRate = (arm) => {
    const state = banditState.find(s => s.arm === arm);
    if (!state) return 0;
    return state.total_trials > 0 
      ? (state.alpha / (state.alpha + state.beta) * 100).toFixed(2)
      : 0;
  };

  const getArmDisplayName = (arm) => {
    const names = {
      'hero-banner': 'Hero Banner',
      'in-article-native': 'In-Article Native',
      'in-article-display': 'In-Article Display',
      'sidebar-sticky': 'Sidebar Sticky',
      'end-of-content': 'End of Content'
    };
    return names[arm] || arm;
  };

  const getPerformanceColor = (rate) => {
    if (rate > 3) return 'text-green-600';
    if (rate > 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const COLORS = ['#FFA500', '#FF69B4', '#00BFFF', '#32CD32', '#FF4500'];

  if (loading && banditState.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Ad Optimization Dashboard</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ad Optimization Dashboard</h2>
          <p className="text-sm text-gray-600">
            SA IS A MOVIE - Real-time ad performance monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={fetchDashboardData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.avgCTR * 100)}`}>
                  {(metrics.avgCTR * 100)?.toFixed(3)}%
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${metrics.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viewability</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(metrics.avgViewability * 100)?.toFixed(1)}%
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {(metrics.bounceRate * 100)?.toFixed(1)}%
                </p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bandit Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Multi-Armed Bandit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banditState.map((arm, index) => (
              <Card key={arm.arm} className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{getArmDisplayName(arm.arm)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate:</span>
                    <Badge variant={parseFloat(calculateSuccessRate(arm.arm)) > 2 ? "default" : "secondary"}>
                      {calculateSuccessRate(arm.arm)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trials:</span>
                    <span className="font-medium">{arm.total_trials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Rewards:</span>
                    <span className="font-medium">{parseFloat(arm.total_rewards).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-medium">
                      {arm.total_trials > 100 ? 'High' : arm.total_trials > 50 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend Chart */}
      {revenueData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`, 
                    name === 'revenue' ? 'Standard' : 'Optimized'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Standard Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="optimized" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Optimized Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ad Placement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={banditState.map((arm, index) => ({
                    name: getArmDisplayName(arm.arm),
                    value: arm.total_trials,
                    color: COLORS[index % COLORS.length]
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {banditState.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Placement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={banditState.map(arm => ({
                name: getArmDisplayName(arm.arm),
                successRate: parseFloat(calculateSuccessRate(arm.arm))
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                <Bar dataKey="successRate" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Optimization Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Top Performers</h4>
              {banditState
                .sort((a, b) => calculateSuccessRate(b.arm) - calculateSuccessRate(a.arm))
                .slice(0, 2)
                .map(arm => (
                  <div key={arm.arm} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">{getArmDisplayName(arm.arm)}</span>
                    <Badge variant="default">{calculateSuccessRate(arm.arm)}%</Badge>
                  </div>
                ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">Needs Attention</h4>
              {banditState
                .sort((a, b) => calculateSuccessRate(a.arm) - calculateSuccessRate(b.arm))
                .slice(0, 2)
                .map(arm => (
                  <div key={arm.arm} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm">{getArmDisplayName(arm.arm)}</span>
                    <Badge variant="secondary">{calculateSuccessRate(arm.arm)}%</Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
