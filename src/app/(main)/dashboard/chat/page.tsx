import type { Metadata } from "next";

import { KaloAiChat } from "@/components/chat/KaloAiChat";

export const metadata: Metadata = {
  title: "Kalo Systems - AI Fleet Chat",
  description: "Interactive AI Agent Fleet Chat powered by LangGraph and Paperclip Bots.",
};

export default function DashboardChatPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-xl tracking-tight">Kalo AI Fleet Chat</h1>
        <p className="text-muted-foreground text-xs">
          Interact live with Kalo Systems autonomous Paperclip AI Bots (Speed-to-Lead AI, Scout Bot, CASL Shield,
          Mastermind Coach).
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <KaloAiChat />
      </div>
    </div>
  );
}
