import DashboardShell from "@/components/DashboardShell";
import CrudPlaceholder from "@/components/CrudPlaceholder";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberEventsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <CrudPlaceholder
          title="Events"
          description="Browse and register for upcoming events."
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}
