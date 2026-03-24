# Magazine Homepage Redesign — Design Spec

## Overview

Redesign the Zidni blog homepage from a simple paginated post list to a full magazine-style layout inspired by the Astra Tech News theme. The implementation modifies the existing homepage and adds new components while preserving the rest of the site.

**Framework:** Astro 6 + Tailwind CSS 4
**Approach:** Modify existing `index.astro` + add new components (Approach A — additive, minimal disruption)
**Direction:** RTL Arabic, Cairo font, existing Zidni teal brand palette
**Scope note:** The footer redesign (Section 6) is intentionally a **site-wide change** since `Footer.astro` is shared via `Base.astro` across all pages. This is acceptable — the rich footer improves the entire site.

## Color Palette (unchanged)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#01AD9F` | Accent, CTAs, category badges, active states |
| Dark | `#152035` | Header, footer, hero overlay, headings |
| Background | `#f8f9fa` | Page background for grid sections |
| Card BG | `#ffffff` | Card surfaces, sidebar widgets |
| Border | `#eee` | Card and widget borders |
| Muted text | `#999` | Dates, meta info |
| Body text | `#444` | Descriptions, sidebar text |

## Homepage Sections (top to bottom)

### 1. Header (existing — no changes)

Keep the current dark header with logo, navigation menu, search icon, and mobile hamburger. No modifications needed.

### 2. Hero — Featured Post

- **Component:** `src/layouts/components/HeroPost.astro`
- **Data:** Always the most recent published post (sorted by date descending). No `featured` frontmatter field — keep it simple.
- **Layout:** Full-width, 400px height on desktop, 300px tablet, 250px on mobile
- **Visual:** Post cover image as background using `<img>` tag (not Astro `<Image>` — all post images are SVGs). Dark gradient overlay from bottom (`rgba(21,32,53,0.95)` at bottom to `rgba(21,32,53,0.2)` at top).
- **No-image fallback:** If the post has no `image`, use a solid dark gradient background (`#152035` to `#1a3a4a`). The component still renders — just without a background image.
- **Content over image:**
  - Category badge (top-right): teal background (`#01AD9F`) + white text, pill shape
  - Title (bottom): white, `text-2xl` on mobile / `text-3xl` on desktop, font-weight 700
  - Meta line: author + date + reading time, white at 60% opacity
- **Click:** Entire hero is an `<a>` linking to the post
- **Mobile:** Reduce height to 250px, title becomes `text-xl`

### 3. Latest Posts Grid

- **Section heading:** `<h2>` — "أحدث المقالات", bold, dark color. All section headings in the page follow this pattern: `<h2>` with `text-xl font-bold text-dark`.
- **Layout:** 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- **Cards:** Reuse/adapt existing `Posts.astro` component with image-top style
  - Cover image: `<img>` tag, `aspect-ratio: 16/10`, `object-contain` with light background (preserves SVG illustrations), rounded top corners
  - Category badge overlaying image (top-right): **teal background + white text** pill (change from current white badge style)
  - Title below image (font-weight 700, dark color)
  - Meta: author + date
- **Count:** Show 3 posts (posts `[1..3]`, skipping the hero post `[0]`)
- **Background:** Light gray (`#f8f9fa`) section with `py-12 px-4`

### 4. More Posts + Sidebar

- **Layout:** 2-column grid — main content (`2fr`) + sidebar (`1fr`). On mobile: sidebar stacks below posts.
- **Main column:**
  - Section heading: `<h2>` — "المزيد من المقالات"
  - Post cards: Same image-top card style as the grid above, displayed in a single column
  - Count: Posts `[4..9]` — the next 6 posts after the grid. This count is hardcoded in `index.astro` only and does **not** change `config.settings.pagination` (which remains 5 for `/page/[slug]` routes).
  - **No pagination on homepage.** Instead, show a "عرض جميع المقالات" (View All Posts) link/button at the bottom that goes to `/page/2` (the first paginated page — since the old `index.astro` was page 1, `/page/[slug].astro` generates routes starting from `/page/2`). The existing `/page/[slug].astro` routes continue to work unchanged with their simple list layout.
- **Sidebar column** — composed by `Sidebar.astro` wrapper component:

#### Sidebar.astro Wrapper
- **Component:** `src/layouts/components/Sidebar.astro`
- **Purpose:** Imports and renders the 3 widgets in order. Handles sticky positioning on desktop (`position: sticky; top: 80px`) and responsive stacking on mobile.
- **Props:** Accepts `posts` and `categories` data to pass down to child widgets.

#### 4a. Categories Widget
- **Component:** `src/layouts/components/sidebar/CategoriesWidget.astro`
- **Data:** Dynamically collected from all posts using `getCollection('posts')`, grouped and counted
- **Layout:** White card with border, heading with teal bottom border accent
- **Items:** Category name + post count badge (gray pill), one per row
- **Click:** Each category links to `/categories/{slug}`

#### 4b. Recent Posts Widget
- **Component:** `src/layouts/components/sidebar/RecentPostsWidget.astro`
- **Data:** 4 most recent posts **excluding those already shown on the page** (i.e., posts `[10..13]` or the next 4 after the "More Posts" section). If fewer than 4 remain, show whatever is available.
- **Layout:** White card, each item = small thumbnail (40x40, rounded) + title
- **Click:** Each links to the post

