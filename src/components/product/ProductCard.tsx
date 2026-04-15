"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatINR } from "@/lib/formatPrice";
import { useState } from "react";
import { Heart } from "lucide-react";

const FALLBACK_IMAGE = "https://picsum.photos/800/800";

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="flex flex-col bg-white z-30 p-5 rounded-none sm:rounded-sm border border-gray-200 hover:shadow-lg transition-shadow relative group">
      <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
        {product.category}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-gray-100 z-40 transition-colors"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
        />
      </button>
      
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1 items-center">
        <div className="w-full aspect-square relative mb-2 flex items-center justify-center p-2">
          <Image 
            src={imgSrc} 
            alt={product.title} 
            fill 
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
        
        <div className="w-full text-left flex-1 mt-1">
          <h4 className="text-sm font-medium line-clamp-2 hover:text-[#C7511F]">{product.title}</h4>
          
          <div className="flex text-[#F3A847] items-center my-1 text-sm">
            {Array(Math.floor(product.rating))
              .fill(1)
              .map((_, i) => (
                <span key={i}>★</span>
              ))}
            <span className="text-blue-500 ml-2 hover:underline">{product.rating}</span>
          </div>
          
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-medium">{formatINR(product.price)}</span>
          </div>

          <div className="flex items-center mt-1">
            <span className="text-[#00A8E1] font-bold italic text-sm tracking-tight mr-1"><span className="text-[#FF9900]">✓</span>prime</span>
            <span className="text-gray-500 text-xs">FREE Delivery</span>
          </div>
        </div>
      </Link>
      
      <button 
        onClick={() => addToCart(product, 1)}
        className="w-full mt-auto bg-[#FFD814] hover:bg-[#F7CA00] text-black text-sm font-medium border border-[#FCD200] mt-3 py-2 rounded-full shadow-sm"
      >
        Add to Cart
      </button>
    </div>
  );
}
