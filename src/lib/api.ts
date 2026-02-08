import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

type AuthResponse = {
  hasUnreadPushNotifications?: boolean;
  [key: string]: unknown;
};

const api = axios.create({
  // CRITICAL CHANGE:
  // We point to '/api' so requests go to Next.js (localhost:3000/api),
  // allowing the Rewrite Proxy to forward them to the Backend.
  // If you point directly to localhost:3200, cookies will fail due to domain mismatch.
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  }
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  // NOTE: You cannot delete HttpOnly cookies via JavaScript (document.cookie).
  // The browser prevents this for security.
  // We simply redirect to login. The backend is responsible for rejecting invalid tokens.

  if (typeof window !== "undefined") {
    // Optional: You could try to fire a "fire and forget" logout call here
    // api.post('admin/auth/logout').catch(() => {});

    window.location.href = "/admin/auth/login";
  }
};

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  // Ensure these match your actual endpoints relative to /api
  return (
    url.includes("/admin/auth/refresh") || url.includes("/admin/auth/login") || url.includes("/admin/auth/verify-sms")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      retryAttempted?: boolean;
    };

    // Global handling for Forbidden (RBAC) responses
    if (error.response?.status === 403) {
      try {
        const data = error.response.data as any;
        const message = data?.detail ?? data?.title ?? "دسترسی غیرمجاز";
        if (typeof window !== "undefined") {
          toast.error(message);
          // Go back one page instead of forcing navigation to a specific route
          window.history.back();
        }
      } catch (e) {
        if (typeof window !== "undefined") {
          toast.error("دسترسی غیرمجاز");
          window.history.back();
        }
      }
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthEndpoint(originalRequest.url)) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (originalRequest.retryAttempted) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest.retryAttempted = true;
    isRefreshing = true;

    try {
      // The browser automatically includes the cookie in this request
      // because we are hitting '/apiadmin/auth/refresh' (Same-Origin)
      const refreshResponse = await api.post<AuthResponse>("/admin/auth/refresh");

      // Handle notification state from refresh response
      if (refreshResponse.data?.hasUnreadPushNotifications !== undefined) {
        // Dispatch custom event for notification state update
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth-notification-update", {
              detail: { hasUnreadPushNotifications: refreshResponse.data.hasUnreadPushNotifications }
            })
          );
        }
      }

      processQueue(null);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      isRefreshing = false;
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
