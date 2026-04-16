import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      guestId: true,
      userEmail: true,
      createdAt: true
    }
  });

  console.log("Recent Orders:");
  console.dir(orders, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
