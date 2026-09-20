import type { Metadata } from "next";

import { IntentLeadsEngine } from "@/components/intent/IntentLeadsEngine";

export const metadata: Metadata = {
  title: "Kalo Systems - ciel/intentleads Intent Engine",
  description: "Configure custom intent characteristics to surface, rank, and trigger speed-to-lead calls.",
};

export default function IntentLeadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <IntentLeadsEngine />
    </div>
  );
}
