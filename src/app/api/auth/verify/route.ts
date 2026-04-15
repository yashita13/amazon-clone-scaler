import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Retrieve the user to log them in automatically
    const user = await prisma.user.findUnique({ where: { email } });

    // Mark as verified by clearing the OTP records
    await prisma.oTPVerification.deleteMany({ where: { email } });

    return NextResponse.json(
      {
        message: "Email verified successfully.",
        userId: user?.id,
        email: user?.email,
        name: user?.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/auth/verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
