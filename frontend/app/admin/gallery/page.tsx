import DashboardShell from "@/components/DashboardShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";
import GalleryManager from "@/components/dashboards/GalleryManager";

export default function AdminGalleryPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <GalleryManager />
      </DashboardShell>
    </ProtectedRoute>
  );
}
