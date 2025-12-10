"use client";

import { FormattedNumber } from "@/components/formatted-number";
import {
  DataCardConfig,
  DataCardEmpty,
  DataCardError,
  DataCardList,
  DataCardSkeleton
} from "@/components/ui/data-card";
import { PaginatedResponseDto } from "@/types/api";
import { Role } from "@/types/entities/role.type";

type Props = {
  data: PaginatedResponseDto<Role> | null;
  isLoading: boolean;
  error: unknown;
};

const rolesCardConfig: DataCardConfig<Role> = {
  primaryField: "name",
  secondaryField: "code",
  renderPrimary: (_v, r) => String(r.name),
  renderSecondary: (k) => <span className="font-mono text-xs text-muted-foreground">{String(k)}</span>,
  badge: {
    field: "userCount",
    render: (v) => (
      <span className="text-xs text-muted-foreground">
        <FormattedNumber value={String(v)} type="normal" /> کاربر
      </span>
    )
  },
  detailFields: [
    {
      key: "key",
      label: "کلید واژه",
      render: (v) => String(v ?? "-")
    },
    {
      key: "description",
      label: "توضیحات",
      render: (v) => String(v ?? "-")
    }
  ]
};

export function RolesCardList({ data, isLoading, error }: Props) {
  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="نقشی یافت نشد" />;

  return <DataCardList data={data.data} config={rolesCardConfig} keyExtractor={(r) => r.id} />;
}

export default RolesCardList;
