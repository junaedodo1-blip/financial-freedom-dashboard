import type { Metadata } from "next";
import { IconBuildingBank } from "@tabler/icons-react";
import { TablerCard } from "@/components/ui/tabler-card";
import { LoginForm } from "../../_components/login-form";

export const metadata: Metadata = {
  title: "Client Login - Financial Freedom OS",
  description: "Secure login for approved client accounts.",
};

export default function LoginV2() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <TablerCard
          statusColor="emerald"
          headerTitle="Client Login"
          headerDescription="Enter your approved credentials to access dashboard."
          footerContent={
            <div className="text-center text-[11px] text-muted-foreground">
              Approved client access only.
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <IconBuildingBank className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-sm text-foreground">Financial Freedom OS</h2>
                <p className="text-xs text-muted-foreground">Approved Client Gateway</p>
              </div>
            </div>

            <LoginForm />
          </div>
        </TablerCard>
      </div>
    </div>
  );
}
