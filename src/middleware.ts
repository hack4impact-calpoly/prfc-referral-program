import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pass = url.searchParams.get("pass");
  const expectedPassword = process.env.DATABASE_PASSWORD;

  // Only protect the referralDatabase route
  if (url.pathname.startsWith("/referralDatabase")) {
    // Checking if query parameter matches env ("temp" for now)
    if (pass !== expectedPassword) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next(); // Allow the request
}
