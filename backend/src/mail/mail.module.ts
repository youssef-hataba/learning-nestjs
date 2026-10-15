import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MailService } from "./mail.service.js";
import { MailProcessor } from "./mail.processor.js";
import { UserRegisteredListener } from "./listeners/user-registered.listener.js";
import { MAIL_QUEUE } from "./mail.constants.js";

@Module({
    imports: [
        BullModule.registerQueue({
            name: MAIL_QUEUE,
        }),
    ],
    providers: [MailService, MailProcessor, UserRegisteredListener],
    exports: [MailService, BullModule],
})
export class MailModule {}
