import DashboardShell from "@/components/DashboardShell";
import MemberTasks from "@/components/dashboards/MemberTasks";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberTasksPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <MemberTasks />
      </DashboardShell>
    </ProtectedRoute>
  );
}