#### 4c. Services CTA Widget
- **Component:** `src/layouts/components/sidebar/ServicesCTA.astro`
- **Data:** Static/hardcoded content
- **Layout:** Teal gradient card (`linear-gradient(135deg, #01AD9F, #0d8a7f)`), white text, centered
  - Heading: "تحتاج مساعدة؟"
  - Description: brief services pitch
  - Button: white pill
- **Click:** Button links to `/graduation-projects-service` (the primary service page that exists in the site)

### 5. Newsletter CTA Banner

- **Component:** `src/layouts/components/NewsletterCTA.astro`
- **Layout:** Full-width teal gradient section, centered content
- **Content:**
  - Heading: "اشترك في نشرتنا البريدية" (white, bold)
  - Subtitle: brief value proposition (white, 80% opacity)
  - Email input + subscribe button in a pill-shaped container
- **Form behavior:** Static HTML `<form>` with `action="#"` and `method="POST"`. The form does nothing on submit for now — future integration will hook into a mailing list service.
  - Input: `<input type="email" required aria-label="البريد الإلكتروني" placeholder="بريدك الإلكتروني">`
  - Button: `<button type="submit">اشترك</button>`
  - Add `data-newsletter-form` attribute on the `<form>` for future JS hookup
- **Mobile:** Stack input and button vertically

### 6. Rich Footer (site-wide change)

- **Component:** Modify existing `src/layouts/partials/Footer.astro`
- **Impact:** This changes the footer on **all pages** (not just homepage) since `Footer.astro` is included via `Base.astro`. This is intentional — the rich footer improves the whole site.
- **Structure (2 parts — newsletter CTA is a separate component placed before the footer in the page layout):**

#### 6a. Main Footer
- Dark background (`#152035`)
- 3-column grid (RTL): About (1.5fr) | Quick Links (1fr) | Services (1fr)
- About column: Logo/brand name + description paragraph
- Quick Links: المقالات, التصنيفات, من نحن, تواصل معنا
- Services: مشاريع تخرج, واجبات جامعية, ترجمة أكاديمية
- Mobile: Stack to single column

#### 6b. Copyright Bar
- Darker background (`#0e1726`)
- Centered copyright text
- Keep existing social icons if present

## New Files

| File | Type | Purpose |
|------|------|---------|
| `src/layouts/components/HeroPost.astro` | Component | Featured post hero with image overlay |
| `src/layouts/components/NewsletterCTA.astro` | Component | Email signup banner |
| `src/layouts/components/Sidebar.astro` | Component | Sidebar wrapper — imports 3 widgets, handles sticky positioning and responsive layout |
| `src/layouts/components/sidebar/CategoriesWidget.astro` | Component | Categories list with counts |
| `src/layouts/components/sidebar/RecentPostsWidget.astro` | Component | Recent posts with thumbnails (excludes posts already shown on page) |
| `src/layouts/components/sidebar/ServicesCTA.astro` | Component | Services promotion card |

## Modified Files

| File | Changes |
|------|---------|
| `src/pages/index.astro` | Rewrite to compose: HeroPost + 3-col grid + Posts with Sidebar + NewsletterCTA. Preserve existing JSON-LD structured data (`organizationSchema`, `webSiteSchema`). |
| `src/layouts/partials/Footer.astro` | Replace with rich 3-column footer + copyright bar (site-wide change) |
| `src/layouts/components/Posts.astro` | Restyle category badge from white bg + dark text to **teal bg + white text** pill. Keep existing hover transition effects (`group-hover:scale-[1.03] transition duration-500`). Use `object-contain` (not `object-cover`) to preserve SVG illustrations. |

## Responsive Breakpoints

| Breakpoint | Grid columns | Sidebar | Hero height |
|------------|-------------|---------|-------------|
| Desktop (≥1024px) | 3-col grid, 2fr+1fr posts+sidebar | Visible, sticky | 400px |
| Tablet (768–1023px) | 2-col grid, full-width posts | Below posts | 300px |
| Mobile (<768px) | 1-col everything | Below posts | 250px |

## Data Flow

All data comes from Astro content collections — no new data sources needed. Uses `<img>` tags for all post images (not Astro `<Image>`) since all post images are SVGs.

```
getCollection('posts') → filter drafts → sort by date desc
  ├── [0]      → HeroPost (latest post)
  ├── [1..3]   → 3-col Latest Posts grid
  ├── [4..9]   → More Posts column (main content)
  ├── [10..13] → RecentPostsWidget (sidebar — no overlap with visible posts)
  └── all      → CategoriesWidget (grouped + counted)
```

**Pagination:** The homepage does **not** paginate. It shows a fixed set of posts (1 hero + 3 grid + 6 more = 10) with a "عرض جميع المقالات" link to `/page/2`. The existing `/page/[slug].astro` pagination routes remain unchanged with `config.settings.pagination = 5`.

## Out of Scope

- Newsletter form backend integration (static form only)
- Header changes
- Individual post page layout changes (note: footer change is site-wide and intentional)
- Dark mode
- New content/posts
- Mailing list service setup
- `featured` frontmatter field (always use latest post for hero)
- Changes to `/page/[slug].astro` pagination routes
