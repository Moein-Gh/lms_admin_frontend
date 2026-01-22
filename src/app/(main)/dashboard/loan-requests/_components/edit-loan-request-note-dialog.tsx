"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLoanRequest } from "@/hooks/use-loan-request";
import { useIsMobile } from "@/hooks/use-mobile";
import { getApiErrorMessage } from "@/lib/api-error";
import type { UpdateLoanRequestDto } from "@/lib/loan-request-api";
import { LoanRequest } from "@/types/entities/loan-request.type";

type EditLoanRequestNoteDialogProps = {
  loanRequest: LoanRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditLoanRequestNoteDialog({ loanRequest, open, onOpenChange }: EditLoanRequestNoteDialogProps) {
  const isMobile = useIsMobile();
  const { mutate: updateLoanRequest, isPending } = useUpdateLoanRequest();

  const form = useForm<UpdateLoanRequestDto>({
    defaultValues: {
      note: loanRequest.note ?? ""
    }
  });

  // Reset form when dialog opens with new loan request
  React.useEffect(() => {
    if (open) {
      form.reset({ note: loanRequest.note ?? "" });
    }
  }, [open, loanRequest.note, form]);

  const onSubmit = (data: UpdateLoanRequestDto) => {
    updateLoanRequest(
      { loanRequestId: loanRequest.id, data },
      {
        onSuccess: () => {
          toast.success("یادداشت با موفقیت ویرایش شد");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          toast.error(getApiErrorMessage(error, "خطا در ویرایش یادداشت"));
        }
      }
    );
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>یادداشت</FormLabel>
              <FormControl>
                <Textarea placeholder="یادداشت خود را وارد کنید..." className="min-h-30 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isMobile && (
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              لغو
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>ویرایش یادداشت درخواست وام</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter className="pt-2">
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? "در حال ذخیره..." : "ذخیره"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isPending}>
                لغو
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>ویرایش یادداشت درخواست وام</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
