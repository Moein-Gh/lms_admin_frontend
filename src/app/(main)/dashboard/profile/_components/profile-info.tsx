"use client";

import { Mail, Phone, Shield, User, UserRoundIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileInfoProps = {
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
  };
  action?: React.ReactNode;
  footer?: React.ReactNode;
};

export function ProfileInfo({ user, action, footer }: ProfileInfoProps) {
  return (
    <Card className="py-6">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 sm:size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRoundIcon className="size-6 sm:size-8" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg sm:text-2xl truncate">{user.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 truncate text-sm sm:text-base">
              <Shield className="size-3.5" />
              {user.role}
            </CardDescription>
          </div>
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">نام و نام خانوادگی</span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">ایمیل</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
        </div>

        {user.phone && (
          <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground">شماره تماس</span>
              <span className="text-sm font-medium" dir="ltr">
                {user.phone}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      {footer && <div className="px-6 pt-2">{footer}</div>}
    </Card>
  );
}
