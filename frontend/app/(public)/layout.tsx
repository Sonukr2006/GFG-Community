import { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CampusChatbot from "@/components/CampusChatbot";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900">
      <SiteHeader />
      {children}
      <SiteFooter />
      <CampusChatbot />
    </div>
  );
}
