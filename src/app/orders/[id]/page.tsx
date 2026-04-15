"use client";

import { formatINR } from "@/lib/formatPrice";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
  address: string | null;
  items: OrderItem[];
}

const STATUS_STEPS = ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
const STEP_LABELS = ["Ordered", "Shipped", "Out for delivery", "Delivered"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data.order);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600 mb-4">{error || "Order not found"}</p>
        <Link href="/orders" className="text-[#007185] hover:underline">← Back to your orders</Link>
      </div>
    );
  }

  const currentStep = Math.max(
    STATUS_STEPS.indexOf(order.status),
    order.status === "CONFIRMED" ? 0 : -1
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/orders" className="text-[#007185] hover:underline text-sm">← Back to your orders</Link>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-medium mb-3">Order Details</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Order placed</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Order total</p>
              <p className="font-medium">{formatINR(order.total)}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Ship to</p>
              <p className="font-medium">{order.userName || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Order #</p>
              <p className="font-mono text-xs break-all">{order.id}</p>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="relative flex justify-between items-start">
            <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0">
              <div
                className="h-1 bg-[#007185] transition-all"
                style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
              />
            </div>
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="relative z-10 flex flex-col items-center" style={{ width: "25%" }}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1 ${i <= currentStep ? "bg-[#007185] border-[#007185]" : "bg-white border-gray-300"}`}>
                  {i < currentStep && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs text-center ${i <= currentStep ? "font-bold" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address */}
        {order.address && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-sm mb-1">Shipping Address</h2>
            <p className="text-sm text-gray-600">{order.userName}</p>
            <p className="text-sm text-gray-600">{order.address}</p>
          </div>
        )}

        {/* Items */}
        <div className="px-6 py-4">
          <h2 className="font-bold text-sm mb-4">Items in this order</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-20 object-contain flex-shrink-0 border border-gray-100 rounded"
                />
                <div className="flex-1 text-sm">
                  <Link href={`/product/${item.product.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium">
                    {item.product.title}
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5">{item.product.category}</p>
                  <p className="text-gray-600 mt-1">Qty: {item.quantity}</p>
                  <p className="font-bold mt-1">{formatINR(item.unitPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between font-bold text-base">
          <span>Order Total</span>
          <span>{formatINR(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
