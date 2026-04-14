import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amazon Clone",
  description: "A full-stack Amazon Clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-amazon-lightGray text-amazon-textPrimary`}>
        <CartProvider>
          <React.Suspense fallback={<div>Loading mapping...</div>}>
            <Navbar />
          </React.Suspense>
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
