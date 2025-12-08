import { Label } from "@/components/ui/label";
import { Pills } from "@/components/ui/pills";
import { TransactionKind, TRANSACTION_KIND_META } from "@/types/entities/transaction.type";

type Props = {
  value?: TransactionKind | null;
  onChange: (val: TransactionKind | null) => void;
  error?: boolean;
};

export function TransactionKindSection({ value, onChange, error }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        نوع تراکنش<span className="text-destructive">*</span>
      </Label>
      <Pills
        options={(Object.values(TransactionKind) as TransactionKind[]).map((k) => ({
          value: k,
          label: TRANSACTION_KIND_META[k].label
        }))}
        value={value ?? undefined}
        onValueChange={(v) => onChange(v ?? null)}
        variant="outline"
        size="sm"
        allowDeselect={false}
      />
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}

export default TransactionKindSection;
