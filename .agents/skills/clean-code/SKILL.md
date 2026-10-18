---
name: clean-code
description: >-
  Standardized Clean Code and Component Decomposition Workflow for Next.js, React,
  and NestJS architectures. Use when building or refactoring UI pages to prevent
  monolithic page files, enforce single responsibility, modularize components,
  and extract data constants, types, and API logic.
---

# Clean Code & Component Decomposition Skill

This skill enforces high-standard software craftmanship, clean architecture, and modular component decomposition. It prevents monolithic anti-patterns (such as 700+ line `page.tsx` files) and ensures codebases remain maintainable, scalable, and delightful to read.

---

## 1. Core Principles

1. **Single Responsibility Principle (SRP):**
   - Each component, hook, or function must have one well-defined responsibility.
   - If a component handles data fetching, complex state, multiple distinct sections, and modal dialogs, it MUST be decomposed.

2. **The "Coordinator Page" Rule (No Monolithic Pages):**
   - Next.js page files (`app/**/page.tsx`) must strictly act as **coordinators / orchestrators**.
   - Maximum recommended length for a `page.tsx` file is **70-150 lines**.
   - A `page.tsx` should only:
     - Load/coordinate data and query params.
     - Hold top-level page state and event handlers.
     - Render clean, semantic feature sections as composable components.
   - Never embed hundreds of lines of inline SVG icons, raw static data arrays, complex modal markup, or lengthy form sections directly inside `page.tsx`.

3. **Separation of Concerns:**
   - **Data & Constants:** Extract fallback data, category lists, configuration options, and copy into `constants.ts`.
   - **Types & Interfaces:** Define all TypeScript models, DTOs, and enums in `types.ts`.
   - **Network Operations:** Keep all `fetch`/API calls inside dedicated `api.ts` service modules.
   - **UI Presentation:** Decompose UI sections into dedicated, testable components.

---

## 2. Directory Architecture for Next.js

When creating or refactoring features, follow this clean modular structure:

```
src/
├── app/
│   ├── page.tsx                     # Thin coordinator (~70 lines)
│   └── products/
│       └── [id]/
│           └── page.tsx             # Thin coordinator (~150 lines)
├── components/
│   ├── layout/                      # Global layout (Navbar, Footer)
│   ├── ui/                          # Primitive / Generic UI (Buttons, Modals, Toasts)
│   ├── home/                        # Feature-specific components for HomePage
│   │   ├── HeroSection.tsx
│   │   ├── TrendingSection.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CustomerReviews.tsx
│   │   └── BestO2Section.tsx
│   └── product/                     # Feature-specific components for Product Detail
│       ├── ProductBreadcrumbs.tsx
│       ├── ProductImageStage.tsx
│       ├── ProductBuyBox.tsx
│       ├── ProductCareMatrix.tsx
│       ├── ProductBenefits.tsx
│       ├── ProductReviewsSection.tsx
│       ├── ProductReviewModal.tsx
│       └── RelatedPlants.tsx
└── features/
    └── products/
        ├── types.ts                 # Botanical & Product TypeScript interfaces
        ├── constants.ts             # Fallback data, categories, testimonials
        └── api.ts                   # Fetchers and mutation helpers
```

---

## 3. Step-by-Step Refactoring Workflow

Whenever a component or page grows beyond 200 lines, execute this refactoring sequence:

### Step 1: Extract Static Data and Constants
- Identify inline objects, fallback lists, navigation tabs, filter arrays.
- Move them to `features/<feature>/constants.ts`.
- Export typed constants (`REAL_FALLBACK_PRODUCTS`, `CATEGORIES`, `TESTIMONIALS`).

### Step 2: Extract Reusable Cards & Sections
- Identify distinct visual regions (e.g. Hero, Catalog Grid, Review Section, Buy Box).
- Create a dedicated component for each in `components/<feature>/<ComponentName>.tsx`.
- Define clear TypeScript `Props` interfaces for each component.
- Keep child components pure whenever possible (accept props & callbacks).

### Step 3: Extract Modals & Complex Dialogs
- Any modal or popup must live in its own component (e.g. `ProductReviewModal.tsx`).
- Pass `isOpen`, `onClose`, and submission handlers as props.

### Step 4: Streamline the Coordinator Page
- Import the extracted components into `page.tsx`.
- Verify readability: any developer reading `page.tsx` should understand the whole layout in 30 seconds.

### Step 5: Validate Type Safety & Compilation
- Run `npx tsc --noEmit` to verify 100% clean typecheck.
- Verify in the browser that all user interactions, state flows, and responsiveness function identically.

---

## 4. Code Quality Checklist

Before finalizing any frontend task, verify:
- [ ] Is `page.tsx` under 150 lines?
- [ ] Are all types and interfaces declared in `types.ts`?
- [ ] Are raw mock/fallback arrays moved to `constants.ts`?
- [ ] Do all components have explicit `Props` interfaces?
- [ ] Are icons and repetitive SVGs isolated or encapsulated?
- [ ] Does `npx tsc --noEmit` pass with zero errors?
