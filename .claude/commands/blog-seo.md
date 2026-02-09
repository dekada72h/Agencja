---
description: Blog SEO improvements and new blog post management
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git:*), Bash(python3:*)
argument-hint: [action] [details]
---

# Blog SEO Management Skill

You are managing the Dekada72H agency blog at `/home/kali/Desktop/Agencja/blog/`.

## Context

- Blog listing page: `blog.html`
- Sitemap: `sitemap.xml`
- All blog posts are in `blog/` directory as static HTML files
- Each post uses inline `<style>` blocks (not external CSS for article styles)
- Each post has: Article Schema, BreadcrumbList Schema, FAQ Schema, Open Graph, Twitter Card
- Posts use `data-i18n` attributes for multilingual support
- Google Analytics ID: `G-DX7YV492B7`
- Domain: `dekada72h.com`
- Posts use Unsplash images with `?w=600&q=80` for cards and `?w=1200&q=80` for hero

## Available Actions

The user will specify what they want. Common actions include:

### 1. Add a new blog post (`new` or `add`)
When adding a new blog post:
- Use the EXACT same HTML template structure as existing posts (copy from `marketing-internetowy-wroclaw.html` as the most recent template)
- Include: Google Analytics, meta tags, Open Graph, Twitter Card, Article Schema, BreadcrumbList, FAQ Schema (5 questions), inline CSS, nav, breadcrumb, article content, related articles section, CTA box, footer, scripts
- Use `articleN` numbering (check blog.html to find the next number)
- Add the post card to `blog.html` in the correct chronological position
- Add entry to `sitemap.xml`
- Add related articles section linking to 3 relevant existing posts
- Update the related articles sections of existing posts to cross-link back where relevant

### 2. Add related articles sections (`related`)
For each blog post, add a "Przeczytaj rowniez" section before the CTA box with 3 cards linking to related posts. Use this HTML structure:

```html
<!-- Related Articles -->
<div class="related-articles">
    <h2>Przeczytaj rowniez</h2>
    <div class="related-articles-grid">
        <a href="FILENAME.html" class="related-article-card">
            <span class="related-category">CATEGORY</span>
            <h3>TITLE</h3>
        </a>
        <!-- 2 more cards -->
    </div>
</div>
```

And add matching CSS before `@media (max-width: 768px)` in the inline `<style>` block.

### 3. Improve alt texts (`alts`)
Expand minimal image alt texts to full descriptive SEO-friendly text with relevant keywords.

### 4. Update internal links (`links`)
Add contextual internal links within blog post body text to other relevant posts.

### 5. Audit SEO (`audit`)
Check all blog posts and pages for: missing meta descriptions, weak title tags, missing schema markup, internal linking gaps, sitemap coverage, image alt texts.

## Existing Blog Posts Reference

| File | Topic | Category |
|------|-------|----------|
| html-vs-wordpress.html | HTML vs WordPress comparison | Technologia |
| landing-page-co-to-jest.html | What is a landing page | Strony WWW |
| seo-pozycjonowanie-stron.html | SEO and site positioning | SEO |
| automatyzacja-procesow-biznesowych.html | Business process automation | Automatyzacja |
| ile-kosztuje-strona-internetowa.html | Website costs guide | Strony WWW |
| strona-internetowa-dla-firmy.html | Why businesses need websites | Strony WWW |
| tworzenie-stron-internetowych-wroclaw.html | Web development in Wroclaw | Strony WWW |
| marketing-internetowy-wroclaw.html | Internet marketing in Wroclaw | Marketing |
| pozycjonowanie-lokalne-wroclaw.html | Local SEO in Wroclaw | SEO |

## Efficiency Rules

- When editing multiple files with the same pattern, use a Python script via Bash for batch operations
- Always verify changes with `git diff --stat` before committing
- Match the existing code style exactly (indentation, naming conventions, data-i18n patterns)
- Use the existing CSS component patterns (highlight-box, stat-highlight, comparison-table, numbered-list, article-cta)
- Commit and push when done unless told otherwise

## User Request

$ARGUMENTS
