"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
};

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? ""
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating profile:", data);
    toast.success("اطلاعات با موفقیت بروزرسانی شد");
  };

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle>ویرایش اطلاعات</CardTitle>
        <CardDescription>اطلاعات کاربری خود را در این بخش ویرایش کنید.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" type="email" {...register("email", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">شماره تماس</Label>
            <Input id="phone" dir="ltr" {...register("phone")} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
