import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  // Add middleware logic here

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req: request, secret });

  if (request.nextUrl.pathname.startsWith("/test") && !token) {
    return NextResponse.rewrite(new URL("/api/auth/signin", request.url));
  }

  console.log("MiddleWare: ", token);
  return NextResponse.next();
};
