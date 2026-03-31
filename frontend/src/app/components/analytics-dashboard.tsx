import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Activity,
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 68000, profit: 20000, expenses: 48000 },
  { month: 'Feb', revenue: 71000, profit: 20000, expenses: 51000 },
  { month: 'Mar', revenue: 75000, profit: 22000, expenses: 53000 },
  { month: 'Apr', revenue: 82000, profit: 26000, expenses: 56000 },
  { month: 'May', revenue: 79000, profit: 24000, expenses: 55000 },
  { month: 'Jun', revenue: 88000, profit: 30000, expenses: 58000 },
];

const salesByCategory = [
  { name: 'T-Shirts', value: 12500, percentage: 35 },
  { name: 'Jeans', value: 9200, percentage: 26 },
  { name: 'Jackets', value: 7800, percentage: 22 },
  { name: 'Accessories', value: 6000, percentage: 17 },
];

const inventoryTurnover = [
  { category: 'Electronics', turnover: 8.5, stock: 3200 },
  { category: 'Clothing', turnover: 12.3, stock: 5600 },
  { category: 'Furniture', turnover: 4.2, stock: 1200 },
  { category: 'Accessories', turnover: 15.8, stock: 8900 },
];

const customerMetrics = [
  { month: 'Jan', newCustomers: 45, returning: 120 },
  { month: 'Feb', newCustomers: 52, returning: 135 },
  { month: 'Mar', newCustomers: 48, returning: 142 },
  { month: 'Apr', newCustomers: 61, returning: 158 },
  { month: 'May', newCustomers: 58, returning: 165 },
  { month: 'Jun', newCustomers: 67, returning: 178 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$463K',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: '2,847',
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: 'up',
    },
    {
      title: 'Active Customers',
      value: '1,284',
      change: '+8.1%',
      icon: Users,
      color: 'bg-purple-500',
      trend: 'up',
    },
    {
      title: 'Inventory Value',
      value: '$892K',
      change: '-3.2%',
      icon: Package,
      color: 'bg-orange-500',
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="size-8 text-blue-600" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Comprehensive business analytics and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="size-4 text-green-500" />
                      ) : (
                        <Activity className="size-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="sales">Sales Distribution</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Metrics</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue, Profit & Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="3"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
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
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-8">
                  {salesByCategory.map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">
                          {category.value.toLocaleString()} units
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: COLORS[idx],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover Rate by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryTurnover}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="turnover"
                    fill="#3b82f6"
                    name="Turnover Rate"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="stock"
                    fill="#10b981"
                    name="Stock Units"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition & Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={customerMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="New Customers"
                  />
                  <Line
                    type="monotone"
                    dataKey="returning"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Returning Customers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
