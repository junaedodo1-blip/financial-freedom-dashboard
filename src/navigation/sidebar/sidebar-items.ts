import {
  Banknote,
  BookOpen,
  Calendar,
  ChartBar,
  CheckSquare,
  Cpu,
  Database,
  Fingerprint,
  Gauge,
  GraduationCap,
  HardDrive,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  UserRound,
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
    label: "Kalo OS Core",
    items: [
      {
        id: "default",
        title: "Kalo Executive CRM",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "crm",
        title: "Scraped Lead Radar",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        id: "analytics",
        title: "Analytics & CASL Shield",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        id: "twenty-crm",
        title: "Twenty Open-Source CRM",
        url: "/dashboard/twenty-crm",
        icon: Database,
        badge: "new",
      },
    ],
  },
  {
    id: 2,
    label: "Kalo AI & Services",
    items: [
      {
        id: "chat",
        title: "Kalo AI Fleet Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
        badge: "new",
      },
      {
        id: "open-notebook",
        title: "Open-Notebook Brain",
        url: "/dashboard/open-notebook",
        icon: BookOpen,
        badge: "new",
      },
      {
        id: "lightmem",
        title: "LightMem AI Memory",
        url: "/dashboard/lightmem",
        icon: HardDrive,
        badge: "new",
      },
      {
        id: "mailflare",
        title: "Mailflare Business Email",
        url: "/dashboard/mailflare",
        icon: Mail,
        badge: "new",
      },
      {
        id: "intent-leads",
        title: "ciel/intentleads Engine",
        url: "/dashboard/intent-leads",
        icon: Sparkles,
        badge: "new",
      },
      {
        id: "agents",
        title: "Paperclip AI Cockpit",
        url: "/dashboard/agents",
        icon: Cpu,
      },
      {
        id: "workshops",
        title: "Canadian Workshop Engine",
        url: "/dashboard/workshops",
        icon: GraduationCap,
      },
      {
        id: "calculator",
        title: "Freedom Gap Calculator",
        url: "/dashboard/calculator",
        icon: Banknote,
      },
    ],
  },
  {
    id: 3,
    label: "Authentication",
    items: [
      {
        id: "login",
        title: "Login Screen",
        url: "/login",
        icon: Lock,
      },
      {
        id: "authentication-sub",
        title: "Auth Variations",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Shadcn Templates",
    items: [
      {
        id: "finance",
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        id: "productivity",
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: ListTodo,
      },
      {
        id: "ecommerce",
        title: "E-commerce",
        url: "/dashboard/ecommerce",
        icon: ShoppingBag,
      },
      {
        id: "email",
        title: "Email",
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
        id: "kanban",
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        id: "tasks",
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "invoice",
        title: "Invoice",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
      {
        id: "profile",
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserRound,
      },
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
    ],
  },
];
