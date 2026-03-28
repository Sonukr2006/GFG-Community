import DashboardShell from "@/components/DashboardShell";
import MemberWorkshops from "@/components/dashboards/MemberWorkshops";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberWorkshopsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <MemberWorkshops />
      </DashboardShell>
    </ProtectedRoute>
  );
}
