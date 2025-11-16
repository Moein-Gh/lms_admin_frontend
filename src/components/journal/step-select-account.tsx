import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAccounts } from "@/hooks/use-account";
import { cn } from "@/lib/utils";

export function StepSelectAccount({
  formData,
  setFormData
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
}) {
  const { data: accountsData, isLoading } = useAccounts(
    { userId: formData.userId, pageSize: 100 },
    { enabled: !!formData.userId }
  );

  return (
    <div className="space-y-2">
      <Label>انتخاب حساب</Label>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
          {accountsData?.data.map((account) => (
            <Card
              key={account.id}
              className={cn(
                "p-3 cursor-pointer transition-colors hover:bg-accent",
                formData.accountId === account.id && "border-primary bg-accent"
              )}
              onClick={() =>
                setFormData({ ...formData, accountId: account.id, loanId: undefined, targetId: account.id })
              }
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{account.name || `کد: ${account.code}`}</span>
                {formData.accountId === account.id && (
                  <span className="text-xs text-primary font-semibold">✓ انتخاب شده</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
