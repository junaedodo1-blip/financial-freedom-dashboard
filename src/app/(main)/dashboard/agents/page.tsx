import { Metadata } from "next";
import { PaperclipCockpitHub } from "@/components/fleet/PaperclipCockpitHub";

export const metadata: Metadata = {
  title: "Paperclip AI Cockpit | Kalo Systems",
  description:
    "Autonomous Multi-Agent Fleet driving speed-to-lead response, CASL compliance verification, and physical workshop bookings.",
};

export default function AgentsPage() {
  return <PaperclipCockpitHub />;
}
