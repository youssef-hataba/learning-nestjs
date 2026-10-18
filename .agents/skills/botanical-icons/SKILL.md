---
name: botanical-icons
description: >-
  Design system, principles, and component generation workflow for custom, handcrafted
  botanical and biophilic SVG icons for Planto. Use when designing, creating, or refactoring
  UI icons to match the website's organic plant sanctuary identity without relying on generic
  third-party icon libraries.
---

# Botanical & Biophilic Icon Design System Skill

This skill governs the creation of custom, bespoke SVG icons tailored specifically for the Planto Botanical Sanctuary website. It ensures that every icon reflects the warmth, organic living lines, and biophilic nature of the brand instead of using sterile, generic third-party icons (such as generic Feather/Lucide).

---

## 1. Biophilic Design Philosophy & Visual Language

Every icon in Planto must feel like a living, natural organism or an artisan botanical tool.

### Core Visual Metaphors:
1. **Organic Curves & Soft Arcs:** Avoid rigid 90° boxy corners where possible; use gentle curves reminiscent of plant stems, leaf contours, and woven baskets.
2. **Sprout & Leaf Infusions:** Subtle botanical accents (leaf tips, veins, sprouted nodes, natural vines, or dew drops) embedded organically into traditional UI metaphors.
3. **Harmonious Botanical Color Palette:**
   - **Primary Foliage Green:** `#4e7349` (Sage Leaf)
   - **Deep Forest Dark:** `#203123` (Deep Earth / Charcoal Moss)
   - **Luminous Sprout / Lime:** `#6c9966` / `#A8C3A0`
   - **Warm Clay & Terracotta:** `#E8B4A0` / `#E9D5C9`
   - **Morning Dew Glow:** `rgba(168, 195, 160, 0.4)`

---

## 2. Technical Specifications for SVG Icons

All custom icons must adhere to strict SVG standards for crisp rendering and effortless React integration:

1. **ViewBox:** Standardized `0 0 24 24` viewBox for universal alignment with standard layout grids.
2. **Stroke Characteristics:**
   - `stroke="currentColor"` for dynamic text-color adaptation via Tailwind classes (`text-[#203123]`, `text-[var(--primary)]`).
   - `strokeWidth="1.8"` or `strokeWidth="2"` for balanced clarity and elegance.
   - `strokeLinecap="round"` and `strokeLinejoin="round"` on all path segments.
3. **Fill Rules:**
   - Default to line-art / outline (`fill="none"`).
   - Support optional dual-tone accents (`fill="currentColor" fillOpacity="0.15"` or accent leaf highlights).
4. **Accessibility:**
   - Always include `aria-hidden="true"` and `focusable="false"`.
   - Provide an optional `title` tag if the icon is standalone without accompanying text.

---

## 3. Directory Structure & TypeScript Component Pattern

All custom icons reside in:
`frontend/src/components/icons/`

```
frontend/src/components/icons/
├── types.ts                   # Universal icon interface & size presets
├── index.ts                   # Central barrel export
├── BotanicalCartIcon.tsx      # Artisan woven plant basket / harvest tote
├── SproutSearchIcon.tsx       # Magnifier blossoming with a sprout stem
├── DewdropHeartIcon.tsx       # Organic droplet-heart favorite icon
├── BiophilicUserIcon.tsx      # Natural profile silhouette
└── ...
```

### Standard Component Blueprint (`types.ts`):
```tsx
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}
```

### Standard Icon Component Template:
```tsx
import React from 'react';
import { IconProps } from './types';

export default function CustomBotanicalIcon({
  size = 24,
  strokeWidth = 1.8,
  className = '',
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block transition-transform duration-200 ${className}`}
      {...props}
    >
      {/* Botanical Paths & Accents */}
    </svg>
  );
}
```

---

## 4. Botanical Metaphors Catalog

When tasked with generating an icon, refer to these nature-aligned design mappings:

| Action / Concept | Standard Generic Icon | Botanical Sanctuary Metaphor |
| :--- | :--- | :--- |
| **Cart / Checkout** | Shopping trolley on wheels | **Artisan woven planter basket** or **harvest tote** with arching vine handles and living sprout detail. |
| **Search / Discover** | Plain magnifying glass | **Botanical loupe** with a subtle curled leaf node or sprouted handle. |
| **Favorites / Wishlist**| Cold geometric heart | **Morning dewdrop heart** with tender leaf fold. |
| **Filter / Sort** | Industrial funnel | **Terracotta seed sifter** or **cascading foliage layers**. |
| **Care / Sunlight** | Generic sun | **Nourishing morning sun** with gentle radiant botanical rays. |
| **Water / Humidity** | Simple drop | **Vital biophilic droplet** with delicate vein ripple. |
| **Account / Profile** | Robotic circle and bust | **Natural botanical gardener silhouette** with sprout crest. |
| **Air Quality (O2)** | Wind breeze lines | **Breathing oxygen leaf** releasing pure ozone bubbles. |

---

## 5. Workflow for Generating New Icons

1. **Conceptualize the Botanical Metaphor:** Connect the functional UI role to a natural flora or artisan gardening element.
2. **Craft Precise SVG Path Vectors:** Keep path data clean, minimal, and mathematically centered in the 24x24 frame.
3. **Create the Component:** Put the component in `frontend/src/components/icons/<IconName>.tsx`.
4. **Export in Index:** Add export to `frontend/src/components/icons/index.ts`.
5. **Integrate & Test:** Replace legacy icon instances in UI components and ensure hover states and accessibility are respected.
