import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import ProfileForm from "@/components/ProfileForm";

export default function LeaderProfilePage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <ProfileForm />
      </DashboardShell>
    </ProtectedRoute>
  );
}
