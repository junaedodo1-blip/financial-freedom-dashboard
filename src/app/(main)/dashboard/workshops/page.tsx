import type { Metadata } from "next";

import { WorkshopEngineHub } from "@/components/workshops/WorkshopEngineHub";

export const metadata: Metadata = {
  title: "Canadian Workshop Engine | Kalo Systems",
  description:
    "Physical branch workshop seating, masterclass reservations, and show-up rate optimization across 5 Canadian hubs.",
};

export default function WorkshopsPage() {
  return <WorkshopEngineHub />;
}
