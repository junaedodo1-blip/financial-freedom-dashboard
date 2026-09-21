"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GraduationCap, LayoutDashboard, Mail, MessageSquare, Sparkles, Zap } from "lucide-react";

import { PitchDemoModal } from "./PitchDemoModal";

export function MobileNav() {
  const pathname = usePathname();
  const [showPitchModal, setShowPitchModal] = useState(false);

  const navItems = [
    { label: "Dashboard", url: "/dashboard/default", icon: LayoutDashboard },
    { label: "AI Fleet", url: "/dashboard/chat", icon: MessageSquare },
    { label: "Intent", url: "/dashboard/intent-leads", icon: Sparkles },
    { label: "Mailflare", url: "/dashboard/mailflare", icon: Mail },
    { label: "Workshops", url: "/dashboard/workshops", icon: GraduationCap },
  ];

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-2 shadow-2xl backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`flex flex-col items-center px-2 py-1 transition-colors ${
                active ? "font-bold text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-0.5 text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setShowPitchModal(true)}
          className="ml-1 flex flex-col items-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 font-bold text-slate-950 shadow-amber-500/20 shadow-md"
        >
          <Zap className="h-4 w-4 fill-slate-950" />
          <span className="text-[9px]">PITCH</span>
        </button>
      </div>

      <PitchDemoModal isOpen={showPitchModal} onClose={() => setShowPitchModal(false)} />
    </>
  );
}
