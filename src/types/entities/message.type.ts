import { PaginationParams } from "../api";

// Message Type Enums
export enum MessageType {
  SMS = "SMS",
  EMAIL = "EMAIL",
  PUSH_NOTIFICATION = "PUSH_NOTIFICATION"
}

export enum MessageStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  FAILED = "FAILED",
  SCHEDULED = "SCHEDULED",
  CANCELLED = "CANCELLED"
}

export const RECIPIENT_STATUSES = ["PENDING", "SENT", "DELIVERED", "FAILED", "READ"] as const;
export enum RecipientStatusEnum {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  READ = "READ"
}
export type RecipientStatus = (typeof RECIPIENT_STATUSES)[number];

// Message Recipient Interface
export interface MessageRecipient {
  id: string;
  messageId: string;
  userId?: string;
  user?: {
    id: string;
    code: number;
    identityId: string;
    status: string;
    identity: {
      id: string;
      phone: string;
      name: string;
      countryCode: string;
      email?: string | null;
    };
  };
  phone?: string;
  email?: string;
  status: RecipientStatus;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  renderedContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Interface
export interface Message {
  id: string;
  type: MessageType;
  status: MessageStatus;
  subject?: string;
  content: string;
  templateId?: string;
  template?: MessageTemplate;
  scheduledAt?: Date;
  sentAt?: Date;
  metadata?: {
    provider?: string;
    cost?: number;
    providerResponse?: Record<string, unknown>;
    errorDetails?: string;
    retryCount?: number;
    [key: string]: unknown;
  };
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  recipients?: MessageRecipient[];
}

// Message Template Interface
export interface MessageTemplate {
  id: string;
  code: number;
  name: string;
  type: MessageType;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// Recipient Group Interface
export interface RecipientGroup {
  id: string;
  code: number;
  name: string;
  description?: string;
  criteria: {
    userStatus?: string;
    hasLoan?: boolean;
    hasAccount?: boolean;
    roles?: string[];
    customQuery?: Record<string, unknown>;
    [key: string]: unknown;
  };
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// DTOs (Data Transfer Objects)

// Send Message DTO
export interface SendMessageDto {
  type: MessageType;
  content?: string;
  subject?: string;
  templateId?: string;
  userIds?: string[];
  phones?: string[];
  emails?: string[];
  recipientGroupId?: string;
  scheduledAt?: Date;
  metadata?: Record<string, unknown>;
}

// Update Message DTO
export interface UpdateMessageDto {
  subject?: string;
  content?: string;
  scheduledAt?: Date;
  status?: MessageStatus;
  metadata?: Record<string, unknown>;
}

// Update Recipient Status DTO
export interface UpdateRecipientStatusDto {
  status: RecipientStatus;
  errorMessage?: string;
}

// Create Message Template DTO
export interface CreateMessageTemplateDto {
  name: string;
  type: MessageType;
  subject?: string;
  content: string;
  variables: string[];
  isActive?: boolean;
}

// Update Message Template DTO
export interface UpdateMessageTemplateDto {
  name?: string;
  subject?: string;
  content?: string;
  variables?: string[];
  isActive?: boolean;
}

// Create Recipient Group DTO
export interface CreateRecipientGroupDto {
  name: string;
  description?: string;
  criteria: Record<string, unknown>;
  isActive?: boolean;
}

// Update Recipient Group DTO
export interface UpdateRecipientGroupDto {
  name?: string;
  description?: string;
  criteria?: Record<string, unknown>;
  isActive?: boolean;
}

// Query Parameters
export interface MessageQueryParams extends PaginationParams {
  type?: MessageType;
  status?: MessageStatus;
  templateId?: string;
  createdBy?: string;
  userId?: string;
  includeRecipients?: boolean;
  includeDeleted?: boolean;
  orderBy?: string;
}

export interface MessageTemplateQueryParams extends PaginationParams {
  type?: MessageType;
  isActive?: boolean;
  includeDeleted?: boolean;
}

export interface RecipientGroupQueryParams extends PaginationParams {
  isActive?: boolean;
  includeDeleted?: boolean;
}

// Status label helpers
export function getMessageStatusLabel(status: MessageStatus): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline" | "active";
} {
  const configs: Record<
    MessageStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "active" }
  > = {
    PENDING: { label: "در انتظار", variant: "secondary" },
    PROCESSING: { label: "در حال پردازش", variant: "default" },
    SENT: { label: "ارسال شده", variant: "active" },
    FAILED: { label: "ناموفق", variant: "destructive" },
    SCHEDULED: { label: "زمان‌بندی شده", variant: "outline" },
    CANCELLED: { label: "لغو شده", variant: "outline" }
  };
  return configs[status];
}

export function getMessageTypeLabel(type: MessageType): string {
  const labels: Record<MessageType, string> = {
    SMS: "پیامک",
    EMAIL: "ایمیل",
    PUSH_NOTIFICATION: "اعلان"
  };
  return labels[type];
}

export function getRecipientStatusLabel(status: RecipientStatus): string {
  const labels: Record<RecipientStatus, string> = {
    PENDING: "در انتظار",
    SENT: "ارسال شده",
    DELIVERED: "تحویل داده شده",
    FAILED: "ناموفق",
    READ: "خوانده شده"
  };
  return labels[status];
}
