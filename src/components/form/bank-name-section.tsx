import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateAccountRequest } from "@/lib/admin-APIs/account-api";

type Props = {
  register: UseFormRegister<CreateAccountRequest>;
  error?: boolean;
};

export function BankSection({ register, error }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="bank" className="text-sm font-medium">
        نام بانک
        <span className="text-destructive">*</span>
      </Label>
      <Input id="bank" placeholder="مثال: ملی، ملت، پاسارگاد" {...register("bankName", { required: true })} />
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}
