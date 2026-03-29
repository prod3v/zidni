## Responsive Audit Report — Zidni (Arabic RTL Astro Blog)

**Audit date:** 2026-03-23
**Auditor:** Automated static analysis (checks 1, 2, 3, 5, 6 — visual check 4 skipped)
**Stack:** Astro 6 + Tailwind CSS v4 + React + MDX, Arabic RTL

---

### Critical (layout broken on mobile)

- [ ] `src/styles/components.css:110` — **Tables use `overflow-hidden` instead of `overflow-x: auto`**. The prose table style applies `prose-table:overflow-hidden` which silently clips table columns on narrow viewports. With 28 MDX articles containing Markdown tables, any table wider than the viewport will lose columns with no way for users to scroll. **Fix:** Replace `prose-table:overflow-hidden` with an `overflow-x: auto` wrapper, or change to `prose-table:overflow-x-auto`.

- [ ] `src/tailwind-plugin/tw-bs-grid.mjs:32` — **Bootstrap grid plugin sets `flexShrink: 0` on all `.row > *` children without `minWidth: 0`**. Line 32 sets `flexShrink: 0` on every grid column child. When a flex child cannot shrink and contains wide content (code blocks, tables), the flex parent expands beyond the viewport causing horizontal scroll. This is one of the most common root causes of overflow on mobile. **Fix:** Add `minWidth: 0` alongside `flexShrink: 0` in the `"& > *"` rule at line 31.

- [ ] `src/tailwind-plugin/tw-bs-grid.mjs:28-29,35-36,70` — **Grid plugin uses physical CSS properties (`marginLeft`, `marginRight`, `paddingLeft`, `paddingRight`, `marginLeft` for offsets)**. On an RTL site, these physical properties cause incorrect spacing — margins and paddings are applied to the wrong side. The `.row` gutter uses `marginRight`/`marginLeft` and `paddingRight`/`paddingLeft` instead of `marginInlineStart`/`marginInlineEnd` and `paddingInlineStart`/`paddingInlineEnd`. The `.offset-*` classes use `marginLeft` instead of `marginInlineStart`. **Fix:** Replace all physical margin/padding properties with logical equivalents (`marginInlineStart`, `marginInlineEnd`, `paddingInlineStart`, `paddingInlineEnd`).

### Major (usable but poor experience)

- [ ] `src/pages/contact.astro:33,36,40,45,50,53` — **Contact page uses physical RTL-incompatible Tailwind classes**. Uses `mr-3` (3 instances on icons) and `pl-8` (3 instances on text) which produce `margin-right` and `padding-left` in CSS — the wrong sides for RTL layout. Icons will have spacing on the wrong side; text indentation will be on the wrong side. **Fix:** Replace `mr-3` with `me-3` and `pl-8` with `ps-8`.

- [ ] `src/pages/categories/index.astro:15` — **Categories page uses `space-x-4`** which generates physical `margin-left` spacing between items. In RTL, this pushes items the wrong direction. **Fix:** Replace with `space-x-4 rtl:space-x-reverse` or switch to `gap-4` with flex.

- [ ] `src/pages/categories/index.astro:23` — Uses `mr-1` on category icon. **Fix:** Replace with `me-1`.

- [ ] `src/pages/tags/index.astro:15` — **Tags page uses `space-x-4`**, same RTL issue as categories. **Fix:** Replace with `gap-4` on a flex container or add `rtl:space-x-reverse`.

- [ ] `src/pages/tags/index.astro:23` — Uses `mr-1` on tag icon. **Fix:** Replace with `me-1`.

- [ ] `src/pages/authors/[single].astro:71,72,75,76,83` — **Author single page uses `mr-4`, `mr-1`, `mr-2`** (physical margin-right) on multiple elements: date items, category items, and category links. All should use `me-*` equivalents.

- [ ] `src/layouts/partials/Footer.astro:12` — **Footer menu uses `space-x-4`** which is RTL-incompatible. **Fix:** Replace with `gap-4` or add `rtl:space-x-reverse`.

- [ ] `src/styles/components.css:40` — **`.social-icons` uses `space-x-4`** (physical spacing). **Fix:** Replace with `space-x-4 rtl:space-x-reverse` or use `gap-4`.

