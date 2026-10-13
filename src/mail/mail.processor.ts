import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { MAIL_QUEUE, JOB_SEND_WELCOME_EMAIL, type SendWelcomeEmailJobData } from "./mail.constants.js";
import { MailService } from "./mail.service.js";

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const attempt = job.attemptsMade + 1;
        const maxAttempts = job.opts.attempts ?? 1;
        this.logger.log(
            `[Queue: ${MAIL_QUEUE}] Processing job #${job.id} "${job.name}" (Attempt ${attempt}/${maxAttempts})`
        );

        switch (job.name) {
            case JOB_SEND_WELCOME_EMAIL: {
                const data = job.data as SendWelcomeEmailJobData;
                await this.mailService.sendWelcomeEmail(data.to, data.username);
                return { delivered: true, to: data.to };
            }

            default:
                this.logger.warn(`[Queue: ${MAIL_QUEUE}] Unhandled job name: "${job.name}"`);
                return { unhandled: true };
        }
    }

    @OnWorkerEvent("completed")
    onCompleted(job: Job): void {
        this.logger.log(`[Queue: ${MAIL_QUEUE}] Job #${job.id} "${job.name}" successfully completed.`);
    }

    @OnWorkerEvent("failed")
    onFailed(job: Job, error: Error): void {
        const attempt = job.attemptsMade;
        const maxAttempts = job.opts.attempts ?? 1;
        this.logger.error(
            `[Queue: ${MAIL_QUEUE}] Job #${job.id} "${job.name}" failed on attempt ${attempt}/${maxAttempts}: ${error.message}`
        );
    }
}
