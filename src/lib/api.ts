import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

type AuthResponse = {
  hasUnreadPushNotifications?: boolean;
  [key: string]: unknown;
};

const api = axios.create({
  // Calls the backend directly, bypassing the Next.js rewrite proxy.
  // Requires the backend to send proper CORS headers (specific origin, not '*') for
  // credentialed cross-origin requests to work.
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
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

    window.location.href = "/auth/login";
  }
};

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  // Ensure these match your actual endpoints relative to /api
  return url.includes("/auth/refresh") || url.includes("/auth/login") || url.includes("/auth/verify-sms");
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      retryAttempted?: boolean;
    };

    // Global handling for Forbidden (RBAC) responses
    if (error.response?.status === 403) {
      // Intentionally do nothing on 403 per user preference.
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
      const refreshResponse = await api.post<AuthResponse>("/auth/refresh");

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
