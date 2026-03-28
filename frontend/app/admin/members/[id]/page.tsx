import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import MemberProfileView from "@/components/MemberProfileView";
import { adminNav } from "@/lib/nav";

export default function AdminMemberProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <MemberProfileView memberId={params.id} backHref="/admin/members" />
      </DashboardShell>
    </ProtectedRoute>
  );
}
