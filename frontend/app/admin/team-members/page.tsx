import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import TeamMembersManager from "@/components/dashboards/TeamMembersManager";

export default function AdminTeamMembersPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <TeamMembersManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
