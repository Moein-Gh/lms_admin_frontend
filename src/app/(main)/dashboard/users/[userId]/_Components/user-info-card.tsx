"use client";

import { Calendar, CreditCard, Hash, MessageCircle, Phone, Trash, User2Icon } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/entities/user.type";

import { EditUserDialog } from "./edit-user-dialog";
import RoleAssignmentDialog from "./role-assignment-dialog";

type Props = { user: User };

export default function UserInfoCard({ user }: Props) {
  const identity = user.identity as {
    avatarUrl?: string;
    name?: string;
    phone?: string;
    nationalCode?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };

  return (
    <Card className="w-full h-full flex flex-col bg-card border-none shadow-none ">
      <CardHeader className="px-6 pt-6 pb-4 flex flex-col gap-4 bg-accent/40 hover:bg-accent/60 transition-colors rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <User2Icon className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-xl font-bold truncate text-foreground">{identity.name ?? "کاربر بدون نام"}</h2>
            <Badge variant="secondary" className="text-xs font-normal px-2.5 py-0.5">
              {user.isActive ? " فعال" : " غیرفعال"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 px-6">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            شماره تماس
          </span>
          <span className="text-base font-bold dir-ltr truncate">
            <FormattedNumber type="normal" value={identity.phone ?? ""} />
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/40 hover:bg-accent/60 transition-colors">
          <span className="text-[15px] text-muted-foreground flex items-center gap-1.5">
            <CreditCard className="h-3 w-3" />
            کد ملی
          </span>
          <span className="text-base font-bold dir-ltr truncate">
            <FormattedNumber type="normal" value={identity.nationalCode ?? ""} />
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
            {/* Assign role dialog (includes trigger) */}
            <RoleAssignmentDialog userId={user.id} />
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
