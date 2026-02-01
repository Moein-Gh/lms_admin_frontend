"use client";

import Link from "next/link";
import { CircleUser, LogOut, User, UserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-auth";
import { useMe } from "@/hooks/use-user";

export function AccountSwitcher() {
  const { data: user } = useMe();
  const logout = useLogout();

  const rawAssignments = (user as any)?.roleAssignments ?? (user as any)?.roleassignments ?? [];
  const roles = rawAssignments.map((ra: any) => ra?.role?.name).filter(Boolean);
  const roleText = roles.length ? roles.join("، ") : "مهمان";

  const activeUser = {
    name: user?.identity?.name ?? "کاربر",
    role: roleText,
    avatar: "" // Add avatar logic if available in User entity
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon-lg"}>
          <CircleUser className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="start" sideOffset={4}>
        <div>
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRoundIcon className="size-4.5" />
            </div>
            <div className="grid flex-1 text-end text-sm leading-tight">
              <span className="truncate font-semibold">{activeUser.name}</span>
              <span className="truncate text-xs capitalize">{activeUser.role}</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin/profile" className="w-full flex items-center justify-between gap-3">
              <User />
              <span className="truncate">حساب کاربری</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={logout.isPending}
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            logout.mutate();
          }}
          className="w-full flex items-center justify-between gap-3"
        >
          <LogOut />
          <span>{logout.isPending ? "خروج..." : "خروج"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
