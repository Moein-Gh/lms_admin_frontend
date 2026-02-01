"use client";

import { Eye } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { DataCardConfig, DataCardList } from "@/components/ui/data-card";
import { type InstallmentWithRelations } from "@/types/entities/installment-projection.type";

type Props = {
  readonly installments: InstallmentWithRelations[];
};

const installmentCardConfig: DataCardConfig<InstallmentWithRelations> = {
  primaryField: "code",
  renderPrimary: (code) => (
    <span className="inline-flex items-center gap-1">
      <span>قسط</span>
      <FormattedNumber value={code as number} type="normal" />
    </span>
  ),
  secondaryField: "loan",
  renderSecondary: (_, installment) => installment.loan.user.identity.name,
  badge: {
    field: "status",
    render: (status) => (
      <Badge variant={status === "PAID" ? "default" : "secondary"}>{status === "PAID" ? "پرداخت شده" : "فعال"}</Badge>
    )
  },
  statusColor: (installment) => (installment.status === "PAID" ? "bg-success" : "bg-warning"),
  detailFields: [
    {
      key: "amount",
      label: "مبلغ",
      render: (amount) => <FormattedNumber value={amount as number} type="price" />
    },
    {
      key: "dueDate",
      label: "سررسید",
      render: (date) => <FormattedDate value={date as string} />
    },
    {
      key: "installmentNumber",
      label: "شماره قسط",
      render: (num) => <FormattedNumber value={num as number} type="normal" />
    }
  ],
  actions: (installment) => [
    {
      icon: <Eye className="size-5" />,
      label: "مشاهده وام",
      onClick: () => {
        window.location.href = `/admin/loans/${installment.loan.id}`;
      },
      side: "right"
    }
  ]
};

export function InstallmentsCardList({ installments }: Props) {
  return <DataCardList data={installments} config={installmentCardConfig} keyExtractor={(item) => item.id} />;
}
