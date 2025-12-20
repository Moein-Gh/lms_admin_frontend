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
import { Transaction, TRANSACTION_STATUS_BADGE } from "@/types/entities/transaction.type";
import { User } from "@/types/entities/user.type";

type Props = {
  data: PaginatedResponseDto<Transaction> | null;
  isLoading: boolean;
  error: unknown;
};

const transactionCardConfig: DataCardConfig<Transaction> = {
  // Most important: amount (primary) and the user who made it (secondary)
  primaryField: "amount",
  renderPrimary: (amount, tx) => <FormattedNumber type="price" value={String(amount)} />,
  secondaryField: "user",
  renderSecondary: (user) =>
    user ? String((user as User).identity.name ?? (user as User).identity.phone ?? "بدون نام") : "بدون کاربر",
  badge: {
    field: "status",
    render: (status) => {
      const meta = TRANSACTION_STATUS_BADGE[status as Transaction["status"]];
      return <Badge variant={meta.variant}>{meta.label}</Badge>;
    }
  },
  detailFields: [
    {
      key: "code",
      label: "کد تراکنش",
      render: (value) => String(value ?? "-")
    },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (value) => <FormattedDate value={value as unknown as Date} />
    },
    {
      key: "externalRef",
      label: "شناسه خارجی",
      render: (value) => String(value ?? "-")
    }
  ],
  actions: (tx) => [
    {
      icon: <Eye className="size-5" />,
      label: "مشاهده",
      onClick: () => {
        window.location.href = `/dashboard/transactions/${tx.id}`;
      },
      side: "right"
    }
  ]
};

export function TransactionsCardList({ data, isLoading, error }: Props) {
  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="تراکنشی یافت نشد" />;

  return <DataCardList data={data.data} config={transactionCardConfig} keyExtractor={(t) => t.id} />;
}
