import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  // Electronics
  {
    title: "Apple Watch Series 9 (Carbon Neutral)",
    description: "Smarter, brighter, and mightier. Advanced health features.",
    price: 399.00,
    imageUrl: "https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.9,
    stock: 120
  },
  {
    title: "MacBook Pro 16-inch M3 Max",
    description: "Mind-blowing performance for pro workflows with all-day battery life.",
    price: 3499.00,
    imageUrl: "https://m.media-amazon.com/images/I/61lsexTCOhL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.9,
    stock: 45
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    description: "Industry-leading noise cancellation with auto noise canceling optimizer.",
    price: 348.00,
    imageUrl: "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.7,
    stock: 200
  },
  {
    title: "iPhone 15 Pro Max 256GB",
    description: "Titanium. A17 Pro chip. Action button. The most powerful iPhone ever.",
    price: 1199.00,
    imageUrl: "https://m.media-amazon.com/images/I/81SigpJN1KL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.8,
    stock: 75
  },
  // Home & Kitchen
  {
    title: "Samsung Front Load Washer and Dryer Set",
    description: "Smart Dial Front Load Washers and Dryers with OptiWash.",
    price: 1598.00,
    imageUrl: "https://m.media-amazon.com/images/I/71d2oBuz12L._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    rating: 4.7,
    stock: 8
  },
  {
    title: "Ninja Air Fryer Pro 4-in-1",
    description: "Air fry, roast, reheat, and dehydrate. Enjoy guilt-free fried food.",
    price: 119.99,
    imageUrl: "https://m.media-amazon.com/images/I/71SpGXr0YnL._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    rating: 4.8,
    stock: 300
  },
  {
    title: "Nespresso Vertuo Coffee and Espresso Machine",
    description: "Brews 4 different cup sizes at the touch of a button.",
    price: 199.00,
    imageUrl: "https://m.media-amazon.com/images/I/61TKaFMVnBL._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    rating: 4.8,
    stock: 150
  },
  // Beauty & Books
  {
    title: "Atomic Habits by James Clear",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    price: 11.98,
    imageUrl: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_SL1500_.jpg",
    category: "Books",
    rating: 4.9,
    stock: 500
  },
  {
    title: "Dior Sauvage Eau de Toilette",
    description: "A radically fresh composition, formulated with high quality ingredients.",
    price: 145.00,
    imageUrl: "https://m.media-amazon.com/images/I/71RkOJVvzbL._AC_SL1500_.jpg",
    category: "Beauty",
    rating: 4.8,
    stock: 120
  },
  {
    title: "Samsung Galaxy S24 Ultra 256GB",
    description: "Galaxy AI is here. Circle to Search. Chat Assist. Titanium frame.",
    price: 1299.99,
    imageUrl: "https://m.media-amazon.com/images/I/71lBwfB3FjL._AC_SL1500_.jpg",
    category: "Electronics",
    rating: 4.6,
    stock: 60
  },
  {
    title: "PlayStation 5 Console (Slim)",
    description: "Stunning games. Haptic feedback. Adaptive triggers. Tempest 3D AudioTech.",
    price: 449.99,
    imageUrl: "https://m.media-amazon.com/images/I/51mGGnRjRLL._SL1500_.jpg",
    category: "Electronics",
    rating: 4.8,
    stock: 35
  },
  {
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description: "7-in-1 functionality: pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker & warmer.",
    price: 89.95,
    imageUrl: "https://m.media-amazon.com/images/I/71V1LtDMGQL._AC_SL1500_.jpg",
    category: "Home & Kitchen",
    rating: 4.7,
    stock: 180
  }
];

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  for (const product of PRODUCTS) {
    await prisma.product.create({
      data: product
    });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