- [ ] `src/styles/components.css:53` — **`.social-icons-simple` uses `space-x-2`** (physical spacing). Same fix needed.

- [ ] `src/styles/components.css:66` — **`.social-share` uses `space-x-1`** (physical spacing). Same fix needed.

- [ ] `src/layouts/components/Pagination.astro:16` — **Pagination uses `space-x-2`** (physical spacing). Pagination items will have spacing on the wrong side in RTL. **Fix:** Use `gap-2` or add `rtl:space-x-reverse`.

- [ ] `src/layouts/shortcodes/Video.tsx:15` — **Video shortcode has fixed `width={500}`**. The `<video>` element gets a hardcoded `width=500` attribute. While `max-width: 100%` from CSS may save it, there is no explicit responsive handling. The video could overflow its container on screens narrower than 500px if the parent doesn't constrain it. **Fix:** Add `className="max-w-full"` or `style={{ maxWidth: '100%' }}` to the video element.

- [ ] `src/layouts/shortcodes/Youtube.tsx` — **YouTube embed (lite-youtube) lacks explicit responsive width handling**. The `lite-youtube` web component may not automatically be responsive. No `width: 100%` or responsive wrapper is applied. **Fix:** Wrap in a responsive container or add `style={{ width: '100%' }}`.

### Minor (cosmetic issues)

- [ ] `src/pages/contact.astro:29,34,41,51,64,65,75,86,90,96` — **Contact page has untranslated English text**: "Contact Info", "Address", "Email", "Phone", "Name", "Email", "Subject", "Message", "Submit Now". This is an Arabic site; these labels should be in Arabic for consistency.

- [ ] `src/pages/categories/index.astro:14`, `src/pages/tags/index.astro:14` — **Page headings are in English** ("Categories", "Tags") on an Arabic blog.

- [ ] `src/pages/categories/[category].astro:32`, `src/pages/tags/[tag].astro:32` — **"Showing Posts From"** text is in English.

- [ ] `src/pages/authors/[single].astro:50` — **"Recent Posts"** heading is in English.

- [ ] `src/pages/404.astro:9-13` — **404 page text is in English**: "Error 404", "Page Not Found", "Back to home".

- [ ] `src/layouts/helpers/SearchBar.tsx:69,78,83,85` — **Search placeholder and result text in English**: "Type here to Search posts", "result"/"results".

- [ ] `src/layouts/components/Pagination.astro:36-37,99-100` — **Pagination arrow SVGs may need flipping for RTL**. The previous/next chevron arrows point left/right based on LTR conventions. In RTL, "previous" should point right and "next" should point left. Consider using `transform: scaleX(-1)` or swapping the SVG paths.

- [ ] `src/styles/components.css:162-163` — **Tab navigation item has `px-8` padding** which could cause horizontal overflow on very small screens (320px) if there are many tabs. Consider reducing to `px-4` on mobile.

- [ ] `src/components/blog/RelatedSidebar.astro:27` — **Related sidebar image thumbnail uses `shrink-0`** (equivalent to `flex-shrink: 0`) which is fine here since the image has a fixed 80px width, but combined with the grid plugin's `flexShrink: 0`, nested flex layouts could compound overflow issues.

---

### Passed Checks

