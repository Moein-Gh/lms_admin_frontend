import { ComboboxFilter } from "@/components/filters/combobox-filter";
import { Label } from "@/components/ui/label";

type UserItem = { id: string; name: string };
type Props = {
  items: UserItem[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  error?: boolean;
};

export function UserSection({ items, value, onChange, error }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="auser" className="text-sm font-medium">
        کاربر
        <span className="text-destructive">*</span>
      </Label>
      <ComboboxFilter
        items={items}
        selectedValue={value}
        onSelect={onChange}
        getItemId={(i) => i.id}
        getItemLabel={(i) => i.name}
        placeholder="انتخاب کاربر"
        searchPlaceholder="جستجوی کاربر..."
        emptyMessage="کاربری یافت نشد"
        allLabel={""}
      />
      {error && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
    </div>
  );
}
