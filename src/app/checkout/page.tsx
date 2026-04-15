"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatINR } from "@/lib/formatPrice";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
  });

  if (cartItems.length === 0 && !orderConfirmed) {
    router.push("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estimatedTax = cartTotal * 0.08;
  const orderTotal = cartTotal + estimatedTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price
      })),
      total: orderTotal
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderConfirmed(data.orderId);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-[800px] mx-auto p-4 py-16 text-center">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-medium mb-4 text-green-700">Order Placed, thank you!</h1>
          <p className="text-gray-600 mb-6 text-lg">Confirmation will be sent to your email.</p>
          <div className="bg-gray-50 p-4 rounded mb-8 text-left inline-block w-full max-w-sm mx-auto">
            <p className="text-sm text-gray-500 font-bold mb-1">Order Number:</p>
            <p className="font-mono">{orderConfirmed}</p>
          </div>
          <br/>
          <Link href="/" className="bg-[#FF9900] hover:bg-[#F3A847] text-black border border-[#a88734] py-2 px-6 rounded shadow-sm inline-block font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-4 py-8 bg-white md:bg-transparent min-h-screen">
      <h1 className="text-3xl font-medium mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left: Form */}
        <div className="md:w-2/3 bg-white md:p-6 md:rounded md:shadow-sm">
          <h2 className="text-xl font-medium mb-4 border-b pb-2">1. Shipping address</h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-bold mb-1">Full name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address or P.O. Box" className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold mb-1">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1">ZIP Code</label>
                  <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]" />
               </div>
            </div>
          </form>

          <h2 className="text-xl font-medium mb-4 border-b pb-2">2. Payment method</h2>
          <div className="space-y-4 mb-8">
            <div className="border border-[#FF9900] bg-orange-50 rounded p-4 flex items-center">
               <input type="radio" checked readOnly className="mr-3 h-4 w-4 text-[#FF9900]" />
               <div className="flex-1">
                 <p className="font-bold">Test Credit Card</p>
                 <p className="text-sm text-gray-600">No real payment will be processed.</p>
               </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Card number</label>
              <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" disabled className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-1/3">
           <div className="bg-white p-6 rounded shadow-sm border border-gray-200 sticky top-4">
              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] py-2 rounded-lg shadow-sm font-medium mb-4 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place your order"}
              </button>
              
              <p className="text-xs text-gray-600 border-b pb-4 mb-4 text-center">
                By placing your order, you agree to Amazon's privacy notice and conditions of use.
              </p>

              <h3 className="font-bold text-lg mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm mb-4 border-b pb-4">
                 <div className="flex justify-between">
                   <span>Items:</span>
                   <span>{formatINR(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping & handling:</span>
                   <span>₹0.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Total before tax:</span>
                   <span>{formatINR(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Estimated tax to be collected:</span>
                   <span>{formatINR(estimatedTax)}</span>
                 </div>
              </div>

              <div className="flex justify-between font-bold text-[#b12704] text-xl">
                 <span>Order total:</span>
                 <span>{formatINR(orderTotal)}</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
