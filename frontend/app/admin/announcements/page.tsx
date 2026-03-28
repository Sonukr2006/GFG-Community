import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import AnnouncementsManager from "@/components/dashboards/AnnouncementsManager";

export default function AdminAnnouncementsPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <AnnouncementsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