- **Viewport meta tag:** PASS — Present in `src/layouts/Base.astro:74-77` with `width=device-width, initial-scale=1, maximum-scale=5`
- **HTML lang and dir:** PASS — `<html lang="ar" dir="rtl">` correctly set in `src/layouts/Base.astro:38`
- **Code block LTR direction:** PASS — `direction: ltr; text-align: left;` applied to `pre, pre code` in `src/styles/components.css:103-107`
- **Fixed widths (500px+):** PASS — No CSS rules with fixed widths >= 500px found in stylesheets
- **Dangerous `overflow: hidden` on body/html:** PASS — No `overflow: hidden` on body or html elements
- **`white-space: nowrap`:** PASS — No `nowrap` declarations found in CSS
- **Font sizes in px:** PASS — No `font-size: Npx` in CSS files; font sizes use `rem` via Tailwind theme plugin
- **Images responsive:** PASS — All `<Image>` components use `w-full` class; base CSS has `img { @apply inline-block }` (though `max-width: 100%` would be better than relying on container constraints)
- **Touch targets (nav):** PASS — Navigation links have `p-3`/`p-4` padding (at least 12px+); social icons are `h-11 w-11` (44px); pagination buttons are `h-10 w-10` (40px, borderline)
- **Container responsive:** PASS — Container uses `max-w-[1000px] px-4 md:px-8 mx-auto`, ensuring content does not touch edges
- **Mobile navigation:** PASS — Hamburger menu implemented via checkbox toggle, hidden on `md:` breakpoint
- **Responsive headings:** PASS — Headings use responsive sizing (`text-h1-sm md:text-h1` etc.)
- **Form inputs:** PASS — Form inputs use `w-full` class for full-width on mobile
- **Shiki code wrapping:** PASS — Astro config sets `shikiConfig: { wrap: true }`, preventing code block horizontal overflow
- **Content max-width:** PASS — `.content` uses `prose max-w-none` contained within the 1000px container
- **Sidebar handling:** PASS — Desktop sidebar uses `hidden md:block md:col-4`; mobile gets separate "Similar Posts" section with `md:hidden`
- **Search input:** PASS — Uses `w-full` for responsive width
- **Logical properties in components:** PARTIAL PASS — Most newer components (Callout, QuickSummary, ReadingProgress, RelatedSidebar, breadcrumbs) correctly use logical properties (`start-*`, `end-*`, `me-*`, `ms-*`, `border-s-4`, `inset-inline-start`, `padding-inline-start`). The main problematic areas are the grid plugin and older/inherited pages.

---

### Visual Verification Results

| Viewport | Status | Issues |
|----------|--------|--------|
| 320px | SKIPPED | Static analysis only — potential table clipping, grid column overflow from `flexShrink: 0` without `minWidth: 0` |
| 375px | SKIPPED | Static analysis only — same concerns as 320px |
| 425px | SKIPPED | Static analysis only |
| 768px | SKIPPED | Static analysis only |
| 1024px | SKIPPED | Static analysis only |

---

### Stats

- **Files scanned:** 94 (54 template/style/script + 40 MDX content files)
- **Issues found:** 21 (3 critical, 12 major, 6 minor)

---

### Summary of Root Causes

The three critical issues share two root causes:

1. **Bootstrap-style grid plugin (`tw-bs-grid.mjs`) uses physical CSS properties and sets `flexShrink: 0` without `minWidth: 0`.** This plugin is the foundation of the entire grid layout. Every `.row` and `.col-*` usage inherits these issues. On an RTL site, the physical `marginLeft`/`marginRight` properties cause gutters and offsets to be applied on the wrong side. The `flexShrink: 0` without `minWidth: 0` means any wide content (tables, code blocks) inside a grid column will force the entire layout wider than the viewport.

2. **Tables in prose content use `overflow-hidden` instead of `overflow-x: auto`.** With 28 articles containing Markdown tables, this silently clips data on mobile. Combined with issue #1, the flex parent may expand instead of constraining the table, so neither the scroll nor the clip actually activates — the entire page overflows.

The majority of "major" issues are RTL-incompatible Tailwind utility classes (`mr-*`, `pl-*`, `space-x-*`) concentrated in the older/inherited pages (contact, categories, tags, authors, footer, pagination). The newer blog components correctly use logical equivalents (`me-*`, `ms-*`, `ps-*`, `start-*`, `end-*`).

---

### Recommended Fix Priority

1. **Fix `tw-bs-grid.mjs`** — Replace physical properties with logical equivalents and add `minWidth: 0` to the `& > *` rule. This is the single highest-impact fix since it affects every page.
2. **Fix table overflow** — Change `prose-table:overflow-hidden` to a scrollable wrapper approach in `components.css`.
3. **Batch-replace RTL-incompatible classes** — Find-and-replace `mr-` to `me-`, `ml-` to `ms-`, `pl-` to `ps-`, `pr-` to `pe-` in the affected files. Replace `space-x-*` with `gap-*` or add `rtl:space-x-reverse`.
4. **Translate remaining English UI strings** to Arabic.
5. **Flip pagination arrows** for RTL context.
