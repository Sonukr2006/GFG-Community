import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminNav } from "@/lib/nav";

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      <DashboardShell title="Admin" items={adminNav}>
        <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-slate-400">Quick snapshot of community activity.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard label="Total Events" value={24} />
          <MetricCard label="Total Workshops" value={18} />
          <MetricCard label="Total Members" value={260} />
          <MetricCard label="Announcements" value={12} />
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
