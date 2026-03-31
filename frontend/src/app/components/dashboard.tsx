import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { apiRequest } from '../lib/api';

interface ChartPoint {
  month: string;
  revenue: number;
  expenses: number;
}

interface PiePoint {
  name: string;
  value: number;
}

interface ApiStat {
  title: string;
  value: number;
  change: string;
  trending: 'up' | 'down';
}

interface DashboardResponse {
  stats: ApiStat[];
  revenue_vs_expenses: ChartPoint[];
  sales_by_category: PiePoint[];
  monthly_performance: ChartPoint[];
}

const defaultRevenueData: ChartPoint[] = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 36000 },
  { month: 'Jun', revenue: 67000, expenses: 41000 },
];

const defaultSalesData: PiePoint[] = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 },
  { name: 'Books', value: 100 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const statMeta = {
  'Total Revenue': { icon: DollarSign, color: 'bg-green-500' },
  'Total Orders': { icon: ShoppingCart, color: 'bg-blue-500' },
  'Inventory Items': { icon: Package, color: 'bg-purple-500' },
  'Active Employees': { icon: Users, color: 'bg-orange-500' },
} as const;

const defaultStats = [
  {
    title: 'Total Revenue',
    value: 328000,
    change: '+12.5%',
    trending: 'up' as const,
  },
  {
    title: 'Total Orders',
    value: 1284,
    change: '+8.2%',
    trending: 'up' as const,
  },
  {
    title: 'Inventory Items',
    value: 3456,
    change: '-2.4%',
    trending: 'down' as const,
  },
  {
    title: 'Active Employees',
    value: 247,
    change: '+5.1%',
    trending: 'up' as const,
  },
];

function formatStatValue(title: string, value: number): string {
  if (title === 'Total Revenue') {
    return `$${Math.round(value).toLocaleString()}`;
  }

  return Math.round(value).toLocaleString();
}

export function Dashboard() {
  const [stats, setStats] = useState<ApiStat[]>(defaultStats);
  const [revenueData, setRevenueData] = useState<ChartPoint[]>(defaultRevenueData);
  const [salesData, setSalesData] = useState<PiePoint[]>(defaultSalesData);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiRequest<DashboardResponse>('/dashboard');
        setStats(response.stats);
        setRevenueData(response.revenue_vs_expenses);
        setSalesData(response.sales_by_category);
      } catch {
        // Keep fallback mock data if API call fails.
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const meta = statMeta[stat.title as keyof typeof statMeta] ?? statMeta['Total Orders'];
          const Icon = meta.icon;
          const TrendIcon = stat.trending === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatStatValue(stat.title, stat.value)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon
                        className={`size-4 ${
                          stat.trending === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          stat.trending === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${meta.color} p-3 rounded-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
