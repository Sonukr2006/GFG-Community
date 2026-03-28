import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import ResourcesManager from "@/components/dashboards/ResourcesManager";

export default function AdminResourcesPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <ResourcesManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
