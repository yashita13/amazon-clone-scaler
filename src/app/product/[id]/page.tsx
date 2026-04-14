"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF9900]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4 py-8">
        <Link href="/" className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center mb-6">
          &larr; Back to results
        </Link>
        <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto p-4 sm:p-8">
        <Link href="/" className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center mb-6">
          &larr; Back to results
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Image Panel */}
          <div className="md:w-1/2 lg:w-2/5 flex justify-center sticky top-4 self-start">
            <div className="relative w-full max-w-md h-[400px] sm:h-[500px]">
              <Image 
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Middle/Right: Details Panel */}
          <div className="md:w-1/2 lg:w-3/5 flex flex-col lg:flex-row gap-8">
            
            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-medium leading-tight mb-2">
                {product.title}
              </h1>
              
              <Link href={`/?category=${encodeURIComponent(product.category)}`} className="text-[#007185] hover:text-[#C7511F] hover:underline mb-2 block">
                {product.category}
              </Link>
              
              <div className="flex text-[#F3A847] items-center my-2 text-lg border-b pb-4">
                {Array(Math.floor(product.rating))
                  .fill(1)
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                <span className="text-[#007185] ml-4 hover:underline text-sm">{product.rating} out of 5 stars</span>
              </div>

              <div className="py-4 border-b">
                <div className="flex items-baseline text-3xl font-medium">
                  <span className="text-sm align-top self-start mt-1">$</span>
                  {Math.floor(product.price)}
                  <span className="text-sm align-top self-start mt-1">
                    {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">FREE Returns</span>
                </div>
              </div>

              <div className="py-4">
                <h3 className="font-bold text-lg mb-2">About this item</h3>
                <p className="text-base text-gray-800 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Right Side: Buy Box (lg screen) */}
            <div className="lg:w-1/3 xl:w-[300px]">
              <div className="border border-gray-300 rounded p-4 shadow-sm sticky top-4">
                <div className="text-2xl font-medium mb-3">
                  <span className="text-sm align-top">$</span>
                  {Math.floor(product.price)}
                  <span className="text-sm align-top">
                    {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
                <div className="text-[#007185] hover:text-[#C7511F] text-sm hover:underline mb-4 cursor-pointer">
                  FREE Returns
                </div>
                <div className="text-sm mb-4">
                  <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">FREE delivery</span> 
                  <span className="font-bold"> Wednesday, Dec 20</span>. Order within <span className="text-green-700">22 hrs 14 mins</span>
                </div>
                
                <h4 className="text-green-700 text-xl mb-4 font-medium">
                  {product.stock > 0 ? "In Stock." : "Out of Stock"}
                </h4>

                {product.stock > 0 && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="quantity" className="text-sm border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 shadow-sm px-2 py-1 flex items-center max-w-[120px]">
                        Qty: 
                        <select 
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="bg-transparent border-none outline-none ml-2 w-full cursor-pointer"
                        >
                          {[...Array(Math.min(10, product.stock))].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] py-2 rounded-full shadow-sm mb-3"
                    >
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={handleBuyNow}
                      className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black border border-[#FF8F00] py-2 rounded-full shadow-sm mb-2"
                    >
                      Buy Now
                    </button>

                    <div className="flex items-center text-gray-500 text-sm mt-3 space-x-2 justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">Secure transaction</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
