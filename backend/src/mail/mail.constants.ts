export const MAIL_QUEUE = "mail";

export const JOB_SEND_WELCOME_EMAIL = "send-welcome-email";
export const JOB_SEND_VERIFICATION_CODE = "send-verification-code";

export const EVENT_USER_REGISTERED = "user.registered";
export const EVENT_SEND_VERIFICATION_CODE = "email.verification.code.send";

export interface UserRegisteredEventPayload {
    userId: string;
    email: string;
    username: string;
}

export interface SendWelcomeEmailJobData {
    to: string;
    username: string;
}

export interface SendVerificationCodeEventPayload {
    email: string;
    code: string;
}

export interface SendVerificationCodeJobData {
    to: string;
    code: string;
}
