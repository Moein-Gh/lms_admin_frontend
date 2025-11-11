import { ArrowLeftRight, HandCoins, IdCard, LayoutDashboard, User, type LucideIcon } from "lucide-react";

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
        url: "/dashboard/default",
        icon: LayoutDashboard
      },
      {
        title: "کاربران",
        url: "/dashboard/users",
        icon: User
      },
      {
        title: "حساب ها",
        url: "/dashboard/accounts",
        icon: IdCard
      },
      {
        title: "وام ها",
        url: "/dashboard/loans",
        icon: HandCoins
      },
      {
        title: "تراکنش ها",
        url: "/dashboard/transactions",
        icon: ArrowLeftRight
      }
      // {
      //   title: "Finance",
      //   url: "/dashboard/finance",
      //   icon: Banknote,
      // },
    ]
  }
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
];
