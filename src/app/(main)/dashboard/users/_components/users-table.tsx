"use client";

import Link from "next/link";

import { Eye } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PaginatedResponseDto } from "@/types/api";
import { User } from "@/types/entities/user.type";

type Props = {
  data: PaginatedResponseDto<User> | null;
  isLoading: boolean;
  error: unknown;
  pagination: {
    page: number;
    pageSize: number;
  };
};

export function UsersTable({ data, isLoading, error, pagination }: Props) {
  return (
    <Card className="relative w-full overflow-auto rounded-xl  bg-card max-h-[70vh]">
      <CardContent className="p-0">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">خطا در بارگذاری داده‌ها</p>
          </div>
        ) : isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">کاربری یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12 text-center">#</TableHead>
                <TableHead className="w-3/12">کاربر</TableHead>
                <TableHead className="w-1/12 text-center">کد</TableHead>
                <TableHead className="w-2/12 text-center">نقش ها</TableHead>
                <TableHead className="w-1/12 text-center">وضعیت</TableHead>
                <TableHead className="w-1/12 text-center">تاریخ عضویت</TableHead>

                <TableHead className="w-2/12 text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((user: User, index: number) => (
                <TableRow key={user.id}>
                  <TableCell className="w-1/12 text-center  text-muted-foreground">
                    {(pagination.page - 1) * pagination.pageSize + index + 1}
                  </TableCell>
                  <TableCell className="w-3/12">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{user.identity.name ?? "نام نامشخص"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/12 text-center">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <FormattedNumber type="normal" value={user.code} className="truncate font-medium" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-2/12 text-center">
                    <div className="flex flex-row gap-1 items-center">
                      {user.roleAssignments?.map((roleAssignment) => (
                        <Badge key={roleAssignment.id} variant="secondary" className="text-xs font-medium">
                          {roleAssignment.role?.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="w-1/12 text-center">
                    <Badge variant={user.isActive ? "active" : "inactive"}>{user.isActive ? "فعال" : "غیرفعال"}</Badge>
                  </TableCell>

                  <TableCell className="w-1/12 text-center">
                    {user.identity.createdAt
                      ? new Date(user.identity.createdAt).toLocaleDateString("fa-IR")
                      : "تاریخ نامشخص"}
                  </TableCell>

                  <TableCell className="w-2/12">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/users/${user.id}`}>
                              <Eye />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>مشاهده جزئیات کاربر</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
