"use client";

import { Eye } from "lucide-react";

import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import {
  DataCardConfig,
  DataCardEmpty,
  DataCardError,
  DataCardList,
  DataCardSkeleton
} from "@/components/ui/data-card";
import { PaginatedResponseDto } from "@/types/api";
import { User } from "@/types/entities/user.type";

type Props = {
  data: PaginatedResponseDto<User> | null;
  isLoading: boolean;
  error: unknown;
};

const userCardConfig: DataCardConfig<User> = {
  primaryField: "identity",
  renderPrimary: (_, user) => user.identity.name ?? "نام نامشخص",
  secondaryField: "code",
  renderSecondary: (code) => <FormattedNumber type="normal" value={code as number} />,
  badge: {
    field: "roleAssignments",
    render: (_, user) =>
      user.roleAssignments && user.roleAssignments.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {user.roleAssignments.map((ra) => (
            <Badge key={ra.id} variant="secondary" className="text-xs font-medium">
              {ra.role?.name}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge variant="secondary" className="text-xs font-medium">
          -
        </Badge>
      )
  },
  statusColor: (user) => (user.isActive ? "bg-success" : "bg-destructive"),
  detailFields: [
    {
      key: "isActive",
      label: "وضعیت",
      render: (isActive) => <Badge variant={isActive ? "active" : "inactive"}>{isActive ? "فعال" : "غیرفعال"}</Badge>
    }
  ],
  actions: (user) => [
    {
      icon: <Eye className="size-5" />,
      label: "مشاهده",
      onClick: () => {
        window.location.href = `/dashboard/users/${user.id}`;
      },
      side: "right"
    }
  ]
};

export function UsersCardList({ data, isLoading, error }: Props) {
  if (error) {
    return <DataCardError />;
  }

  if (isLoading) {
    return <DataCardSkeleton count={5} />;
  }

  if (!data || data.data.length === 0) {
    return <DataCardEmpty message="کاربری یافت نشد" />;
  }

  return <DataCardList data={data.data} config={userCardConfig} keyExtractor={(user) => user.id} />;
}
