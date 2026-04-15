import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchFakestoreProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  
  return data.map((item: any) => ({
    title: item.title,
    description: item.description,
    price: item.price,
    imageUrl: item.image,
    category: item.category,
    rating: item.rating.rate,
    stock: item.rating.count > 0 ? item.rating.count : 50,
    isBestSeller: item.rating.rate >= 4.5
  }));
}

const PREMIUM_ITEMS = [
  // Books 
  {
    title: "Atomic Habits by James Clear",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results.",
    price: 389.00,
    oldPrice: 799.00,
    discountPercentage: 51,
    imageUrl: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_SL1500_.jpg",
    category: "Books",
    rating: 4.8,
    stock: 1500,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "The Psychology of Money by Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn’t necessarily about what you know.",
    price: 260.00,
    oldPrice: 399.00,
    discountPercentage: 35,
    imageUrl: "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_SL1500_.jpg",
    category: "Books",
    rating: 4.7,
    stock: 800,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Nike Shoes
  {
    title: "Nike Men's Air Zoom Pegasus 39 Running Shoe",
    description: "Intuitive design and high-performance cushioning for your daily run. Lightweight and durable.",
    price: 6995.00,
    oldPrice: 10495.00,
    discountPercentage: 33,
    imageUrl: "https://m.media-amazon.com/images/I/718yG3c7n6L._AC_UL1500_.jpg",
    category: "Men's Clothing",
    rating: 4.6,
    stock: 120,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "Nike Women's Revolution 6 Next Nature",
    description: "Soft foam cushioning and a breathable design for comfortable daily wear and light running.",
    price: 2495.00,
    oldPrice: 3695.00,
    discountPercentage: 32,
    imageUrl: "https://m.media-amazon.com/images/I/71XmNo88B5L._AC_SL1500_.jpg",
    category: "Women's Clothing",
    rating: 4.4,
    stock: 200,
    isBestSeller: false,
    isLimitedTimeDeal: false
  },
  // Kitchen
  {
    title: "Prestige Iris Plus 750 Watt Mixer Grinder",
    description: "Powerful motor, 3 stainless steel jars, and a transparent juicer jar for all your kitchen needs.",
    price: 3199.00,
    oldPrice: 5999.00,
    discountPercentage: 47,
    imageUrl: "https://m.media-amazon.com/images/I/61m6cK1wGkL._AC_SL1500_.jpg",
    category: "Kitchen",
    rating: 4.3,
    stock: 300,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "Pigeon Amaze Plus 1.5L Electric Kettle",
    description: "Multi-purpose kettle for boiling water, making tea, and coffee. Speed-boil technology.",
    price: 549.00,
    oldPrice: 1195.00,
    discountPercentage: 54,
    imageUrl: "https://m.media-amazon.com/images/I/51p8vX8169L._AC_SL1200_.jpg",
    category: "Kitchen",
    rating: 4.2,
    stock: 1000,
    isBestSeller: false,
    isLimitedTimeDeal: false
  },
  // Home
  {
    title: "Solimo Microfibre Reversible Comforter, Double",
    description: "Soft and breathable microfibre comforter for all-season use. Machine washable.",
    price: 1499.00,
    oldPrice: 2999.00,
    discountPercentage: 50,
    imageUrl: "https://m.media-amazon.com/images/I/81S8Ait3yFL._AC_SL1500_.jpg",
    category: "Home",
    rating: 4.5,
    stock: 450,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  // Office
  {
    title: "Amazon Basics Classic Lined Notebook - 240 Pages",
    description: "Thread-bound classic notebook with black covers and ruled pages. High-quality paper.",
    price: 299.00,
    oldPrice: 499.00,
    discountPercentage: 40,
    imageUrl: "https://m.media-amazon.com/images/I/81xU2yBvKxL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.6,
    stock: 500,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  {
    title: "Paper Mate Flair Felt Tip Pens, Medium Point",
    description: "Felt tip pens in assorted colors. Smudge-resistant ink that won't bleed through paper.",
    price: 649.00,
    oldPrice: 849.00,
    discountPercentage: 24,
    imageUrl: "https://m.media-amazon.com/images/I/81O0dZ6Y-AL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.8,
    stock: 200,
    isBestSeller: false,
    isLimitedTimeDeal: false
  },
  // Electronics
  {
    title: "Echo Dot (5th Gen) - Smart speaker with Alexa",
    description: "Deep bass and vibrant sound in a compact design. Ask Alexa for music, news, and more.",
    price: 3699.00,
    oldPrice: 4499.00,
    discountPercentage: 18,
    imageUrl: "https://m.media-amazon.com/images/I/81S88mY0JHL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.7,
    stock: 1000,
    isBestSeller: true,
    isLimitedTimeDeal: true
  },
  {
    title: "Kindle Paperwhite (16 GB) - Now with a 6.8\" display",
    description: "Adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    price: 11999.00,
    oldPrice: 13999.00,
    discountPercentage: 14,
    imageUrl: "https://m.media-amazon.com/images/I/71XmNo88B5L._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.8,
    stock: 350,
    isBestSeller: true,
    isLimitedTimeDeal: false
  },
  // Fashion / Baby
  {
    title: "Pampers Active Baby Taped Style Diapers, Small, 22 pcs",
    description: "5 Star Skin Comfort, cottony softness, and anti-rash shield for your baby.",
    price: 364.00,
    imageUrl: "https://m.media-amazon.com/images/I/71e-TqP+sRL._AC_SL1500_.jpg",
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
