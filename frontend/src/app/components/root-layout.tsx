import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  UserCircle,
  Menu,
  Bell,
  LogOut,
  Settings,
  BarChart3,
  TrendingUp,
  ClipboardList,
  UserCog,
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useNotifications } from '../contexts/notification-context';
import { useNavigate } from 'react-router';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Sales', path: '/sales', icon: ShoppingCart },
  { name: 'Orders', path: '/orders', icon: ClipboardList },
  { name: 'HR', path: '/hr', icon: Users },
  { name: 'Finance', path: '/finance', icon: DollarSign },
  { name: 'CRM', path: '/crm', icon: UserCircle },
  { name: 'RMG Analysis', path: '/rmg-analysis', icon: TrendingUp },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Users', path: '/users', icon: UserCog, adminOnly: true },
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string | number>>(new Set());
  const { user, logout, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  // Filter notifications - show only unread by default
  const displayedNotifications = showAllNotifications 
    ? notifications 
    : notifications.filter(n => !n.read);

  // Get critical notification to show as modal (only out of stock and delivery overdue)
  const criticalNotifications = notifications.filter(
    (n) => (n.category === 'out_of_stock' || n.category === 'delivery_overdue') && !dismissedAlerts.has(n.id)
  );
  const currentCriticalAlert = criticalNotifications[0];

  const handleAcknowledgeCritical = (id: string | number) => {
    markAsRead(id);
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const handleDismissCritical = (id: string | number) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const getCriticalIcon = () => {
    if (!currentCriticalAlert) return null;
    switch (currentCriticalAlert.type) {
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  const NavContent = () => (
    <>
      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="size-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">ERP System</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavContent />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 relative z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-blue-600">ERP System</h1>
                  <p className="text-sm text-gray-500 mt-1">Enterprise Management</p>
                </div>
                <nav className="p-4 space-y-2">
                  <NavContent />
                </nav>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold text-blue-600 md:hidden">ERP System</h1>
          </div>

          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications Sidebar */}
            <Sheet open={notificationSidebarOpen} onOpenChange={setNotificationSidebarOpen}>
              <button
                onClick={() => setNotificationSidebarOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="size-5 text-gray-700" />
                {unreadCount > 0 && (
                  <Badge className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs font-bold rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </button>
              <SheetContent side="right" className="w-96 p-0 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {showAllNotifications ? 'All Notifications' : 'Unread Notifications'}
                    </h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-auto py-1 px-2 hover:bg-gray-200"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  {notifications.length > unreadCount && (
                    <button
                      onClick={() => setShowAllNotifications(!showAllNotifications)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {showAllNotifications 
                        ? `Hide read (${notifications.length - unreadCount} read)`
                        : `Show all (${notifications.length - unreadCount} read)`
                      }
                    </button>
                  )}
                </div>
                <ScrollArea className="flex-1">
                  {displayedNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-500 h-full">
                      <Bell className="size-16 mb-4 opacity-20" />
                      <p className="text-sm">{showAllNotifications ? 'No notifications' : 'All caught up!'}</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {displayedNotifications.slice().reverse().map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markAsRead(notif.id);
                          }}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            notif.read 
                              ? 'bg-white border-gray-100 hover:bg-gray-50 hover:shadow-sm' 
                              : notif.type === 'error'
                              ? 'bg-red-50 border-red-300 hover:bg-red-100 shadow-sm'
                              : notif.type === 'warning'
                              ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 shadow-sm'
                              : 'bg-blue-50 border-blue-300 hover:bg-blue-100 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                                {!notif.read && (
                                  <div className={`shrink-0 size-3 rounded-full ${
                                    notif.type === 'error' ? 'bg-red-600' :
                                    notif.type === 'warning' ? 'bg-yellow-600' :
                                    'bg-blue-600'
                                  }`} />
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(notif.timestamp)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notif.id);
                              }}
                              className="h-6 w-6 p-0 shrink-0 hover:bg-gray-300"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Critical Alert Dialog */}
      <AlertDialog open={!!currentCriticalAlert}>
        <AlertDialogContent className={`${
          currentCriticalAlert?.type === 'error' 
            ? 'border-red-500 bg-red-50' 
            : 'border-yellow-500 bg-yellow-50'
        }`}>
          <AlertDialogHeader className="flex flex-row items-start gap-4">
            <div className="mt-0.5">
              {getCriticalIcon()}
            </div>
            <div className="flex-1">
              <AlertDialogTitle className={`${
                currentCriticalAlert?.type === 'error' 
                  ? 'text-red-900' 
                  : 'text-yellow-900'
              }`}>
                {currentCriticalAlert?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className={`mt-2 ${
                currentCriticalAlert?.type === 'error' 
                  ? 'text-red-700' 
                  : 'text-yellow-700'
              }`}>
                {currentCriticalAlert?.message}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel 
              onClick={() => currentCriticalAlert && handleDismissCritical(currentCriticalAlert.id)}
            >
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => currentCriticalAlert && handleAcknowledgeCritical(currentCriticalAlert.id)}
              className={currentCriticalAlert?.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
            >
              Acknowledge
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
