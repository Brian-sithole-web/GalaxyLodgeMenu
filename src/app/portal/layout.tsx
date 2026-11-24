import type { ReactNode } from "react";
import { PortalFrame } from "@/components/admin/PortalFrame";

/**
 * Layout in src/app/portal.
 * Wraps every signed-in page in the admin shell.
 */
export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalFrame>{children}</PortalFrame>;
}
