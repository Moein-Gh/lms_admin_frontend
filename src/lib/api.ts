import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3200",
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
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
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    url.includes("/auth/refresh") ||
    url.includes("/auth/login") ||
    url.includes("/auth/verify-sms")
  );
};

// Response interceptor for 401 handling with refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      retryAttempted?: boolean;
    };

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Skip refresh for auth endpoints to avoid infinite loops
    if (isAuthEndpoint(originalRequest.url)) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // If already retried, logout and redirect
    if (originalRequest.retryAttempted) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
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
      // Attempt to refresh the token
      await api.post("/auth/refresh");

      // Token refreshed successfully, process queued requests
      processQueue(null);
      isRefreshing = false;

      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear auth and redirect
      processQueue(refreshError as AxiosError);
      isRefreshing = false;
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
