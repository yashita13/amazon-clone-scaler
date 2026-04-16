import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to fetch and cache external products from DummyJSON
async function fetchAndCacheExternalProducts(searchQuery: string) {
  try {
    const url = searchQuery 
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      : `https://dummyjson.com/products?limit=20`;
      
    const res = await fetch(url);
    if (!res.ok) return [];
    
    const data = await res.json();
    const externalProducts = data.products || [];

    // Map and Upsert into local DB for consistency (detail view, cart, etc.)
    const savedProducts = await Promise.all(
      externalProducts.map(async (p: any) => {
        const extId = `ext_dj_${p.id}`;
        return prisma.product.upsert({
          where: { id: extId },
          update: {
            title: p.title,
            description: p.description,
            price: p.price,
            imageUrl: p.thumbnail,
            category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            rating: p.rating || 0,
            stock: p.stock || 10,
            discountPercentage: Math.round(p.discountPercentage) || null,
            oldPrice: p.price / (1 - (p.discountPercentage || 0) / 100),
          },
          create: {
            id: extId,
            title: p.title,
            description: p.description,
            price: p.price,
            imageUrl: p.thumbnail,
            category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            rating: p.rating || 0,
            stock: p.stock || 10,
            discountPercentage: Math.round(p.discountPercentage) || null,
            oldPrice: p.price / (1 - (p.discountPercentage || 0) / 100),
          }
        });
      })
    );

    return savedProducts;
  } catch (error) {
    console.error("fetchAndCacheExternalProducts error:", error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest"; // newest, price_asc, price_desc, rating_desc
    const bestSeller = searchParams.get("isBestSeller") === "true";
    const limitedDeal = searchParams.get("isLimitedTimeDeal") === "true";

    const skip = (page - 1) * limit;

    // Trigger external fetch if we are searching 
    if (search || (category && category !== "All" && category !== "All Categories")) {
      await fetchAndCacheExternalProducts(search || category);
    }

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (category && category !== "All" && category !== "All Categories") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (bestSeller) {
      where.isBestSeller = true;
    }

    if (limitedDeal) {
      where.isLimitedTimeDeal = true;
    }

    // Determine ordering
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "rating_desc") orderBy = { rating: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
