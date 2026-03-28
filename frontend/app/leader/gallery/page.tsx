import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";
import GalleryManager from "@/components/dashboards/GalleryManager";

export default function LeaderGalleryPage() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <GalleryManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
