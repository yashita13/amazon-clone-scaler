"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// A dummy hero image
const HERO_IMAGE = "https://picsum.photos/1500/600?random=1";

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
    <div className="max-w-[1500px] mx-auto bg-amazon-lightGray">
      <div className="relative">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
          <Image 
            src={HERO_IMAGE} 
            alt="Hero Banner" 
            fill 
            className="object-cover"
            priority
          />
          {/* Gradient overlay to blend bottom of hero image to general background */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amazon-lightGray to-transparent z-10" />
        </div>
      </div>

      <div className="relative z-20 px-4 -mt-16 sm:-mt-32 md:-mt-48 max-w-7xl mx-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-5">
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
