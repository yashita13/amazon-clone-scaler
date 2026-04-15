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
    stock: item.rating.count > 0 ? item.rating.count : 50
  }));
}

const BUDGET_ITEMS = [
  {
    title: "AmazonBasics Classic Notebook, Ruled",
    description: "240 pages, classic black notebook perfect for writing or journaling.",
    price: 4.99,
    imageUrl: "https://m.media-amazon.com/images/I/81xU2yBvKxL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.5,
    stock: 200
  },
  {
    title: "Pilot G2 Premium Rolling Ball Gel Pens",
    description: "Fine Point, Black Ink, 5-Pack. Smooth writing experience.",
    price: 5.50,
    imageUrl: "https://m.media-amazon.com/images/I/71Yy87N1cOL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.8,
    stock: 500
  },
  {
    title: "Scotch Magic Tape, 3 Rolls",
    description: "Invisible matte finish tape. Excellent for office or home use.",
    price: 3.25,
    imageUrl: "https://m.media-amazon.com/images/I/71cOozlR31L._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.7,
    stock: 120
  },
  {
    title: "BIC Round Stic Xtra Life Ballpoint Pen",
    description: "Black Ink, Medium Point, 10-Count.",
    price: 1.50,
    imageUrl: "https://m.media-amazon.com/images/I/71o0X4jQ6lL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.4,
    stock: 1000
  },
  {
    title: "Post-it Notes, 3x3 in, 4 Pads",
    description: "Canary Yellow, clean removal, sticks securely.",
    price: 4.00,
    imageUrl: "https://m.media-amazon.com/images/I/61N+Vw2bZCL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.8,
    stock: 350
  },
  {
    title: "AmazonBasics Multipurpose Scissors",
    description: "8-inch, 2-pack. Titanium blades for durability.",
    price: 5.99,
    imageUrl: "https://m.media-amazon.com/images/I/81e5vG4JomL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.7,
    stock: 250
  },
  {
    title: "Mead Spiral Notebook, 1 Subject",
    description: "Wide Ruled Paper, 70 Sheets, Assorted Colors.",
    price: 2.29,
    imageUrl: "https://m.media-amazon.com/images/I/71m6F5gA7iL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.5,
    stock: 600
  },
  {
    title: "Expo Low Odor Dry Erase Markers",
    description: "Chisel Tip, Assorted Colors, 4-Pack.",
    price: 4.89,
    imageUrl: "https://m.media-amazon.com/images/I/71DkLh7m8fL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.8,
    stock: 180
  },
  {
    title: "Sharpie Permanent Markers",
    description: "Fine Point, Black, 2-Count.",
    price: 2.98,
    imageUrl: "https://m.media-amazon.com/images/I/71d4pXn1oSL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.8,
    stock: 450
  },
  {
    title: "AmazonBasics Ruled Index Cards",
    description: "3x5 Inch, White, 300-Count.",
    price: 3.50,
    imageUrl: "https://m.media-amazon.com/images/I/71X8k8j7gOL._AC_SL1500_.jpg",
    category: "Office Products",
    rating: 4.7,
    stock: 300
  }
];

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Fetching products from FakeStoreAPI...');
  const fakeStoreProducts = await fetchFakestoreProducts();

  const allProducts = [...fakeStoreProducts, ...BUDGET_ITEMS];

  console.log(`Seeding ${allProducts.length} products...`);
  
  for (const product of allProducts) {
    await prisma.product.create({
      data: product
    });
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
