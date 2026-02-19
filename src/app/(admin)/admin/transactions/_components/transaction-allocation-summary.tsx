"use client";

import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import {
  BanknoteIcon,
  Building2,
  CalendarIcon,
  CardIcon,
  Hash,
  Landmark,
  ReceiptText,
  UserIcon
} from "@/components/icons";
import { useJournals } from "@/hooks/admin/use-journal";
import type { Account } from "@/types/entities/account.type";
import type { Installment } from "@/types/entities/installment.type";
import { type JournalEntry, JournalEntryTarget } from "@/types/entities/journal-entry.type";
import type { Loan } from "@/types/entities/loan.type";
import type { SubscriptionFee } from "@/types/entities/subscription-fee.type";
import {
  type AllocationItem,
  type DetailField,
  AllocationRow,
  AllocationRowSkeleton
} from "./transaction-allocation-row";

// ── Type guards ───────────────────────────────────────────────

function isAccount(t: JournalEntry["target"]): t is Account {
  return !!t && "cardNumber" in t;
}

function isLoan(t: JournalEntry["target"]): t is Loan {
  return !!t && ("loanType" in t || "paymentMonths" in t);
}

function isInstallment(t: JournalEntry["target"]): t is Installment {
  return !!t && "installmentNumber" in t;
}

function isSubscriptionFee(t: JournalEntry["target"]): t is SubscriptionFee {
  return !!t && "periodStart" in t;
}

// ── Helpers ──────────────────────────────────────────────────

function field(id: string, icon: React.ReactNode, value: React.ReactNode): DetailField {
  return { id, icon, value };
}

function toAllocationItem(entry: JournalEntry): AllocationItem | null {
  if (!entry.targetType || !entry.targetId) return null;

  const t = entry.target;
  const entryAcc = entry.account ?? null;
  const entryUserName = entryAcc?.user?.identity.name ?? null;
  const entryAccountName = entryAcc?.name ?? null;
  const entryAccountCode = entryAcc?.code ?? null;
  const entryBankName = entryAcc?.bankName ?? null;
  const entryAccountId = entry.accountId ?? entryAcc?.id ?? null;

  switch (entry.targetType) {
    case JournalEntryTarget.INSTALLMENT: {
      const inst = isInstallment(t) ? t : null;
      const loanId = inst?.loanId ?? inst?.loan?.id ?? null;
      const loanLabel = inst?.loan?.name ?? (inst?.loan?.code ? `وام #${inst.loan.code}` : null);
      const userName = entryUserName ?? inst?.loan?.account?.user?.identity.name ?? null;
      const dueDate = inst?.dueDate ?? null;
      const details: DetailField[] = [
        ...(loanLabel ? [field("loan", <Landmark className="size-3" />, loanLabel)] : []),
        ...(userName ? [field("user", <UserIcon className="size-3" />, userName)] : []),
        ...(dueDate
          ? [field("date", <CalendarIcon className="size-3" />, <FormattedDate value={new Date(dueDate)} />)]
          : [])
      ];
      return {
        entryId: entry.id,
        targetType: entry.targetType,
        title: inst ? `قسط شماره ${inst.installmentNumber}` : "بازپرداخت قسط",
        details,
        amount: entry.amount,
        href: loanId ? `/admin/loans/${loanId}` : null
      };
    }

    case JournalEntryTarget.LOAN: {
      const loan = isLoan(t) ? t : null;
      const userName = entryUserName ?? loan?.account?.user?.identity.name ?? null;
      const loanType = loan?.loanType?.name ?? null;
      const accountName = entryAccountName ?? loan?.account?.name ?? null;
      const details: DetailField[] = [
        ...(loanType ? [field("type", <Hash className="size-3" />, loanType)] : []),
        ...(userName ? [field("user", <UserIcon className="size-3" />, userName)] : []),
        ...(accountName ? [field("account", <CardIcon className="size-3" />, accountName)] : [])
      ];
      return {
        entryId: entry.id,
        targetType: entry.targetType,
        title: loan?.name ?? `وام #${loan?.code ?? entry.targetId.slice(0, 8)}`,
        details,
        amount: entry.amount,
        href: `/admin/loans/${entry.targetId}`
      };
    }

    case JournalEntryTarget.SUBSCRIPTION_FEE: {
      const sub = isSubscriptionFee(t) ? t : null;
      const accountId = entryAccountId ?? sub?.accountId ?? null;
      const periodDate = sub?.periodStart ? new Date(sub.periodStart) : null;
      const details: DetailField[] = [
        ...(periodDate
          ? [field("period", <CalendarIcon className="size-3" />, <FormattedDate value={periodDate} />)]
          : []),
        ...(entryUserName ? [field("user", <UserIcon className="size-3" />, entryUserName)] : []),
        ...(entryAccountCode ? [field("code", <Hash className="size-3" />, `حساب #${entryAccountCode}`)] : []),
        ...(entryBankName ? [field("bank", <Building2 className="size-3" />, entryBankName)] : [])
      ];
      return {
        entryId: entry.id,
        targetType: entry.targetType,
        title: entryAccountName ?? "پرداخت ماهیانه",
        details,
        amount: entry.amount,
        href: accountId ? `/admin/accounts/${accountId}` : null
      };
    }

    case JournalEntryTarget.ACCOUNT: {
      const acc = isAccount(t) ? t : entryAcc;
      const userName = entryUserName ?? acc?.user?.identity.name ?? null;
      const accountName = entryAccountName ?? acc?.name ?? null;
      const accountCode = entryAccountCode ?? acc?.code ?? null;
      const bankName = entryBankName ?? acc?.bankName ?? null;
      const details: DetailField[] = [
        ...(userName ? [field("user", <UserIcon className="size-3" />, userName)] : []),
        ...(accountCode ? [field("code", <Hash className="size-3" />, `حساب #${accountCode}`)] : []),
        ...(bankName ? [field("bank", <Building2 className="size-3" />, bankName)] : [])
      ];
      return {
        entryId: entry.id,
        targetType: entry.targetType,
        title: accountName ?? "افزایش موجودی حساب",
        details,
        amount: entry.amount,
        href: `/admin/accounts/${entry.targetId}`
      };
    }

    default:
      return null;
  }
}

// ── Main export ───────────────────────────────────────────────

type Props = {
  readonly transactionId: string;
};

export function TransactionAllocationSummary({ transactionId }: Props) {
  const { data, isLoading, error } = useJournals({ transactionId, includeEntries: true });
  const entries = data?.data[0]?.entries ?? [];

  const items: AllocationItem[] = entries.map(toAllocationItem).filter((x): x is AllocationItem => x !== null);

  const totalAllocated = items.reduce((sum, i) => sum + Number(i.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <AllocationRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-destructive py-6">خطا در بارگذاری اطلاعات تخصیص</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
        <ReceiptText className="size-8 opacity-40" />
        <p className="text-sm">اطلاعات تخصیص یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <AllocationRow key={item.entryId} item={item} />
      ))}

      <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3 mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BanknoteIcon className="size-4 shrink-0" />
          <span>جمع تخصیص‌یافته</span>
        </div>
        <span className="text-sm font-bold text-foreground tabular-nums">
          <FormattedNumber type="price" value={String(totalAllocated)} />
        </span>
      </div>
    </div>
  );
}
