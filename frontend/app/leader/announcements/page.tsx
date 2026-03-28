import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import AnnouncementsManager from "@/components/dashboards/AnnouncementsManager";

export default function LeaderAnnouncementsPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <AnnouncementsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
