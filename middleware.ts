import { NextResponse } from "next/server";

// No-op middleware: refresh logic removed; requests pass through untouched
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: []
};
