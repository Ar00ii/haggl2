/**
 * Reverses `seed-demo-data.ts` — drops every `isSeed = true` row in
 * cascade-safe order. Real user activity is untouched.
 *
 * Usage (from backend/):
 *   DATABASE_URL=postgres://... npx ts-node scripts/wipe-demo-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('▶ Wiping demo data');

  const seedUsers = await prisma.user.findMany({
    where: { isSeed: true },
    select: { id: true },
  });
  const seedUserIds = seedUsers.map((u) => u.id);

  const repBefore = seedUserIds.length
    ? await prisma.reputationEvent.count({ where: { userId: { in: seedUserIds } } })
    : 0;
  if (seedUserIds.length) {
    await prisma.reputationEvent.deleteMany({ where: { userId: { in: seedUserIds } } });
  }
  const reviews = await prisma.marketReview.deleteMany({ where: { isSeed: true } });
  const purchases = await prisma.marketPurchase.deleteMany({ where: { isSeed: true } });
  const listings = await prisma.marketListing.deleteMany({ where: { isSeed: true } });
  const users = await prisma.user.deleteMany({ where: { isSeed: true } });

  console.log('✓ removed', {
    users: users.count,
    listings: listings.count,
    purchases: purchases.count,
    reviews: reviews.count,
    reputationEvents: repBefore,
  });
}

main()
  .catch((e) => {
    console.error('✗ wipe failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
