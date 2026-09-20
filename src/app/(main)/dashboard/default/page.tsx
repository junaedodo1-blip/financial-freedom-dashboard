import type { Metadata } from "next";
import { ConnectedMasterDashboard } from "@/components/dashboard/ConnectedMasterDashboard";
import { TwentyCrmHub } from "@/components/crm/TwentyCrmHub";

export const metadata: Metadata = {
  title: "Customer Lead & Meeting Growth System | Dashboard",
  description:
    "Simple, intuitive customer growth dashboard. Find leads, connect in 45 seconds, book meetings, and sync sales deals.",
};

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <ConnectedMasterDashboard />
      <TwentyCrmHub />
    </div>
  );
}
