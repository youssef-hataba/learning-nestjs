import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import {
    MAIL_QUEUE,
    JOB_SEND_WELCOME_EMAIL,
    JOB_SEND_VERIFICATION_CODE,
    EVENT_USER_REGISTERED,
    EVENT_SEND_VERIFICATION_CODE,
    type UserRegisteredEventPayload,
    type SendWelcomeEmailJobData,
    type SendVerificationCodeEventPayload,
    type SendVerificationCodeJobData,
} from "../mail.constants.js";

@Injectable()
export class UserRegisteredListener {
    private readonly logger = new Logger(UserRegisteredListener.name);

    constructor(
        @InjectQueue(MAIL_QUEUE)
        private readonly mailQueue: Queue
    ) {}

    @OnEvent(EVENT_USER_REGISTERED)
    async handleUserRegisteredEvent(payload: UserRegisteredEventPayload): Promise<void> {
        this.logger.log(
            `Received "${EVENT_USER_REGISTERED}" event for user: ${payload.username} (${payload.email}). Enqueuing welcome email job...`
        );

        const jobData: SendWelcomeEmailJobData = {
            to: payload.email,
            username: payload.username,
        };

        const job = await this.mailQueue.add(JOB_SEND_WELCOME_EMAIL, jobData, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000, // 5s -> 10s -> 20s
            },
            removeOnComplete: {
                age: 3600 * 24, // Keep completed jobs for 24h
                count: 100,     // Or last 100 completed
            },
            removeOnFail: {
                count: 500,     // Retain up to 500 failed jobs for debugging
            },
        });

        this.logger.log(`Enqueued job #${job.id} for "${JOB_SEND_WELCOME_EMAIL}" into queue "${MAIL_QUEUE}".`);
    }

    @OnEvent(EVENT_SEND_VERIFICATION_CODE)
    async handleSendVerificationCodeEvent(payload: SendVerificationCodeEventPayload): Promise<void> {
        this.logger.log(
            `Received "${EVENT_SEND_VERIFICATION_CODE}" event for email: ${payload.email}. Enqueuing verification code email job...`
        );

        const jobData: SendVerificationCodeJobData = {
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
}
