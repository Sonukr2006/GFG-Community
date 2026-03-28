"use client";

import { ReactNode, useEffect } from "react";
import { getRole } from "@/lib/auth";

export default function ProtectedRoute({
  role,
  children
}: {
  role: "admin" | "leader" | "member";
  children: ReactNode;
}) {
  useEffect(() => {
    const currentRole = getRole();
    if (currentRole !== role) {
      window.location.href = "/";
    }
  }, [role]);

  return <>{children}</>;
}
