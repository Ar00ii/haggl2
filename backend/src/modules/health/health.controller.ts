import { Controller, Get } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

/**
 * Liveness + readiness probe for Render's health check. Returns 200
 * with "ok" when the process is up and both Postgres + Redis answer.
 * Render hits /api/v1/health every ~30s; if it fails N times in a row
 * the platform restarts the container.
 *
 * The prefix `api/v1` is applied globally in `main.ts`, so the route
 * actually exposed is `/api/v1/health`.
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get()
  async check() {
    const checks = {
      app: 'ok' as const,
      db: 'unknown' as 'ok' | 'down' | 'unknown',
      redis: 'unknown' as 'ok' | 'down' | 'unknown',
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.db = 'ok';
    } catch {
      checks.db = 'down';
    }

    try {
      await this.redis.getClient().ping();
      checks.redis = 'ok';
    } catch {
      checks.redis = 'down';
    }

    return {
      status: 'ok',
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
