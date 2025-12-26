"use client";

import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserRolesProps = {
  roles: string[];
  action?: React.ReactNode;
};

export function UserRoles({ roles, action }: UserRolesProps) {
  return (
    <Card className="py-6">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShieldCheck className="size-5 text-primary" />
            نقش‌های من
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">لیست نقش‌ها و دسترسی‌های شما در سیستم.</CardDescription>
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="px-3 py-1 text-sm">
              {role}
            </Badge>
          ))}
          {roles.length === 0 && <p className="text-sm text-muted-foreground">هیچ نقشی برای شما تعریف نشده است.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
