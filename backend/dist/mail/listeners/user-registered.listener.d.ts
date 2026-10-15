import { Queue } from "bullmq";
import { type UserRegisteredEventPayload, type SendVerificationCodeEventPayload } from "../mail.constants.js";
export declare class UserRegisteredListener {
    private readonly mailQueue;
    private readonly logger;
    constructor(mailQueue: Queue);
    handleUserRegisteredEvent(payload: UserRegisteredEventPayload): Promise<void>;
    handleSendVerificationCodeEvent(payload: SendVerificationCodeEventPayload): Promise<void>;
}
