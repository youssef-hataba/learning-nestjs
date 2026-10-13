export const MAIL_QUEUE = "mail";

export const JOB_SEND_WELCOME_EMAIL = "send-welcome-email";

export const EVENT_USER_REGISTERED = "user.registered";

export interface UserRegisteredEventPayload {
    userId: string;
    email: string;
    username: string;
}

export interface SendWelcomeEmailJobData {
    to: string;
    username: string;
}
