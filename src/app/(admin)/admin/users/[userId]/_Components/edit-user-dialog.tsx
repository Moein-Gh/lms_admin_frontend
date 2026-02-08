"use client";

import * as React from "react";

import { Edit2, CircleCheckIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateUser } from "@/hooks/admin/use-user";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { User, UserStatus } from "@/types/entities/user.type";

type Props = {
  user: User;
  onUpdated?: (user: User) => void;
};

type FormValues = {
  status: UserStatus;
  name?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
};

/**
 * EditUserDialog
 * - Uses react-hook-form
 * - Mirrors the UX of UserFiltersDialog (Dialog on desktop, Drawer on mobile)
 * - Submits only supported fields to the existing updateUser API: currently `status` and `identityId`.
 * - The API does not accept direct identity edits (name/phone) — those fields are shown as read-only.
 */
export function EditUserDialog({ user, onUpdated }: Props) {
  const isMobile = useIsMobile();
  const updateUser = useUpdateUser();
  const [open, setOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const disabled = isSaving || saved;

  const identity = user.identity as {
    name?: string | null;
    phone?: string | null;
    countryCode?: string | null;
    email?: string | null;
  };

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      status: user.status,
      name: identity.name ?? "",
      phone: identity.phone ?? "",
      countryCode: identity.countryCode ?? "",
      email: identity.email ?? ""
    }
  });

  React.useEffect(() => {
    reset({
      status: user.status,
      name: identity.name ?? "",
      phone: identity.phone ?? "",
      countryCode: identity.countryCode ?? "",
      email: identity.email ?? ""
    });
  }, [identity.name, identity.phone, identity.countryCode, identity.email, user.status, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);
      // perform update
      await updateUser.mutateAsync({ userId: user.id, data: values });

      // optimistic local update callback
      if (onUpdated) {
        const updatedstatus = user.status;
        const baseIdentity = user.identity;
        const updatedIdentity = {
          ...baseIdentity,
          name: values.name ?? baseIdentity.name,
          phone: values.phone ?? baseIdentity.phone,
          countryCode: values.countryCode ?? baseIdentity.countryCode,
          email: values.email ?? baseIdentity.email
        };

        const updatedUser: User = {
          ...user,
          status: updatedstatus,
          identity: updatedIdentity
        };

        onUpdated(updatedUser);
      }

      // show a success toast and a brief inline success state, then close
      toast.success("تغییرات با موفقیت اعمال شد");
      setSaved(true);
      // give a short delay so the user sees the success state
      setTimeout(() => {
        setOpen(false);
        setSaved(false);
      }, 600);
    } catch (err) {
      // Let the caller or global error handlers manage errors
      console.error(err);
      toast.error("خطا در ذخیره‌سازی");
    } finally {
      setIsSaving(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      {/* disable inputs while mutation is running */}
      <fieldset disabled={disabled} className="space-y-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>نام</Label>
            <Input {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label>شماره تلفن</Label>
            <Input {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label>کد کشور</Label>
            <Input {...register("countryCode")} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>ایمیل</Label>
            <Input {...register("email")} />
          </div>

          <div className="flex items-center gap-3">
            <Label>فعال</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Switch checked={!!field.value} onCheckedChange={field.onChange} dir="ltr" disabled={disabled} />
              )}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1" disabled={disabled}>
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeOpacity="0.25"
                  />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                در حال ذخیره...
              </span>
            ) : saved ? (
              <span className="flex items-center justify-center gap-2">
                <CircleCheckIcon className="size-4 text-emerald-500" />
                ذخیره شد
              </span>
            ) : (
              "ذخیره تغییرات"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()} disabled={disabled}>
            بازنشانی
          </Button>
        </div>
      </fieldset>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm" variant="outline" aria-label="ویرایش">
            <Edit2 className="size-4" />
            {!isMobile && <span className="me-2">ویرایش</span>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>ویرایش کاربر</DrawerTitle>
          </DrawerHeader>

          <div className="px-4">{form}</div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                انصراف
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="ویرایش">
          <Edit2 className="size-4" />
          {<span className="me-2">ویرایش</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>ویرایش کاربر</DialogTitle>
          <DialogDescription>فیلدهای قابل ویرایش را تغییر دهید</DialogDescription>
        </DialogHeader>

        {form}
      </DialogContent>
    </Dialog>
  );
}
