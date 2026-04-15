import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/notifications";
import crypto from "crypto";

/**
 * POST /api/auth/signup
 *
 * Body: { email, password, name?, mobile? }
 *
 * - Creates a new User with a hashed password.
 * - Generates a 6-digit OTP saved to OTPVerification.
 * - Sends OTP via email (and SMS if mobile provided).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, mobile } = body;

    // Validate required fields
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password using Node's built-in crypto (SHA-256 + random salt)
    // In production, use bcrypt or argon2
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    const storedHash = `${salt}:${passwordHash}`;

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: storedHash,
        name: name || null,
        mobile: mobile || null,
      },
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email before creating new one
    await prisma.oTPVerification.deleteMany({ where: { email } });

    // Save OTP to DB
    await prisma.oTPVerification.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    // Send OTP via mock email/SMS
    await sendOTP(email, otp, mobile);

    return NextResponse.json(
      {
        message: "Account created. Please verify your email with the OTP sent.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
