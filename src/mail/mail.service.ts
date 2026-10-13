import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import ejs from "ejs";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly resend: Resend;
    private readonly defaultFrom: string;

    constructor(private readonly configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>("RESEND_API_KEY"));
        this.defaultFrom = this.configService.get<string>("MAIL_FROM") ?? "Learning NestJS <onboarding@resend.dev>";
    }

    private resolveTemplatePath(templateName: string): string {
        const distPath = path.join(process.cwd(), "dist", "mail", "templates", `${templateName}.ejs`);
        if (fs.existsSync(distPath)) {
            return distPath;
        }

        const srcPath = path.join(process.cwd(), "src", "mail", "templates", `${templateName}.ejs`);
        if (fs.existsSync(srcPath)) {
            return srcPath;
        }

        throw new Error(`Email template "${templateName}.ejs" not found in dist or src folders.`);
    }

    private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
        const templatePath = this.resolveTemplatePath(templateName);
        return await ejs.renderFile(templatePath, data);
    }

    private async sendEmail(to: string, subject: string, templateName: string, context: Record<string, any>): Promise<void> {
        try {
            const html = await this.renderTemplate(templateName, context);

            const response = await this.resend.emails.send({
                from: this.defaultFrom,
                to,
                subject,
                html,
            });

            if (response.error) {
                this.logger.error(`Resend returned an error while sending to ${to}: ${response.error.message}`, response.error);
                throw new Error(`Resend Error: ${response.error.message}`);
            }

            this.logger.log(`Email successfully sent to ${to} (Message ID: ${response.data?.id})`);
        } catch (error: any) {
            this.logger.error(`Failed to send email to ${to}: ${error?.message ?? error}`, error?.stack);
            throw error;
        }
    }

    async sendWelcomeEmail(to: string, username: string): Promise<void> {
        await this.sendEmail(to, "Welcome to Our Platform! 🚀", "welcome", { username });
    }
}
