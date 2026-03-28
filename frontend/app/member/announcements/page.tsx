import DashboardShell from "@/components/DashboardShell";
import MemberAnnouncements from "@/components/dashboards/MemberAnnouncements";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberAnnouncementsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <MemberAnnouncements />
      </DashboardShell>
    </ProtectedRoute>
  );
}
