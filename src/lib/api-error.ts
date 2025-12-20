import { AxiosError } from "axios";
import { ProblemDetails } from "@/types/api";

/**
 * Type guard to check if an error is an AxiosError with ProblemDetails
 */
export function isApiError(error: unknown): error is AxiosError<ProblemDetails> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true &&
    !!(error as AxiosError).response?.data &&
    typeof (error as AxiosError).response?.data === "object" &&
    "title" in ((error as AxiosError).response?.data as Record<string, unknown>)
  );
}

/**
 * Helper to extract a user-friendly error message from an API error
 */
export function getApiErrorMessage(error: unknown, fallback = "خطای ناشناخته رخ داده است"): string {
  if (isApiError(error)) {
    // Prefer detail, then title, then fallback
    return error.response?.data.detail ?? error.response?.data.title ?? fallback;
  }

  // Handle network errors or other axios errors without response data
  if (error instanceof AxiosError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
