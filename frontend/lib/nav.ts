import { SidebarItem } from "@/components/Sidebar";

export const adminNav: SidebarItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Events", href: "/admin/events" },
  { label: "Workshops", href: "/admin/workshops" },
  { label: "Team Members", href: "/admin/team-members" },
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Tasks", href: "/admin/tasks" },
  { label: "Contact Messages", href: "/admin/contact-messages" },
  { label: "Members", href: "/admin/members" },
  { label: "Leaders", href: "/admin/leaders" }
];

export const leaderNav: SidebarItem[] = [
  { label: "Dashboard", href: "/leader" },
  { label: "Events", href: "/leader/events" },
  { label: "Workshops", href: "/leader/workshops" },
  { label: "Team Members", href: "/leader/team-members" },
  { label: "Announcements", href: "/leader/announcements" },
  { label: "Resources", href: "/leader/resources" },
  { label: "Gallery", href: "/leader/gallery" },
  { label: "Tasks", href: "/leader/tasks" },
  { label: "Contact Messages", href: "/leader/contact-messages" }
];

export const memberNav: SidebarItem[] = [
  { label: "Dashboard", href: "/member" },
  { label: "Events", href: "/member/events" },
  { label: "Workshops", href: "/member/workshops" },
  { label: "Resources", href: "/member/resources" },
  { label: "Announcements", href: "/member/announcements" },
  { label: "Tasks", href: "/member/tasks" },
  { label: "Profile", href: "/member/profile" }
];
