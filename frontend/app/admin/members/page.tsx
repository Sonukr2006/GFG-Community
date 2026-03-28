import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import MembersManager from "@/components/dashboards/MembersManager";

export default function AdminMembersPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <MembersManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
