import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        const host = this.configService.get<string>("REDIS_HOST", "localhost");
        const port = Number(this.configService.get<number>("REDIS_PORT", 6379));

        this.client = new Redis({
            host,
            port,
            maxRetriesPerRequest: 3,
        });

        this.client.on("connect", () => {
            this.logger.log(`Connected to Redis at ${host}:${port}`);
        });

        this.client.on("error", (err) => {
            this.logger.error(`Redis connection error: ${err.message}`, err.stack);
        });
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds && ttlSeconds > 0) {
            await this.client.set(key, value, "EX", ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    onModuleDestroy(): void {
        if (this.client) {
            this.client.disconnect();
            this.logger.log("Redis client disconnected");
        }
    }
}
