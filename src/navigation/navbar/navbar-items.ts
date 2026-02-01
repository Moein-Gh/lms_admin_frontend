import {
  ArrowLeftRight,
  HandCoins,
  IdCard,
  LayoutDashboard,
  User,
  ShieldUser,
  Settings2,
  BarChart,
  FileText,
  MessageSquare,
  type LucideIcon
} from "lucide-react";

export interface NavbarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navbarItems: NavbarItem[] = [
  {
    title: "داشبورد",
    url: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "کاربران",
    url: "/admin/users",
    icon: User
  },
  {
    title: "حساب‌ها",
    url: "/admin/accounts",
    icon: IdCard
  },
  {
    title: "وام‌ها",
    url: "/admin/loans",
    icon: HandCoins
  },
  {
    title: "تراکنش‌ها",
    url: "/admin/transactions",
    icon: ArrowLeftRight
  }
];

export const additionalNavbarItems: NavbarItem[] = [
  {
    title: "درخواست‌ وام",
    url: "/admin/loan-requests",
    icon: FileText
  },
  {
    title: "نقش‌ها",
    url: "/admin/roles",
    icon: ShieldUser
  },
  {
    title: "انواع وام",
    url: "/admin/loan-types",
    icon: Settings2
  },
  {
    title: "گزارش‌ها",
    url: "/admin/reports",
    icon: BarChart
  }
];
