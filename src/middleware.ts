import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

const protectedPaths = [
  "/test/listening/",
  "/test/reading/",
  "/test/writing/",
  "/test/speaking/",
];

export const middleware = async (request: NextRequest) => {
  // Add middleware logic here

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req: request, secret });

  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !token
  ) {
    return NextResponse.rewrite(new URL("/api/auth/signin", request.url));
  }

  console.log("MiddleWare: ", token);
  return NextResponse.next();
};
