import DashboardShell from "@/components/DashboardShell";
import ContactMessagesManager from "@/components/dashboards/ContactMessagesManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";

export default function LeaderContactMessagesPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <ContactMessagesManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
