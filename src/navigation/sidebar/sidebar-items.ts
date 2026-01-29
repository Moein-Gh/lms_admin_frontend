import {
  ArrowLeftRight,
  HandCoins,
  ShieldUser,
  IdCard,
  LayoutDashboard,
  Settings2,
  User,
  BarChart,
  FileText,
  MessageSquare,
  type LucideIcon
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,

    items: [
      {
        title: "داشبورد",
        url: "/dashboard",
        icon: LayoutDashboard
      }

      // {
      //   title: "Finance",
      //   url: "/dashboard/finance",
      //   icon: Banknote,
      // },
    ]
  },
  {
    id: 2,
    label: "مدیریت کاربران",
    items: [
      {
        title: "کاربران",
        url: "/dashboard/users",
        icon: User
      },
      {
        title: "نقش‌ها",
        url: "/dashboard/roles",
        icon: ShieldUser
      }
    ]
  },
  {
    id: 3,
    label: "مدیریت حساب‌ها",
    items: [
      {
        title: "حساب‌ها",
        url: "/dashboard/accounts",
        icon: IdCard
      }
    ]
  },
  {
    id: 4,
    label: "مدیریت وام ها",
    items: [
      {
        title: "وام‌ها",
        url: "/dashboard/loans",
        icon: HandCoins
      },
      {
        title: "درخواست‌های وام",
        url: "/dashboard/loan-requests",
        icon: FileText
      },
      {
        title: "انواع وام",
        url: "/dashboard/loan-types",
        icon: Settings2
      }
    ]
  },
  {
    id: 5,
    label: "مدیریت تراکنش‌ها",
    items: [
      {
        title: "تراکنش‌ها",
        url: "/dashboard/transactions",
        icon: ArrowLeftRight
      }
    ]
  },
  {
    id: 6,
    label: "گزارش‌ها",
    items: [
      {
        title: "گزارش‌ها",
        url: "/dashboard/reports",
        icon: BarChart
      }
    ]
  }
];

// {
//   id: 2,
//   label: "Pages",
//   items: [
//     {
//       title: "Authentication",
//       url: "/auth",
//       icon: Fingerprint,
//       subItems: [
//         { title: "Login v1", url: "/auth/v1/login", newTab: true },
//         { title: "Login v2", url: "/auth/v2/login", newTab: true },
//         { title: "Register v1", url: "/auth/v1/register", newTab: true },
//         { title: "Register v2", url: "/auth/v2/register", newTab: true },
//       ],
//     },
//   ],
// },
