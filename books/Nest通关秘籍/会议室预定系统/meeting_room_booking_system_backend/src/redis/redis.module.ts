import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
        });

        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
