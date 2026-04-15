import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchFakestoreProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  
  return data.map((item: any) => ({
    title: item.title,
    description: item.description,
    imageUrl: item.image,
    category: item.category,
    rating: item.rating.rate,
    stock: item.rating.count > 0 ? item.rating.count : 50,
    isBestSeller: item.rating.rate >= 4.5,
    price: Math.round(item.price * 83) // Converting FakeStore USD to INR for DB
  }));
}

const PREMIUM_ITEMS = [
  // Books 
  {
    title: "Atomic Habits by James Clear",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results.",
    price: 310.00,
    oldPrice: 799.00,
    discountPercentage: 61,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1500&auto=format&fit=crop",
    category: "Books",
    rating: 4.8,
    stock: 1500,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "The Psychology of Money by Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness.",
    price: 199.00,
    oldPrice: 399.00,
    discountPercentage: 50,
    imageUrl: "https://images.unsplash.com/photo-1592492159418-39f319320569?q=80&w=1500&auto=format&fit=crop",
    category: "Books",
    rating: 4.7,
    stock: 800,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Nike Shoes
  {
    title: "Nike Air Zoom Pegasus 39 Running Shoe",
    description: "Intuitive design and high-performance cushioning for your daily run.",
    price: 5995.00,
    oldPrice: 10495.00,
    discountPercentage: 43,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&q=80",
    category: "Men's Clothing",
    rating: 4.6,
    stock: 120,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  // Beauty (New)
  {
    title: "Luxury Face Serum with Vitamin C",
    description: "Powerful antioxidant serum for glowing, radiant skin. Dermatologist tested.",
    price: 699.00,
    oldPrice: 1499.00,
    discountPercentage: 53,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1500&auto=format&fit=crop",
    category: "Beauty",
    rating: 4.5,
    stock: 500,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  {
    title: "Maybelline New York Volume Express Mascara",
    description: "Bold volume and clump-free length. Long-lasting smudge-proof formula.",
    price: 395.00,
    oldPrice: 599.00,
    discountPercentage: 34,
    imageUrl: "https://images.unsplash.com/photo-1631214503020-f5773193910c?q=80&w=1500&auto=format&fit=crop",
    category: "Beauty",
    rating: 4.4,
    stock: 1000,
    isBestSeller: false,
    isLimitedTimeDeal: true
  },
  // Toys (New)
  {
    title: "LEGO Classic Creative Bricks Set",
    description: "Inspire open-ended creativity with this large set of colorful bricks in 33 different colors.",
    price: 1999.00,
    oldPrice: 3299.00,
    discountPercentage: 39,
    imageUrl: "https://images.unsplash.com/photo-1585366119957-e55694b960cb?auto=format&q=80",
    category: "Toys & Games",
    rating: 4.9,
    stock: 300,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Furniture (New)
  {
    title: "Ergonomic Mesh Office Chair",
    description: "Breathable mesh back with lumbar support. Adjustable height and 360-degree swivel.",
    price: 4999.00,
    oldPrice: 8999.00,
    discountPercentage: 44,
    imageUrl: "https://images.unsplash.com/photo-1616464916356-3a777b2b59b1?auto=format&q=80",
    category: "Furniture",
    rating: 4.3,
    stock: 150,
    isBestSeller: false,
    isLimitedTimeDeal: true
  },
  // Appliances (New)
  {
    title: "AmazonBasics 20L Solo Microwave Oven",
    description: "Reliable performance with mechanical dials. Perfect for reheating and cooking.",
    price: 3990.00,
    oldPrice: 5990.00,
    discountPercentage: 33,
    imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&q=80",
    category: "Appliances",
    rating: 4.2,
    stock: 80,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Kitchen
  {
    title: "Prestige Iris Plus Mixer Grinder",
    description: "Powerful 750W motor for all your grinding needs.",
    price: 2699.00,
    oldPrice: 5999.00,
    discountPercentage: 55,
    imageUrl: "https://images.unsplash.com/photo-1589733901241-5e5da4bbdc62?auto=format&q=80",
    category: "Home & Kitchen",
    rating: 4.3,
    stock: 300,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  // Electronics
  {
    title: "Echo Dot (5th Gen) Smart Speaker",
    description: "Vibrant sound and deep bass. Ask Alexa for anything.",
    price: 2999.00,
    oldPrice: 4499.00,
    discountPercentage: 33,
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1500&auto=format&fit=crop",
    category: "Electronics",
    rating: 4.7,
    stock: 1000,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "Kindle Paperwhite (16 GB)",
    description: "6.8\" display and adjustable warm light. Store thousands of books.",
    price: 9999.00,
    oldPrice: 13999.00,
    discountPercentage: 28,
    imageUrl: "https://images.unsplash.com/photo-1622122892817-45b38188db7e?auto=format&q=80",
    category: "Electronics",
    rating: 4.8,
    stock: 350,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Baby
  {
    title: "Pampers Active Baby Taped Diapers",
    description: "Softest comfort and anti-rash shield for your little one.",
    price: 299.00,
    oldPrice: 499.00,
    discountPercentage: 40,
    imageUrl: "https://images.unsplash.com/photo-1544126592-807daa2edc17?auto=format&q=80",
    category: "Baby",
    rating: 4.4,
    stock: 1000,
    isBestSeller: true,
    isLimitedTimeDeal: false
  }
];

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Fetching products from FakeStoreAPI...');
  const fakeStoreProducts = await fetchFakestoreProducts();

  // Custom ordering: Insert PREMIUM_ITEMS FIRST (older inserted, appears on page 2+), 
  // then fakeStoreProducts LAST (newer inserted, appears on page 1)
  const allProducts = [...PREMIUM_ITEMS, ...fakeStoreProducts];

  console.log(`Seeding ${allProducts.length} products...`);
  
  for (const product of allProducts) {
    await prisma.product.create({
      data: product
    });
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
