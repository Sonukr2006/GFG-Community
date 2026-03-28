import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import LeadersManager from "@/components/dashboards/LeadersManager";

export default function AdminLeadersPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <LeadersManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
