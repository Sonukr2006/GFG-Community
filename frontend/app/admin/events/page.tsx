import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import EventsManager from "@/components/dashboards/EventsManager";

export default function AdminEventsPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <EventsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
