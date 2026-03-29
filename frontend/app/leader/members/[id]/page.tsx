import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import MemberProfileView from "@/components/MemberProfileView";
import { leaderNav } from "@/lib/nav";

export default function LeaderMemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <MemberProfileView memberId={params.id} backHref="/leader/members" />
      </DashboardShell>
    </ProtectedRoute>
  );
}
