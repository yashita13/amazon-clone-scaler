import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/signin
 *
 * Body: { email, password }
 *
 * - Finds the user by email.
 * - Verifies the hashed password.
 * - Returns the user ID on success.
 *
 * Note: This is a simple credential check. For session management,
 * integrate NextAuth.js or a JWT library in production.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password against hashed bcrypt password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Sign in successful",
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("POST /api/auth/signin error:", error);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
