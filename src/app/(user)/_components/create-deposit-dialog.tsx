"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AmountInput from "@/components/form/amount-input";
import UploadField from "@/components/form/upload-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-current-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateTransaction } from "@/hooks/use-transaction";
import { TransactionKind } from "@/types/entities/transaction.type";
import { RequestError } from "@/types/error";

type FormValues = {
  amount: string;
  note: string;
  image?: File[];
};

export function CreateDepositDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { data: user } = useAuth();
  const create = useCreateTransaction();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      amount: "",
      note: "",
      image: []
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (!user?.id) {
      toast.error("کاربر یافت نشد");
      return;
    }

    const formData = new FormData();
    formData.append("kind", TransactionKind.DEPOSIT);
    formData.append("amount", String(data.amount));
    formData.append("userId", user.id);
    if (data.note) formData.append("note", String(data.note));
    const file = data.image && data.image.length > 0 ? data.image[0] : null;
    if (file) formData.append("image", file);

    create.mutate(formData, {
      onSuccess: () => {
        toast.success("درخواست واریز شما ثبت شد و پس از تایید اعمال خواهد شد");
        setOpen(false);
        reset();
      },
      onError: (e) => toast.error((e as RequestError).response?.data.detail ?? "خطا در ثبت درخواست")
    });
  });

  const triggerButton = (
    <Button variant="default">
      <PlusIcon className="size-4" />
      درخواست واریز
    </Button>
  );

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-5 py-4" encType="multipart/form-data">
      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        توجه: درخواست واریز شما پس از بررسی و تایید توسط مدیریت اعمال خواهد شد.
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          مبلغ واریز<span className="text-destructive">*</span>
        </Label>
        <AmountInput id="amount" placeholder="مبلغ مورد نظر" {...register("amount", { required: true })} />
        {errors.amount && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-medium">
          توضیحات
        </Label>
        <Input id="note" placeholder="توضیحات یا شماره پیگیری" {...register("note")} />
      </div>

      <UploadField<FormValues, "image">
        name="image"
        control={control}
        accept="image/*,.pdf"
        multiple={false}
        maxFiles={1}
        label="پیوست رسید واریز"
      />

      {!isMobile && (
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={create.isPending}>
            {create.isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            پاک کردن
          </Button>
        </div>
      )}
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>درخواست واریز جدید</DrawerTitle>
            <DrawerDescription>ثبت درخواست واریز به حساب</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter>
            <Button
              type="button"
              onClick={() => {
                const formElement = document.querySelector("form");
                if (formElement instanceof HTMLFormElement) formElement.requestSubmit();
              }}
              disabled={create.isPending}
            >
              {create.isPending ? "در حال ثبت..." : "ثبت درخواست"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">لغو</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>درخواست واریز جدید</DialogTitle>
          <DialogDescription>ثبت درخواست واریز به حساب</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
