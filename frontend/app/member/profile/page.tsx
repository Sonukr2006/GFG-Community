import DashboardShell from "@/components/DashboardShell";
import CrudPlaceholder from "@/components/CrudPlaceholder";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberProfilePage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <CrudPlaceholder
          title="Profile"
          description="Manage your member profile and preferences."
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}
