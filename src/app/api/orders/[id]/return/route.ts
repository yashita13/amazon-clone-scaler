import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, type } = body;

    if (!reason || !type) {
      return NextResponse.json(
        { error: "Reason and type are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: type === "RETURN" ? "RETURN_REQUESTED" : "EXCHANGED",
        returnReason: reason,
        returnType: type,
      },
    });

    return NextResponse.json({
      message: "Request submitted successfully",
      status: updatedOrder.status,
    });
  } catch (error) {
    console.error("POST /api/orders/[id]/return error:", error);
    return NextResponse.json(
      { error: "Failed to process return/exchange" },
      { status: 500 }
    );
  }
}
