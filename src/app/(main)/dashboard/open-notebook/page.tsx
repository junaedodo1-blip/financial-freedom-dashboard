import type { Metadata } from "next";

import { OpenNotebookBrainHub } from "@/components/brain/OpenNotebookBrainHub";

export const metadata: Metadata = {
  title: "Open-Notebook Knowledge Brain | Kalo Systems",
  description:
    "Enterprise Knowledge Brain & RAG Vector Engine integrated with open-notebook for Kalo Systems AI Fleet Agents.",
};

export default function OpenNotebookPage() {
  return <OpenNotebookBrainHub />;
}
