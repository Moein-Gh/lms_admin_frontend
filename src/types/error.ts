import { ProblemDetails } from "./api";

export type RequestError = {
  readonly response?: {
    readonly data: ProblemDetails;
  };
};
