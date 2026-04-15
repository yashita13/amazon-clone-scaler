"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { motion, AnimatePresence } from "framer-motion";

const CAROUSEL_IMAGES = [
  "/a1.jpg",
  "/a2.png",
  "/a3.jpg",
  "/a4.jpg",
  "/a5.jpg",
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

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
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
        if (categoryParam && categoryParam !== "All Categories") query.set("category", categoryParam);

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
      <div className="relative w-full overflow-hidden group" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}>
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
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EAEDED] to-transparent z-10 pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-[40%] -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none border border-transparent rounded shadow-sm hover:border-black cursor-pointer"
          >
            <ChevronLeftIcon className="h-8 w-8 text-black" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-[40%] -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none border border-transparent rounded shadow-sm hover:border-black cursor-pointer"
          >
            <ChevronRightIcon className="h-8 w-8 text-black" />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 mt-[-150px] md:mt-[-320px] max-w-[1500px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
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
