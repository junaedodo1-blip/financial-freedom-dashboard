import { Metadata } from "next";
import { LightMemHub } from "@/components/memory/LightMemHub";

export const metadata: Metadata = {
  title: "LightMem AI Agent Memory | Kalo Systems",
  description:
    "Long-Term AI Agent Memory Layer integrated with LightMem for Paperclip AI Fleet Agents.",
};

export default function LightMemPage() {
  return <LightMemHub />;
}
