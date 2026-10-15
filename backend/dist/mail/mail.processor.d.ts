import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MailService } from "./mail.service.js";
export declare class MailProcessor extends WorkerHost {
    private readonly mailService;
    private readonly logger;
    constructor(mailService: MailService);
    process(job: Job<any, any, string>): Promise<any>;
    onCompleted(job: Job): void;
    onFailed(job: Job, error: Error): void;
}
