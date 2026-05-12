import { createClient } from 'redis';
import crypto from 'crypto';

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);

export class CacheService {
  static async getPdf(data: any): Promise<Buffer | null> {
    const key = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const cached = await redis.get(key);
    return cached ? Buffer.from(cached, 'base64') : null;
  }

  static async setPdf(data: any, buffer: Buffer) {
    const key = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    await redis.set(key, buffer.toString('base64'), { EX: 3600 });
  }
}