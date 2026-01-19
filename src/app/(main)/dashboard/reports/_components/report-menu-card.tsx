import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportMenuCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly href: string;
}

export function ReportMenuCard({ title, description, icon: Icon, href }: ReportMenuCardProps) {
  return (
    <Card className="group transition-shadow hover:shadow-md p-3">
      <CardHeader>
        <div className="mb-2 w-fit rounded-lg bg-primary/10  transition-colors group-hover:bg-primary/20">
          <Icon className="size-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant="outline">
          <Link href={href}>مشاهده گزارش</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
