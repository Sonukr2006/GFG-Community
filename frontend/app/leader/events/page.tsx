import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import EventsManager from "@/components/dashboards/EventsManager";

export default function LeaderEventsPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <EventsManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
