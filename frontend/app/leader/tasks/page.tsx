import DashboardShell from "@/components/DashboardShell";
import TasksManager from "@/components/dashboards/TasksManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";

export default function LeaderTasksPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <TasksManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
