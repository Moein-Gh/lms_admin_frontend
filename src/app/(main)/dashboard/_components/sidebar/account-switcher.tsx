"use client";

import { CircleUser, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getInitials } from "@/lib/utils";

export function AccountSwitcher({
  users
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const activeUser = users[0];
  const logout = useLogout();

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
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
              <AvatarFallback className="rounded-lg">{getInitials(activeUser.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-end text-sm leading-tight">
              <span className="truncate font-semibold">{activeUser.name}</span>
              <span className="truncate text-xs capitalize">{activeUser.role}</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-end gap-3">
            حساب کاربری
            <User />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={logout.isPending}
          onSelect={(e) => {
            e.preventDefault();
            logout.mutate();
          }}
          className="justify-end gap-3"
        >
          {logout.isPending ? "خروج..." : "خروج"}
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
