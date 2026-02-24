"use client";

import Link from "next/link";
import { FormattedDate } from "@/components/formatted-date";
import { ArrowUpRight, CalendarIcon, Hash } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { type JournalEntry, JOURNAL_ENTRY_TARGET_META, JournalEntryTarget } from "@/types/entities/journal-entry.type";
import {
  type SubscriptionFee,
  SubscriptionFeeStatus,
  SUBSCRIPTION_FEE_STATUS_LABEL
} from "@/types/entities/subscription-fee.type";
import { getTargetLink, getTargetCode, isSubscriptionFee } from "./journal-entry-utils";

const SUBSCRIPTION_FEE_STATUS_VARIANT: Record<SubscriptionFeeStatus, "active" | "inactive" | "warning" | "outline"> = {
  [SubscriptionFeeStatus.ALLOCATED]: "active",
  [SubscriptionFeeStatus.PAID]: "outline",
  [SubscriptionFeeStatus.DUE]: "warning"
};

type Props = {
  targetType?: JournalEntry["targetType"];
  targetId?: string;
  target?: JournalEntry["target"];
};

/**
 * Renders target type badge, code/link, and target-specific extra details
 * (e.g. subscription fee status, period start).
 */
export function JournalEntryTargetInfo({ targetType, targetId, target }: Props) {
  if (!targetType) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const targetLink = targetId ? getTargetLink(targetType, targetId, target) : null;
  const targetCode = getTargetCode({ targetType, targetId, target } as JournalEntry);
  // eslint-disable-next-line security/detect-object-injection -- targetType is a validated enum value
  const meta = JOURNAL_ENTRY_TARGET_META[targetType];
  const fee: SubscriptionFee | null = isSubscriptionFee(target) ? target : null;

  return (
    <div className="space-y-1.5 min-w-0">
      {/* Type badge + code/link */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant={meta.variant} className="text-xs font-normal shrink-0">
          {meta.label}
        </Badge>
        {targetCode && (
          <>
            <Hash className="size-3 text-muted-foreground shrink-0" />
            {targetLink ? (
              <Link
                href={targetLink}
                className="flex items-center gap-0.5 text-xs text-primary hover:underline"
                title={`مشاهده ${meta.label}`}
              >
                {targetCode}
                <ArrowUpRight className="size-3" />
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">{targetCode}</span>
            )}
          </>
        )}
      </div>

      {/* Subscription-fee extras */}
      {fee && (
        <div className="space-y-1">
          <Badge variant={SUBSCRIPTION_FEE_STATUS_VARIANT[fee.status]} className="text-xs font-normal">
            {SUBSCRIPTION_FEE_STATUS_LABEL[fee.status]}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3 shrink-0" />
            <span>دوره: </span>
            <FormattedDate value={fee.periodStart} />
          </div>
          {targetType === JournalEntryTarget.SUBSCRIPTION_FEE && fee.paidAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="size-3 shrink-0" />
              <span>پرداخت: </span>
              <FormattedDate value={fee.paidAt} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
