import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRegisteredListener } from "./user-registered.listener.js";
import {
    JOB_SEND_WELCOME_EMAIL,
    type UserRegisteredEventPayload,
} from "../mail.constants.js";

describe("UserRegisteredListener", () => {
    let listener: UserRegisteredListener;
    let mockQueue: { add: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockQueue = {
            add: vi.fn().mockResolvedValue({ id: "job-123" }),
        };
        listener = new UserRegisteredListener(mockQueue as any);
    });

    it("should enqueue a welcome email job with retry options when user.registered is emitted", async () => {
        const payload: UserRegisteredEventPayload = {
            userId: "user-1",
            email: "test@example.com",
            username: "joo",
        };

        await listener.handleUserRegisteredEvent(payload);

        expect(mockQueue.add).toHaveBeenCalledTimes(1);
        expect(mockQueue.add).toHaveBeenCalledWith(
            JOB_SEND_WELCOME_EMAIL,
            {
                to: "test@example.com",
                username: "joo",
            },
            expect.objectContaining({
                attempts: 3,
                backoff: expect.objectContaining({
                    type: "exponential",
                    delay: 5000,
                }),
            })
        );
    });

    it("should enqueue a verification code email job with retry options when email.verification.code.send is emitted", async () => {
        const payload = {
            email: "verify@example.com",
            code: "654321",
        };

        await listener.handleSendVerificationCodeEvent(payload);

        expect(mockQueue.add).toHaveBeenCalledTimes(1);
        expect(mockQueue.add).toHaveBeenCalledWith(
            "send-verification-code",
            {
                to: "verify@example.com",
                code: "654321",
            },
            expect.objectContaining({
                attempts: 3,
                backoff: expect.objectContaining({
                    type: "exponential",
                    delay: 3000,
                }),
            })
        );
    });
});
