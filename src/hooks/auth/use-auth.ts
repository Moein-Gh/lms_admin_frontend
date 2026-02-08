import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { logout as apiLogout, requestSms, verifySms } from "@/lib/auth-api";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";
import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";
import { userKeys } from "../admin/use-user";

export function useRequestSms() {
  return useMutation({
    mutationFn: requestSms
  });
}

export function useVerifySms() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setHasUnreadPushNotifications = useNotificationsStore((s) => s.setHasUnreadPushNotifications);

  return useMutation({
    mutationFn: verifySms,
    onSuccess: (data) => {
      // Seed the user cache with the logged in user
      if (data.user) {
        queryClient.setQueryData(userKeys.me(), data.user);
      }

      try {
        // Store session id for later logout
        if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
      } catch {
        // ignore
      }

      // Update notifications state
      if (data.hasUnreadPushNotifications !== undefined) {
        setHasUnreadPushNotifications(data.hasUnreadPushNotifications);

        // Show toast if there are unread notifications
        if (data.hasUnreadPushNotifications) {
          toast.info("پیام جدید دارید!", {
            description: "پیام‌های خوانده نشده در انتظار شماست",
            action: {
              label: "مشاهده",
              onClick: () => router.push("/admin/messages")
            },
            duration: 6000
          });
        }
      }

      // Redirect based on user role
      const hasAdminRole = data.user?.roleAssignments?.some(
        (assignment) => assignment.role?.key === "admin" && assignment.status === RoleAssignmentStatus.ACTIVE
      );
      const hasAccountHolderRole = data.user?.roleAssignments?.some(
        (assignment) => assignment.role?.key === "account-holder" && assignment.status === RoleAssignmentStatus.ACTIVE
      );

      if (hasAccountHolderRole && !hasAdminRole) {
        router.push("/");
      } else {
        router.push("/admin");
      }
    }
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      // Call backend refresh token endpoint
      return await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to refresh token");
        }
        return res.json();
      });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    // Call backend logout endpoint with the session id body if available
    mutationFn: async () => {
      let sessionId: string | undefined;
      try {
        sessionId = localStorage.getItem("sessionId") ?? undefined;
      } catch {
        // ignore
      }
      await apiLogout({ sessionId });
    },
    onSuccess: () => {
      // Best-effort local cleanup for any client-managed tokens
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("sessionId");
      } catch {
        // ignore
      }
      try {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      } catch {
        // ignore
      }
      try {
        const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const path = "path=/";
        const names = ["accessToken", "refreshToken", "access_token", "refresh_token", "token"];
        for (const name of names) {
          document.cookie = `${name}=; ${expire}; ${path}`;
        }
      } catch {
        // ignore
      }
      // Clear react-query cache and navigate to login
      queryClient.clear();
      router.replace("/auth/login");
    }
  });
}
