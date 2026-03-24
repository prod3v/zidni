# Magazine Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Zidni blog homepage from a simple post list into a magazine-style layout with hero section, post grid, sidebar, newsletter CTA, and rich footer.

**Architecture:** Modify `src/pages/index.astro` to compose 6 new/modified Astro components. Data comes from existing content collections via `getSinglePage("posts")`. The footer change is site-wide (shared via `Base.astro`). No new dependencies needed.

**Tech Stack:** Astro 6, Tailwind CSS 4, existing Cairo font, existing utility functions (`dateFormat`, `readingTime`, `slugify`, `humanize`)

**Spec:** `docs/superpowers/specs/2026-03-24-magazine-homepage-design.md`

**Import alias:** `@/components/*` maps to `src/layouts/components/*` (defined in `tsconfig.json`)

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/layouts/components/HeroPost.astro` | Featured post hero with image overlay + gradient |
| `src/layouts/components/NewsletterCTA.astro` | Email signup banner (static form) |
| `src/layouts/components/Sidebar.astro` | Sidebar wrapper — sticky, renders 3 widgets |
| `src/layouts/components/sidebar/CategoriesWidget.astro` | Category list with post counts |
| `src/layouts/components/sidebar/RecentPostsWidget.astro` | Recent posts with thumbnails |
| `src/layouts/components/sidebar/ServicesCTA.astro` | Services promotion card |

### Modified Files
| File | What Changes |
|------|-------------|
| `src/layouts/components/Posts.astro` | Restyle category badge: white bg → teal bg + white text |
| `src/layouts/partials/Footer.astro` | Replace simple footer with rich 3-column footer (site-wide) |
| `src/pages/index.astro` | Rewrite to compose all magazine sections |

---

## Task 1: Restyle Post Card Category Badge

**Files:**
- Modify: `src/layouts/components/Posts.astro:40-45`

- [ ] **Step 1: Update the category badge classes**

In `src/layouts/components/Posts.astro`, change line 42 from:
```html
<span class="bg-white/90 backdrop-blur-sm text-dark text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
```
to:
```html
<span class="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/components/Posts.astro
git commit -m "style: restyle post card category badge to teal bg + white text"
```

---

## Task 2: Create HeroPost Component

**Files:**
- Create: `src/layouts/components/HeroPost.astro`

- [ ] **Step 1: Create the HeroPost component**

Create `src/layouts/components/HeroPost.astro`:

```astro
---
import dateFormat from "@/lib/utils/dateFormat";
import readingTime from "@/lib/utils/readingTime";
import { humanize } from "@/lib/utils/textConverter";
import type { CollectionEntry } from "astro:content";

type Props = {
  post: CollectionEntry<"posts">;
};

const { post } = Astro.props;
const { title, image, date, categories, authors } = post.data;
const hasImage = !!image;
---

<a
  href={`/blog/${post.id}`}
  aria-label={title}
  class="block relative w-full h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden group"
>
  {/* Background image or fallback gradient */}
  {hasImage ? (
    <img
      src={image}
      alt={title}
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
    />
  ) : null}

  {/* Dark gradient overlay */}
  <div
    class:list={[
      "absolute inset-0",
      hasImage
        ? "bg-gradient-to-t from-[rgba(21,32,53,0.95)] to-[rgba(21,32,53,0.2)]"
        : "bg-gradient-to-br from-dark to-[#1a3a4a]",
    ]}
  />

  {/* Category badge - top right (RTL: start = right) */}
  {categories?.[0] && (
    <span class="absolute top-4 start-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
      {humanize(categories[0])}
    </span>
  )}

  {/* Content overlay at bottom */}
  <div class="absolute bottom-0 start-0 end-0 p-5 md:p-8 z-10">
    <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
      {title}
    </h2>
    <div class="flex flex-wrap items-center gap-3 text-white/60 text-sm">
      {authors?.[0] && <span>{authors[0]}</span>}
      {date && (
        <>
          <span>·</span>
          <span>{dateFormat(date)}</span>
        </>
      )}
      <span>·</span>
      <span>{readingTime(post.body ?? "")}</span>
    </div>
  </div>
</a>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds. Component is not yet used on any page — just verifying it compiles.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/components/HeroPost.astro
git commit -m "feat: add HeroPost component with image overlay and gradient"
```

---

## Task 3: Create Sidebar Widgets

**Files:**
- Create: `src/layouts/components/sidebar/CategoriesWidget.astro`
- Create: `src/layouts/components/sidebar/RecentPostsWidget.astro`
- Create: `src/layouts/components/sidebar/ServicesCTA.astro`
- Create: `src/layouts/components/Sidebar.astro`

- [ ] **Step 1: Create the sidebar directory**

```bash
mkdir -p src/layouts/components/sidebar
```

- [ ] **Step 2: Create CategoriesWidget**

Create `src/layouts/components/sidebar/CategoriesWidget.astro`:

```astro
---
import { humanize, slugify } from "@/lib/utils/textConverter";

