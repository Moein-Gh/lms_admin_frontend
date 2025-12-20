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
import { Loan, LoanStatus, LoanStatusLabels } from "@/types/entities/loan.type";

type Props = {
  data: PaginatedResponseDto<Loan> | null;
  isLoading: boolean;
  error: unknown;
};

const loanCardConfig: DataCardConfig<Loan> = {
  // Primary: account name. Secondary: code. Badge area shows amount.
  primaryField: "account",
  renderPrimary: (k, loan) => loan.account?.user?.identity.name ?? loan.account?.name,
  secondaryField: "code",
  renderSecondary: (code) => <FormattedNumber type="normal" value={code as number} />,
  badge: {
    field: "amount",
    render: (amt) => <FormattedNumber type="price" value={Number(amt) || 0} />
  },
  // Move other info into detail fields
  detailFields: [
    {
      key: "status",
      label: "وضعیت",
      render: (s) => {
        const label = LoanStatusLabels[s as Loan["status"]];
        const variant = s === LoanStatus.ACTIVE ? "default" : s === LoanStatus.PENDING ? "outline" : "secondary";
        return <Badge variant={variant}>{label}</Badge>;
      }
    },

    {
      key: "startDate",
      label: "تاریخ شروع",
      render: (v) => <FormattedDate value={v as unknown as Date} />
    },
    {
      key: "loanType",
      label: "نوع وام",
      render: (v) => String((v as Loan["loanType"])?.name ?? "-")
    },
    {
      key: "account",
      label: "حساب",
      render: (v, loan) => String(loan.account?.name ?? "-")
    }
  ],
  actions: (loan) => [
    {
      icon: <Eye className="size-5" />,
      label: "مشاهده",
      onClick: () => {
        window.location.href = `/dashboard/loans/${loan.id}`;
      },
      side: "right"
    }
  ]
};

export function LoansCardList({ data, isLoading, error }: Props) {
  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="وامی یافت نشد" />;

  return <DataCardList data={data.data} config={loanCardConfig} keyExtractor={(l) => l.id} />;
}
