import type { Journal } from "@/types/entities/journal.type";

export function calculateUnbalancedAmount(entries: Journal["entries"]): number {
  const account2050Entries = entries?.filter((entry) => entry.ledgerAccount?.code === "2050") ?? [];
  const totalDebit = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "DEBIT" ? sum + Number(entry.amount) : sum),
    0
  );
  const totalCredit = account2050Entries.reduce(
    (sum, entry) => (entry.dc === "CREDIT" ? sum + Number(entry.amount) : sum),
    0
  );
  return Math.abs(totalDebit - totalCredit);
}
