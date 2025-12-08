import { Label } from "@/components/ui/label";
import { Pills, type PillOption } from "@/components/ui/pills";

type Props = {
  options: PillOption<string>[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  error?: boolean;
};

export function AccountTypeSection({ options, value, onChange, error }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="atype" className="text-sm font-medium">
        نوع حساب
        <span className="text-destructive">*</span>
      </Label>
      <Pills
        options={options}
        mode="single"
        value={value}
        onValueChange={onChange}
        variant="outline"
        className="w-full"
      />
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}
