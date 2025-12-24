"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsivePanel } from "@/components/ui/responsive-panel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteUser } from "@/hooks/use-user";
import { RequestError } from "@/types/error";
import RoleAssignmentDialog from "./role-assignment-dialog";

export default function UserDeletePanel({ userId }: { userId: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const requiredPhrase = "متوجه شدم";

  const { register, watch, handleSubmit, reset, formState } = useForm<{ confirm: string }>({
    defaultValues: { confirm: "" }
  });

  const confirmValue = watch("confirm", "");
  const isMatch = confirmValue.trim() === requiredPhrase;

  const deleteMutation = useDeleteUser();
  const router = useRouter();

  const onSubmit = async () => {
    if (!isMatch) {
      toast.error("لطفاً عبارت خواسته شده را دقیق وارد کنید");
      return;
    }
    setLoading(true);
    try {
      await deleteMutation.mutateAsync(userId);
      toast.success("کاربر با موفقیت حذف شد");
      router.push("/dashboard/users");
      reset();
      setOpen(false);
    } catch (e) {
      toast.error((e as RequestError).response?.data.detail ?? "خطا در حذف کاربر");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!open) reset({ confirm: "" });
  }, [open, reset]);

  return (
    <div className="flex items-center gap-2">
      <RoleAssignmentDialog userId={userId} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ارسال پیام</TooltipContent>
      </Tooltip>

      <Button
        variant="destructive"
        size="icon"
        className="h-9 w-9 shrink-0 hover:bg-destructive/90"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <ResponsivePanel open={open} onOpenChange={setOpen} variant="destructive">
        <div dir="rtl" className="w-full">
          <DialogTitle className="pb-6">حذف کاربر</DialogTitle>
          <p className="text-start text-sm">
            حذف کاربر فقط در صورتی امکان‌پذیر است که کاربر حساب یا تراکنش نداشته باشد.
          </p>
          <p className="text-start text-sm mt-2">برای حذف این کاربر، لطفاً عبارت زیر را دقیقاً وارد کنید:</p>
          <div className="mt-2 text-start font-medium">{requiredPhrase}</div>

          <form className="flex flex-col gap-4 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="confirm-delete-user"
              placeholder="عبارت را اینجا وارد کنید"
              className="text-start"
              {...register("confirm", { required: true })}
              disabled={loading}
              autoFocus
            />

            {formState.errors.confirm && <div className="text-destructive text-xs text-center">کادر الزامی است</div>}

            <div className="flex gap-2 justify-center mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                انصراف
              </Button>

              <Button type="submit" variant="destructive" disabled={loading || !isMatch}>
                حذف نهایی
              </Button>
            </div>
          </form>
        </div>
      </ResponsivePanel>
    </div>
  );
}
