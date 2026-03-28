import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import WorkshopsManager from "@/components/dashboards/WorkshopsManager";

export default function AdminWorkshopsPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <WorkshopsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
