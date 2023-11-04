import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Check if request is to /api/contacts
  if (request.nextUrl.pathname === "/api/contacts") {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "POST");
    response.headers.set("Access-Control-Allow-Headers", "*");
  }

  return response;
}
