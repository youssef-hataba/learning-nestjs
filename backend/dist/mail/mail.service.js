var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import ejs from "ejs";
import * as path from "path";
import * as fs from "fs";
let MailService = MailService_1 = class MailService {
    configService;
    logger = new Logger(MailService_1.name);
    resend;
    defaultFrom;
    constructor(configService) {
        this.configService = configService;
        this.resend = new Resend(this.configService.get("RESEND_API_KEY"));
        this.defaultFrom = this.configService.get("MAIL_FROM") ?? "Learning NestJS <onboarding@resend.dev>";
    }
    resolveTemplatePath(templateName) {
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
    async renderTemplate(templateName, data) {
        const templatePath = this.resolveTemplatePath(templateName);
        return await ejs.renderFile(templatePath, data);
    }
    async sendEmail(to, subject, templateName, context) {
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
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error?.message ?? error}`, error?.stack);
            throw error;
        }
    }
    async sendWelcomeEmail(to, username) {
        await this.sendEmail(to, "Welcome to Our Platform! 🚀", "welcome", { username });
    }
    async sendVerificationCodeEmail(to, code) {
        await this.sendEmail(to, "Verify Your Email Address 🔐", "verify-email", { code });
    }
};
MailService = MailService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], MailService);
export { MailService };
//# sourceMappingURL=mail.service.js.map