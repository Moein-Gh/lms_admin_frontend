import {
  LoanIcon,
  CardIcon,
  LayoutDashboard,
  UserIcon,
  AdminIcon,
  Settings2,
  BarChart,
  FileText,
  TransactionIcon,
  AppIcon
} from "@/components/icons";

export interface NavbarItem {
  title: string;
  url: string;
  icon: AppIcon;
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
    icon: UserIcon
  },
  {
    title: "حساب‌ها",
    url: "/admin/accounts",
    icon: CardIcon
  },
  {
    title: "وام‌ها",
    url: "/admin/loans",
    icon: LoanIcon
  },
  {
    title: "تراکنش‌ها",
    url: "/admin/transactions",
    icon: TransactionIcon
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
    icon: AdminIcon
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
