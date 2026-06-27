import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  Download,
  Share2,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from 'recharts';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

const performanceMetrics = [
  { metric: 'Production', value: 92, fullMark: 100 },
  { metric: 'Quality', value: 88, fullMark: 100 },
  { metric: 'Efficiency', value: 89, fullMark: 100 },
  { metric: 'On-Time Delivery', value: 95, fullMark: 100 },
  { metric: 'Cost Control', value: 86, fullMark: 100 },
  { metric: 'Worker Satisfaction', value: 91, fullMark: 100 },
];

const correlationData = [
  { efficiency: 85, quality: 88, output: 1200 },
  { efficiency: 91, quality: 92, output: 1350 },
  { efficiency: 89, quality: 90, output: 1280 },
  { efficiency: 93, quality: 95, output: 1420 },
  { efficiency: 88, quality: 89, output: 1250 },
  { efficiency: 87, quality: 86, output: 1200 },
  { efficiency: 92, quality: 94, output: 1380 },
];

export function AnalyticsResults() {
  const predictions = [
    {
      title: 'Production Forecast',
      prediction: 'Expected 18% increase in next quarter',
      confidence: 94,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      trend: 'positive',
    },
    {
      title: 'Quality Trend',
      prediction: 'Defect rate likely to decrease to 1.8%',
      confidence: 87,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: 'positive',
    },
    {
      title: 'Resource Alert',
      prediction: 'Material shortage risk in 2 weeks',
      confidence: 78,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      trend: 'warning',
    },
    {
      title: 'Demand Spike',
      prediction: 'T-shirt demand to surge by 25% in April',
      confidence: 91,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      trend: 'positive',
    },
  ];

  const recommendations = [
    {
      priority: 'high',
      title: 'Increase T-Shirt Production Capacity',
      description: 'AI predicts 25% demand increase. Consider hiring 15 additional workers.',
      impact: 'Revenue increase: ~$180K',
      icon: Target,
    },
    {
      priority: 'high',
      title: 'Address Material Shortage Risk',
      description: 'Order raw materials 2 weeks early to prevent production delays.',
      impact: 'Avoid $50K in losses',
      icon: AlertTriangle,
    },
    {
      priority: 'medium',
      title: 'Optimize Weekend Shifts',
      description: 'Saturday efficiency drops to 85%. Implement incentive program.',
      impact: 'Efficiency gain: 8%',
      icon: TrendingUp,
    },
    {
      priority: 'medium',
      title: 'Quality Training for Week 4',
      description: 'Defect rates spike in Week 4. Schedule quality control training.',
      impact: 'Reduce defects by 15%',
      icon: CheckCircle,
    },
    {
      priority: 'low',
      title: 'Explore Automation Opportunities',
      description: 'Repetitive tasks in jacket production can be automated.',
      impact: 'Cost reduction: $30K/year',
      icon: Lightbulb,
    },
  ];

  const handleExport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const generatedAt = new Date().toLocaleString();
    let y = 18;

    const addFooter = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text('Shitol ERP | AI Analytics Report', margin, pageHeight - 10);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, {
        align: 'right',
      });
    };

    const ensureSpace = (requiredHeight: number) => {
      if (y + requiredHeight <= pageHeight - 18) {
        return;
      }

      addFooter();
      doc.addPage();
      y = 18;
    };

    const sectionTitle = (title: string) => {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(31, 41, 55);
      doc.text(title, margin, y);
      y += 7;
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.6);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
    };

    doc.setFillColor(49, 46, 129);
    doc.rect(0, 0, pageWidth, 48, 'F');
    doc.setFillColor(99, 102, 241);
    doc.circle(pageWidth - 24, 12, 24, 'F');
    doc.setFillColor(16, 185, 129);
    doc.circle(pageWidth - 8, 42, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('AI Analysis Report', margin, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('RMG production intelligence, forecast risk, and action plan', margin, 29);
    doc.text(`Generated: ${generatedAt}`, margin, 37);
    y = 60;

    doc.setFillColor(245, 243, 255);
    doc.setDrawColor(221, 214, 254);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(76, 29, 149);
    doc.text('Executive Summary', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text(
      doc.splitTextToSize(
        'The AI model analyzed 6 months of RMG production data across production, quality, efficiency, and market trends. The model reports 94% prediction accuracy and produced 24 operational insights.',
        pageWidth - margin * 2 - 10
      ),
      margin + 5,
      y + 15
    );
    y += 40;

    const kpis = [
      ['Data Points', '150K+', [124, 58, 237]],
      ['Prediction Accuracy', '94%', [22, 163, 74]],
      ['Insights Generated', '24', [37, 99, 235]],
    ] as const;

    const cardWidth = (pageWidth - margin * 2 - 8) / 3;
    kpis.forEach(([label, value, color], index) => {
      const x = margin + index * (cardWidth + 4);
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(x, y, cardWidth, 25, 3, 3, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(label, x + 5, y + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(value, x + 5, y + 19);
    });
    y += 38;

    sectionTitle('Predictions & Forecasts');
    predictions.forEach((item) => {
      ensureSpace(24);
      const isWarning = item.trend === 'warning';
      doc.setFillColor(isWarning ? 254 : 240, isWarning ? 252 : 253, isWarning ? 232 : 244);
      doc.setDrawColor(isWarning ? 234 : 196, isWarning ? 179 : 181, isWarning ? 8 : 253);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 21, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(item.title, margin + 5, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text(item.prediction, margin + 5, y + 13);
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(pageWidth - margin - 50, y + 8, 30, 3, 1.5, 1.5, 'F');
      doc.setFillColor(isWarning ? 245 : 34, isWarning ? 158 : 197, isWarning ? 11 : 94);
      doc.roundedRect(pageWidth - margin - 50, y + 8, 30 * (item.confidence / 100), 3, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(31, 41, 55);
      doc.text(`${item.confidence}%`, pageWidth - margin - 14, y + 11);
      y += 26;
    });

    sectionTitle('Performance Metrics');
    performanceMetrics.forEach((item) => {
      ensureSpace(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      doc.text(item.metric, margin, y + 3);
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(margin + 55, y, 86, 4, 2, 2, 'F');
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin + 55, y, 86 * (item.value / 100), 4, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.value}%`, pageWidth - margin, y + 3, { align: 'right' });
      y += 9;
    });
    y += 6;

    sectionTitle('AI-Powered Recommendations');
    recommendations.forEach((item) => {
      const rowHeight = 25;
      ensureSpace(rowHeight + 4);
      const priorityColor =
        item.priority === 'high'
          ? [239, 68, 68]
          : item.priority === 'medium'
          ? [245, 158, 11]
          : [59, 130, 246];

      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, pageWidth - margin * 2, rowHeight, 3, 3, 'FD');
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.roundedRect(margin + 5, y + 5, 22, 7, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(item.priority.toUpperCase(), margin + 16, y + 10, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(item.title, margin + 32, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text(doc.splitTextToSize(item.description, 102), margin + 32, y + 14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text(item.impact, pageWidth - margin - 5, y + 10, { align: 'right' });
      y += rowHeight + 5;
    });

    addFooter();
    doc.save(`ai-analysis-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('PDF report downloaded.');
  };

  const handleShare = () => {
    toast.success('Analysis shared with team members!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="size-8 text-purple-600" />
            AI Analysis Results
          </h1>
          <p className="text-gray-500 mt-1">
            Comprehensive insights and predictions based on RMG data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleExport}>
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analysis Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Brain className="size-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Analysis Summary</h2>
              <p className="text-gray-600 mt-2">
                Our AI has analyzed 6 months of production data, processing over 150,000 data
                points across production, quality, efficiency, and market trends. The model achieved
                94% accuracy in predictions with high confidence intervals.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Data Points</p>
                  <p className="text-2xl font-bold text-purple-600">150K+</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Prediction Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">94%</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Insights Generated</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI Predictions & Forecasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred, idx) => {
            const Icon = pred.icon;
            return (
              <Card key={idx} className={pred.bgColor}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon className={`size-8 ${pred.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{pred.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pred.prediction}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              pred.trend === 'positive' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {pred.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency vs Quality Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="efficiency" name="Efficiency" unit="%" />
                <YAxis dataKey="quality" name="Quality" unit="%" />
                <ZAxis dataKey="output" range={[100, 400]} name="Output" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Production Days"
                  data={correlationData}
                  fill="#8b5cf6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const Icon = rec.icon;
              const priorityColor =
                rec.priority === 'high'
                  ? 'bg-red-500'
                  : rec.priority === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500';

              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={priorityColor}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                    <Icon className="size-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-sm font-medium text-green-600 mt-2">
                      Expected Impact: {rec.impact}
                    </p>
                  </div>
                  <Button size="sm">Take Action</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
