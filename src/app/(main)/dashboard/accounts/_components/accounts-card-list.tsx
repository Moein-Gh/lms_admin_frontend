"use client";

import { Eye } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
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
import { Account, AccountStatusLabels } from "@/types/entities/account.type";

type Props = {
  data: PaginatedResponseDto<Account> | null;
  isLoading: boolean;
  error: unknown;
};

const accountCardConfig: DataCardConfig<Account> = {
  // Primary: show bank name and account code; Secondary: user/name
  primaryField: "user",
  renderPrimary: (_, acc) =>
    acc.user ? String(acc.user.identity.name ?? acc.user.identity.phone ?? "بدون نام") : "بدون کاربر",
  secondaryField: "code",
  renderSecondary: (code) => <FormattedNumber type="normal" value={code as number} />,
  badge: {
    field: "bankName",
    render: (bank) => <span className="text-sm text-muted-foreground">{String(bank ?? "-")}</span>
  },
  detailFields: [
    {
      key: "status",
      label: "وضعیت",
      render: (v) => {
        const label = AccountStatusLabels[v as Account["status"]];
        return <Badge variant={label.badgeVariant}>{label.label}</Badge>;
      }
    },
    {
      key: "createdAt",
      label: "تاریخ ایجاد",
      render: (v) => <FormattedDate value={v as unknown as Date} />
    },
    {
      key: "accountType",
      label: "نوع حساب",
      render: (v) => String((v as Account["accountType"])?.name ?? "-")
    },
    {
      key: "cardNumber",
      label: "شماره کارت",
      render: (v) => String(v ?? "-")
    }
  ],
  actions: (acc) => [
    {
      icon: <Eye className="size-5" />,
      label: "مشاهده",
      onClick: () => {
        window.location.href = `/dashboard/accounts/${acc.id}`;
      }
    }
  ]
};

export function AccountsCardList({ data, isLoading, error }: Props) {
  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="حسابی یافت نشد" />;

  return <DataCardList data={data.data} config={accountCardConfig} keyExtractor={(a) => a.id} />;
}
