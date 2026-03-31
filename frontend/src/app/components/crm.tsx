import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Search, UserCircle, Mail, Phone, Building2 } from 'lucide-react';
import { apiRequest } from '../lib/api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  value: number;
  lastContact: string;
}

const statusOptions = ['lead', 'prospect', 'customer', 'inactive'] as const;
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6b7280'];

interface ApiListResponse<T> {
  data: T[];
}

interface ApiItemResponse<T> {
  data: T;
}

export function CRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead' as Customer['status'],
    value: 0,
    lastContact: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiRequest<ApiListResponse<Customer>>('/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Failed to load customers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'customer':
        return <Badge className="bg-green-500">Customer</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-500">Prospect</Badge>;
      case 'lead':
        return <Badge className="bg-yellow-500">Lead</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiListResponse<Customer>>('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Unable to refresh customers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.company) {
      return;
    }

    try {
      const response = await apiRequest<ApiItemResponse<Customer>>('/customers', {
        method: 'POST',
        body: JSON.stringify(newCustomer),
      });

      setCustomers((prev) => [...prev, response.data]);
      setDialogOpen(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        value: 0,
        lastContact: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to add customer', error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await apiRequest(`/customers/${id}`, { method: 'DELETE' });
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error('Failed to delete customer', error);
    }
  };

  const totalCustomers = customers.filter(c => c.status === 'customer').length;
  const totalValue = customers
    .filter(c => c.status === 'customer')
    .reduce((sum, c) => sum + c.value, 0);
  const avgValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;

  const customerStatusData = statusOptions.map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: customers.filter((c) => c.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-500 mt-1">Manage customer relationships and sales pipeline</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Add a new customer or lead to your CRM system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cust-name">Full Name</Label>
                <Input
                  id="cust-name"
                  placeholder="Enter full name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-email">Email</Label>
                <Input
                  id="cust-email"
                  type="email"
                  placeholder="email@company.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-phone">Phone</Label>
                <Input
                  id="cust-phone"
                  placeholder="(555) 123-4567"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-company">Company</Label>
                <Input
                  id="cust-company"
                  placeholder="Company name"
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-status">Status</Label>
                <Select
                  value={newCustomer.status}
                  onValueChange={(value: Customer['status']) => setNewCustomer({ ...newCustomer, status: value })}
                >
                  <SelectTrigger id="cust-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-value">Estimated Value</Label>
                <Input
                  id="cust-value"
                  type="number"
                  min={0}
                  step={100}
                  value={newCustomer.value}
                  onChange={(e) => setNewCustomer({ ...newCustomer, value: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cust-last-contact">Last Contact</Label>
                <Input
                  id="cust-last-contact"
                  type="date"
                  value={newCustomer.lastContact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastContact: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <UserCircle className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <Building2 className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Mail className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Phone className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Customer Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${Math.round(avgValue).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={customerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="text-sm text-gray-500">Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {customers.filter(c => c.status === 'lead').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ${customers
                    .filter(c => c.status === 'lead')
                    .reduce((sum, c) => sum + c.value, 0)
                    .toLocaleString()} potential
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">Prospects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {customers.filter(c => c.status === 'prospect').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ${customers
                    .filter(c => c.status === 'prospect')
                    .reduce((sum, c) => sum + c.value, 0)
                    .toLocaleString()} in pipeline
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">37.5%</p>
                <p className="text-sm text-gray-500 mt-1">Lead to Customer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="size-5" />
              Customer Database
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading customer data...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="size-3" />
                        {customer.email}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="size-3" />
                        {customer.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>{customer.lastContact}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${customer.value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
