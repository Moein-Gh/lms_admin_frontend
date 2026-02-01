import Link from "next/link";
import {
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  FileText,
  Tag,
  CalendarClock,
  CheckCircle2,
  Database
} from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMessageStatusLabel, getMessageTypeLabel, Message, MessageType } from "@/types/entities/message.type";

type MessageInfoCardProps = {
  readonly message: Message;
};

const MESSAGE_TYPE_ICONS: Record<MessageType, typeof Mail> = {
  SMS: MessageSquare,
  EMAIL: Mail,
  PUSH_NOTIFICATION: Bell
};

function InfoItem({
  icon: Icon,
  label,
  children,
  className
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

export function MessageInfoCard({ message }: MessageInfoCardProps) {
  const TypeIcon = MESSAGE_TYPE_ICONS[message.type];
  const statusInfo = getMessageStatusLabel(message.status);

  return (
    <Card className="overflow-hidden border-none shadow-md bg-card">
      <div className="flex-1 p-6 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <InfoItem icon={Tag} label="نوع پیام">
            <span className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" />
              {getMessageTypeLabel(message.type)}
            </span>
          </InfoItem>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>وضعیت</span>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          {message.template && (
            <InfoItem icon={FileText} label="قالب">
              <Link
                href={`/admin/message-templates/${message.template.id}`}
                className="text-primary hover:underline font-medium"
              >
                {message.template.name}
              </Link>
            </InfoItem>
          )}

          <InfoItem icon={Calendar} label="تاریخ ایجاد">
            <FormattedDate value={message.createdAt} />
          </InfoItem>

          {message.scheduledAt && (
            <InfoItem icon={CalendarClock} label="زمان‌بندی شده">
              <FormattedDate value={message.scheduledAt} />
            </InfoItem>
          )}

          {message.sentAt && (
            <InfoItem icon={Calendar} label="تاریخ ارسال">
              <FormattedDate value={message.sentAt} />
            </InfoItem>
          )}
        </div>

        <Separator />

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>محتوا</span>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Metadata Section */}
        {message.metadata && Object.keys(message.metadata).length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Database className="h-4 w-4" />
                <span>اطلاعات اضافی</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(message.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{key}</span>
                    <span className="text-sm font-medium text-foreground text-left">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
