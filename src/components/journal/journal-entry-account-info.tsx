"use client";

import Link from "next/link";
import { UserIcon, CardIcon, Hash } from "@/components/icons";
import type { Account } from "@/types/entities/account.type";

type Props = {
  account?: Account;
  accountId?: string;
};

/**
 * Renders account holder (user) and account details for a journal entry.
 * Used in both the mobile card and the desktop table row.
 */
export function JournalEntryAccountInfo({ account, accountId }: Props) {
  if (!account) {
    return accountId ? <span className="text-xs text-muted-foreground font-mono">{accountId.slice(0, 8)}…</span> : null;
  }

  const userName = account.user?.identity.name;
  const userCode = account.user?.code;
  const userLink = account.user?.id ? `/admin/users/${account.user.id}` : null;
  const accountLink = `/admin/accounts/${account.id}`;

  return (
    <div className="space-y-1.5 min-w-0">
      {/* User row */}
      {userName && (
        <div className="flex items-center gap-1.5 min-w-0">
          <UserIcon className="size-3 shrink-0 text-muted-foreground" />
          {userLink ? (
            <Link href={userLink} className="text-xs font-medium truncate hover:underline text-foreground">
              {userName}
            </Link>
          ) : (
            <span className="text-xs font-medium truncate">{userName}</span>
          )}
          {userCode !== undefined && <span className="text-xs text-muted-foreground shrink-0">(کد: {userCode})</span>}
        </div>
      )}

      {/* Account row */}
      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
        <CardIcon className="size-3 shrink-0 text-muted-foreground" />
        <Link href={accountLink} className="text-xs text-primary hover:underline truncate">
          {account.name}
        </Link>
        {account.bookCode && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
            <Hash className="size-3" />
            دفتر {account.bookCode}
          </span>
        )}
      </div>
    </div>
  );
}
