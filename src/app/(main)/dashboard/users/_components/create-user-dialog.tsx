"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
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
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const createUser = useCreateUser();

  const [phoneValue, setPhoneValue] = React.useState("");
  const [name, setName] = React.useState("");
  const [nationalCode, setNationalCode] = React.useState("");

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const parsed = parsePhoneNumber(phoneValue || "");
    if (!parsed || !parsed.countryCallingCode) {
      toast.error("لطفاً شماره تلفن معتبر وارد کنید");
      return;
    }

    const payload = {
      countryCode: `+${parsed.countryCallingCode}`,
      phone: parsed.nationalNumber,
      name: name.trim(),
      nationalCode: nationalCode.trim() || undefined
    } as const;

    createUser.mutate(payload, {
      onSuccess: () => {
        toast.success("کاربر با موفقیت ایجاد شد");
        setOpen(false);
        setPhoneValue("");
        setName("");
        setNationalCode("");
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
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          شماره موبایل
          <span className="text-destructive">*</span>
        </Label>
        <PhoneInput
          id="phone"
          placeholder="9xxxxxxxxx"
          defaultCountry="IR"
          value={phoneValue}
          onChange={(v) => setPhoneValue(v || "")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="national" className="text-sm font-medium">
          کد ملی
        </Label>
        <Input
          id="national"
          placeholder="کد ملی"
          value={nationalCode}
          onChange={(e) => setNationalCode(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          نام و نام خانوادگی
        </Label>
        <Input id="name" placeholder="نام" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {!isMobile && (
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={createUser.isPending}>
            {createUser.isPending ? "در حال ایجاد..." : "ایجاد کاربر"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPhoneValue("");
              setName("");
              setNationalCode("");
            }}
          >
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
          <DrawerHeader className="text-right">
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
