import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import MembersManager from "@/components/dashboards/MembersManager";
import { leaderNav } from "@/lib/nav";

export default function LeaderMembersPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <MembersManager profileBasePath="/leader/members" canDelete={false} canCreate={false} />
      </DashboardShell>
    </ProtectedRoute>
  );
}
