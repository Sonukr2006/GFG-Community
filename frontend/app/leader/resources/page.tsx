import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import ResourcesManager from "@/components/dashboards/ResourcesManager";

export default function LeaderResourcesPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <ResourcesManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
