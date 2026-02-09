"use client";

import { UserCircle, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/admin/use-current-user";
import { PageHeader } from "../_components/page-header";

export default function ProfilePage() {
  const { data: user } = useAuth();

  const profileSections = [
    {
      title: "اطلاعات شخصی",
      items: [{ label: "نام", value: user?.identity.name, icon: UserCircle }]
    },
    {
      title: "اطلاعات تماس",
      items: [
        { label: "ایمیل", value: user?.identity.email, icon: Mail },
        { label: "کد کشور", value: user?.identity.countryCode, icon: MapPin },
        { label: "شماره تماس", value: user?.identity.phone, icon: Phone }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader icon={User} title="پروفایل کاربری" subtitle="مشاهده و مدیریت اطلاعات حساب کاربری" />

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 md:size-24">
              <UserCircle className="size-12 text-primary md:size-16" />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-1 text-center md:text-right">
              <h2 className="text-xl font-semibold md:text-2xl">{user?.identity.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.identity.email}</p>
              <p className="text-xs text-muted-foreground">شناسه کاربری: {user?.id}</p>
            </div>
          </div>
        </Card>

        {/* Profile Sections */}
        <div className="space-y-4">
          {profileSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="p-6">
              <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div key={itemIndex}>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      </div>
                      {itemIndex < section.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">تنظیمات حساب</h3>
          <div className="space-y-3">
            <button className="w-full rounded-lg border p-3 text-right transition-colors hover:bg-muted">
              <p className="font-medium">تغییر رمز عبور</p>
              <p className="text-sm text-muted-foreground">رمز عبور خود را تغییر دهید</p>
            </button>
            <button className="w-full rounded-lg border p-3 text-right transition-colors hover:bg-muted">
              <p className="font-medium">ویرایش اطلاعات</p>
              <p className="text-sm text-muted-foreground">اطلاعات پروفایل خود را ویرایش کنید</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
