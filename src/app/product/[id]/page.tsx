"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/formatPrice";
import { Heart } from "lucide-react";

const FALLBACK_IMAGE = "https://picsum.photos/800/800";

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
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [selectedThumb, setSelectedThumb] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

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
        setMainImgSrc(data.imageUrl);
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
      <div className="bg-white min-h-screen">
        <div className="max-w-[1500px] mx-auto p-4 sm:p-8">
          {/* Skeleton Back Link */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Skeleton Image Panel */}
            <div className="md:w-1/2 lg:w-2/5">
              <div className="flex gap-3">
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-14 h-14 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="flex-1 aspect-square bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Skeleton Info Panel */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
              {/* Skeleton Buy Box */}
              <div className="lg:w-1/3 xl:w-[300px]">
                <div className="border border-gray-200 rounded p-4 space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-10 bg-gray-200 rounded-full animate-pulse w-full" />
                  <div className="h-10 bg-gray-200 rounded-full animate-pulse w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
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

  // Generate thumbnail variants from the main image URL
  const thumbnails = [
    mainImgSrc,
    product.imageUrl.replace('SL1500', 'SL800') || product.imageUrl,
    product.imageUrl.replace('SL1500', 'SL400') || product.imageUrl,
    product.imageUrl,
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  // Fake MRP for strikethrough (30% higher)
  const mrp = product.price * 1.3;
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto p-4 sm:p-8">
        <Link href="/" className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center mb-6">
          &larr; Back to results
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Image Panel with Thumbnails */}
          <div className="md:w-1/2 lg:w-2/5 sticky top-4 self-start">
            <div className="flex gap-3">
              {/* Thumbnail Strip */}
              <div className="flex flex-col gap-2">
                {thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedThumb(i); setMainImgSrc(thumb); }}
                    className={`w-14 h-14 border-2 rounded overflow-hidden relative ${selectedThumb === i ? 'border-[#C45500]' : 'border-gray-200 hover:border-[#C45500]'}`}
                  >
                    <Image
                      src={thumb}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 relative aspect-square">
                <Image
                  src={mainImgSrc}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                  onError={() => setMainImgSrc(FALLBACK_IMAGE)}
                />
              </div>
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
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-red-600 text-sm font-medium">-{discountPercent}%</span>
                  <span className="text-3xl font-medium">{formatINR(product.price)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  M.R.P.: <span className="line-through">{formatINR(mrp)}</span>
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
                <div className="text-2xl font-medium mb-1">
                  {formatINR(product.price)}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  M.R.P.: <span className="line-through">{formatINR(mrp)}</span>
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
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
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
                      className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black border border-[#FF8F00] py-2 rounded-full shadow-sm mb-4"
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={() => product && toggleWishlist(product)}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-full border border-gray-300 shadow-sm text-sm font-medium transition-colors ${isWishlisted ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                      {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
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
