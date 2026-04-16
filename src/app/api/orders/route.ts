import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/mailer";
import { calculateOrderPrices } from "@/lib/orderUtils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, email, name, address, guestId, paymentMethod, paymentProvider } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request: items array is empty or missing" }, { status: 400 });
    }

    // Backend-side calculation for 100% consistency
    let itemsTotal = 0;
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid request: unit price or product missing" }, { status: 400 });
      }
      itemsTotal += item.unitPrice * item.quantity;
    }

    const pricing = calculateOrderPrices(itemsTotal);

    const order = await prisma.order.create({
      data: {
        total: pricing.finalTotal,
        itemsTotal: pricing.itemsTotal,
        taxAmount: pricing.taxAmount,
        deliveryFee: pricing.deliveryFee,
        status: "CONFIRMED",
        userEmail: email || null,
        userName: name || null,
        address: address || null,
        guestId: guestId || null,
        paymentMethod: paymentMethod || null,
        paymentProvider: paymentProvider || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
          items: {
              include: { product: true }
          }
      }
    });

    // Send order confirmation email immediately
    if (email) {
      // Pass the full order object with pricing breakdown for perfectly consistent emails
      sendOrderEmail(email, order as any, name, address).catch((err) =>
        console.error("Failed to send order confirmation email:", err)
      );
    }

    return NextResponse.json({ 
      orderId: order.id, 
      status: order.status,
      timestamp: order.createdAt.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
