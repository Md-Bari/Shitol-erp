import { useState } from 'react';
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
import { Plus, Search, Users, UserCheck, UserX, Calendar } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  salary: number;
}

const mockEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Alice Johnson', email: 'alice.j@company.com', department: 'Engineering', position: 'Senior Developer', status: 'active', joinDate: '2024-01-15', salary: 95000 },
  { id: 'EMP-002', name: 'Bob Williams', email: 'bob.w@company.com', department: 'Sales', position: 'Sales Manager', status: 'active', joinDate: '2023-08-20', salary: 78000 },
  { id: 'EMP-003', name: 'Carol Martinez', email: 'carol.m@company.com', department: 'Marketing', position: 'Marketing Lead', status: 'on-leave', joinDate: '2023-05-10', salary: 72000 },
  { id: 'EMP-004', name: 'David Chen', email: 'david.c@company.com', department: 'Engineering', position: 'DevOps Engineer', status: 'active', joinDate: '2024-02-01', salary: 88000 },
  { id: 'EMP-005', name: 'Emma Thompson', email: 'emma.t@company.com', department: 'HR', position: 'HR Manager', status: 'active', joinDate: '2022-11-15', salary: 69000 },
  { id: 'EMP-006', name: 'Frank Rodriguez', email: 'frank.r@company.com', department: 'Finance', position: 'Financial Analyst', status: 'active', joinDate: '2024-03-01', salary: 65000 },
  { id: 'EMP-007', name: 'Grace Lee', email: 'grace.l@company.com', department: 'Engineering', position: 'UI/UX Designer', status: 'active', joinDate: '2023-09-12', salary: 74000 },
  { id: 'EMP-008', name: 'Henry Davis', email: 'henry.d@company.com', department: 'Sales', position: 'Sales Representative', status: 'inactive', joinDate: '2023-03-20', salary: 58000 },
];

export function HumanResources() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-500">On Leave</Badge>;
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

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeave = employees.filter(e => e.status === 'on-leave').length;
  const departments = new Set(employees.map(e => e.department)).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-gray-500 mt-1">Manage employees and workforce data</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to the system. Fill in all required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="emp-name">Full Name</Label>
                <Input id="emp-name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-email">Email</Label>
                <Input id="emp-email" type="email" placeholder="email@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-department">Department</Label>
                <Input id="emp-department" placeholder="Enter department" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-position">Position</Label>
                <Input id="emp-position" placeholder="Enter position" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-salary">Salary</Label>
                <Input id="emp-salary" type="number" placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <UserCheck className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Calendar className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">On Leave</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{onLeave}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-lg">
                <UserX className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Departments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{departments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Employee Directory
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
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
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${employee.salary.toLocaleString()}
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
