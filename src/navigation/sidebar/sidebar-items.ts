import {
  Banknote,
  Calendar,
  ChartBar,
  CheckSquare,
  Database,
  Fingerprint,
  Gauge,
  Kanban,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main Workspace",
    items: [
      {
        id: "default",
        title: "Executive Command",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "crm",
        title: "CRM/Leads",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        id: "chat",
        title: "AI Agent",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "mail",
        title: "Email & Outreach",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "calendar",
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "tasks",
        title: "Execution & Tasks",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "kanban",
        title: "Kanban Board",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        id: "finance",
        title: "Freedom & Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
    ],
  },
  {
    id: 2,
    label: "Settings & System",
    items: [
      {
        id: "users",
        title: "Team & Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "authentication-sub",
        title: "Auth Variations",
        icon: Fingerprint,
        subItems: [
          { id: "login-v1", title: "Login Screen", url: "/login" },
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Developer Sandbox",
    items: [
      {
        id: "sandbox-sub",
        title: "Template Demos",
        icon: Database,
        subItems: [
          { id: "twenty-crm", title: "Twenty CRM Engine", url: "/dashboard/twenty-crm" },
          { id: "intent-leads", title: "Intent Leads Radar", url: "/dashboard/intent-leads" },
          { id: "open-notebook", title: "Open-Notebook Brain", url: "/dashboard/open-notebook" },
          { id: "lightmem", title: "LightMem AI Memory", url: "/dashboard/lightmem" },
          { id: "agents", title: "Paperclip AI Cockpit", url: "/dashboard/agents" },
          { id: "workshops", title: "Canadian Workshop Engine", url: "/dashboard/workshops" },
          { id: "calculator", title: "Freedom Calculator", url: "/dashboard/calculator" },
          { id: "mailflare", title: "Mailflare Direct Hub", url: "/dashboard/mailflare" },
          { id: "analytics", title: "Analytics & CASL Shield", url: "/dashboard/analytics" },
          { id: "ecommerce", title: "E-Commerce Demo", url: "/dashboard/ecommerce" },
          { id: "kanban", title: "Kanban Board Demo", url: "/dashboard/kanban" },
          { id: "productivity", title: "Productivity Demo", url: "/dashboard/productivity" },
          { id: "invoice", title: "Invoice Demo", url: "/dashboard/invoice" },
          { id: "profile", title: "Profile Demo", url: "/dashboard/profile" },
        ],
      },
    ],
  },
];
