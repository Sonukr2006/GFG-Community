import DashboardShell from "@/components/DashboardShell";
import TasksManager from "@/components/dashboards/TasksManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";

export default function AdminTasksPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <TasksManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
