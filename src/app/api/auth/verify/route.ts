import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";
import { cookies } from "next/headers";

/**
 * POST /api/auth/verify
 *
 * Body: { email, code }
 *
 * - Checks if the OTP for the email exists and matches.
 * - Checks if it has expired.
 * - Deletes the OTP on success and returns a "verified" payload.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    // Find OTP records for this email
    const otpRecords = await prisma.oTPVerification.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (otpRecords.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check the most recent one
    const latestOtp = otpRecords[0];

    if (latestOtp.code !== code) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    if (latestOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Mark as verified by clearing the OTP records
    await prisma.oTPVerification.deleteMany({ where: { email } });

    // Create the actual account now that OTP is verified
    const user = await prisma.user.create({
      data: {
        email,
        name: latestOtp.name || "Amazon Buyer",
        password: latestOtp.password || "",
        phone: latestOtp.phone || "",
      }
    });

    // Create JWT
    const token = await signJWT({ userId: user.id, role: user.role });

    const response = NextResponse.json(
      {
        message: "Email verified and account created successfully.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
