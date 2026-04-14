"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");

  const categories = ["All", "Electronics", "Books", "Home & Kitchen"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="flex flex-col w-full">
      <div className="bg-[#131921] text-white px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold border border-transparent hover:border-white p-1 rounded">
          amazon
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 mx-4 max-w-3xl">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-200 text-black px-2 py-2 rounded-l-md border-r border-gray-400 outline-none hover:bg-gray-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Amazon"
            className="flex-1 px-4 py-2 text-black outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 py-2 rounded-r-md text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center space-x-4">
          <div className="text-sm border border-transparent hover:border-white p-1 rounded hidden sm:block cursor-pointer">
            <p>Hello, sign in</p>
            <p className="font-bold">Account & Lists</p>
          </div>
          <div className="text-sm border border-transparent hover:border-white p-1 rounded hidden sm:block cursor-pointer">
            <p>Returns</p>
            <p className="font-bold">& Orders</p>
          </div>
          <Link href="/cart" className="flex items-center group border border-transparent hover:border-white p-1 rounded relative">
            <div className="relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="absolute -top-1 left-4 text-[#FF9900] font-bold text-lg">{itemCount}</span>
            </div>
            <span className="font-bold mt-2 ml-1 hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Band */}
      <div className="bg-[#232F3E] p-2 sm:hidden flex">
        <form onSubmit={handleSearch} className="flex flex-1">
          <input
             type="text"
             placeholder="Search Amazon"
             className="flex-1 px-4 py-2 rounded-l-md text-black outline-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 py-2 rounded-r-md text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Category Links Band */}
      <div className="bg-[#232F3E] text-white text-sm px-4 py-1 flex space-x-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center space-x-1 cursor-pointer hover:border-white border border-transparent p-1">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span>All</span>
        </div>
        <Link href="/?category=Electronics" className="p-1 border border-transparent hover:border-white">Electronics</Link>
        <Link href="/?category=Books" className="p-1 border border-transparent hover:border-white">Books</Link>
        <Link href="/?category=Home+%26+Kitchen" className="p-1 border border-transparent hover:border-white">Home & Kitchen</Link>
      </div>
    </header>
  );
}
