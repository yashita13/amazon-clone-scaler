import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const response = NextResponse.json({ message: "Sign out successful" });
  
  response.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
