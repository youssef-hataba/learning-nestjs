# Backend Technical Documentation & Architecture Index

> **Repository:** Learning NestJS — E-Commerce & Sanctuary Platform  
> **Backend Framework:** NestJS 12 (TypeScript, Fastify/Express, TypeORM, PostgreSQL)  
> **Status:** Active / Production-Ready  

Welcome to the engineering documentation hub. This directory contains detailed architectural primers, implementation guides, line-by-line code breakdowns, and security protocols for the backend system.

---

## 📁 Directory Structure & Documentation Map

```text
backend/docs/
├── README.md                                          <-- Documentation Hub & Navigation Portal
│
├── auth/                                              <-- Authentication, Authorization & Security
│   ├── AUTH_AND_RBAC_GUIDE.md                         <-- JWT, Guards, RBAC & Roles
│   ├── EMAIL_VERIFICATION_PRE_REGISTRATION_GUIDE.md   <-- Pre-registration OTP & Redis Verification
│   ├── GOOGLE_OAUTH_ARCHITECTURE_AND_CONCEPTS.md      <-- OAuth 2.0 / OIDC Concepts & Flows (Part 1)
│   ├── GOOGLE_OAUTH_FULLSTACK_IMPLEMENTATION_GUIDE.md <-- Google Auth Full-Stack Code Guide (Part 2)
│   └── SELF_SERVICE_VS_ADMIN_ARCHITECTURE.md          <-- Self-Service (/me) vs Admin Boundaries
│
├── messaging-and-queues/                              <-- Queues, Redis & Email Notifications
│   ├── REDIS_BULLMQ_AND_EVENT_DRIVEN_CONCEPTS.md      <-- Redis & BullMQ Conceptual Guide
│   ├── EMAIL_NOTIFICATION_SYSTEM_V2_GUIDE.md          <-- V2 Event-Driven Queue & Resend Email Guide
│   └── EMAIL_NOTIFICATION_SYSTEM_GUIDE.md             <-- V1 Direct Async Email Guide (Legacy/Evolution)
│
├── scheduled-tasks/                                   <-- Cron Jobs & Database Maintenance
│   └── CRON_JOB_AND_CLEANUP_GUIDE.md                  <-- Automated Account Cleanup & Soft Deletes
│
└── architecture/                                      <-- Cross-Cutting NestJS Architectural Patterns
    └── INTERCEPTORS_GUIDE.md                          <-- NestJS Interceptors & Response Transformation
```

---

## 🧭 Topic Summaries & Quick Links

### 1. 🔐 Authentication & Identity Management (`docs/auth/`)

| Document | Focus | Key Topics |
| :--- | :--- | :--- |
| **[AUTH_AND_RBAC_GUIDE.md](./auth/AUTH_AND_RBAC_GUIDE.md)** | Core Security & RBAC | JWT payload extraction, `AuthGuard`, `RolesGuard`, `@Roles()` decorator, UserType enum. |
| **[EMAIL_VERIFICATION_PRE_REGISTRATION_GUIDE.md](./auth/EMAIL_VERIFICATION_PRE_REGISTRATION_GUIDE.md)** | Pre-Registration Security | Two-step registration, 6-digit OTP generation, Redis token storage, single-use verification tokens. |
| **[GOOGLE_OAUTH_ARCHITECTURE_AND_CONCEPTS.md](./auth/GOOGLE_OAUTH_ARCHITECTURE_AND_CONCEPTS.md)** | Social Auth Primer (Part 1) | OAuth 2.0 vs OIDC, Authorization Code Flow, Mermaid sequence diagram, smart account linking. |
| **[GOOGLE_OAUTH_FULLSTACK_IMPLEMENTATION_GUIDE.md](./auth/GOOGLE_OAUTH_FULLSTACK_IMPLEMENTATION_GUIDE.md)** | Social Auth Code Guide (Part 2) | Line-by-line code explanation of NestJS backend + Next.js 16 frontend callback handling. |
| **[SELF_SERVICE_VS_ADMIN_ARCHITECTURE.md](./auth/SELF_SERVICE_VS_ADMIN_ARCHITECTURE.md)** | API Boundary Design | Domain isolation: `/me` self-service endpoints vs administrative `/users/:id` privilege controls. |

---

### 2. 📨 Messaging, Queues & Email System (`docs/messaging-and-queues/`)

| Document | Focus | Key Topics |
| :--- | :--- | :--- |
| **[REDIS_BULLMQ_AND_EVENT_DRIVEN_CONCEPTS.md](./messaging-and-queues/REDIS_BULLMQ_AND_EVENT_DRIVEN_CONCEPTS.md)** | Conceptual Primer | Why queues matter, Redis RAM architecture, BullMQ terminology, producers vs workers, backoff retries. |
| **[EMAIL_NOTIFICATION_SYSTEM_V2_GUIDE.md](./messaging-and-queues/EMAIL_NOTIFICATION_SYSTEM_V2_GUIDE.md)** | Production Architecture | Event-driven architecture with `EventEmitter2`, BullMQ worker, Resend API, EJS HTML templates. |
| **[EMAIL_NOTIFICATION_SYSTEM_GUIDE.md](./messaging-and-queues/EMAIL_NOTIFICATION_SYSTEM_GUIDE.md)** | Architectural Evolution | Initial V1 fire-and-forget implementation, why it was upgraded to V2 event-driven queues. |

---

### 3. ⏱️ Scheduled Tasks & Automated Cleanup (`docs/scheduled-tasks/`)

| Document | Focus | Key Topics |
| :--- | :--- | :--- |
| **[CRON_JOB_AND_CLEANUP_GUIDE.md](./scheduled-tasks/CRON_JOB_AND_CLEANUP_GUIDE.md)** | Lifecycle & Cron | NestJS `ScheduleModule`, cron patterns, 30-day soft-delete grace period, permanent purge jobs. |

---

### 4. 🏛️ Architecture & Cross-Cutting Concerns (`docs/architecture/`)

| Document | Focus | Key Topics |
| :--- | :--- | :--- |
| **[INTERCEPTORS_GUIDE.md](./architecture/INTERCEPTORS_GUIDE.md)** | Cross-Cutting Concerns | NestJS Interceptors lifecycle, request logging, response payload formatting, RxJS operators. |

---

## 🛠️ Contributing to Documentation

When documenting new features or refactoring existing modules:
1. **Conceptual Primer:** If introducing a new paradigm (e.g., WebSockets, Caching, Payment Gateways), create a high-level conceptual primer with analogies and diagrams.
2. **Implementation Guide:** Provide an exhaustive line-by-line code walkthrough explaining syntax, decorator logic, error handling, and security decisions.
3. **Keep Index Updated:** Add the new document link and summary to this `README.md`.
