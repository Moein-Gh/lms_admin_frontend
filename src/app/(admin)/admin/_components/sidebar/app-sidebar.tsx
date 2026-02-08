"use client";

import Link from "next/link";

import { Command, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { useMe } from "@/hooks/admin/use-user";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useMe();

  const hasAccountHolder = user?.roleAssignments?.some(
    (assignment) => assignment.role?.key === "account-holder" && assignment.status === RoleAssignmentStatus.ACTIVE
  );

  const items = hasAccountHolder
    ? sidebarItems.map((group) => {
        if (group.id === 1) {
          // Insert a link to the user dashboard (/) right after the admin dashboard item
          const dashboardIndex = 0;
          const before = group.items.slice(0, dashboardIndex + 1);
          const after = group.items.slice(dashboardIndex + 1);
          return {
            ...group,
            items: [
              ...before,
              {
                title: "داشبورد کاربری",
                url: "/",
                icon: Home
              },
              ...after
            ]
          };
        }
        return group;
      })
    : sidebarItems;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/admin">
                <Command />
                <span className="text-base font-semibold">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={rootUser} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
