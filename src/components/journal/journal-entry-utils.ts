import { type JournalEntry, JournalEntryTarget } from "@/types/entities/journal-entry.type";

import type { SubscriptionFee } from "@/types/entities/subscription-fee.type";

export function isSubscriptionFee(target: JournalEntry["target"] | undefined): target is SubscriptionFee {
  return !!target && typeof target === "object" && ("periodStart" in target || "accountId" in target);
}

export function getTargetLink(type: JournalEntryTarget, id: string, target?: JournalEntry["target"]): string | null {
  switch (type) {
    case JournalEntryTarget.ACCOUNT:
      return `/admin/accounts/${id}`;
    case JournalEntryTarget.LOAN:
      return `/admin/loans/${id}`;
    case JournalEntryTarget.SUBSCRIPTION_FEE:
      if (isSubscriptionFee(target)) {
        if ("account" in target && target.account?.id) return `/admin/accounts/${target.account.id}`;
        if ("accountId" in target && target.accountId) return `/admin/accounts/${target.accountId}`;
      }
      return null;
    default:
      return null;
  }
}

export function getTargetCode(entry: JournalEntry): string | null {
  if (entry.target && "code" in entry.target && entry.target.code) {
    return String(entry.target.code);
  }
  if (entry.targetId) return entry.targetId.slice(0, 8) + "…";
  return null;
}
