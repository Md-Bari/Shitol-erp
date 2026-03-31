import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Search,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-03-24', description: 'Product Sales', category: 'Revenue', amount: 15000, type: 'income', status: 'completed' },
  { id: 'TXN-002', date: '2026-03-24', description: 'Office Rent', category: 'Rent', amount: 3500, type: 'expense', status: 'completed' },
  { id: 'TXN-003', date: '2026-03-23', description: 'Software Licenses', category: 'IT', amount: 1200, type: 'expense', status: 'completed' },
  { id: 'TXN-004', date: '2026-03-23', description: 'Consulting Services', category: 'Revenue', amount: 8500, type: 'income', status: 'pending' },
  { id: 'TXN-005', date: '2026-03-22', description: 'Utilities', category: 'Operating', amount: 850, type: 'expense', status: 'completed' },
  { id: 'TXN-006', date: '2026-03-22', description: 'Product Sales', category: 'Revenue', amount: 12300, type: 'income', status: 'completed' },
  { id: 'TXN-007', date: '2026-03-21', description: 'Payroll', category: 'Salaries', amount: 45000, type: 'expense', status: 'completed' },
  { id: 'TXN-008', date: '2026-03-21', description: 'Marketing Campaign', category: 'Marketing', amount: 2800, type: 'expense', status: 'failed' },
];

const cashFlowData = [
  { month: 'Oct', income: 58000, expenses: 42000 },
  { month: 'Nov', income: 62000, expenses: 45000 },
  { month: 'Dec', income: 55000, expenses: 43000 },
  { month: 'Jan', income: 68000, expenses: 48000 },
  { month: 'Feb', income: 71000, expenses: 51000 },
  { month: 'Mar', income: 75000, expenses: 53000 },
];

const profitData = [
  { month: 'Oct', profit: 16000 },
  { month: 'Nov', profit: 17000 },
  { month: 'Dec', profit: 12000 },
  { month: 'Jan', profit: 20000 },
  { month: 'Feb', profit: 20000 },
  { month: 'Mar', profit: 22000 },
];

export function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance & Accounting</h1>
        <p className="text-gray-500 mt-1">Track financial performance and transactions</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${totalIncome.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.3%</span>
                </div>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <TrendingUp className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${totalExpenses.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="size-4 text-red-500" />
                  <span className="text-sm text-red-500">+5.8%</span>
                </div>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <TrendingDown className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${netProfit.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm text-green-500">+18.2%</span>
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <DollarSign className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{profitMargin}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm text-green-500">+2.4%</span>
                </div>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Receipt className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="cashflow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profit">Profit Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Recent Transactions
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell className="font-medium">{txn.description}</TableCell>
                  <TableCell>{txn.category}</TableCell>
                  <TableCell>
                    <Badge variant={txn.type === 'income' ? 'default' : 'secondary'}>
                      {txn.type === 'income' ? 'Income' : 'Expense'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-medium ${
                        txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
