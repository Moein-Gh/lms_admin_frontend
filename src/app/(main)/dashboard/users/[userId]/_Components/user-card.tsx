"use client";

import { Calendar, CreditCard, Hash, MessageCircle, Phone, Trash } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/entities/user.type";

import { EditUserDialog } from "./edit-user-dialog";

type Props = { user: User };

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
    <Card className="w-full h-full flex flex-col bg-card border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-center gap-4 pb-4 pt-6">
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-background shadow-sm">
            <AvatarImage src={avatarSrc} alt={identity.name ?? "کاربر"} className="object-cover" />
          </Avatar>
          <span
            className={
              "absolute bottom-0 right-0 flex items-center justify-center rounded-full border-2 border-card " +
              (user.isActive ? "bg-emerald-500 w-4 h-4 md:w-5 md:h-5" : "bg-gray-400 w-4 h-4 md:w-5 md:h-5")
            }
            title={user.isActive ? "فعال" : "غیرفعال"}
          >
            <span className="sr-only">{user.isActive ? "فعال" : "غیرفعال"}</span>
          </span>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="text-lg font-bold truncate text-foreground">{identity.name ?? "کاربر بدون نام"}</h2>
          <Badge variant="secondary" className="w-fit text-xs font-normal px-2.5 py-0.5">
            {user.isActive ? "حساب کاربری فعال" : "حساب کاربری غیرفعال"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 px-6">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            شماره تماس
          </span>
          <span className="text-base font-bold dir-ltr truncate">
            <FormattedNumber useGrouping={false} value={identity.phone ?? ""} />
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <CreditCard className="h-3 w-3" />
            کد ملی
          </span>
          <span className="text-base font-bold dir-ltr truncate">
            <FormattedNumber useGrouping={false} value={identity.nationalCode ?? ""} />
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <Hash className="h-3 w-3" />
            کد کاربر
          </span>
          <span className="text-base font-bold dir-ltr truncate">{user.code}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            تاریخ عضویت
          </span>
          <span className="text-base font-medium truncate">{formatDate(identity.createdAt!)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-2 flex flex-col gap-3 mt-auto">
        <Separator />
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex-1">
            <EditUserDialog user={user} />
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>ارسال پیام</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" className="h-9 w-9 shrink-0 hover:bg-destructive/90">
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حذف کاربر</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
