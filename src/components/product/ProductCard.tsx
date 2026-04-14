"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col bg-white z-30 p-4 rounded hover:shadow-lg transition-shadow relative">
      <div className="absolute top-2 right-2 text-xs italic text-gray-400">
        {product.category}
      </div>
      
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1 items-center">
        <div className="w-[200px] h-[200px] relative mb-4">
          <Image 
            src={product.imageUrl} 
            alt={product.title} 
            fill 
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="w-full text-left flex-1 mt-2">
          <h4 className="font-medium line-clamp-2">{product.title}</h4>
          
          <div className="flex text-[#F3A847] items-center my-1 text-sm">
            {Array(Math.floor(product.rating))
              .fill(1)
              .map((_, i) => (
                <span key={i}>★</span>
              ))}
            <span className="text-blue-500 ml-2 hover:underline">{product.rating}</span>
          </div>
          
          <div className="text-2xl mt-1">
            <span className="text-sm align-top">$</span>
            {Math.floor(product.price)}
            <span className="text-sm align-top">
              {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center space-x-1 mt-1 text-sm">
            <span className="text-blue-500 font-semibold italic">prime</span>
            <span className="text-gray-500">FREE Delivery</span>
          </div>
        </div>
      </Link>
      
      <button 
        onClick={() => addToCart(product, 1)}
        className="w-full mt-auto bg-[#FF9900] hover:bg-[#F3A847] text-black border border-[#a88734] mt-4 py-2 rounded shadow-sm hover:shadow"
      >
        Add to Cart
      </button>
    </div>
  );
}
