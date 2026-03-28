import DashboardShell from "@/components/DashboardShell";
import CrudPlaceholder from "@/components/CrudPlaceholder";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberWorkshopsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <CrudPlaceholder
          title="Workshops"
          description="Register and track workshop attendance."
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}
