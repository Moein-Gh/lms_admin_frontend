"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  DataCardList,
  DataCardEmpty,
  DataCardError,
  DataCardSkeleton,
  type DataCardConfig
} from "@/components/ui/data-card";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useDeleteLoanType, useLoanTypes } from "@/hooks/use-loan-type";
import { LoanType } from "@/types/entities/loan-type.type";
import { LoanTypeForm } from "./loan-type-form";

export function LoanTypeCardList() {
  const { data, isLoading, error } = useLoanTypes();
  const [editingLoanType, setEditingLoanType] = useState<LoanType | null>(null);
  const [deletingLoanType, setDeletingLoanType] = useState<LoanType | null>(null);
  const deleteMutation = useDeleteLoanType();

  const handleDelete = async () => {
    if (!deletingLoanType) return;
    try {
      await deleteMutation.mutateAsync(deletingLoanType.id);
      toast.success("نوع وام با موفقیت حذف شد");
      setDeletingLoanType(null);
    } catch {
      toast.error("خطا در حذف نوع وام");
    }
  };

  const cardConfig: DataCardConfig<LoanType> = {
    primaryField: "name",
    secondaryField: "code",
    renderSecondary: (value) => `کد: ${value}`,
    detailFields: [
      { key: "commissionPercentage", label: "درصد کارمزد", render: (v) => `%${v}` },
      { key: "defaultInstallments", label: "اقساط پیش‌فرض", render: (v) => `${v} قسط` },
      {
        key: "minInstallments",
        label: "محدوده اقساط",
        render: (_, item) => `${item.minInstallments} تا ${item.maxInstallments}`
      },
      { key: "creditRequirementPct", label: "اعتبار مورد نیاز", render: (v) => `%${v}` },
      { key: "description", label: "توضیحات", render: (v) => String(v ?? "-") }
    ],
    actions: (item) => [
      {
        icon: <Edit2 className="size-6" />,
        label: "ویرایش",
        onClick: () => setEditingLoanType(item),
        side: "left"
      },
      {
        icon: <Trash2 className="size-6" />,
        label: "حذف",
        onClick: () => setDeletingLoanType(item),
        variant: "destructive",
        side: "right"
      }
    ]
  };

  if (error) return <DataCardError />;
  if (isLoading) return <DataCardSkeleton count={5} />;
  if (!data || data.data.length === 0) return <DataCardEmpty message="نوع وامی یافت نشد" />;

  return (
    <div className="flex flex-col gap-3">
      <DataCardList data={data.data} config={cardConfig} keyExtractor={(item) => item.id} />

      {/* Edit Drawer */}
      <Drawer open={!!editingLoanType} onOpenChange={(open) => !open && setEditingLoanType(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-start">
              <DrawerTitle>ویرایش {editingLoanType?.name}</DrawerTitle>
              <DrawerDescription>اطلاعات نوع وام را ویرایش کنید.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {editingLoanType && (
                <LoanTypeForm
                  initialData={editingLoanType}
                  onSuccess={() => setEditingLoanType(null)}
                  onCancel={() => setEditingLoanType(null)}
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingLoanType} onOpenChange={(open) => !open && setDeletingLoanType(null)}>
        <AlertDialogContent className="text-start">
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از حذف این نوع وام اطمینان دارید؟</AlertDialogTitle>
            <AlertDialogDescription>این عمل غیرقابل بازگشت است.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className=" gap-2">
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
  );
}
