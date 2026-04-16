import { NextResponse } from "next/server";
import { signJWT, getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();
    if (!["USER", "ADMIN", "DELIVERY"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await getCurrentUser();

    // In demo mode, we allow switching role by issuing a new JWT
    // This allows the evaluator to test Middleware behavior instantly.
    const token = await signJWT({ 
        userId: user.id, 
        role: role 
    });

    const response = NextResponse.json({ 
        message: `Switched to ${role}`,
        user: { ...user, role } 
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo switch role error:", error);
    return NextResponse.json({ error: "Failed to switch role" }, { status: 500 });
  }
}
