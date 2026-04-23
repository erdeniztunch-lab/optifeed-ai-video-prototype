

# Optifeed — AI Product Video Flow

A 6-step guided flow that turns existing catalog products into ready-to-use video assets for ad channels. Built to match the existing Optifeed dashboard style (dark sidebar, light content area, soft cards, purple primary CTAs, subtle status chips).

## Visual style (consistent across all screens)
- Light app background, white cards with soft shadow + 1px subtle border
- Dark navy sidebar with "Optifeed" logo and nav (Dashboard, Feed Sources, Exports, Videos *(active)*, Dynamic Templates, GA4 Analytics, Meta Ads)
- Primary CTA: solid purple button. Secondary: ghost/outline. Tertiary: text link
- Status chips: neutral gray ("Draft", "No video"), green ("Ready"), purple accent ("New")
- Generous spacing, one clear primary action per screen, breadcrumb-style step indicator at top: **1 Select → 2 Generate → 3 Preview → 4 Send → Done**

## Routing
Single new route `/videos` with internal step state (no URL changes needed) so the flow feels like one continuous task. Sidebar gets a new "Videos" item that opens Step 1.

---

### Screen 1 — Opportunity / Entry Point
Centered hero card on the Videos page.
- Small icon (video/sparkle)
- Headline: **"Create product videos for your catalog"**
- Subtext: "Use your existing product data and images to create video assets for Google, Meta, and TikTok."
- Status pill: **"124 products have no video assets"**
- Single primary CTA: **Create videos**
- Nothing else on the page — pure focus.

### Screen 2 — Product Selection
- Top: Title "Select products to create videos" + helper "Start with products that are missing video assets."
- Light filter chips: **No video · Best sellers · Recently added** (single-select, "No video" pre-applied)
- Search input (right-aligned)
- Responsive grid of product cards (4 cols desktop → 2 → 1):
  - Product image (square)
  - Product name + tiny brand line
  - Status tag: "No video" (gray) or "Ready for video" (green)
  - Selection checkbox in top-right corner; selected state = purple border + checked
- Sticky bottom bar appears when ≥1 selected: "X products selected" + primary CTA **Generate videos**

### Screen 3 — Generate Video
Modal/dialog over Screen 2 (keeps context).
- Title: "Generate video drafts"
- Line: **"You selected 6 products"**
- Line: "We'll use your product images and catalog data to create video drafts."
- Two compact selectors only:
  - Format: **Square · Vertical** (segmented control)
  - Channel intent: **Meta · TikTok · Google** (segmented, multi-select)
- Primary CTA: **Generate drafts** · Secondary: Cancel
- On click → brief loading state ("Creating your videos…" with progress shimmer on stacked product thumbnails) → Screen 4.

### Screen 4 — Preview & Approve  *(hero screen)*
Two-column layout, max focus on the video.
- **Left (60%)**: Large video player in a soft-shadowed card, 1:1 or 9:16 based on chosen format. Play/pause + mute only. Below player: tiny pagination "Draft 1 of 6 · ‹ ›" so user can step through generated drafts.
- **Right (40%)**:
  - Product thumbnail + name + brand
  - Two micro-detail rows with check icons:
    - "Created from existing product images"
    - "Ready for catalog use"
  - Status tag: **Draft**
  - Stacked actions:
    - Primary: **Approve** (purple)
    - Secondary: **Regenerate** (outline, with refresh icon)
    - Tertiary: **← Back to products** (text link)
- Approving advances to next draft until all are reviewed, then goes to Screen 5.

### Screen 5 — Send to Channel
Centered, narrow column.
- Title: **"Video approved"** with green check icon
- Subtext: "Choose where to use this video."
- Channel option cards (multi-select, large click target, checkbox + icon + label):
  - Google feed
  - Meta feed
  - TikTok feed
  - Download video (no checkbox — direct action style)
- Primary CTA: **Send video** · Secondary text link: **Skip for now**

### Screen 6 — Success State
Clean centered confirmation.
- Large success icon (green check in soft circle)
- Title: **"Video sent successfully"**
- Two supporting lines:
  - "1 product now has a video asset"
  - "Sent to Meta feed"
- Action stack:
  - Primary: **Create another video** (loops back to Screen 2)
  - Secondary: **View products**
  - Tertiary text link: **Go to feed**

---

## Data approach
All product data and generated video previews are mocked in-file (sample products with placeholder images, a short looping sample MP4 for the preview player). No backend needed — this is a polished UI flow demo. State is held with React `useState` inside the `/videos` page; step transitions are local.

## What gets built
- New page `src/pages/Videos.tsx` orchestrating all 6 steps
- Step components in `src/components/videos/`: `EntryStep`, `SelectStep`, `GenerateDialog`, `PreviewStep`, `SendStep`, `SuccessStep`, plus `StepIndicator`, `ProductCard`, `ChannelOption`
- Shared `AppShell` with the dark sidebar and active "Videos" nav item, reused around the page
- Route added in `App.tsx`: `/videos` (and Index updated to link/redirect into it for easy access)
- Mock data file `src/data/products.ts` with ~12 sample products

