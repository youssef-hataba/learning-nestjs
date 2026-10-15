var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersCleanupService_1;
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { User } from "./user.entity.js";
let UsersCleanupService = UsersCleanupService_1 = class UsersCleanupService {
    usersRepository;
    logger = new Logger(UsersCleanupService_1.name);
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async handleExpiredAccountCleanup() {
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
        }
        else {
            this.logger.log("No expired accounts found for cleanup today.");
        }
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersCleanupService.prototype, "handleExpiredAccountCleanup", null);
UsersCleanupService = UsersCleanupService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository])
], UsersCleanupService);
export { UsersCleanupService };
//# sourceMappingURL=users-cleanup.service.js.map