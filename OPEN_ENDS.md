# Open ends — Featherwood Interiors

<!--
Tracked by Flaux HQ. Rules:
- One item per line: "- [ ] text #tags"
- Priority tags: #high #medium #low (default medium)
- Other tags allowed: #mobile #blog #homepage etc.
- When fixed: tick it "- [x]" or delete the line, in the same commit as the fix.
- Or write "closes OE: <item text>" in the commit message.
- Keep the section headings exactly as they are.
-->

## Bugs
- [ ] Wire a catch-all 404 route in `client/src/App.tsx` — `not-found.tsx` exists but unknown URLs fall through with a blank Switch #high
- [ ] Footer Privacy/Terms links point to `/contact` instead of real legal pages (`client/src/components/Footer.tsx`) #high
- [ ] `/user-info` links to `/privacy-policy` and `/terms` which have no routes (`client/src/pages/UserInfo.tsx`) #high
- [x] URLA Accent Chair has price ₹0 / discountedPrice ₹0 in `client/src/data/furniture.json` — blocks checkout display #high
- [ ] Contact form submit opens Google Apps Script URL in a new tab via GET (`client/src/utils/googleSheetsApi.ts`) instead of silent POST #medium
- [ ] Firebase config and API keys are hardcoded in `client/src/lib/firebase.ts` (move to env; rotate if exposed) #high
- [ ] Auth state `console.log` spam on every login change in `client/src/lib/firebase.ts` #low
- [ ] Calculator/quote XHR handlers log success payloads to console (`HomeCalculator.tsx`, `KitchenCalculator.tsx`, `WardrobeCalculator.tsx`, `UserInfo.tsx`) #low
- [ ] Duplicate asset roots: root `public/` vs `client/public/` — Vite serves `client/public`; root copies can drift #medium
- [ ] `TestPage.tsx` exists unused; confirm it is never reachable in production builds #low

## SEO
- [x] Update `client/public/sitemap.xml` — add LEXUS, VELVETO, TURKISH-SOFA-SET, accent-chairs/URLA; remove deleted modern-queen-bed and storage-bed URLs #high
- [ ] SPA + react-helmet meta may not be crawled for routes beyond `/` — verify prerender/SSR or static meta per route for Vite #high
- [ ] `SEO.tsx` appends ` | FeatherWood` to every title, pushing many titles over 60 chars (e.g. Home becomes ~61) #medium
- [ ] Audit unique title (50–60) and meta description (140–160) on Services, Contact, Projects, calculators, and each furniture product page #medium
- [ ] JSON-LD in `client/index.html` FurnitureStore missing `openingHoursSpecification`, `geo`, and `sameAs` social profiles #high
- [ ] `client/index.html` references `./apple-touch-icon.png` but file is missing under `client/public/` #medium
- [ ] No `site.webmanifest` / PWA manifest linked from `client/index.html` #low
- [ ] CategoryExplorer / HeroSlider / many `<img>` tags lack explicit `width`/`height` (CLS risk) #medium
- [ ] Many homepage/about/project images are remote Unsplash URLs, not self-hosted WebP with lazy loading #medium
- [ ] Product image alts often missing or generic on furniture listing cards (`Furniture.tsx`, `FurnitureCategory.tsx`) #medium
- [ ] Confirm Google Search Console verification meta/DNS for featherwood.in #high
- [ ] Confirm www vs non-www and trailing-slash redirects on Vercel match canonical `https://www.featherwood.in` #medium
- [ ] Add LocalBusiness/FurnitureStore structured data with both Whitefield addresses, phone, hours, geo on Contact and Store Locator #medium
- [ ] Furniture product URLs with spaces (`Classic%20Grey%20Sofa`) — consider slugifying ids for cleaner URLs #low
- [ ] Thin copy risk on furniture category pages that rely mostly on product cards without local Bengaluru keyword content #medium
- [ ] Internal linking: add cross-links from Services ↔ Furniture ↔ Design Ideas ↔ Projects on key pages #medium
- [ ] OG/Twitter tags always use static `og-image.jpg` — product/service pages should set unique `ogImage` via `SEO.tsx` #medium
- [ ] Twitter handle `@featherwoodin` in meta — confirm account exists or remove #low

