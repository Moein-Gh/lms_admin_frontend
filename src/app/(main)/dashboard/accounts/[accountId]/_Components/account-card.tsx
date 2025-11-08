"use client";

import { MessageCircle, Trash } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/entities/user.type";

import { EditUserDialog } from "./edit-account-dialog";

type Props = { user: User };

// Centered profile card with subtle gradient header and action bar
export default function UserCard({ user }: Props) {
  const identity = user.identity as {
    avatarUrl?: string;
    name?: string;
    phone?: string;
    nationalCode?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };

  const avatarSrc =
    identity.avatarUrl ?? `https://i5p1o7caz2.ufs.sh/f/x2U4h8rqrclvSEGweo3DWPs8bGcKq1fhNvCwgj4op3rZF0nd`;

  return (
    <div className="w-full card-container flex flex-row flex-wrap md:flex-col">
      {/* Profile section */}
      <div className="p-3 md:p-4 relative flex-1 flex flex-row md:flex-col items-center md:items-center gap-3 md:gap-0">
        {/* Avatar with status badge */}
        <div className="flex flex-row md:flex-col items-center text-center gap-0 md:gap-0 shrink-0">
          <div className="relative inline-block shrink-0">
            <Avatar className="h-14 w-14 md:h-20 md:w-20">
              <AvatarImage src={avatarSrc} alt={identity.name ?? "کاربر"} />
            </Avatar>
            <span
              className={
                "absolute z-10 -top-1 -left-1 flex items-center justify-center rounded-full border-2 " +
                (user.isActive ? "bg-emerald-500 border-white w-5 h-5" : "bg-gray-400 border-white w-5 h-5 opacity-70")
              }
              title={user.isActive ? "فعال" : "غیرفعال"}
              data-active={user.isActive ? "true" : "false"}
            >
              <span className="sr-only">{user.isActive ? "فعال" : "غیرفعال"}</span>
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="flex flex-col items-start md:items-center flex-1 min-w-0">
          <h3 className="md:mt-3 text-sm md:text-lg font-bold truncate w-full md:w-auto">{identity.name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground truncate w-full md:w-auto">{identity.phone}</p>

          <div className="mt-1.5 md:mt-3 flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 w-full md:w-auto">
            <Badge className="text-[10px] md:text-xs bg-accent text-accent-foreground whitespace-nowrap">
              عضویت: {formatDate(identity.createdAt!)}
            </Badge>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4 hidden md:block" />
            <Badge className="text-[10px] md:text-xs bg-accent text-accent-foreground whitespace-nowrap">
              آخرین تغییر: {formatDate(identity.updatedAt!)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Vertical separator for mobile horizontal layout */}
      <div className="block md:hidden w-px bg-border my-3" />

      {/* Bottom section - codes and actions */}
      <div className="p-3 md:border-t border-t-0 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-2 md:gap-3 shrink-0">
        <div className="flex flex-col text-[10px] md:text-xs text-muted-foreground gap-1 w-full md:w-auto">
          <span className="truncate">
            کد کاربر: <span className="font-medium text-foreground">{user.code}</span>
          </span>
          <span className="truncate">
            کد ملی: <span className="font-medium text-foreground">{identity.nationalCode ?? "-"}</span>
          </span>
        </div>

        {/* Action buttons - hidden on mobile, visible from md+ */}
        <div className="hidden md:flex items-center gap-1.5 md:gap-2 w-full md:w-auto justify-start md:justify-end">
          <EditUserDialog user={user} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled size="icon" variant="outline" className="h-9 w-9 md:h-10 md:w-10">
                <MessageCircle className="h-5 w-5 md:h-7 md:w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">ارسال پیام</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10 h-9 w-9 md:h-10 md:w-10"
                data-slot="button"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">حذف</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile-only action row: place buttons in a separate row below content */}
      <div className="basis-full block md:hidden px-3">
        <Separator className="mb-2" />
        <div className="flex items-center gap-2 w-full justify-center">
          <EditUserDialog user={user} />

          <Button disabled size="sm" variant="outline" className="inline-flex items-center gap-1.5 h-9">
            <MessageCircle className="h-5 w-5" />
            <span>ارسال پیام</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="inline-flex items-center gap-1.5 text-destructive border-destructive hover:bg-destructive/10 h-9"
            data-slot="button"
          >
            <Trash className="h-5 w-5" />
            <span>حذف</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
