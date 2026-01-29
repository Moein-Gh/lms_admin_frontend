"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, Inbox } from "lucide-react";

import { PaginationControls } from "@/components/pagination-controls";
import { useMessages } from "@/hooks/use-message";
import { useMe } from "@/hooks/use-user";
import { Message, MessageType } from "@/types/entities/message.type";
import { DateSeparator } from "./_components/date-separator";
import { MessageCard } from "./_components/message-card";

// Helper to group messages by date
function groupMessagesByDate(messages: Message[], currentUserId?: string) {
  const groups: { date: string; messages: Message[] }[] = [];
  const dateMap = new Map<string, Message[]>();

  messages.forEach((message) => {
    const recipient = currentUserId ? message.recipients?.find((r: any) => r.userId === currentUserId) : undefined;
    const receivedDate = recipient?.createdAt ?? message.createdAt;
    const dateObj = new Date(receivedDate);
    const dateKey = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push(message);
  });

  // Convert map to sorted array
  Array.from(dateMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // Most recent first
    .forEach(([date, msgs]) => {
      groups.push({ date, messages: msgs });
    });

  return groups;
}

export default function MessagesPage() {
  const router = useRouter();
  const location = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("per_page") ?? 10);

  const { data: user, isLoading: isUserLoading } = useMe();

  const { data: messagesData, isLoading: isMessagesLoading } = useMessages(
    {
      page,
      pageSize: perPage,
      userId: user?.id,
      type: MessageType.PUSH_NOTIFICATION
    },
    {
      enabled: !!user?.id
    }
  );

  const isLoading = isUserLoading || (!!user?.id && isMessagesLoading);

  const messageGroups = React.useMemo(() => {
    if (!messagesData?.data) return [];
    return groupMessagesByDate(messagesData.data, user?.id);
  }, [user?.id, messagesData]);

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`${location}?${params.toString()}`);
    },
    [router, location, searchParams]
  );

  const handlePageSizeChange = React.useCallback(
    (newPageSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("per_page", String(newPageSize));
      params.set("page", "1");
      router.push(`${location}?${params.toString()}`);
    },
    [router, location, searchParams]
  );

  return (
    <div className="container max-w-4xl p-4 md:p-6 space-y-6 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">پیام‌های دریافتی</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : messagesData?.data.length ? (
        <div className="space-y-6">
          <div className="space-y-0">
            {messageGroups.map((group) => (
              <div key={group.date}>
                <DateSeparator date={group.date} />
                <div className="grid gap-3">
                  {group.messages.map((message) => (
                    <MessageCard key={message.id} message={message} currentUserId={user?.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <PaginationControls
            meta={messagesData.meta}
            page={page}
            pageSize={perPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">هیچ پیامی یافت نشد</h3>
            <p className="mt-1">صندوق پیام‌های شما خالی است.</p>
          </div>
        </div>
      )}
    </div>
  );
}
