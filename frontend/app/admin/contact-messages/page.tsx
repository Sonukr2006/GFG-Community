import DashboardShell from "@/components/DashboardShell";
import ContactMessagesManager from "@/components/dashboards/ContactMessagesManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";

export default function AdminContactMessagesPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <ContactMessagesManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