type Props = {
  categories: { name: string; count: number }[];
};

const { categories } = Astro.props;
---

<div class="bg-white rounded-xl border border-[#eee] p-5">
  <h3 class="text-base font-bold text-dark mb-4 pb-2 border-b-2 border-primary inline-block">
    التصنيفات
  </h3>
  <ul class="space-y-3">
    {categories.map((cat) => (
      <li>
        <a
          href={`/categories/${slugify(cat.name)}`}
          class="flex items-center justify-between text-sm text-body hover:text-primary transition duration-200"
        >
          <span>{humanize(cat.name)}</span>
          <span class="bg-[#f0f0f0] text-[#888] text-xs px-2 py-0.5 rounded-full">
            {cat.count}
          </span>
        </a>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 3: Create RecentPostsWidget**

Create `src/layouts/components/sidebar/RecentPostsWidget.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";

type Props = {
  posts: CollectionEntry<"posts">[];
};

const { posts } = Astro.props;
---

<div class="bg-white rounded-xl border border-[#eee] p-5">
  <h3 class="text-base font-bold text-dark mb-4 pb-2 border-b-2 border-primary inline-block">
    أحدث المقالات
  </h3>
  <ul class="space-y-4">
    {posts.map((post) => (
      <li>
        <a
          href={`/blog/${post.id}`}
          class="flex items-center gap-3 group"
        >
          {post.data.image && (
            <img
              src={post.data.image}
              alt={post.data.title}
              class="w-10 h-10 rounded-lg object-contain bg-light flex-shrink-0"
              loading="lazy"
            />
          )}
          <span class="text-sm text-body leading-snug group-hover:text-primary transition duration-200 line-clamp-2">
            {post.data.title}
          </span>
        </a>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 4: Create ServicesCTA**

Create `src/layouts/components/sidebar/ServicesCTA.astro`:

```astro
---
---

<div class="rounded-xl p-6 text-center" style="background: linear-gradient(135deg, #01AD9F, #0d8a7f);">
  <h3 class="text-white font-bold text-base mb-2">تحتاج مساعدة؟</h3>
  <p class="text-white/80 text-sm mb-4 leading-relaxed">
    نقدم خدمات مشاريع التخرج والواجبات الجامعية والترجمة الأكاديمية
  </p>
  <a
    href="/graduation-projects-service"
    class="inline-block bg-white text-primary font-semibold text-sm px-5 py-2 rounded-full hover:shadow-lg transition duration-300"
  >
    تصفح خدماتنا
  </a>
</div>
```

- [ ] **Step 5: Create Sidebar wrapper**

Create `src/layouts/components/Sidebar.astro`:

```astro
---
import CategoriesWidget from "./sidebar/CategoriesWidget.astro";
import RecentPostsWidget from "./sidebar/RecentPostsWidget.astro";
import ServicesCTA from "./sidebar/ServicesCTA.astro";
import type { CollectionEntry } from "astro:content";

type Props = {
  categories: { name: string; count: number }[];
  recentPosts: CollectionEntry<"posts">[];
};

const { categories, recentPosts } = Astro.props;
---

<aside class="lg:sticky lg:top-20 space-y-6">
  <CategoriesWidget categories={categories} />
  {recentPosts.length > 0 && <RecentPostsWidget posts={recentPosts} />}
  <ServicesCTA />
</aside>
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: Build succeeds. Components compile but are not yet used on any page.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/components/sidebar/ src/layouts/components/Sidebar.astro
git commit -m "feat: add sidebar widgets (categories, recent posts, services CTA)"
```

---

## Task 4: Create NewsletterCTA Component

**Files:**
- Create: `src/layouts/components/NewsletterCTA.astro`

- [ ] **Step 1: Create the NewsletterCTA component**

Create `src/layouts/components/NewsletterCTA.astro`:

```astro
---
---

<section class="py-12 px-4" style="background: linear-gradient(135deg, #01AD9F, #0d8a7f);">
  <div class="container max-w-2xl mx-auto text-center">
    <h2 class="text-white text-xl md:text-2xl font-bold mb-2">
      اشترك في نشرتنا البريدية
    </h2>
    <p class="text-white/80 text-sm md:text-base mb-6">
      احصل على أحدث المقالات والنصائح الأكاديمية مباشرة في بريدك
    </p>
    <form
      action="#"
      method="POST"
      data-newsletter-form
      class="flex flex-col sm:flex-row items-center gap-3 justify-center max-w-md mx-auto"
    >
      <input
        type="email"
        required
        aria-label="البريد الإلكتروني"
        placeholder="بريدك الإلكتروني"
        class="w-full sm:flex-1 px-5 py-3 rounded-full text-sm text-dark bg-white/90 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        class="w-full sm:w-auto px-6 py-3 bg-white text-primary font-semibold text-sm rounded-full hover:shadow-lg transition duration-300"
      >
        اشترك
      </button>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/components/NewsletterCTA.astro
git commit -m "feat: add NewsletterCTA component with static email form"
```

---

## Task 5: Redesign Footer (site-wide)

**Files:**
- Modify: `src/layouts/partials/Footer.astro`

- [ ] **Step 1: Replace Footer.astro with rich 3-column footer**

Replace the entire contents of `src/layouts/partials/Footer.astro` with:

```astro
---
import Social from "@/components/Social.astro";
import config from "@/config/config.json";
import social from "@/config/social.json";
---

<footer>
  {/* Main Footer */}
  <div class="bg-dark py-12 px-4">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-12">
        {/* About Column */}
        <div>
          <div class="text-primary text-xl font-bold mb-3">
            {config.site.logo_text || "زدني"}
          </div>
          <p class="text-white/60 text-sm leading-relaxed">
            مدونة تعليمية للطلاب الجامعيين تقدم نصائح دراسية، دروس في البرمجة، وأدلة أكاديمية شاملة لمساعدتك على التفوق
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 class="text-white font-semibold text-sm mb-4">روابط سريعة</h4>
          <ul class="space-y-2">
            <li>
              <a href="/categories" class="text-white/60 text-sm hover:text-white transition duration-200">المقالات</a>
            </li>
            <li>
              <a href="/about" class="text-white/60 text-sm hover:text-white transition duration-200">عن زدني</a>
            </li>
            <li>
              <a href="/contact" class="text-white/60 text-sm hover:text-white transition duration-200">تواصل معنا</a>
            </li>
            <li>
              <a href="/privacy-policy" class="text-white/60 text-sm hover:text-white transition duration-200">سياسة الخصوصية</a>
            </li>
          </ul>
        </div>

        {/* Services Column */}
        <div>
          <h4 class="text-white font-semibold text-sm mb-4">خدماتنا</h4>
          <ul class="space-y-2">
            <li>
              <a href="/graduation-projects-service" class="text-white/60 text-sm hover:text-white transition duration-200">مشاريع التخرج</a>
            </li>
            <li>
              <a href="/university-assignments" class="text-white/60 text-sm hover:text-white transition duration-200">الواجبات الجامعية</a>
            </li>
            <li>
              <a href="/academic-translation-service" class="text-white/60 text-sm hover:text-white transition duration-200">الترجمة الأكاديمية</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social icons */}
      <div class="mt-8 pt-6 border-t border-white/10 text-white/60">
        <Social source={social.main} className="social-icons justify-center" />
      </div>
    </div>
  </div>

  {/* Copyright Bar */}
  <div class="bg-[#0e1726] py-4 px-4">
    <div class="container text-center">
      <p class="text-white/50 text-sm">{config.params.copyright}</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds. The footer change applies to all pages.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/partials/Footer.astro
git commit -m "feat: redesign footer with 3-column layout + copyright bar (site-wide)"
```

---

## Task 6: Rewrite Homepage (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

This is the main integration task — composing all the components together.

- [ ] **Step 1: Rewrite index.astro**

Replace the entire contents of `src/pages/index.astro` with:

```astro
---
import HeroPost from "@/components/HeroPost.astro";
import NewsletterCTA from "@/components/NewsletterCTA.astro";
import Posts from "@/components/Posts.astro";
import Sidebar from "@/components/Sidebar.astro";
import config from "@/config/config.json";
import Base from "@/layouts/Base.astro";
import { getSinglePage } from "@/lib/contentParser.astro";
import dateFormat from "@/lib/utils/dateFormat";
import { humanize } from "@/lib/utils/textConverter";
import { sortByDate } from "@/lib/utils/sortFunctions";

// Fetch and sort all posts
const posts = await getSinglePage("posts");
const sortedPosts = sortByDate(posts);

// Slice posts for each section (spec: 1 hero + 3 grid + 6 more + 4 sidebar)
const heroPost = sortedPosts[0];
const gridPosts = sortedPosts.slice(1, 4);
const morePosts = sortedPosts.slice(4, 10);
const sidebarRecentPosts = sortedPosts.slice(10, 14);

// Build category counts from all posts
const categoryMap = new Map<string, number>();
for (const post of posts) {
  for (const cat of post.data.categories) {
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }
}
const categories = Array.from(categoryMap.entries())
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

// JSON-LD schemas (preserved from original)
const baseUrl = config.site.base_url;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "زدني",
  url: baseUrl,
  logo: `${baseUrl}${config.site.logo}`,
  description: config.metadata.meta_description,
  contactPoint: {
    "@type": "ContactPoint",
    email: config.contactinfo.email,
    contactType: "customer service",
    availableLanguage: "Arabic",
  },
  sameAs: [],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "زدني",
  alternateName: "Zidni",
  url: baseUrl,
  description: config.metadata.meta_description,
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
---

<Base>
  <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(webSiteSchema)} />

  {/* Section 1: Hero — Featured Post */}
  {heroPost && <HeroPost post={heroPost} />}

  {/* Section 2: Latest Posts Grid */}
  {gridPosts.length > 0 && (
    <section class="bg-[#f8f9fa] py-12 px-4">
      <div class="container">
        <h2 class="text-xl font-bold text-dark mb-8">أحدث المقالات</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <article class="bg-white rounded-xl overflow-hidden border border-[#eee] group">
              {post.data.image && (
                <a href={`/blog/${post.id}`} class="block overflow-hidden relative">
                  <div class="bg-light p-4">
                    <img
                      src={post.data.image}
                      alt={post.data.title}
                      class="w-full aspect-[16/10] object-contain group-hover:scale-[1.03] transition duration-500"
                      loading="lazy"
                    />
                  </div>
                  {post.data.categories?.[0] && (
                    <span class="absolute top-3 start-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {humanize(post.data.categories[0])}
                    </span>
                  )}
                </a>
              )}
              <div class="p-4">
                <h3 class="font-bold text-dark leading-snug mb-2">
                  <a href={`/blog/${post.id}`} class="hover:text-primary transition duration-300">
                    {post.data.title}
                  </a>
                </h3>
                <div class="flex items-center gap-2 text-[#999] text-xs">
                  {post.data.authors?.[0] && <span>{post.data.authors[0]}</span>}
                  {post.data.date && (
                    <>
                      <span>·</span>
                      <span>{dateFormat(post.data.date)}</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )}

  {/* Section 3: More Posts + Sidebar */}
  <section class="py-12 px-4">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column (2/3) */}
        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-dark mb-8">المزيد من المقالات</h2>
          {morePosts.length > 0 && (
            <Posts posts={morePosts} fluid={false} />
          )}
          {/* View All Posts link */}
          <div class="mt-10 text-center">
            <a
              href="/page/2"
              class="inline-block bg-primary text-white font-semibold text-sm px-8 py-3 rounded-full hover:shadow-lg transition duration-300"
            >
              عرض جميع المقالات ←
            </a>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <Sidebar categories={categories} recentPosts={sidebarRecentPosts} />
      </div>
    </div>
  </section>

  {/* Section 4: Newsletter CTA */}
  <NewsletterCTA />
</Base>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Start dev server and visually verify**

Run: `npm run dev`

Check the homepage at `http://localhost:4321` and verify:
1. Hero section shows the latest post with image overlay and gradient
2. 3-column grid shows next 3 posts with teal category badges
3. "More Posts" section shows 6 posts with sidebar on the right (RTL)
4. Sidebar shows categories with counts, recent posts, and services CTA
5. Newsletter CTA banner appears before the footer
6. Rich footer shows 3 columns + social icons + copyright bar
7. Mobile: everything stacks to single column, sidebar below posts

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rewrite homepage with magazine layout (hero, grid, sidebar, newsletter)"
```

---

## Task 7: Visual QA and Fixes

This task is for any styling adjustments found during visual verification.

- [ ] **Step 1: Run dev server and check all pages**

Run: `npm run dev`

Verify on **non-homepage** pages that the new rich footer renders correctly:
- A blog post page (`/blog/python-beginners-guide`)
- The categories page (`/categories`)
- The contact page (`/contact`)
- A service page (`/graduation-projects-service`)

- [ ] **Step 2: Check mobile responsiveness**

Resize browser to 375px width and verify:
- Hero height is 250px
- Grid is single-column
- Sidebar stacks below posts
- Newsletter form stacks vertically
- Footer stacks to single column
- No horizontal overflow

- [ ] **Step 3: Fix any issues found**

Address any visual problems (spacing, overflow, colors, RTL alignment). Each fix should be small and targeted.

- [ ] **Step 4: Run full build to verify no errors**

Run: `npm run build`
Expected: Clean build with no errors or warnings.

- [ ] **Step 5: Commit fixes**

Stage only the files that were actually changed, then commit:
```bash
git commit -m "fix: visual adjustments for magazine homepage and rich footer"
```

(Skip this commit if no fixes were needed.)
