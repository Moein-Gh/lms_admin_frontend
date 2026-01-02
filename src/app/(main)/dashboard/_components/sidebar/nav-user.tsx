"use client";

import { EllipsisVertical, LogOut, User, UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-auth";

export function NavUser({
  user
}: {
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const logout = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRoundIcon className="size-4.5" />
              </div>
              <div className="grid flex-1 text-end text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
              <EllipsisVertical className="me-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-end text-sm">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRoundIcon className="size-4.5" />
                </div>
                <div className="grid flex-1 text-end text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={logout.isPending}
              onSelect={(e) => {
                e.preventDefault();
                logout.mutate();
              }}
            >
              <LogOut />
              {logout.isPending ? "خروج..." : "خروج"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
