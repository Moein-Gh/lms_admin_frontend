"use client";

import { useState } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

import { FormattedNumber } from "@/components/formatted-number";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteLoanType } from "@/hooks/use-loan-type";
import { LoanType } from "@/types/entities/loan-type.type";
import { LoanTypeForm } from "./loan-type-form";

interface LoanTypeDesktopCardProps {
  loanType: LoanType;
}

export function LoanTypeDesktopCard({ loanType }: LoanTypeDesktopCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteMutation = useDeleteLoanType();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(loanType.id);
      toast.success("نوع وام با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف نوع وام");
    }
  };

  if (isEditing) {
    return (
      <Card className="relative overflow-hidden border-primary/50 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">ویرایش {loanType.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LoanTypeForm
            initialData={loanType}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex flex-1 items-center gap-8">
          <div className="flex flex-col gap-1 min-w-[150px]">
            <span className="text-xs text-muted-foreground">کد: {loanType.code}</span>
            <h3 className="text-lg font-bold">{loanType.name}</h3>
          </div>

          <div className="grid grid-cols-4 gap-8 flex-1">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">کارمزد</span>
              <span className="font-medium">%{loanType.commissionPercentage}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">اقساط پیش‌فرض</span>
              <span className="font-medium">{loanType.defaultInstallments} قسط</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">محدوده اقساط</span>
              <span className="font-medium">
                {loanType.minInstallments} تا {loanType.maxInstallments}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">اعتبار مورد نیاز</span>
              <span className="font-medium">%{loanType.creditRequirementPct}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-r pr-4 mr-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit2 className="size-4 text-muted-foreground" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-right">
              <AlertDialogHeader>
                <AlertDialogTitle>آیا از حذف این نوع وام اطمینان دارید؟</AlertDialogTitle>
                <AlertDialogDescription>
                  این عمل غیرقابل بازگشت است و تمامی اطلاعات مربوط به این نوع وام حذف خواهد شد.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      {loanType.description && (
        <div className="bg-muted/30 px-6 py-2 text-xs text-muted-foreground border-t">{loanType.description}</div>
      )}
    </Card>
  );
}
