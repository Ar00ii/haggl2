/**
 * One-shot DB cleanup: remove every listing / repository / tag whose
 * title, description, or tag includes "bolty" (the pre-rebrand brand
 * name). Idempotent — safe to re-run.
 *
 * Usage (locally):
 *   cd backend
 *   npx ts-node scripts/wipe-bolty-listings.ts
 *
 * Usage (Render shell):
 *   render shell <service> -- npx ts-node scripts/wipe-bolty-listings.ts
 *
 * Outputs counts of rows removed per table. Does not touch the User
 * table — usernames containing "bolty" stay (those are people, not
 * brand artifacts).
 */
import { PrismaClient, Prisma } from '@prisma/client';

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    // ── Marketplace listings ─────────────────────────────────────────
    // Match title OR description OR tags array containing "bolty".
    const listingMatch: Prisma.MarketListingWhereInput = {
      OR: [
        { title: { contains: 'bolty', mode: 'insensitive' } },
        { description: { contains: 'bolty', mode: 'insensitive' } },
        { tags: { has: 'bolty' } },
      ],
    };
    const listingsToWipe = await prisma.marketListing.findMany({
      where: listingMatch,
      select: { id: true, title: true },
    });
    if (listingsToWipe.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`[wipe] removing ${listingsToWipe.length} listings:`);
      for (const l of listingsToWipe) {
        // eslint-disable-next-line no-console
        console.log(`  • ${l.title} (${l.id})`);
      }
      await prisma.marketListing.deleteMany({ where: listingMatch });
    }

    // ── Repositories ─────────────────────────────────────────────────
    const repoMatch: Prisma.RepositoryWhereInput = {
      OR: [
        { name: { contains: 'bolty', mode: 'insensitive' } },
        { fullName: { contains: 'bolty', mode: 'insensitive' } },
        { description: { contains: 'bolty', mode: 'insensitive' } },
        { topics: { has: 'bolty' } },
      ],
    };
    const reposToWipe = await prisma.repository.findMany({
      where: repoMatch,
      select: { id: true, name: true },
    });
    if (reposToWipe.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`[wipe] removing ${reposToWipe.length} repos:`);
      for (const r of reposToWipe) {
        // eslint-disable-next-line no-console
        console.log(`  • ${r.name} (${r.id})`);
      }
      await prisma.repository.deleteMany({ where: repoMatch });
    }

    if (listingsToWipe.length === 0 && reposToWipe.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[wipe] no bolty rows found — DB already clean.');
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `[wipe] done. removed ${listingsToWipe.length} listings + ${reposToWipe.length} repos.`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[wipe] failed:', err);
  process.exit(1);
});
