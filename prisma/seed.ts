import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  // Electronics
  {
    title: "Apple iPhone 15 Pro, 256GB - Titanium",
    description: "Experience the fastest chip ever in a smartphone and an incredible camera system.",
    price: 1099.00,
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500",
    category: "Electronics",
    rating: 4.8,
    stock: 150
  },
  {
    title: "MacBook Pro 16-inch M3 Max",
    description: "Mind-blowing performance for pro workflows with all-day battery life.",
    price: 3499.00,
    imageUrl: "https://images.unsplash.com/photo-1517336714460-457224b6e351?w=500",
    category: "Electronics",
    rating: 4.9,
    stock: 45
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    description: "Industry-leading noise cancellation with auto noise canceling optimizer.",
    price: 348.00,
    imageUrl: "https://images.unsplash.com/photo-1675243935987-3c1820d7454a?w=500",
    category: "Electronics",
    rating: 4.7,
    stock: 200
  },
  // Home & Kitchen
  {
    title: "Dyson V15 Detect Cordless Vacuum",
    description: "Intelligently optimizes suction and run time based on floor type.",
    price: 699.00,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067df5f15430?w=500",
    category: "Home & Kitchen",
    rating: 4.6,
    stock: 65
  },
  {
    title: "Nespresso Vertuo Coffee and Espresso Machine",
    description: "Brews 4 different cup sizes at the touch of a button.",
    price: 199.00,
    imageUrl: "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=500",
    category: "Home & Kitchen",
    rating: 4.8,
    stock: 150
  },
  {
    title: "Ninja Air Fryer Pro 4-in-1",
    description: "Air fry, roast, reheat, and dehydrate. Enjoy guilt-free fried food.",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500",
    category: "Home & Kitchen",
    rating: 4.8,
    stock: 300
  },
  // Books
  {
    title: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel.",
    price: 18.24,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500",
    category: "Books",
    rating: 4.8,
    stock: 500
  },
  {
    title: "Dune (Penguin Galaxy)",
    description: "Frank Herbert’s classic masterpiece, a triumph of the imagination.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    category: "Books",
    rating: 4.8,
    stock: 220
  },
  {
    title: "Thinking, Fast and Slow",
    description: "A major New York Times bestseller by Nobel Prize winner Daniel Kahneman.",
    price: 22.50,
    imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500",
    category: "Books",
    rating: 4.5,
    stock: 350
  },
  // Beauty
  {
    title: "La Mer Crème de la Mer Moisturizer",
    description: "A luxuriously rich cream that thoroughly soothes, moisturizes, and hydrates to help heal away dryness.",
    price: 195.00,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    category: "Beauty",
    rating: 4.8,
    stock: 60
  },
  {
    title: "Dior Sauvage Eau de Toilette",
    description: "A radically fresh composition, formulated with high quality ingredients.",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1594035919831-58188c5820ab?w=500",
    category: "Beauty",
    rating: 4.9,
    stock: 120
  },
  // Appliances
  {
    title: "Whirlpool Stainless Steel Refrigerator",
    description: "A counter-depth french door refrigerator with immense storage capacity.",
    price: 1299.99,
    imageUrl: "https://images.unsplash.com/photo-1584824486509-f64f89fb0c69?w=500",
    category: "Appliances",
    rating: 4.5,
    stock: 15
  },
  {
    title: "Samsung Front Load Washer and Dryer Set",
    description: "Smart Dial Front Load Washers and Dryers with OptiWash.",
    price: 1598.00,
    imageUrl: "https://images.unsplash.com/photo-1610557892470-5b1285db2d6e?w=500",
    category: "Appliances",
    rating: 4.7,
    stock: 8
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
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
