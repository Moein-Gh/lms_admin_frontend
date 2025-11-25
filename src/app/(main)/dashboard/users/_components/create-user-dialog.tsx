"use client";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { parsePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateUser } from "@/hooks/use-user";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const createUser = useCreateUser();

  type FormValues = {
    phone: string;
    name: string;
    nationalCode: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      phone: "",
      name: "",
      nationalCode: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    const parsed = parsePhoneNumber(data.phone || "");
    if (!parsed || !parsed.countryCallingCode) {
      toast.error("لطفاً شماره تلفن معتبر وارد کنید");
      return;
    }
    const payload = {
      countryCode: `+${parsed.countryCallingCode}`,
      phone: parsed.nationalNumber,
      name: data.name.trim(),
      nationalCode: data.nationalCode.trim() || undefined
    } as const;
    createUser.mutate(payload, {
      onSuccess: () => {
        toast.success("کاربر با موفقیت ایجاد شد");
        setOpen(false);
        reset();
      },
      onError: (err: unknown) => {
        let msg = "خطا در ایجاد کاربر";
        if (err && typeof err === "object" && "message" in err) {
          msg = (err as { message?: string }).message ?? msg;
        }
        toast.error(msg);
      }
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          شماره موبایل
          <span className="text-destructive">*</span>
        </Label>
        <PhoneInput
          id="phone"
          placeholder="9xxxxxxxxx"
          defaultCountry="IR"
          required
          value={undefined}
          onChange={(v) => setValue("phone", v || "", { shouldValidate: true })}
        />
        {errors.phone && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="national" className="text-sm font-medium">
          کد ملی <span className="text-destructive">*</span>
        </Label>
        <Input id="national" placeholder="کد ملی" required {...register("nationalCode", { required: true })} />
        {errors.nationalCode && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          نام و نام خانوادگی <span className="text-destructive">*</span>
        </Label>
        <Input id="name" placeholder="نام" required {...register("name", { required: true })} />
        {errors.name && <span className="text-xs text-destructive">این فیلد الزامی است</span>}
      </div>

      {!isMobile && (
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={createUser.isPending}>
            {createUser.isPending ? "در حال ایجاد..." : "ایجاد کاربر"}
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
        <DrawerTrigger asChild>
          <Button>
            <PlusIcon className="size-4" />
            افزودن کاربر جدید
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>افزودن کاربر جدید</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter>
            <Button
              type="button"
              onClick={() => {
                const formElement = document.querySelector("form");
                if (formElement instanceof HTMLFormElement) {
                  formElement.requestSubmit();
                }
              }}
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "در حال ایجاد..." : "ایجاد کاربر"}
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
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن کاربر جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن کاربر جدید</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
