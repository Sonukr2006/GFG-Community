import DashboardShell from "@/components/DashboardShell";
import CrudPlaceholder from "@/components/CrudPlaceholder";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberResourcesPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <CrudPlaceholder
          title="Resources"
          description="Access learning resources curated by the team."
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}
