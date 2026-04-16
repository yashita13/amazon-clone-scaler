export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const guestId = searchParams.get("guestId");

  if (!email && !guestId) {
    return NextResponse.json({ error: "Email or GuestID is required" }, { status: 400 });
  }

  const where: any = {};
  if (email) {
    where.userEmail = email;
  } else if (guestId) {
    where.guestId = guestId;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ orders });
}
