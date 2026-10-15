import { ConfigService } from "@nestjs/config";
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly resend;
    private readonly defaultFrom;
    constructor(configService: ConfigService);
    private resolveTemplatePath;
    private renderTemplate;
    private sendEmail;
    sendWelcomeEmail(to: string, username: string): Promise<void>;
    sendVerificationCodeEmail(to: string, code: string): Promise<void>;
}
