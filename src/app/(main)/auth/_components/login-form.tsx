"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { IconAlertTriangle, IconLock, IconShieldCheck, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Approved Client Accounts List (only approved users can log in)
const APPROVED_ACCOUNTS = [{ username: "junaed", email: "junaed@financialfreedom.ca", password: "1357" }];

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("junaed");
  const [password, setPassword] = useState("1357");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const inputLower = username.trim().toLowerCase();

    // Check against approved logins
    const approvedUser = APPROVED_ACCOUNTS.find(
      (acc) =>
        (acc.username.toLowerCase() === inputLower || acc.email.toLowerCase() === inputLower) &&
        acc.password === password,
    );

    setTimeout(() => {
      setIsSubmitting(false);

      if (approvedUser) {
        toast.success("Login Successful", {
          description: `Welcome back, ${approvedUser.username}!`,
        });
        window.location.href = "/dashboard/default";
      } else {
        const errorText = "Access denied. Account not approved by administrator.";
        setErrorMsg(errorText);
        toast.error("Login Failed", {
          description: errorText,
        });
      }
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-rose-600 text-xs dark:text-rose-400">
          <IconAlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block font-medium text-muted-foreground text-xs">Approved Username or Email</label>
        <div className="relative">
          <IconUser className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="junaed"
            className="pl-8 text-xs"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-medium text-muted-foreground text-xs">Password</label>
        <div className="relative">
          <IconLock className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            className="pl-8 text-xs"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-muted-foreground text-xs">
        <span className="flex items-center gap-1 font-medium text-[11px] text-emerald-600 dark:text-emerald-400">
          <IconShieldCheck className="h-3.5 w-3.5" /> Approved Client Access Only
        </span>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full font-semibold text-xs" size="sm">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
