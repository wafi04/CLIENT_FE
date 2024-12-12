import { AdminLayout } from "@/components/layouts/AuthLayout";
import { SidebarDashboard } from "@/components/layouts/SidebarDashboard";
import { Outlet } from "react-router-dom";

export function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      <SidebarDashboard>
        <Outlet />
      </SidebarDashboard>
    </AdminLayout>
  );
}
