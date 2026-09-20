import type { Metadata } from "next";

import { TwentyCrmHub } from "@/components/crm/TwentyCrmHub";

export const metadata: Metadata = {
  title: "Kalo Systems - Twenty Open-Source CRM",
  description: "Twenty CRM integration for Kalo Systems AI Client Acquisition & Financial OS.",
};

export default function TwentyCrmPage() {
  return (
    <div className="flex flex-col gap-6">
      <TwentyCrmHub />
    </div>
  );
}
