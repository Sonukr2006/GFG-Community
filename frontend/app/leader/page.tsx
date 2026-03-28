import DashboardShell from "@/components/DashboardShell";
import MetricCard from "@/components/MetricCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { leaderNav } from "@/lib/nav";

export default function LeaderDashboard() {
  return (
    <ProtectedRoute role="leader">
      <DashboardShell title="Leader" items={leaderNav}>
        <h1 className="text-2xl font-semibold text-white">Leader Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Manage community programs and content.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Upcoming Events" value={7} />
          <MetricCard label="Active Workshops" value={5} />
          <MetricCard label="Announcements" value={4} />
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
