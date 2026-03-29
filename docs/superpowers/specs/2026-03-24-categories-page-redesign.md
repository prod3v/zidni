# Categories Page Redesign — Discovery Hub

## Goal

Replace the minimal categories listing page (`/categories`) with a content-rich discovery hub that helps visitors explore Zidni's 5 content areas with visual context, article counts, and preview links.

## Current State

- Page title "Categories" (now translated to "التصنيفات")
- Horizontal row of 5 category pills with icons
- No descriptions, no article counts, no previews
- Mostly empty whitespace

## Design

### Layout

Full-width stacked cards, one per category. Each card contains:

- **Storyset SVG illustration** (alternating left/right position per card)
- **Category name** as H2 heading, linked to category page
- **1-line Arabic description** of what the category covers
- **Article count badge** (e.g., "16 مقال")
- **2-3 latest article titles** as clickable links (sorted by date)
- **"عرض الكل →" link** to the full category page

### Category Data

| Category | Count | Illustration | Description |
|---|---|---|---|
| دليل المواد | 16 | hand-coding.svg | شروحات مبسطة لمواد البرمجة والحاسب الجامعية |
| مهارات الدراسة | 8 | exams.svg | نصائح للمذاكرة والامتحانات وتنظيم الوقت |
| مشاريع التخرج | 8 | graduation.svg | أفكار ودليل تنفيذ مشاريع التخرج خطوة بخطوة |
| الترجمة الأكاديمية | 4 | learning-languages.svg | ترجمة المصطلحات والأبحاث الأكاديمية |
| الحياة الجامعية | 5 | course-app.svg | السيرة الذاتية والتدريب والشهادات التقنية |

### Visual Style

- Dark card backgrounds (`bg-darkmode-body` or `bg-dark/50`) with subtle border
- Illustration takes ~40% width on desktop, full-width on mobile (stacked above text)
- Teal/primary accent on count badge and "عرض الكل" link
- Cards alternate illustration position: odd cards = image right, even = image left
- On mobile: illustration on top, text below (single column)
- RTL layout throughout

### Page Structure

```
<section> page header: "التصنيفات" + subtitle
  <div> category cards (5 total)
    Card 1: [text | illustration]  (image right)
    Card 2: [illustration | text]  (image left)
    Card 3: [text | illustration]  (image right)
    ...
  </div>
</section>
```

## File Changes

- `src/pages/categories/index.astro` — rewrite with new layout
- No new components needed — all markup in the page file
- Data fetched at build time via existing `getTaxonomy` + `getSinglePage`

## Out of Scope

- Category page (`/categories/[category]`) redesign
- New components or shared abstractions
- JavaScript interactivity
