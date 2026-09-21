import type { Metadata } from "next";

import { MailflareHub } from "@/components/mailflare/MailflareHub";

export const metadata: Metadata = {
  title: "Mailflare Business Email & 360 Audit | Kalo Systems",
  description:
    "Enterprise business email outreach, automated warmup, IntentLeads transport, and 360 company audit for Kalo Systems AI Fleet.",
};

export default function MailflarePage() {
  return <MailflareHub />;
}