## Client inputs needed
- [x] Final selling price (and discount) for URLA Accent Chair — currently ₹0 in catalog #high
- [ ] Real Instagram / Facebook / LinkedIn profile URLs for Footer (currently generic instagram.com, facebook.com, linkedin.com) #high
- [ ] Confirm showroom hours and days for both addresses used in Store Locator + schema #high
- [ ] Provide SVG logo (currently JPG `cmp_logo.jpg`) and a proper `apple-touch-icon` 180×180 PNG #medium
- [ ] Own photography for wardrobes, tables, and chairs categories (stock/Unsplash stand-ins currently in use) #medium
- [ ] Privacy Policy and Terms of Service final legal text for featherwood.in #high
- [ ] Confirm Google Business Profile URL(s) for Whitefield / Kadugodi / Siddapura to link as `sameAs` #medium
- [ ] Confirm GA4 property `G-8RXLHRNHLM` ownership and that client has dashboard access #medium
- [ ] Confirm which Projects case studies are real FeatherWood work vs placeholder (e.g. Manhattan penthouse, coastal villa) #high
- [ ] Testimonials approval / attribution details if names/photos should appear publicly #low
- [ ] Domain/DNS and Vercel project access for Flaux if not already shared #medium

## Features to build
- [ ] Create `/privacy-policy` and `/terms` pages and wire Footer + UserInfo links #high
- [ ] Catch-all `<Route>` using `not-found.tsx` (or `ErrorPage.tsx`) for unknown paths #high
- [ ] Silent contact/quote form submissions (no `_blank` Google Script tab) with success/error toast only #medium
- [ ] Admin order management SEO/noIndex and auth hardening for `/admin/orders` #medium
- [ ] Optional: web app manifest + apple-touch-icon set for mobile install/home-screen #low
- [ ] Optional: product slug system and redirect map for space-containing furniture IDs #low

## Content
- [ ] Replace Unsplash hero/editorial imagery on Home and About with FeatherWood project photos #medium
- [ ] Review Projects (`manhattan-penthouse`, `coastal-villa`, etc.) for accuracy — names read as placeholders #high
- [ ] Wardrobe/table/chair catalog products still use generic stock images — replace with real SKUs or unpublish #medium
- [ ] Footer brand blurb and About “since 2010” claim — confirm founding year with client #low
- [ ] Add Privacy and Terms page copy once client provides legal text #high
- [ ] Accent Chairs category is live; confirm nav naming vs Chairs category to avoid shopper confusion #low

## Performance & accessibility
- [ ] Google Fonts + Font Awesome loaded via CSS `@import` in `client/src/index.css` (render-blocking); self-host or use `<link rel=preload>` with `font-display: swap` already present in URL — still blocking #high
- [ ] Large furniture WebPs (Turkish sofa set ~1.2MB folder; some shots 150KB+) — further compress / responsive srcset #medium
- [ ] Ensure all interactive controls (cart, quantity, size radios) have visible focus styles and accessible names #medium
- [ ] Contact/quote forms: associate visible `<Label>` with every input (some rely on placeholder-only) #medium
- [ ] Check colour contrast of `#6E6A66` text on `#FAFAF8` / white for WCAG AA #medium
- [ ] CategoryExplorer cards: add meaningful `alt` text beyond category name alone where images show products #low
- [ ] Keyboard navigation through Navbar dropdown furniture list and mobile menu #medium

## Launch & infra
- [ ] Confirm production deploy on Vercel uses `client`-aware Vite build (`vercel.json` outputDirectory `dist`) and correct root #high
- [ ] Document required env vars (Firebase, Google Script URL) in README — none documented today #high
- [ ] Move Firebase and Google Apps Script URLs out of source into env / secrets #high
- [ ] Verify form email/Sheets delivery end-to-end in production (Contact, UserInfo, calculators) #high
- [ ] Confirm SSL, apex→www redirect, and Search Console sitemap submission for `https://www.featherwood.in/sitemap.xml` #high
- [ ] Set up uptime monitoring for featherwood.in #medium
- [ ] Confirm backup strategy for Firebase orders data and Google Sheets leads #medium
- [ ] Align root `public/` vs `client/public/` so only one source of robots/sitemap/favicons is deployed #medium
