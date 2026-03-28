import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import TeamMemberProfileView from "@/components/TeamMemberProfileView";
import { adminNav } from "@/lib/nav";

export default function AdminTeamMemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <TeamMemberProfileView memberId={params.id} backHref="/admin/team-members" />
      </DashboardShell>
    </ProtectedRoute>
  );
}
