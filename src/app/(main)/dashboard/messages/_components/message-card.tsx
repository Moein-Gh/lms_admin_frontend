"use client";

import { Clock } from "lucide-react";

import { FormattedDate } from "@/components/formatted-date";
import { Card, CardContent } from "@/components/ui/card";
import { DATE_FORMATS } from "@/lib/date-service";
import { cn } from "@/lib/utils";
import { Message } from "@/types/entities/message.type";

interface MessageCardProps {
  message: Message;
  currentUserId?: string;
}

export function MessageCard({ message, currentUserId }: MessageCardProps) {
  // Find the recipient for the current user to get user-specific content
  const recipient = currentUserId ? message.recipients?.find((r) => r.userId === currentUserId) : undefined;
  const displayContent = recipient?.renderedContent ?? message.content;
  const receivedDate = recipient?.createdAt ?? message.createdAt;
  const isUnread = recipient ? !recipient.readAt : false;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all hover:shadow-md",
        isUnread
          ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/10"
          : "border-border/60 hover:border-border"
      )}
    >
      {isUnread && <div className="absolute right-0 top-0 h-full w-1 bg-linear-to-b from-primary to-primary/60" />}

      <CardContent className="p-4 sm:p-5">
        <div className="space-y-3">
          {/* Subject if exists */}
          {message.subject && (
            <h3
              className={cn(
                "line-clamp-2 font-semibold text-base leading-tight sm:text-lg",
                isUnread ? "text-foreground" : "text-foreground/90"
              )}
            >
              {message.subject}
            </h3>
          )}

          {/* Message Content */}
          <div
            className={cn(
              "prose prose-sm max-w-none text-sm leading-relaxed dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
              isUnread ? "text-foreground" : "text-foreground/80"
            )}
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          {/* Time */}
          <div className="flex items-center justify-end gap-1.5 pt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <FormattedDate value={receivedDate} format={DATE_FORMATS.TIME_SHORT} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
