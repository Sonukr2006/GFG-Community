import DashboardShell from "@/components/DashboardShell";
import MemberEvents from "@/components/dashboards/MemberEvents";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberEventsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <MemberEvents />
      </DashboardShell>
    </ProtectedRoute>
  );
}
