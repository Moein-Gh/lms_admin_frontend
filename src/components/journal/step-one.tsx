import * as React from "react";
import type { AllocationKind, AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/entities/user.type";

export function StepOne({
  formData,
  setFormData,
  usersData,
  suggestedAmount
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
  usersData: { data: User[] } | undefined;
  suggestedAmount?: number;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="user">کاربر</Label>
        <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
          <SelectTrigger id="user">
            <SelectValue placeholder="انتخاب کاربر" />
          </SelectTrigger>
          <SelectContent>
            {usersData?.data.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.identity.name ?? user.identity.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kind">نوع موجودیت</Label>
        <Select
          value={formData.kind}
          onValueChange={(value) => setFormData({ ...formData, kind: value as AllocationKind })}
        >
          <SelectTrigger id="kind">
            <SelectValue placeholder="انتخاب نوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACCOUNT">موجودی حساب</SelectItem>
            <SelectItem value="SUBSCRIPTION_FEE">هزینه اشتراک</SelectItem>
            <SelectItem value="INSTALLMENT">قسط</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">مبلغ</Label>
        <Input
          id="amount"
          type="number"
          placeholder={suggestedAmount ? `مبلغ پیشنهادی: ${suggestedAmount}` : "مبلغ را وارد کنید"}
          value={formData.amount ?? ""}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          min="0"
          step="0.01"
        />
        {suggestedAmount && (
          <p className="text-sm text-muted-foreground">
            مبلغ عدم تعادل حساب ۲۰۵۰: {suggestedAmount.toLocaleString("fa-IR")} ریال
          </p>
        )}
      </div>
    </>
  );
}
