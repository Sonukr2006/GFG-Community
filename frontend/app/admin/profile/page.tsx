import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import ProfileForm from "@/components/ProfileForm";

export default function AdminProfilePage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <ProfileForm />
      </DashboardShell>
    </ProtectedRoute>
  );
}
