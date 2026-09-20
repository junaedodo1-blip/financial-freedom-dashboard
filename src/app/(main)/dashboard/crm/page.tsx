import type { Metadata } from "next";
import { TwentyCrmHub } from "@/components/crm/TwentyCrmHub";

export const metadata: Metadata = {
  title: "CRM Dashboard | Financial Freedom OS & Twenty CRM",
  description:
    "Explore Financial Freedom OS Canada & Twenty Open-Source CRM with live prospect radar, speed calls, and pipeline activity.",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <TwentyCrmHub />
    </div>
  );
}
