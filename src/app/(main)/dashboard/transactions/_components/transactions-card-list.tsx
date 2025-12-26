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
import { Transaction, TRANSACTION_STATUS_BADGE, TransactionStatus } from "@/types/entities/transaction.type";
import { User } from "@/types/entities/user.type";

type Props = {
  data: PaginatedResponseDto<Transaction> | null;
  isLoading: boolean;
  error: unknown;
};

const transactionCardConfig: DataCardConfig<Transaction> = {
  // Primary: User name, Secondary: Transaction code, Badge: Amount
  primaryField: "user",
  renderPrimary: (user) =>
    user ? String((user as User).identity.name ?? (user as User).identity.phone ?? "بدون نام") : "بدون کاربر",
  secondaryField: "code",
  renderSecondary: (code) => <FormattedNumber type="normal" value={String(code)} />,
  badge: {
    field: "amount",
    render: (amount) => <FormattedNumber type="price" value={String(amount)} />
  },
  statusColor: (tx) => {
    switch (tx.status) {
      case TransactionStatus.APPROVED:
        return "bg-success";
      case TransactionStatus.PENDING:
        return "bg-amber-500";
      case TransactionStatus.REJECTED:
        return "bg-destructive";
      default:
        return "bg-blue-500";
    }
  },
  detailFields: [
    {
      key: "status",
      label: "وضعیت",
      render: (status) => {
        const meta = TRANSACTION_STATUS_BADGE[status as Transaction["status"]];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      }
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
