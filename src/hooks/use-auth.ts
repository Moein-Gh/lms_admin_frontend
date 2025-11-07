import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout as apiLogout, requestSms, verifySms } from "@/lib/auth-api";

export function useRequestSms() {
  return useMutation({
    mutationFn: requestSms,
  });
}

export function useVerifySms() {
  return useMutation({
    mutationFn: verifySms,
    onSuccess: (data) => {
      try {
        // Store session id for later logout
        if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
      } catch {
        // ignore
      }
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      // Call backend refresh token endpoint
      return await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to refresh token");
        }
        return res.json();
      });
    },
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
        const names = [
          "accessToken",
          "refreshToken",
          "access_token",
          "refresh_token",
          "token",
        ];
        for (const name of names) {
          document.cookie = `${name}=; ${expire}; ${path}`;
        }
      } catch {
        // ignore
      }
      // Clear react-query cache and navigate to login
      queryClient.clear();
      router.replace("/auth/login");
    },
  });
}
