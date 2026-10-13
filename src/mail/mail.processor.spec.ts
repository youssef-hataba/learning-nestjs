import { describe, it, expect, vi, beforeEach } from "vitest";
import { MailProcessor } from "./mail.processor.js";
import { JOB_SEND_WELCOME_EMAIL } from "./mail.constants.js";

describe("MailProcessor", () => {
    let processor: MailProcessor;
    let mockMailService: { sendWelcomeEmail: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockMailService = {
            sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
        };
        processor = new MailProcessor(mockMailService as any);
    });

    it("should process send-welcome-email job and invoke mailService.sendWelcomeEmail", async () => {
        const mockJob = {
            id: "1",
            name: JOB_SEND_WELCOME_EMAIL,
            data: {
                to: "joo@example.com",
                username: "joo",
            },
            attemptsMade: 0,
            opts: { attempts: 3 },
        };

        const result = await processor.process(mockJob as any);

        expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith("joo@example.com", "joo");
        expect(result).toEqual({ delivered: true, to: "joo@example.com" });
    });

    it("should handle unknown job gracefully", async () => {
        const mockJob = {
            id: "2",
            name: "unknown-job-type",
            data: {},
            attemptsMade: 0,
            opts: { attempts: 1 },
        };

        const result = await processor.process(mockJob as any);

        expect(mockMailService.sendWelcomeEmail).not.toHaveBeenCalled();
        expect(result).toEqual({ unhandled: true });
    });
});
