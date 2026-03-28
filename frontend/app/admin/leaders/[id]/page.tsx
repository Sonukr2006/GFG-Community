import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import LeaderProfileView from "@/components/LeaderProfileView";
import { adminNav } from "@/lib/nav";

export default function AdminLeaderProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <LeaderProfileView memberId={params.id} backHref="/admin/leaders" />
      </DashboardShell>
    </ProtectedRoute>
  );
}
