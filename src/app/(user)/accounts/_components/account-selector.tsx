"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Account } from "@/types/entities/account.type";

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId?: string;
  onSelectAccount: (accountId: string) => void;
}

export function AccountSelector({ accounts, selectedAccountId, onSelectAccount }: AccountSelectorProps) {
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  return (
    <>
      {/* Mobile: Horizontal Scroll Pills */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {accounts.map((account) => (
              <Button
                key={account.id}
                variant={account.id === selectedAccountId ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectAccount(account.id)}
                className={cn("shrink-0 transition-all", account.id === selectedAccountId && "shadow-md")}
              >
                <span className="font-medium">{account.accountType?.name ?? "حساب"}</span>
                <span className="text-xs opacity-70">****{account.cardNumber.slice(-4)}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: Dropdown Select */}
      <div className="hidden md:block">
        <Select value={selectedAccountId} onValueChange={onSelectAccount}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue>
              {selectedAccount && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedAccount.accountType?.name ?? "حساب"}</span>
                  <span className="text-sm text-muted-foreground">****{selectedAccount.cardNumber.slice(-4)}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{account.accountType?.name ?? "حساب"}</span>
                  <span className="text-sm text-muted-foreground">****{account.cardNumber.slice(-4)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
