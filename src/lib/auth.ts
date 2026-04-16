import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "amazon_scaler_secret_1234567890_rb_ac_integration";
const key = new TextEncoder().encode(JWT_SECRET);

export const DUMMY_USER = {
  id: "guest-user",
  name: "Guest User",
  email: "guest@example.com",
  role: "USER" as const,
};

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Returns the currently authenticated user from the session cookie.
 * Falls back to a DUMMY_USER if no session exists or is invalid.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (!token) return DUMMY_USER;

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return DUMMY_USER;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, email: true, name: true, role: true },
    });

    return user ? { ...user, role: user.role as "USER" | "ADMIN" | "DELIVERY" } : DUMMY_USER;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return DUMMY_USER;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (user === DUMMY_USER) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireRole(role: "USER" | "ADMIN" | "DELIVERY") {
  const user = await getCurrentUser();
  if (user.role !== role && user.role !== "ADMIN") {
    throw new Error(`Access denied: required role ${role}`);
  }
  return user;
}
