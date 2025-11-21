import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader
    ? authHeader.split(" ")[1]
    : req.cookies.get("token")?.value;
  console.log("token ", token);

  if (req.nextUrl.pathname === "/logOut") {
    const response = NextResponse.redirect(new URL("/signIn", req.url));
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: -1,
      path: "/",
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: -1,
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/logOut"],
};
