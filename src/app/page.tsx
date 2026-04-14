"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { motion, AnimatePresence } from "framer-motion";

const CAROUSEL_IMAGES = [
  "https://picsum.photos/id/1015/1500/600",
  "https://picsum.photos/id/1035/1500/600",
  "https://picsum.photos/id/1041/1500/600",
];

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unwrappedParams = use(searchParams);
  const pageParam = typeof unwrappedParams.page === "string" ? unwrappedParams.page : "1";
  const searchParam = typeof unwrappedParams.search === "string" ? unwrappedParams.search : "";
  const categoryParam = typeof unwrappedParams.category === "string" ? unwrappedParams.category : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam));
  const [totalPages, setTotalPages] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        query.set("page", currentPage.toString());
        if (searchParam) query.set("search", searchParam);
        if (categoryParam) query.set("category", categoryParam);

        const res = await fetch(`/api/products?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentPage, searchParam, categoryParam]);

  // Sync state if URL changes directly
  useEffect(() => {
    setCurrentPage(parseInt(pageParam));
  }, [pageParam]);

  return (
    <div className="max-w-[1500px] mx-auto bg-[#EAEDED]">
      <div className="relative w-full overflow-hidden" style={{ WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)" }}>
        <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] relative">
          <AnimatePresence>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image 
                src={CAROUSEL_IMAGES[currentImageIndex]} 
                alt="Banner Carousel" 
                fill 
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 px-4 -mt-[100px] sm:-mt-[150px] md:-mt-[350px] max-w-[1500px] mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amazon-orange"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded mt-20">
            {error}
          </div>
        ) : products.length === 0 ? (
           <div className="bg-white p-8 text-center text-xl font-medium rounded mt-20">
             {searchParam || categoryParam ? "No products found for your search/filter." : "No products available."}
           </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-12 space-x-2">
                <button 
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    window.history.pushState(null, '', `?page=${newPage}${searchParam ? `&search=${searchParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`);
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  Previous
                </button>
                <div className="flex items-center px-4 py-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => {
                    const newPage = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(newPage);
                    window.history.pushState(null, '', `?page=${newPage}${searchParam ? `&search=${searchParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center disabled:opacity-50"
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
