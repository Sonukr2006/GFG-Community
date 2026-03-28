import DashboardShell from "@/components/DashboardShell";
import CrudPlaceholder from "@/components/CrudPlaceholder";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberAnnouncementsPage() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <CrudPlaceholder
          title="Announcements"
          description="Stay updated with community announcements."
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}
