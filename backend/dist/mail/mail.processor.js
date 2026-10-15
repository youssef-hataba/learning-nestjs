var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailProcessor_1;
import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { MAIL_QUEUE, JOB_SEND_WELCOME_EMAIL, JOB_SEND_VERIFICATION_CODE, } from "./mail.constants.js";
import { MailService } from "./mail.service.js";
let MailProcessor = MailProcessor_1 = class MailProcessor extends WorkerHost {
    mailService;
    logger = new Logger(MailProcessor_1.name);
    constructor(mailService) {
        super();
        this.mailService = mailService;
    }
    async process(job) {
        const attempt = job.attemptsMade + 1;
        const maxAttempts = job.opts.attempts ?? 1;
        this.logger.log(`[Queue: ${MAIL_QUEUE}] Processing job #${job.id} "${job.name}" (Attempt ${attempt}/${maxAttempts})`);
        switch (job.name) {
            case JOB_SEND_WELCOME_EMAIL: {
                const data = job.data;
                await this.mailService.sendWelcomeEmail(data.to, data.username);
                return { delivered: true, to: data.to };
            }
            case JOB_SEND_VERIFICATION_CODE: {
                const data = job.data;
                await this.mailService.sendVerificationCodeEmail(data.to, data.code);
                return { delivered: true, to: data.to };
            }
            default:
                this.logger.warn(`[Queue: ${MAIL_QUEUE}] Unhandled job name: "${job.name}"`);
                return { unhandled: true };
        }
    }
    onCompleted(job) {
        this.logger.log(`[Queue: ${MAIL_QUEUE}] Job #${job.id} "${job.name}" successfully completed.`);
    }
    onFailed(job, error) {
        const attempt = job.attemptsMade;
        const maxAttempts = job.opts.attempts ?? 1;
        this.logger.error(`[Queue: ${MAIL_QUEUE}] Job #${job.id} "${job.name}" failed on attempt ${attempt}/${maxAttempts}: ${error.message}`);
    }
};
__decorate([
    OnWorkerEvent("completed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Job]),
    __metadata("design:returntype", void 0)
], MailProcessor.prototype, "onCompleted", null);
__decorate([
    OnWorkerEvent("failed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Job, Error]),
    __metadata("design:returntype", void 0)
], MailProcessor.prototype, "onFailed", null);
MailProcessor = MailProcessor_1 = __decorate([
    Processor(MAIL_QUEUE),
    __metadata("design:paramtypes", [MailService])
], MailProcessor);
export { MailProcessor };
//# sourceMappingURL=mail.processor.js.map