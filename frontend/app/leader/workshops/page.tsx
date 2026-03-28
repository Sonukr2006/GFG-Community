import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import WorkshopsManager from "@/components/dashboards/WorkshopsManager";

export default function LeaderWorkshopsPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <WorkshopsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
