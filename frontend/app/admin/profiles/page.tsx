import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilesManager from "@/components/dashboards/ProfilesManager";
import { adminNav } from "@/lib/nav";

export default function AdminProfilesPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <ProfilesManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
