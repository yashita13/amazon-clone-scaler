"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, signOutUser } = useAuth();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  // const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [category, setCategory] = useState(searchParams.get("category") || "All Categories");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    "All Categories", 
    "Electronics", 
    "Jewellery", 
    "Men's Clothing", 
    "Women's Clothing", 
    "Office Products"
  ];

  const subNavLinks = [
    { label: "Electronics", value: "Electronics" },
    { label: "Jewellery", value: "Jewellery" },
    { label: "Men's Clothing", value: "Men's Clothing" },
    { label: "Women's Clothing", value: "Women's Clothing" },
    { label: "Office Products", value: "Office Products" },
    { label: "Today's Deals", value: "" },
    { label: "Mobiles", value: "" },
    { label: "Best Sellers", value: "" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All Categories") params.set("category", category);

    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="flex flex-col">
      {/* Top Main Nav */}
      <div className="bg-[#131921] px-4 py-2 flex items-center justify-between space-x-4">

        {/* Logo */}
        <Link href="/" className="flex items-center pt-2 border border-transparent hover:border-white p-1 rounded-sm">
          <Image
            src="/amazon-logo.png"
            alt="Amazon"
            width={100}
            height={30}
            className="object-contain"
          />
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 mx-4 max-w-3xl">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-200 text-black px-2 py-2 rounded-l-md border-r border-gray-400 outline-none hover:bg-gray-300 max-w-[150px] truncate"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Amazon"
            className="flex-1 px-4 py-2 text-black bg-white outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 py-2 rounded-r-md text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        {/* Right Links */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-white text-sm">
          {mounted && (
            user ? (
              <div className="hidden md:block cursor-pointer border border-transparent hover:border-white p-1 rounded-sm group relative">
                <p>Hello, {user.name?.split(' ')[0] || user.email.split('@')[0]}</p>
                <p className="font-bold">Account & Lists</p>
                <div className="hidden group-hover:block absolute top-full right-0 bg-white text-black p-2 shadow-md rounded mt-1 z-50">
                  <button onClick={signOutUser} className="block w-full text-left px-4 py-2 hover:bg-gray-100 whitespace-nowrap text-sm">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link href="/signin" className="hidden md:block cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
                <p>Hello, sign in</p>
                <p className="font-bold">Account & Lists</p>
              </Link>
            )
          )}

          <Link href="/orders" className="hidden md:block cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
            <p>Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          <Link href="/wishlist" className="hidden lg:block cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
            <p>Your</p>
            <p className="font-bold">Wishlist</p>
          </Link>

          <Link href="/cart" className="flex items-center cursor-pointer border border-transparent hover:border-white p-1 rounded-sm relative">
            <div className="relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="absolute -top-2 -right-2 text-[#FF9900] font-bold text-sm">
                {mounted ? itemCount : 0}
              </span>
            </div>
            <span className="font-bold mt-2 ml-1 hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="bg-[#232F3E] p-2 sm:hidden flex">
        <form onSubmit={handleSearch} className="flex flex-1">
          <input
            type="text"
            placeholder="Search Amazon"
            className="flex-1 px-4 py-2 rounded-l-md text-black bg-white outline-none"
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
      <div className="bg-[#232f3e] text-white text-sm px-4 py-1 flex space-x-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/" className="flex items-center space-x-1 cursor-pointer hover:border-white border border-transparent p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span className="font-bold">All</span>
        </Link>
        {subNavLinks.map((link) => (
          <Link 
            key={link.label} 
            href={link.value ? `/?category=${encodeURIComponent(link.value)}` : "/"}
            className="cursor-pointer hover:border-white border border-transparent p-1"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
