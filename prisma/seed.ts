import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const products = [
    // Electronics
    {
      title: "Wireless Noise-Cancelling Headphones",
      description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
      price: 299.99,
      imageUrl: "https://picsum.photos/seed/elec1/400/400",
      category: "Electronics",
      rating: 4.8,
      stock: 50,
    },
    {
      title: "4K Ultra HD Smart TV",
      description: "55-inch smart television with vibrant colors and built-in streaming apps.",
      price: 499.00,
      imageUrl: "https://picsum.photos/seed/elec2/400/400",
      category: "Electronics",
      rating: 4.5,
      stock: 30,
    },
    {
      title: "Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard with tactile switches for precision gaming.",
      price: 89.99,
      imageUrl: "https://picsum.photos/seed/elec3/400/400",
      category: "Electronics",
      rating: 4.7,
      stock: 120,
    },
    {
      title: "Smartphone Fast Charger",
      description: "65W USB-C power adapter for quick charging smartphones and tablets.",
      price: 24.50,
      imageUrl: "https://picsum.photos/seed/elec4/400/400",
      category: "Electronics",
      rating: 4.3,
      stock: 200,
    },
    
    // Books
    {
      title: "The Silent Patient",
      description: "A shocking psychological thriller of a woman's act of violence against her husband.",
      price: 14.99,
      imageUrl: "https://picsum.photos/seed/book1/400/400",
      category: "Books",
      rating: 4.6,
      stock: 80,
    },
    {
      title: "Atomic Habits",
      description: "An easy & proven way to build good habits & break bad ones.",
      price: 11.98,
      imageUrl: "https://picsum.photos/seed/book2/400/400",
      category: "Books",
      rating: 4.9,
      stock: 150,
    },
    {
      title: "Dune",
      description: "Frank Herbert's classic masterpiece - a triumph of the imagination.",
      price: 18.00,
      imageUrl: "https://picsum.photos/seed/book3/400/400",
      category: "Books",
      rating: 4.7,
      stock: 90,
    },
    {
      title: "Clean Code",
      description: "A Handbook of Agile Software Craftsmanship.",
      price: 34.50,
      imageUrl: "https://picsum.photos/seed/book4/400/400",
      category: "Books",
      rating: 4.8,
      stock: 45,
    },

    // Home & Kitchen
    {
      title: "Non-Stick Cookware Set",
      description: "10-piece pots and pans set with non-stick coating for easy cleaning.",
      price: 129.99,
      imageUrl: "https://picsum.photos/seed/home1/400/400",
      category: "Home & Kitchen",
      rating: 4.4,
      stock: 60,
    },
    {
      title: "Programmable Coffee Maker",
      description: "12-cup drip coffee maker with programmable timer and keep-warm setting.",
      price: 49.99,
      imageUrl: "https://picsum.photos/seed/home2/400/400",
      category: "Home & Kitchen",
      rating: 4.5,
      stock: 85,
    },
    {
      title: "Robot Vacuum Cleaner",
      description: "Smart robotic vacuum with strong suction and self-charging capability.",
      price: 199.00,
      imageUrl: "https://picsum.photos/seed/home3/400/400",
      category: "Home & Kitchen",
      rating: 4.6,
      stock: 40,
    },
    {
      title: "Scented Candles Gift Set",
      description: "Set of 4 natural soy wax candles with lavender, vanilla, rose, and lemon scents.",
      price: 22.95,
      imageUrl: "https://picsum.photos/seed/home4/400/400",
      category: "Home & Kitchen",
      rating: 4.8,
      stock: 110,
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
