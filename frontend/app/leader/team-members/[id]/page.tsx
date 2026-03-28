import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import TeamMemberProfileView from "@/components/TeamMemberProfileView";
import { leaderNav } from "@/lib/nav";

export default function LeaderTeamMemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <TeamMemberProfileView memberId={params.id} backHref="/leader/team-members" />
      </DashboardShell>
    </ProtectedRoute>
  );
}
