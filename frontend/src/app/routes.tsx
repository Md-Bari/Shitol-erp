import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { Dashboard } from "./components/dashboard";
import { Inventory } from "./components/inventory";
import { Sales } from "./components/sales";
import { HumanResources } from "./components/human-resources";
import { Finance } from "./components/finance";
import { CRM } from "./components/crm";
import { Login } from "./components/login";
import { UserManagement } from "./components/user-management";
import { OrdersPage } from "./components/orders-page";
import { RMGAnalysis } from "./components/rmg-analysis";
import { AnalyticsResults } from "./components/analytics-results";
import { AnalyticsDashboard } from "./components/analytics-dashboard";
import { ProtectedRoute } from "./components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "sales", Component: Sales },
      { path: "orders", Component: OrdersPage },
      { path: "hr", Component: HumanResources },
      { path: "finance", Component: Finance },
      { path: "crm", Component: CRM },
      { path: "users", Component: UserManagement },
      { path: "rmg-analysis", Component: RMGAnalysis },
      { path: "analytics-results", Component: AnalyticsResults },
      { path: "analytics", Component: AnalyticsDashboard },
    ],
  },
]);