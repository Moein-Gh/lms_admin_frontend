import {
  LoanIcon,
  AdminIcon,
  CardIcon,
  LayoutDashboard,
  Settings2,
  UserIcon,
  BarChart,
  FileText,
  type AppIcon,
  TransactionIcon
} from "@/components/icons";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: AppIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: AppIcon;
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
        url: "/admin",
        icon: LayoutDashboard
      }

      // {
      //   title: "Finance",
      //   url: "/admin/finance",
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
        url: "/admin/UserIcons",
        icon: UserIcon
      },
      {
        title: "نقش‌ها",
        url: "/admin/roles",
        icon: AdminIcon
      }
    ]
  },
  {
    id: 3,
    label: "مدیریت حساب‌ها",
    items: [
      {
        title: "حساب‌ها",
        url: "/admin/accounts",
        icon: CardIcon
      }
    ]
  },
  {
    id: 4,
    label: "مدیریت وام ها",
    items: [
      {
        title: "وام‌ها",
        url: "/admin/loans",
        icon: LoanIcon
      },
      {
        title: "درخواست‌های وام",
        url: "/admin/loan-requests",
        icon: FileText
      },
      {
        title: "انواع وام",
        url: "/admin/loan-types",
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
        url: "/admin/transactions",
        icon: TransactionIcon
      }
    ]
  },
  {
    id: 6,
    label: "گزارش‌ها",
    items: [
      {
        title: "گزارش‌ها",
        url: "/admin/reports",
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
