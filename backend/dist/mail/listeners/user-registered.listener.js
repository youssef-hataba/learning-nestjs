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
var UserRegisteredListener_1;
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { MAIL_QUEUE, JOB_SEND_WELCOME_EMAIL, JOB_SEND_VERIFICATION_CODE, EVENT_USER_REGISTERED, EVENT_SEND_VERIFICATION_CODE, } from "../mail.constants.js";
let UserRegisteredListener = UserRegisteredListener_1 = class UserRegisteredListener {
    mailQueue;
    logger = new Logger(UserRegisteredListener_1.name);
    constructor(mailQueue) {
        this.mailQueue = mailQueue;
    }
    async handleUserRegisteredEvent(payload) {
        this.logger.log(`Received "${EVENT_USER_REGISTERED}" event for user: ${payload.username} (${payload.email}). Enqueuing welcome email job...`);
        const jobData = {
            to: payload.email,
            username: payload.username,
        };
        const job = await this.mailQueue.add(JOB_SEND_WELCOME_EMAIL, jobData, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: {
                age: 3600 * 24,
                count: 100,
            },
            removeOnFail: {
                count: 500,
            },
        });
        this.logger.log(`Enqueued job #${job.id} for "${JOB_SEND_WELCOME_EMAIL}" into queue "${MAIL_QUEUE}".`);
    }
    async handleSendVerificationCodeEvent(payload) {
        this.logger.log(`Received "${EVENT_SEND_VERIFICATION_CODE}" event for email: ${payload.email}. Enqueuing verification code email job...`);
        const jobData = {
            to: payload.email,
            code: payload.code,
        };
        const job = await this.mailQueue.add(JOB_SEND_VERIFICATION_CODE, jobData, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 3000,
            },
            removeOnComplete: {
                age: 3600 * 24,
                count: 100,
            },
            removeOnFail: {
                count: 500,
            },
        });
        this.logger.log(`Enqueued job #${job.id} for "${JOB_SEND_VERIFICATION_CODE}" into queue "${MAIL_QUEUE}".`);
    }
};
__decorate([
    OnEvent(EVENT_USER_REGISTERED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRegisteredListener.prototype, "handleUserRegisteredEvent", null);
__decorate([
    OnEvent(EVENT_SEND_VERIFICATION_CODE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRegisteredListener.prototype, "handleSendVerificationCodeEvent", null);
UserRegisteredListener = UserRegisteredListener_1 = __decorate([
    Injectable(),
    __param(0, InjectQueue(MAIL_QUEUE)),
    __metadata("design:paramtypes", [Queue])
], UserRegisteredListener);
export { UserRegisteredListener };
//# sourceMappingURL=user-registered.listener.js.map