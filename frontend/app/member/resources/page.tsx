import DashboardShell from "@/components/DashboardShell";
import MemberResources from "@/components/dashboards/MemberResources";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberResourcesPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <MemberResources />
      </DashboardShell>
    </ProtectedRoute>
  );
}
