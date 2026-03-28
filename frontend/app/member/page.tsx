import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { memberNav } from "@/lib/nav";

export default function MemberDashboard() {
  return (
    <ProtectedRoute role="member">
      <DashboardShell title="Member" items={memberNav}>
        <h1 className="text-2xl font-semibold text-white">Member Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Track your community participation.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Events Registered" value={5} />
          <MetricCard label="Workshops Joined" value={3} />
          <MetricCard label="Resources Saved" value={12} />
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
