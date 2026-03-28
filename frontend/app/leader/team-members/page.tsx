import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import TeamMembersManager from "@/components/dashboards/TeamMembersManager";

export default function LeaderTeamMembersPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <TeamMembersManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
