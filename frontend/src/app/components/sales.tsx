import { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Search, Eye, ShoppingCart, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  shipping_address: string;
}

interface CreateOrderForm {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  order_date: string;
  delivery_date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

interface ItemResponse<T> {
  data: T;
}

interface ListResponse<T> {
  data: T[];
}

const salesTrend = [
  { day: 'Mon', sales: 12 },
  { day: 'Tue', sales: 19 },
  { day: 'Wed', sales: 15 },
  { day: 'Thu', sales: 22 },
  { day: 'Fri', sales: 28 },
  { day: 'Sat', sales: 25 },
  { day: 'Sun', sales: 18 },
];

export function Sales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrderDialogOpen, setNewOrderDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newOrderForm, setNewOrderForm] = useState<CreateOrderForm>({
    customer_name: '',
    email: '',
    phone: '',
    shipping_address: '',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    status: 'pending',
    items: [{ product_name: '', quantity: 1, price: 0 }],
  });

  // Load orders from the database on component mount
  const fetchOrders = async () => {
    try {
      const response = await apiRequest<ListResponse<Order>>('/orders');
      setOrders(response.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddItem = () => {
    setNewOrderForm({
      ...newOrderForm,
      items: [...newOrderForm.items, { product_name: '', quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewOrderForm({
      ...newOrderForm,
      items: newOrderForm.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...newOrderForm.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'product_name' ? value : Number(value),
    };
    setNewOrderForm({ ...newOrderForm, items: newItems });
  };

  const handleCreateOrder = async () => {
    // Validation
    if (!newOrderForm.customer_name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!newOrderForm.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!newOrderForm.phone.trim()) {
      toast.error('Phone is required');
      return;
    }
    if (!newOrderForm.shipping_address.trim()) {
      toast.error('Shipping address is required');
      return;
    }
    if (newOrderForm.items.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    // Validate items
    for (const item of newOrderForm.items) {
      if (!item.product_name.trim()) {
        toast.error('All items must have a product name');
        return;
      }
      if (item.quantity < 1) {
        toast.error('Item quantity must be at least 1');
        return;
      }
      if (item.price < 0) {
        toast.error('Item price cannot be negative');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest<ItemResponse<Order>>('/orders', {
        method: 'POST',
        body: JSON.stringify(newOrderForm),
      });

      setOrders([response.data, ...orders]);
      toast.success('Order created successfully');
      setNewOrderDialogOpen(false);
      setNewOrderForm({
        customer_name: '',
        email: '',
        phone: '',
        shipping_address: '',
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: '',
        status: 'pending',
        items: [{ product_name: '', quantity: 1, price: 0 }],
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders and track sales</p>
        </div>
        <Button onClick={() => setNewOrderDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-green-500 mt-1">+15.3% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalOrdersCount}</p>
            <p className="text-sm text-green-500 mt-1">+8.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${avgOrderValue.toFixed(2)}
            </p>
            <p className="text-sm text-green-500 mt-1">+6.5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Recent Orders
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading orders...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                      <TableCell className="font-medium">{order.customer_name}</TableCell>
                      <TableCell>{order.order_date}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Order Dialog */}
      <Dialog open={newOrderDialogOpen} onOpenChange={setNewOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Fill in the order details and items information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Customer Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  placeholder="John Doe"
                  value={newOrderForm.customer_name}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, customer_name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newOrderForm.email}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={newOrderForm.phone}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_address">Shipping Address *</Label>
                <Input
                  id="shipping_address"
                  placeholder="123 Main St, City, State 12345"
                  value={newOrderForm.shipping_address}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, shipping_address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Order Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_date">Order Date *</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={newOrderForm.order_date}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, order_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Delivery Date</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={newOrderForm.delivery_date}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, delivery_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={newOrderForm.status}
                    onValueChange={(value: any) =>
                      setNewOrderForm({ ...newOrderForm, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Order Items *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="size-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3 border rounded-lg p-4">
                {newOrderForm.items.map((item, index) => (
                  <div key={index} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Product Name *</Label>
                        <Input
                          placeholder="Product name"
                          value={item.product_name}
                          onChange={(e) =>
                            handleItemChange(index, 'product_name', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Quantity *</Label>
                        <Input
                          type="number"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                          min="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price *</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, 'price', e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        disabled={newOrderForm.items.length === 1}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewOrderDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
