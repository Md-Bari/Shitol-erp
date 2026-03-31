import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const productionData = [
  { month: 'Oct', tShirts: 12000, jeans: 8000, jackets: 3000, target: 25000 },
  { month: 'Nov', tShirts: 13500, jeans: 9200, jackets: 3500, target: 25000 },
  { month: 'Dec', tShirts: 11000, jeans: 7800, jackets: 2800, target: 25000 },
  { month: 'Jan', tShirts: 15000, jeans: 10500, jackets: 4200, target: 28000 },
  { month: 'Feb', tShirts: 16200, jeans: 11000, jackets: 4500, target: 28000 },
  { month: 'Mar', tShirts: 17500, jeans: 12200, jackets: 5100, target: 30000 },
];

const qualityData = [
  { week: 'Week 1', defectRate: 2.5, target: 2.0 },
  { week: 'Week 2', defectRate: 2.1, target: 2.0 },
  { week: 'Week 3', defectRate: 1.8, target: 2.0 },
  { week: 'Week 4', defectRate: 2.3, target: 2.0 },
];

const efficiencyData = [
  { day: 'Mon', efficiency: 87, output: 1200 },
  { day: 'Tue', efficiency: 91, output: 1350 },
  { day: 'Wed', efficiency: 89, output: 1280 },
  { day: 'Thu', efficiency: 93, output: 1420 },
  { day: 'Fri', efficiency: 88, output: 1250 },
  { day: 'Sat', efficiency: 85, output: 1180 },
];

export function RMGAnalysis() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    toast.info('AI Analysis started...');

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    setAnalyzing(false);
    setAnalysisComplete(true);
    toast.success('AI Analysis completed!');
    
    // Navigate to results after a short delay
    setTimeout(() => {
      navigate('/analytics-results');
    }, 1000);
  };

  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Production Increase',
      description: 'T-shirt production up 35% compared to last quarter',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Quality Alert',
      description: 'Defect rate increased in Week 4, requires attention',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      type: 'positive',
      icon: CheckCircle,
      title: 'Efficiency Peak',
      description: 'Thursday shows highest efficiency at 93%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'negative',
      icon: TrendingDown,
      title: 'Weekend Dip',
      description: 'Saturday efficiency drops to 85%, consider staffing review',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const stats = [
    { label: 'Avg Production', value: '34,800', unit: 'units/month', trend: '+12%', positive: true },
    { label: 'Avg Defect Rate', value: '2.2%', unit: 'of total', trend: '-0.3%', positive: true },
    { label: 'Avg Efficiency', value: '89%', unit: 'capacity', trend: '+5%', positive: true },
    { label: 'Production Target', value: '92%', unit: 'achieved', trend: '+8%', positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RMG Trend Analysis</h1>
          <p className="text-gray-500 mt-1">
            AI-powered analysis for Ready-Made Garment production trends
          </p>
        </div>
        <Button
          onClick={handleAIAnalysis}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {analyzing ? (
            <>
              <Brain className="size-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="size-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.unit}</p>
                </div>
                <Badge className={stat.positive ? 'bg-green-500' : 'bg-red-500'}>
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-5 text-purple-600" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div
                  key={idx}
                  className={`${insight.bgColor} p-4 rounded-lg border-l-4 ${
                    insight.type === 'positive'
                      ? 'border-green-500'
                      : insight.type === 'warning'
                      ? 'border-yellow-500'
                      : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`size-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="production" className="space-y-4">
        <TabsList>
          <TabsTrigger value="production">Production Trends</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="efficiency">Daily Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Production by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tShirts"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="jeans"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="jackets"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control - Defect Rate Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="defectRate"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Efficiency & Output Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
                  <Bar yAxisId="right" dataKey="output" fill="#10b981" name="Output (units)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
