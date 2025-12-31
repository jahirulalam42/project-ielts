// app/api/auth/oauth-redirect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    if (!token) {
      return NextResponse.redirect(new URL("/user/signin", request.url));
    }

    // Check if this is a new user (first time OAuth sign-in)
    const isNewUser = token.isNewUser;

    if (isNewUser) {
      // New users go to onboarding
      return NextResponse.redirect(
        new URL(
          `/user/onboarding?next=${encodeURIComponent(callbackUrl)}`,
          request.url
        )
      );
    } else {
      // Existing users go directly to their destination
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
  } catch (error) {
    console.error("OAuth redirect error:", error);
    // Fallback to home page if there's an error
    return NextResponse.redirect(new URL("/", request.url));
  }
}
