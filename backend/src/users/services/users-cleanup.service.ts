import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { User } from "../user.entity.js";

@Injectable()
export class UsersCleanupService {
    private readonly logger = new Logger(UsersCleanupService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    /**
     * Daily Cron Job running at midnight (00:00:00).
     * Permanently purges (hard-deletes) user accounts that have been soft-deleted
     * for more than 30 days.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleExpiredAccountCleanup(): Promise<void> {
        this.logger.log("Running scheduled purge of expired accounts (>30 days deleted)...");

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const expiredUsers = await this.usersRepository.find({
            withDeleted: true,
            where: {
                deletedAt: LessThan(thirtyDaysAgo),
            },
        });

        if (expiredUsers.length > 0) {
            await this.usersRepository.remove(expiredUsers);
            this.logger.log(`Successfully purged ${expiredUsers.length} user account(s) older than 30 days.`);
        } else {
            this.logger.log("No expired accounts found for cleanup today.");
        }
    }
}
