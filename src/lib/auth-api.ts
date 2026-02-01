import type { User } from "@/types/entities/user.type";
import api from "./api";

type RequestSmsPayload = {
  phone: string;
  countryCode: string;
  purpose: string;
};

type VerifySmsPayload = {
  phone: string;
  code: string;
  purpose: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: User;
  userId: string;
  success: boolean;
  hasUnreadPushNotifications?: boolean;
};

export async function requestSms(payload: RequestSmsPayload): Promise<void> {
  await api.post("/auth/request-sms/", payload);
}

export async function verifySms(payload: VerifySmsPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/verify-sms", payload);
  return response.data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/refresh");
  return response.data;
}

export type LogoutPayload = {
  sessionId?: string;
};

export async function logout(payload?: LogoutPayload): Promise<void> {
  await api.post("/auth/logout", payload ?? {});
}
