import {
  ArrowLeftRight,
  HandCoins,
  IdCard,
  LayoutDashboard,
  User,
  ShieldUser,
  Settings2,
  BarChart,
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
    url: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "کاربران",
    url: "/dashboard/users",
    icon: User
  },
  {
    title: "حساب‌ها",
    url: "/dashboard/accounts",
    icon: IdCard
  },
  {
    title: "وام‌ها",
    url: "/dashboard/loans",
    icon: HandCoins
  },
  {
    title: "تراکنش‌ها",
    url: "/dashboard/transactions",
    icon: ArrowLeftRight
  }
];

export const additionalNavbarItems: NavbarItem[] = [
  {
    title: "نقش‌ها",
    url: "/dashboard/roles",
    icon: ShieldUser
  },
  {
    title: "انواع وام",
    url: "/dashboard/loan-types",
    icon: Settings2
  },
  {
    title: "گزارش‌ها",
    url: "/dashboard/reports",
    icon: BarChart
  }
];
