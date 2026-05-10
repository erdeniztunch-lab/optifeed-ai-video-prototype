# Optifeed AI Video — Implementation Audit

> **Scope:** Frontend-only validated prototype (Phases 0–7)
> **Sources of truth:** product.md (product decisions), feedback-implementation.md (implementation spec)
> **Approach:** Phase-by-phase comparison of implemented code against spec and product intent
> **Status:** In progress — auditing phase by phase

---

# Phase 1 Audit: Library / Folder

## 1. What Works

- **Campaign folder names in mock data** (`Anneler Günü Kampanyası`, `Yaz Koleksiyonu 2025`, `Ramazan Özel Seçkisi`) are excellent — they feel like real performance marketing campaigns and match the product.md target user profile exactly.
- **Inline folder creation** (Enter confirms, Escape cancels, "Oluştur" button) is clean and functional. Keyboard interaction is correct.
- **FolderCard metadata** (name, date in tr-TR locale, video count badge) is correct per spec.
- **Status badge** (Aktif/Taslak) is a reasonable addition, styled clearly.
- **TokenBadge component** is correctly built: Coins icon, amber on low balance, red on depleted, tr-TR number format.
- **Stage transition** `library → select` works correctly.
- **Back navigation** `select → library` works correctly via step bar.
- **Empty state** triggers correctly when `folders.length === 0`.

---

## 2. Messaging Issues

**2.1 Empty state title is wrong**
- **Current:** `"Henüz klasör yok"`
- **Spec (feedback-implementation.md):** `"Henüz video klasörünüz yok"`
- The word "klasörünüz" (your folders) is more personal and appropriate. Missing the possessive makes it feel generic.

**2.2 Empty state CTA conflicts with product.md**
- **Current:** `"İlk klasörü oluştur"` (Create first folder)
- **product.md says:** `"İlk videoyu oluştur"` (Create first video)
- **feedback-implementation.md says:** `"İlk klasörü oluştur"`
- product.md is the source of truth. The CTA should focus on the user outcome (creating videos), not the organizational mechanism (folders). The user's job is "create videos for my campaign," not "manage folders." Using "folder" as the primary CTA frame is an organizational metaphor that front-loads the wrong concept.

**2.3 Empty state subtitle is too administrative**
- **Current:** `"Ürün videolarını düzenlemek için bir kampanya klasörü oluşturun."` ("Create a campaign folder to organize product videos.")
- The framing is passive and organizational. It says nothing about *why* the user is here: to produce video assets for performance marketing campaigns.
- product.md says: "Sıfırdan başlayan kullanıcıya boş bir generation ekranı yerine bağlamsal yönlendirme yapılır." — contextual guidance, not just a folder management instruction.

**2.4 Bottom hint is misplaced and hardcoded**
- **Current:** A `Sparkles + "Her video oluşturma 10 token harcar."` hint rendered at the bottom of the library page.
- This cost information does not belong on the Library screen. product.md places cost transparency at the template selection and cost confirmation steps, not at the entry/library level.
- `{10}` is a JSX expression with a literal number. It should use the `TOKEN_COST_PER_VIDEO` constant if kept at all.
- This feels like a holdover assumption ("user needs cost info everywhere") rather than a deliberate product decision.

**2.5 No explanation of the campaign-based workflow**
- The screen title `"Video Kütüphanesi"` and subtitle `"Ürün videolarınızı kampanya klasörlerine göre düzenleyin."` describe the organization model but don't explain *what happens when you open a folder* — the user has no hint that selecting a folder is the entry to a full video creation workflow.
- A first-time user sees folders and a list, with no indication that clicking one starts product selection.

---

## 3. UI/UX Issues

**3.1 TokenBadge placement is inconsistent across the flow**
- **On library stage:** TokenBadge is inside LibraryStep's own header (in-page position, top right of content area).
- **On all other stages:** TokenBadge is inside the sticky step bar header (top of the page, above content).
- **Spec says:** `"TokenBadge AppShell header'ına yerleştirilecek"` — it was intended to live in the AppShell header permanently and always be visible.
- The current approach causes a visual position jump when transitioning from library (in-page badge) to select (header badge). The badge appears to teleport.

**3.2 Folder grid is 3 columns on large screens — spec says 2**
- **Current:** `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- **Spec:** `"2 kolonlu kart grid (masaüstü), 1 kolon (mobil)"`
- 3-column layout makes folder cards narrower and harder to read, especially since campaign names can be long (e.g., "Anneler Günü Kampanyası").

**3.3 Empty state → creation transition is jarring**
- When the user is in the centered empty state and clicks `"İlk klasörü oluştur"`, `isCreating` becomes `true`, which makes `isEmpty = false`, which switches the entire view from the centered empty layout to the filled-state toolbar layout — showing an empty grid and an inline creation row.
- The user goes from a prominent centered call-to-action to a small inline input in a different layout context. This is disorienting and does not feel like a smooth "start here" entry.

**3.4 FolderCard action is ambiguous**
- The only affordance on each FolderCard is a `ChevronRight` icon. This is commonly used to mean "navigate into" or "see contents," but clicking it triggers product selection (creating new videos), not viewing existing content.
- A user who has `"8 video"` badge on their folder naturally expects to *see those 8 videos* when they click. Instead they're taken to product selection.

**3.5 No visual differentiation between "new batch" action and "view content" intent**
- There is no visual cue distinguishing "start a new video batch for this campaign" from "browse existing videos in this folder." Both would use the same click gesture on the folder card. This creates ambiguity.

---

## 4. Product Logic Issues

**4.1 Folder clicking does not show existing folder contents**
- **product.md says:** `"Daha önce üretilen videolar klasör yapısında bulunur"` and `"Her klasöre tıklayarak içeriğe erişim"` — the library should show previously created videos and folders should be viewable.
- **Current behavior:** Clicking any folder immediately navigates to product selection (stage "select"). There is no intermediate "folder content" view.
- **Impact:** The mock data shows folders with `videoCount: 8`, `videoCount: 3`, `videoCount: 12` — but clicking them never shows these videos. The video count badge is effectively decorative and misleading.

**4.2 `activeFolderId` was removed in Phase 7 with no replacement**
- The folder ID is no longer tracked anywhere after Phase 7 cleanup. When a user creates or opens a folder and proceeds through the flow, the flow has no association with which campaign/folder is being worked on. The SuccessStep has no way to record "these videos were saved to folder X."
- This was intentional for the prototype (no persistence), but the folder context being completely invisible downstream creates a disconnect with the campaign-based mental model product.md describes.

**4.3 Library is entry-only, not a true library**
- product.md describes the library as a place to *access previously produced videos by campaign*. The current implementation is a pure creation entry point — there is no "view existing videos" path whatsoever.
- For a validated prototype this may be acceptable, but the mock data (non-zero video counts) makes it appear that the library functionality exists when it doesn't.

---

## 5. Code / State Flow Issues

**5.1 `{10}` hardcoded in bottom hint**
- `LibraryStep.tsx` line 146: `"Her video oluşturma {10} token harcar."`
- This literal `{10}` is not using `TOKEN_COST_PER_VIDEO` constant from `src/data/tokens.ts`. If the cost changes, this copy won't update.

**5.2 `handleOpenFolder` parameter `_folderId` is silently dropped**
- After Phase 7, `handleOpenFolder(_folderId: string)` receives the folder ID but does nothing with it — no folder context is preserved anywhere downstream.
- This is not wrong for the prototype, but the underscore-prefix `_folderId` in a props-facing function makes the contract between LibraryStep and Videos.tsx feel intentionally broken, which may confuse future readers.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| CTA: `"İlk videoyu oluştur"` | product.md | ❌ Built as `"İlk klasörü oluştur"` |
| Empty state title: `"Henüz video klasörünüz yok"` | feedback-implementation.md | ❌ Built as `"Henüz klasör yok"` |
| TokenBadge in AppShell header (always visible) | feedback-implementation.md | ❌ In LibraryStep page header, causing positional jump |
| 2-column grid on desktop | feedback-implementation.md | ❌ 3 columns on large screens |
| Folder content view (existing videos per folder) | product.md | ❌ Not implemented (acceptable for MVP, but mock data creates false impression) |

---

## 7. Old Assumptions Still Visible

**7.1 Token cost hint on the Library screen**
- The `"Her video oluşturma 10 token harcar"` hint at the bottom of the library is a carry-over assumption that "token cost should be visible at all times." product.md places cost transparency specifically at the point of generation (template step), not at the entry screen.

**7.2 Hardcoded `{10}` literal**
- Suggests this copy was written quickly without connecting to the shared constant, which is a sign of an assumption that the cost is fixed forever at 10.

**7.3 Status badge (Aktif/Taslak) on folder cards**
- The `status` field was added to the `VideoFolder` interface in Phase 0, and the FolderCard renders it. However, product.md's folder spec never mentions a status concept for folders — it only lists: campaign name, creation date, video count. The Aktif/Taslak status is an assumption layered on top of the spec that has no defined logic for when a folder becomes "active" vs "draft."

---

## 8. Must-Fix Items

1. **Empty state CTA label** — change from `"İlk klasörü oluştur"` to focus on video creation intent, aligning with product.md's `"İlk videoyu oluştur"` direction.
2. **Empty state title** — change from `"Henüz klasör yok"` to `"Henüz video klasörünüz yok"` per spec.
3. **TokenBadge positional consistency** — resolve the visual jump between library (in-page badge) and other stages (step-bar badge). Either move it to AppShell permanently, or ensure the position is consistent.
4. **Grid columns** — change from 3 columns on large screens to 2, per spec.
5. **Remove bottom token-cost hint** — it belongs on the template/cost step, not the library screen.
6. **FolderCard videoCount vs. reality** — either set all mock folder `videoCount` values to `0` (they have no accessible content yet) to avoid misleading the user, or add a visual clarification that clicking starts a *new* creation batch.

---

## 9. Nice-to-Have Later

- A brief explanatory line on FolderCard like "Yeni video oluştur →" instead of a bare chevron, making the action intent clear.
- A subtitle on the screen that explains the campaign-based model to first-time users (e.g., "Kampanyalarınız için ürün videoları oluşturun ve yönetin").
- Folder card hover state that hints at the next action (e.g., "Videoları üret" label on hover).

---

## 10. Recommended Fix Direction

The screen's structural implementation is sound, but **the messaging and CTA labels are built from the organizational perspective (folders) instead of the user's goal perspective (creating campaign videos)**. product.md is clear: the entry point should guide a performance marketer into the workflow — "you're here to produce video assets for this campaign." The folder is the vehicle, not the destination.

The TokenBadge placement inconsistency is a quick structural fix. The grid column count is a one-line change. The most important change is the empty state CTA and the bottom hint — they both send the wrong message about what this screen is for.

---

---

# Phase 2 Audit: Product Selection

## 1. What Works

- **CTA label is correct** — "Choose template" is implemented as specified in product.md. The screen does not say "Generate video" — the validated decision is respected.
- **Search functionality** works correctly: name, brand, productId, and itemGroupId are all searchable. The search placeholder "Search by name, ID or group..." communicates the scope adequately.
- **"Recently added" sort indicator** is visible in the toolbar (desktop), matching the product.md requirement.
- **Product limit enforcement** works correctly — when 10 products are selected, unselected cards become disabled and non-clickable. The "You've reached the maximum" warning banner appears correctly.
- **CostEstimateBar** correctly updates live with selected count, estimated time (Clock icon), and estimated token cost. The `~` approximation prefix is used on both, which matches the "yaklaşık" (approximate) product.md requirement.
- **Insufficient balance state** shows amber color + AlertTriangle + "(insufficient balance)" label — correctly communicates the problem.
- **StackedImageIndicator** renders correctly on images with `additionalImageCount > 0`, returns null when count is 0.
- **Product metadata fields** are implemented: name, brand, status badge, productId, itemGroupId, category, main image — all present in both views.
- **StatusBadge** renders for every product card in both grid and list views.
- **List/grid view toggle** is functional and preserves selection state.
- **Select all** logic correctly respects the 10-product limit — it fills remaining slots rather than overflowing.
- **`onContinue` prop** is correctly wired to `handleChooseTemplate` in Videos.tsx, which transitions to the template stage.
- **`PRODUCT_SELECTION_LIMIT` constant** is used throughout (not hardcoded) — changing it once will propagate everywhere.

---

## 2. Messaging Issues

**2.1 Trust microcopy is completely absent**
- **product.md explicitly states:** `"Bu aşamada ödeme alınmayacaktır" veya benzeri güven veren mikrocopy (değerlendirmeye alınmalı)` — the cost confirmation bar should include a reassurance that no payment/token deduction happens at this stage.
- **Current:** The bar shows counts and estimates but contains zero trust-building copy. The user sees "~40 tokens" and may hesitate, not knowing whether this is a charge or just an estimate.
- This was called out as a product decision in product.md and is completely missing.

**2.2 Language inconsistency with Phase 1**
- LibraryStep is entirely in Turkish ("Video Kütüphanesi", "Ürün videolarınızı kampanya klasörlerine göre düzenleyin").
- SelectStep is entirely in English ("Select products to create videos", "Choose up to 10 products", "No products match your search").
- The product.md was written for a Turkish-language product. Switching to English at the product selection stage creates a jarring transition. The feedback-implementation.md also specified the empty state copy in Turkish: "Aramanızla eşleşen ürün bulunamadı".

**2.3 Empty search state is in English, spec specified Turkish**
- **Current:** `"No products match your search."`
- **feedback-implementation.md says:** `"Aramanızla eşleşen ürün bulunamadı"` — this was explicitly specified in Turkish.

**2.4 Limit warning is verbose and in English**
- **Current:** `"You've reached the maximum selection of 10 products. Deselect a product to choose a different one."`
- **feedback-implementation.md says:** `"Maksimum seçime ulaştınız (10/10)"` — shorter, cleaner, Turkish.
- The current text is too long and reads like an error message from a form validator, not marketing workflow UI.

**2.5 Zero-selection state microcopy is generic**
- **Current:** `"Select at least one product to continue."`
- Tells the user *what they can't do* rather than guiding them toward *what they should do*. Not contextual to the campaign video creation workflow.

**2.6 "Ready" status badge label is ambiguous**
- `StatusBadge` displays `"No video"` (amber) and `"Ready"` (green) for product status.
- **product.md says:** "Status (video var / yok)" — "has video" / "no video."
- "Ready" implies the product is ready for something (ready to generate? ready to publish?). It doesn't clearly say "already has a video." A user selecting products for video generation might not realize they're about to create a *second* video for a product that already has one.

---

## 3. UI/UX Issues

**3.1 No campaign/folder context visible anywhere on this screen**
- After selecting "Anneler Günü Kampanyası" from the library, the user arrives at Product Selection with zero indication of which campaign they're working on.
- The header says "Select products to create videos" — generic, campaign-agnostic.
- product.md's entire organizing principle is "campaign-based work" — the product selection screen should reinforce which campaign context the user is in.

**3.2 Positive (sufficient) balance state has no green indicator**
- **feedback-implementation.md says:** `"yeterli bakiye varsa yeşil badge"` (green badge when balance is sufficient).
- **Current:** When balance is sufficient and products are selected, the token estimate shows in neutral grey — no green signal, no reassurance.
- The amber/red warning for insufficient is implemented, but the inverse positive state (green = you're good to go) is absent.

**3.3 "Recently added" sort label is not interactive — looks broken**
- The sort indicator is a `<div>` with `ArrowUpDown` icon + "Recently added" text — no `onClick`, no hover state, no cursor change.
- **feedback-implementation.md says:** `"sağ üste 'Sort: Recently added' dropdown (tek seçenek veya ileride genişletilebilir basit seçici)"` — it should look like a control.
- A user who wants to sort differently will click it and nothing happens, creating a broken-interaction impression.

**3.4 "Recently added" is hidden on mobile**
- `className="hidden items-center gap-1.5 ... sm:flex"` — completely invisible below `sm` breakpoint.
- product.md says `"Recently added" seçeneği mutlaka bulunur` — no mobile exception noted.

**3.5 Category is virtually invisible in grid view**
- Grid view category: `text-[10px] text-muted-foreground/70` — 10px is below readable threshold and `/70` opacity makes it near-invisible.
- product.md lists category as a required visible product field.

**3.6 StackedImageIndicator design doesn't match the spec**
- **product.md says:** "iskambil kağıdı benzeri indicator" (playing-card stacked indicator) — a visual metaphor of stacked/offset cards.
- **Current:** A semi-transparent dark badge overlay with an `Images` icon and `+N` count. Functional but looks like a generic counter badge, not a "stacked photos" visual.

**3.7 Selection count is duplicated — toolbar pill AND sticky bar**
- Toolbar shows: `"{selectedIds.length} selected"` pill.
- Sticky bar shows: `"{selectedCount} / 10 products selected"`.
- The same count appears in two places with different formats, adding visual noise.

**3.8 List view metadata is hidden on small screens**
- In list view, the right metadata column (ID, Group, Category) is hidden below `md` breakpoint. The grid view shows more product data on small screens than list view does — an inversion of expectations.

---

## 4. Product Logic Issues

**4.1 `tags` field in Product is unused dead data**
- `ProductTag = "no-video" | "best-seller" | "recent"` type and `tags: ProductTag[]` field remain in the Product interface and all 12 mock products.
- The filter tabs that used these tags were removed in Phase 2. Tags are completely invisible in the UI and serve no purpose — legacy data from the pre-validated prototype.

**4.2 Search includes `brand` — beyond spec scope**
- Searches on: `name`, `brand`, `productId`, `itemGroupId`.
- product.md specifies: `"Ürün adı, ID ve item group ID"` — brand is not listed.
- Harmless extension, but the placeholder only says "name, ID or group" — brand search works invisibly.

**4.3 "Select all" button label change is confusing**
- When at limit and NOT all visible products are selected, the button shows `"Clear selection"` even though the user may want to adjust one item, not clear everything.
- The button alternates between three states with two using the same label, making the control unpredictable.

---

## 5. Code / State Flow Issues

**5.1 Campaign/folder context is lost at the transition boundary**
- `activeFolderId` was removed in Phase 7. `handleOpenFolder(_folderId)` now discards the folder ID entirely.
- The SelectStep has no way to know which campaign context it's operating under — making it impossible to show "Selecting products for: Anneler Günü Kampanyası" without re-adding state.

**5.2 `CostEstimateBar` does not receive `limit` or `tokenCostPerVideo` as props**
- **feedback-implementation.md spec:** `Props: selectedCount, limit, tokenCostPerVideo, tokenBalance`
- **Current:** Receives only `selectedCount` and `tokenBalance`; imports `PRODUCT_SELECTION_LIMIT`, `TOKEN_COST_PER_VIDEO`, `ESTIMATED_MINUTES_PER_VIDEO` directly from `tokens.ts`.
- Hard dependencies inside the component rather than injected props — not reusable or testable with different configurations.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| Trust microcopy: "Bu aşamada ödeme alınmayacaktır" or equivalent | product.md | ❌ Not present anywhere in bar or screen |
| Green/positive indicator when balance is sufficient | feedback-implementation.md | ❌ Only amber/warning state implemented |
| Sort as interactive control (dropdown appearance) | feedback-implementation.md | ❌ Static non-interactive label |
| Empty search state in Turkish: "Aramanızla eşleşen ürün bulunamadı" | feedback-implementation.md | ❌ Shows English copy |
| Limit warning: "Maksimum seçime ulaştınız (10/10)" | feedback-implementation.md | ❌ Shows verbose English string |
| Campaign context carried forward from Phase 1 | product.md (campaign-based org) | ❌ No folder/campaign reference on screen |

---

## 7. Old Assumptions Still Visible

**7.1 `ProductTag` and `tags` field are legacy, unused**
- Remnants of the pre-validated filter tab system. Tags were never removed from the data model even though the UI feature they powered was removed in Phase 2.

**7.2 "Ready" status language is from the old prototype**
- `"Ready"` (green) label carries over from the original non-validated prototype where it may have meant "ready to send to feed." product.md defines this as "video var" (has video) — a different meaning.

---

## 8. Must-Fix Items

1. **Add trust microcopy** to CostEstimateBar — reassurance that token deduction happens at generation, not at selection.
2. **Add positive (green) balance indicator** — signal "you're good to go" when balance is sufficient and products are selected.
3. **Fix "Recently added" to look like an interactive control** — cursor-pointer, hover state, dropdown affordance even if single-option.
4. **Show campaign/folder context** — display which campaign/folder the user came from (breadcrumb or subtitle).
5. **Fix "Ready" status badge label** — rename to "Has video" or equivalent to clarify the product already has a video asset.
6. **Fix empty search copy** — use "Aramanızla eşleşen ürün bulunamadı" per spec.
7. **Fix limit warning copy** — shorten to "Maksimum seçime ulaştınız (10/10)" per spec.

---

## 9. Nice-to-Have Later

- Remove `tags` / `ProductTag` from the Product interface and mock data.
- Make `CostEstimateBar` accept `limit` and `tokenCostPerVideo` as props instead of importing directly.
- Increase category text size/contrast in grid view.
- Add "Recently added" sort indicator visibility on mobile.
- Revise StackedImageIndicator to use a stacked-card visual metaphor rather than a count badge overlay.
- Consider removing the toolbar selection pill since the sticky bar already shows the count with full context.

---

## 10. Recommended Fix Direction

Two issues dominate: **trust** and **context**.

The trust issue is the most critical product-level gap — product.md explicitly flagged the need for reassurance microcopy that no payment happens at selection time, and it is completely absent. A performance marketer seeing "~40 tokens" in the bar with no explanation may hesitate or feel uncertain about whether selecting products is already committing budget.

The context issue comes directly from Phase 1's folder architecture: the campaign context evaporates the moment the user enters product selection. The whole product rationale is campaign-based organization — selecting products for "Anneler Günü Kampanyası" should feel different from selecting products for "Yaz Koleksiyonu." Currently they look identical.

The other fixes (status badge wording, sort control affordance, copy language consistency) are smaller corrections that bring messaging in line with the validated product spec.

---

---

# Phase 3 Audit: Template Selection

## 1. What Works

- **Full-page implementation** — `TemplateSelectionStep.tsx` is a proper full-page step component, not a modal or dialog. The validated product decision ("açık grid yapısında gösterilir") is correctly implemented.
- **GenerateDialog removed from active flow** — `GenerateDialog.tsx` remains on disk but is not imported anywhere in the active route. The legacy dialog pattern ("gizli Change butonu") is not surfaced to the user.
- **Templates visible on load** — All 4 templates are visible immediately in a 2×2 grid on desktop / 1-column on mobile. The user never faces a blank state.
- **Template-first layout** — Templates appear at the top of the page. Guided fields come below. This matches the product principle: "Template-first, guided."
- **No blank prompt-first experience** — The user sees templates before any text input area. The guided fields are labeled optional, preventing anxiety about needing to write a prompt to proceed.
- **All 4 guided fields present** — "Sektör", "Ürün tipi", "Background / konsept", "Tema / kampanya bağlamı" are all implemented as dropdowns. A fifth free-text area ("Serbest tema notu") is also present.
- **No "Change" button** — product.md explicitly says: "Gizli 'Change' butonu kullanılmaz." The new TemplateCard grid uses direct click-to-select. No picker dialog exists.
- **Default template is `product-spotlight`** — per spec; the card is pre-selected on first render.
- **Cost/time confirmation shown before generate** — `GenerateCostConfirm` is rendered at the bottom, above the Generate button. User sees videos count, estimated time, and token cost before committing.
- **Insufficient balance → CTA disabled** — `canGenerate = videoCount > 0 && hasEnoughBalance` gates the button correctly.
- **1:1 format explicitly stated** — "Output format: 1:1, 1080×1080." appears in GenerateCostConfirm.
- **Social Story correctly annotated** — `helperText: "Produced at 1:1 in MVP — vertical V2"` is present on the Social Story TemplateCard. The V2 note and MVP format constraint are communicated.
- **No text overlay fields** — Guided fields cover sector, theme, background, and product type only. No copy/text overlay inputs exist, correctly excluding the out-of-scope feature.
- **No multi-dimension generation** — No aspect ratio selector or multi-format options anywhere on the screen.
- **Selected products strip** — Shows stacked product images (up to 5) and names, giving the user immediate context for which products they're generating videos for.
- **300ms transition before stage change** — `handleClick` uses a 300ms `setTimeout` before calling `onGenerate()`, giving brief visual feedback that generation is starting.

---

## 2. Messaging Issues

**2.1 Page subtitle is generic and uses technical jargon**
- **Current:** `"Select the video format, then optionally configure the production context."`
- "Production context" is internal technical language. A performance marketer doesn't think in terms of "production context" — they think in terms of campaign parameters, creative direction, or video style.
- product.md's framing: the user is setting up their campaign's video format and providing context for what the creative should look and feel like. The subtitle should communicate *that*, not abstract configuration.

**2.2 Section label "Production settings" misframes the purpose of guided fields**
- **Current:** Section heading before GuidedPromptFields: `"PRODUCTION SETTINGS"`
- product.md calls these fields: "Guided prompt alanları (sektör, tema, kampanya bağlamı, background, ürün tipi gibi yönlendirmeli giriş alanları)."
- "Production settings" sounds like technical or studio settings — audio levels, rendering options. It does not communicate "tell us about your campaign so the AI knows what kind of creative to make."
- A label like "Kampanya bağlamı" or "Video yaratıcı bağlamı" would be meaningfully closer to the product intent.

**2.3 "All fields optional — fill what's relevant" is English inside a Turkish-labeled field group**
- The hint `"All fields optional — fill what's relevant"` is in English, but the 4 field labels it accompanies are in Turkish ("Sektör", "Ürün tipi", etc.).
- This mixing creates a visually inconsistent experience and signals that the screen was assembled from two different language conventions.

**2.4 GenerateCostConfirm heading is a status statement, not a decision prompt**
- **Current:** `"Ready to generate {n} videos"`
- This reads as a system status update ("the system is ready") rather than a clear call-to-action or confirmation framing.
- The user is about to commit tokens and kick off generation — the copy should prompt decision-making: "X video üretilecek" or "Bu videonları üretmek istiyor musunuz?" The current phrasing feels passive.
- feedback-implementation.md spec: `"{n} video üretilecek"` — a direct declarative statement, not a "ready" status.

**2.5 GenerateCostConfirm stat labels are in English**
- Stat labels: "Videos", "Estimated time", "Token cost" — all English.
- The rest of the guided fields section uses Turkish labels. The inconsistency is jarring: user reads Turkish field names above, then sees English stat labels below.
- feedback-implementation.md spec: `Tahmini süre: ~{n × 2} dk` / `Tahmini maliyet: {n × 10} token` / `Kalan bakiye: {balance - cost} token` — all Turkish.

**2.6 1:1 format note is nearly invisible**
- **Current:** Line 91 in GenerateCostConfirm: `"Tokens are deducted when generation starts. Output format: 1:1, 1080×1080."` — rendered as `text-xs text-muted-foreground/60`.
- This is the single most important format constraint in the MVP (product.md: "Tüm üretimler 1:1, 1080×1080 formatında yapılır.") yet it's placed in the smallest, lowest-contrast text on the page, visually subordinate to everything else.
- A user who assumes they're getting vertical videos for their Instagram Stories will not notice this disclaimer.

**2.7 CTA wording is correct but context is missing**
- **Current:** `"Generate videos"` — matches spec.
- However, no secondary copy explains what happens next: "generation takes ~X minutes, you'll be taken to a progress screen." A first-time user clicking "Generate videos" doesn't know whether it'll be instant or wait-based.

---

## 3. UI/UX Issues

**3.1 No campaign/folder context on screen (continues Phase 2 gap)**
- The selected products strip shows product images and names, but there is zero indication of which campaign/folder the user is working in.
- If the user came from "Anneler Günü Kampanyası," the template selection screen looks identical to if they came from "Yaz Koleksiyonu." The campaign context that product.md builds the entire organizational model around is invisible here too.

**3.2 Section headings are visually identical — flat hierarchy**
- Both section labels ("VIDEO FORMAT" and "PRODUCTION SETTINGS") use the same `text-sm font-semibold uppercase tracking-widest text-muted-foreground` styling.
- With identical visual treatment, the page reads as a flat sequence of settings rather than a structured "choose first, configure second" flow. The template selection visually feels equal in weight to the guided fields, when template choice is the primary decision and guided fields are secondary.

**3.3 Social Story preview image is misleadingly landscape**
- `TemplateCard` renders a `aspect-[4/3]` container for all templates, including Social Story.
- Social Story is conceptually vertical/mobile-first (the template description says "Mobile-first format optimised for fast-scrolling placements"). Its preview image (`photo-1521572267360-ee0c2909d518`, a person in a t-shirt) is landscape-cropped in a 4:3 container.
- A user seeing this card has no visual indication that the template is intended for vertical placements — the card contradicts its own purpose. Especially since the 1:1 MVP note is in tiny text, the user has conflicting signals: description says "mobile/vertical," card shows landscape.

**3.4 "Balance remaining" is in a different visual treatment than the cost stats**
- Stats "Videos", "Estimated time", "Token cost" are rendered as `StatRow` components with colored icon + label + value in a consistent 3-column grid.
- "Remaining after generation: X tokens" is rendered as a full-width info box (`rounded-lg bg-muted/50`) with a `Coins` icon and inline text.
- The remaining balance is as important as the cost stat but is rendered in a visually subordinate, secondary treatment. The user has to scan two different visual patterns to understand the full cost picture.

**3.5 Guided fields section uses a card wrapper; template section does not**
- Templates are laid out directly on the page background.
- GuidedPromptFields is wrapped in `rounded-2xl border bg-card p-5`.
- This inconsistency signals that the guided fields are more "contained" and formal than the template grid. If anything, the inverse is true — template selection is the core decision and should feel more defined.

**3.6 "themeCustom" auto-populate only fills when empty — changing theme after typing breaks the link**
- In `GuidedPromptFields.tsx`, line 58-60: when a theme preset is selected, the textarea auto-fills only `if (v && !value.themeCustom)`.
- If the user types custom text first, then selects a preset, the textarea doesn't update. If they select a preset, then type, then select a different preset, the textarea still doesn't update.
- This creates a confusing experience where the dropdown and the textarea appear to be in sync initially but then silently diverge. The user may not realize their free-text note no longer corresponds to their selected preset.

**3.7 Products strip only renders up to 5 images even with 10 selected**
- The strip slices `products.slice(0, 5)`. With 10 products selected, the strip shows 5 stacked images and "+5 more" text.
- This creates a visual impression that only 5 products are in context. Acceptable as a space constraint, but no tooltip or expandable detail tells the user they can see all 10. The cost confirmation shows the full count, so this is resolvable in context — but the strip undersells the selection.

---

## 4. Product Logic Issues

**4.1 Template "recommendation" concept is completely gone — no cue on default selection**
- GenerateDialog had a `recommendation` field: "No discount detected → best for product-focused format" shown as a badge on Product Spotlight.
- product.md says: "MVP'de şablon önerisi statiktir. Varsayılan şablon: product-spotlight." Static recommendation is fine for MVP.
- However, the new `templates.ts` data model has no `recommendation` field at all — and the TemplateCard has no indication of *why* Product Spotlight is pre-selected. A user sees 4 equally-presented cards with one already selected, but no hint that "this is the default/recommended starting point."
- The absence of even a subtle "Başlangıç için önerilir" note means the default selection reads as arbitrary.

**4.2 `GuidedPrompt` state is always reset when returning to this stage**
- `TemplateSelectionStep` initializes its local state with `DEFAULT_GUIDED_PROMPT` on every mount.
- If a user fills out all guided fields, proceeds to progress, then navigates back (e.g., "Back" from progress → review → template), their guided field entries are wiped.
- product.md doesn't explicitly address state persistence on back-navigation, but from a UX perspective, losing entered context on back-navigation is frustrating — especially since the fields were optional and the user made deliberate choices.

**4.3 `GenerateCostConfirm` hardwires `TOKEN_COST_PER_VIDEO` via import, not prop**
- **feedback-implementation.md spec:** `Props: videoCount, tokenCostPerVideo, tokenBalance`
- **Current:** Props are `videoCount, tokenBalance, onGenerate` — `tokenCostPerVideo` is imported directly from `@/data/tokens`.
- Same issue as `CostEstimateBar` in Phase 2. The component is not reusable or independently testable with different cost values.

---

## 5. Code / State Flow Issues

**5.1 `TemplateSelectionStep` has no `onBack` prop — back is step-bar-only**
- Back navigation is handled entirely by the `getPreviousStage("template") = "select"` logic in Videos.tsx step bar.
- The component itself has no internal back affordance. This means if the step bar were hidden or the "Back" button were removed, there would be no escape from the template step.
- feedback-implementation.md spec: `Props: products, tokenBalance, onGenerate(opts), onBack()` — `onBack` was specified but not implemented.
- In the current UI this is benign because the step bar's Back button always works. But the component interface is incomplete per spec.

**5.2 `GuidedPromptFields` free-text max is 200 chars, spec says 100**
- Line 74 in `GuidedPromptFields.tsx`: `maxLength={200}`
- feedback-implementation.md: "Tema alanında ek free text input (textarea, max 100 karakter)"
- Minor deviation. 200 chars is more permissive and not harmful, but diverges from spec.

**5.3 `TemplateSelectionStep` local `guidedPrompt` state is redundant with Videos.tsx**
- Videos.tsx holds `const [guidedPrompt, setGuidedPrompt] = useState<GuidedPrompt>(DEFAULT_GUIDED_PROMPT)` at the top level.
- `TemplateSelectionStep` also holds `const [guidedPrompt, setGuidedPrompt] = useState<GuidedPrompt>(DEFAULT_GUIDED_PROMPT)` internally.
- The component-local state is the one that's actually used. The Videos.tsx top-level `guidedPrompt` state is only set when `handleStartGeneration` is called — it's a one-time write on generate, not a two-way sync.
- This means the `guidedPrompt` state in Videos.tsx serves no purpose between renders — it's overwritten each time generation starts. The architectural intent (holding it at the top for later use in Edit Prompt?) is unclear from the code.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| `onBack` prop on `TemplateSelectionStep` | feedback-implementation.md | ❌ Not implemented as prop (step bar handles back externally) |
| `tokenCostPerVideo` as prop to `GenerateCostConfirm` | feedback-implementation.md | ❌ Imported directly from tokens.ts |
| Cost confirmation labels in Turkish (`Tahmini süre`, `Tahmini maliyet`, `Kalan bakiye`) | feedback-implementation.md | ❌ Labels are in English |
| Heading: `"{n} video üretilecek"` | feedback-implementation.md | ❌ Shows "Ready to generate {n} videos" |
| Max 100 chars on free-text theme note | feedback-implementation.md | ❌ Set to 200 chars |
| Default recommendation note on pre-selected template | product.md (static default rationale) | ❌ No indication why product-spotlight is pre-selected |
| Campaign/folder context visible on screen | product.md (campaign-based org) | ❌ Not present (same as Phase 2) |

---

## 7. Old Assumptions Still Visible

**7.1 GenerateDialog.tsx on disk — represents the entire discarded architecture**
- The file contains: a `showPicker` state that opens a Dialog for template change, hover video preview on templates (V2/out of scope), `renderPreviewChrome`/`renderPickerChrome` functions for each template, "Change" button (explicitly removed in validated spec), a separate internal `TEMPLATES` array (disconnected from `src/data/templates.ts`), and "draft" language ("Generate draft for...").
- None of this is active, but the file is a complete representation of the pre-validated architecture. It shows what was replaced and why — which is useful context, but also means any developer reading the codebase will see a very different (and more complex) implementation of the same feature.

**7.2 "Production settings" section label — studio/technical framing assumption**
- "Production settings" carries an assumption that the user thinks of this as a production configuration interface (like video editing software settings). The validated product is a marketing tool — users think in campaign terms, not production parameters.

**7.3 "optionally configure the production context" — developer-facing language in user-facing copy**
- "Configure" and "production context" are developer/product framing. A performance marketer setting up a Mother's Day campaign doesn't think "I need to configure the production context." They think "I want Anneler Günü vibes, stüdyo arka plan, moda sektörü."

**7.4 English/Turkish language split**
- Phase 1 (Library) was entirely Turkish. Phase 2 (Select) was entirely English. Phase 3 splits at the field level: page-level copy is English, field labels are Turkish. This is not an explicit old assumption, but it's a symptom of building incrementally without a consistent language decision — each phase defaulted to whatever language the developer was writing in at the time.

---

## 8. Must-Fix Items

1. **Fix page subtitle** — Replace "Select the video format, then optionally configure the production context." with copy that speaks to the performance marketer's intent: what video style they want, and what campaign context the AI should know about.
2. **Rename "Production settings" section label** — Use language that communicates campaign context guidance, not technical settings. Spec calls these "guided prompt alanları" — something like "Kampanya bağlamı" is more aligned.
3. **Translate GenerateCostConfirm stat labels and heading** — "Ready to generate X videos" → `"{n} video üretilecek"`. Stat labels "Estimated time" / "Token cost" → Turkish equivalents per feedback-implementation.md spec.
4. **Make the 1:1 format note more prominent** — Currently `text-xs text-muted-foreground/60` — nearly invisible. The output format is the most important constraint in MVP scope. It should be visible at normal reading size.
5. **Add default-template rationale** — Add a subtle "Önerilen" or similar indicator on the Product Spotlight card explaining why it's pre-selected, preventing the default from looking arbitrary.
6. **Campaign/folder context** — Carry forward the campaign name from Phase 1 to this screen, so the user knows which campaign they're building the template for.
7. **Fix `"All fields optional — fill what's relevant"` hint** — Translate to Turkish to be consistent with the Turkish field labels it accompanies.

---

## 9. Nice-to-Have Later

- Pass `tokenCostPerVideo` as a prop to `GenerateCostConfirm` instead of importing directly, per spec.
- Add `onBack` prop to `TemplateSelectionStep` per spec, even if the step bar handles it for now.
- Persist `guidedPrompt` state when user navigates back to the template step — avoid wiping their campaign context choices.
- Make `themeCustom` auto-populate update when the preset changes (not just when empty), or visually decouple the two inputs so the user understands they're independent.
- Adjust the Social Story TemplateCard preview to use a portrait-cropped or 1:1 image that better represents a mobile/story format.
- Shorten free-text max length from 200 to 100 to match spec.
- Address the card wrapper inconsistency — either wrap templates in a card or remove the card from guided fields, so the two sections have a consistent visual treatment.

---

## 10. Recommended Fix Direction

The structural implementation of Phase 3 is strong — full page, open grid, template-first, cost confirmation before generate. The core product decisions are correctly implemented.

The dominant problem is **framing language**: the screen sounds like a generic video production configuration tool, not a performance marketing creative workflow. "Production settings," "configure the production context," and English stat labels pull the screen away from the performance marketing identity that product.md is built around. The guided fields themselves — Anneler Günü, Ramazan, Yaz Koleksiyonu, Beyaz fon, Lifestyle — are excellent and deeply contextual. The framing around them is what undercuts them.

The second issue is **format constraint visibility**: "Output format: 1:1, 1080×1080" is the single most important limitation in the entire MVP, yet it's rendered in the smallest, lowest-contrast text on the page. Any user with Social Story in mind who doesn't notice this will be surprised at review time.

The third issue is the **ongoing language inconsistency** that started in Phase 2 and continues here. A decision needs to be made: is this a Turkish-language product (as product.md implies) or an English-language product? The current mixed state — Turkish in one section, English in another, Turkish field labels inside English framing — is the worst of both worlds. It creates cognitive friction on every screen transition.

---

---

# Phase 4 Audit: Generation Progress

## 1. What Works

- **One job per selected product** — `products.map(...)` in `GenerationProgressStep` creates exactly one `VideoProgressJob` per selected product. The list always reflects the full selection. ✅
- **Three distinct job states** — `pending` / `generating` / `ready` are visually differentiated: opacity-50 gray card for pending, primary-tinted card with spinner for generating, success-tinted card with checkmark for ready. ✅
- **Staggered simulation** — Each video becomes "generating" then "ready" in sequence at `(i+1) × DEMO_VIDEO_GENERATION_DELAY_MS` (3s each). The progressive reveal is correctly implemented. ✅
- **Progress bar** — A smooth animated bar fills proportionally to `readyCount / total`. It transitions at 700ms ease-out, giving a satisfying visual rhythm. ✅
- **Early review option** — As soon as `anyReady`, a CTA card appears: "You can start reviewing the videos that are ready — you don't have to wait for all of them." + "Review videos →" button. This correctly implements the product.md principle: "Tamamlanan video hemen izlenebilir." ✅
- **Timeout cleanup on unmount** — `useEffect` returns a cleanup function that clears all `window.setTimeout` references. When the user navigates to review before all timeouts fire, no state updates occur after unmount. ✅
- **Back navigation correctly blocked** — `getPreviousStage("progress")` returns `null`, so the step-bar Back button is effectively inert for this stage. product.md implies generation cannot be cancelled once started. ✅
- **Token deduction handled upstream** — `handleStartGeneration` in `Videos.tsx` deducts tokens before entering this step. The progress screen correctly doesn't handle token state. ✅
- **"All videos ready!" complete state** — When `allComplete`, the header changes to a success message with `CheckCircle` icon. The CTA card switches to a success-tinted full-width button. ✅
- **`onComplete` force-completes all jobs** — `handleProgressComplete` in `Videos.tsx` immediately marks all `VideoJob` entries as `"ready"` with `SAMPLE_VIDEO` URL before transitioning to review. This ensures the review step always receives a complete, consistent job list regardless of when the user clicks the CTA. ✅

---

## 2. Messaging Issues

**2.1 Estimated time display is deeply misleading in the demo**
- `estimatedRemainingMin = inFlightCount * ESTIMATED_MINUTES_PER_VIDEO` uses the constant `ESTIMATED_MINUTES_PER_VIDEO = 2`.
- With 5 products, the screen shows `~10 min remaining` at the start. But each video completes every 3 real seconds. The entire 5-video demo runs in 15 actual seconds.
- A user sees "~10 min remaining," waits ~5 seconds, and suddenly all videos are done. The timing estimate is not only wrong — it contradicts the user's lived experience immediately.
- feedback-implementation.md specifies `DEMO_VIDEO_GENERATION_DELAY_MS = 3000` and acknowledges the compression ("Demo modunda gerçek 2dk beklenmez; her video 3 saniyede 'tamamlanır'") but does not prescribe what to display. The current implementation applies real-world timing constants to a demo-speed simulation — they should never be combined.

**2.2 All status labels are in English**
- feedback-implementation.md spec labels (Turkish):
  - `"Sırada bekliyor"` — implemented as `"Pending"`
  - `"Üretiliyor..."` — implemented as `"Generating..."`
  - `"Hazır ✓"` — implemented as `"Ready"`
- Page heading: `"Generating videos..."` — spec: `"Videolar üretiliyor..."`
- Completion heading: `"All videos ready!"` — spec: `"Tüm videolar hazır!"`
- Subtitle: `"X videos generated successfully."` — spec equivalent: `"{tamamlanan} / {toplam} video hazır"`
- Early review note: `"You can start reviewing the videos that are ready — you don't have to wait for all of them."` — spec: `"İncelemeye başlayabilirsiniz"` (much shorter)
- CTA: `"Review videos →"` — spec: `"Videoları incele →"`

**2.3 No context about what is being generated**
- The screen says "Generating videos..." with no reference to which template is being used, which campaign this is for, or any guided prompt context.
- product.md describes the progress screen as the step where the user actively waits while videos are created. The user has zero reminder of what they set up in Phase 3 — template, theme, sector, background are all invisible here.
- A performance marketer who set up "Anneler Günü / Moda & Giyim / Lifestyle background" has no confirmation that's what's being generated.

**2.4 No messaging when no videos are ready yet (zero-ready state)**
- When all jobs are "pending" or the first job is "generating," there's nothing below the progress bar except the flat job list.
- The `anyReady` guard hides the CTA box entirely before the first video completes.
- The user is watching a progress bar and job list with no "sit tight" guidance. There's no reassurance like "İlk videonuz birkaç dakika içinde hazır olacak" or even a simple loading note.

**2.5 "~X min remaining" disappears entirely at 0 remaining, then jumps to complete**
- When the last video is "generating," `inFlightCount = 1` → shows `~2 min remaining`.
- The next tick: last video becomes "ready," `inFlightCount = 0`, `allComplete = true` → header switches to "All videos ready!" with no intermediate state.
- The transition from "~2 min remaining" to "All videos ready!" is abrupt — no count-down from 1 to 0. In real usage this would be a clean UI moment, but in the demo the "~2 min remaining" flashes for one render cycle before jumping to complete.

---

## 3. UI/UX Issues

**3.1 Timing display makes the prototype feel broken**
- With 3 products selected, the screen shows `~6 min remaining` at start, then 9 seconds later shows "All videos ready!" The mismatch is jarring enough to undermine confidence in the prototype itself.
- During a demo or user test, this will immediately prompt "why does it say 6 minutes if it just took 9 seconds?" — breaking the suspension of disbelief that makes a prototype useful.
- Options: (a) remove the time estimate on the progress step entirely in demo mode, (b) base the displayed time on `DEMO_VIDEO_GENERATION_DELAY_MS` ("~X seconds remaining" in demo), or (c) add a visible "Demo mode — compressed speed" disclaimer.

**3.2 No visual grouping of job states**
- All jobs (pending, generating, ready) are in a flat `space-y-2` list. As jobs transition to ready, the visual sequence becomes a top-to-bottom mix of green/primary/muted cards.
- feedback-implementation.md spec envisions distinct sections: `Generating kart (aktif üretim)` and `Pending kart` and `Ready kart`. A visual separation or ordering (ready → generating → pending) would make the list more scannable.
- Currently as the list grows longer (10 products), completed items at the top look visually identical in position to incomplete items at the bottom.

**3.3 "Review videos →" CTA causes layout shift when it appears**
- The CTA block (`mt-8 rounded-2xl border p-5`) is conditionally rendered when `anyReady` becomes true. Its appearance shifts the page layout by ~100px downward.
- On mobile or in a fixed-height viewport, this shift can be disorienting — the user is watching a progress list and suddenly the page jumps.
- It would be less jarring to reserve space for the CTA block from the start (rendered but disabled/muted before `anyReady`).

**3.4 "Ready" video thumbnail uses the product image with a play button — not a real video thumbnail**
- In `VideoProgressCard`, the ready state shows:
  ```tsx
  <img src={job.productImage} alt="Video thumbnail" />
  ```
  with a play button overlay.
- The product image is the input, not the output. Showing it as a "video thumbnail" with a play icon implies the user can preview the generated video from this screen.
- Clicking the thumbnail does nothing — there's no `onClick` handler.
- This is a dead affordance: a play button icon with no action. A user will naturally try to click it. feedback-implementation.md spec: `"İncele" butonu aktif` on ready cards — but the current implementation renders an unclickable play icon, not a button.

**3.5 No "İncele" action button on ready cards**
- feedback-implementation.md: `"Ready" durumunda "İncele" butonu aktif` — a per-card "Inspect/Review" button that could eventually navigate to that specific video in the review step.
- Current implementation has no button on ready cards — only the unclickable thumbnail.
- In a 10-video run, having per-card "Review this one" buttons would help users who want to check a specific product's video immediately.

**3.6 Pending cards at 50% opacity are hard to read**
- `isPending && "border-border bg-card opacity-50"` — at 50% opacity, the product name and image are noticeably faded.
- For users with lower-quality monitors or in bright environments, dimmed cards can be difficult to parse.
- A lighter visual treatment (e.g., reduced border emphasis + muted text, rather than full opacity reduction) would preserve readability while still communicating "not yet active."

**3.7 The progress bar is thin (h-1.5) and easy to miss**
- At 1.5px height (roughly 6px rendered), the progress bar is the smallest visual element on the page. It sits between the header section and the job list.
- For a screen that is fundamentally about communicating progress, the primary progress indicator is the least prominent element. The header count ("3 / 5 videos ready") is more readable, but the bar itself provides no meaningful additional signal at this size.

---

## 4. Product Logic Issues

**4.1 `template` and `guidedPrompt` are NOT passed to `GenerationProgressStep` — spec requires them**
- feedback-implementation.md Phase 4 spec: `Props: products, template, guidedPrompt, onComplete()`
- Current component interface: `Props: products, onComplete`
- `template` and `guidedPrompt` are never passed. There is no way to show "Generating with: Product Spotlight — Anneler Günü — Moda & Giyim" context in the progress screen without these props.
- These were presumably intentionally omitted during implementation (the progress screen doesn't need them to function), but they were spec'd for a reason: providing context reassurance to the user during the wait.

**4.2 Demo timing and real-world timing constants are mixed in the same computation**
- `estimatedRemainingMin = inFlightCount * ESTIMATED_MINUTES_PER_VIDEO` uses `ESTIMATED_MINUTES_PER_VIDEO = 2`.
- The actual simulation drives off `DEMO_VIDEO_GENERATION_DELAY_MS = 3000`.
- These two constants serve different purposes (UI display vs. simulation speed) but the UI display is computed from the wrong one for the demo context.
- Both constants are correctly defined and separated in `tokens.ts` — the problem is how they're used, not how they're defined.

**4.3 "Generating" state only applies to one video at a time (sequential, not parallel)**
- The simulation uses staggered timeouts: video 1 generates first, then video 2, etc.
- product.md implies: "Her video tamamlandıkça ekranda belirir" — which suggests sequential is fine.
- However, the spec also says "Her video yaklaşık 2 dakika sürebilir. 10 video seçildiyse kullanıcı bu süre zarfında tamamlanan videoları görmeye başlar" — implying potentially parallel generation where some finish before others.
- For the demo, sequential is acceptable and actually cleaner to watch. But the UI shows exactly one video "Generating..." at a time, which may give the impression that videos are generated one-by-one sequentially, when real AI generation would likely be parallel.

**4.4 No failed/error state**
- product.md doesn't explicitly define an error state for generation, and feedback-implementation.md doesn't specify one either.
- For a validated prototype, this is acceptable. However, the absence is worth noting: if the prototype is shown to stakeholders, a question about "what happens if generation fails?" has no answer in the current UI.

---

## 5. Code / State Flow Issues

**5.1 `useEffect` dependency array is empty but uses `products` at closure time**
- `useEffect(() => { ... }, [])` — the eslint-disable comment acknowledges this.
- `products` is captured at component mount and never re-evaluated. Since `GenerationProgressStep` is only mounted once per generation run (it unmounts when `stage` changes), this is practically safe.
- However, if `products` ever changes during the progress step (which currently can't happen but could in a future refactor), the simulation would not restart. The `eslint-disable` comment suppresses the warning rather than addressing the dependency.

**5.2 Local `jobs` state and parent `videoJobs` state are parallel but independent**
- `GenerationProgressStep` manages its own `jobs: VideoProgressJob[]` state locally.
- `Videos.tsx` manages `videoJobs: VideoJob[]` at the top level.
- These two arrays are initialized independently and evolve independently. The local state drives the UI. The parent state is set once on `onComplete()` via `handleProgressComplete`.
- This means: during the progress simulation, the parent `videoJobs` state remains stale (all "pending" from initialization in `handleStartGeneration`). Only when `onComplete` fires does the parent state jump to "all ready."
- For the current implementation this is fine (the review step uses parent state, not local state). But the dual-state architecture means there's no single source of truth for video job status during the progress phase.

**5.3 `inFlightCount` includes both "pending" and "generating" in the remaining estimate**
- `inFlightCount = jobs.filter((j) => j.status !== "ready").length`
- This means: with 5 videos, 1 generating, 4 pending: `inFlightCount = 5` → `~10 min remaining`.
- But the first video will be ready in 3 seconds (demo speed). The estimate treats all in-flight as if they're waiting to start, which overstates the remaining time even by real-world standards (where parallel generation might be happening).

**5.4 The component accepts `products: Product[]` but only uses `id`, `name`, and `image`**
- The full `Product` type includes `productId`, `itemGroupId`, `category`, `brand`, `additionalImageCount`, etc.
- Only 3 fields are used. The prop type could be a narrower interface for clarity, but this is a minor architectural point.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| `template` prop on `GenerationProgressStep` | feedback-implementation.md | ❌ Not passed or used |
| `guidedPrompt` prop on `GenerationProgressStep` | feedback-implementation.md | ❌ Not passed or used |
| Status label: `"Sırada bekliyor"` | feedback-implementation.md | ❌ Shows "Pending" |
| Status label: `"Üretiliyor..."` | feedback-implementation.md | ❌ Shows "Generating..." |
| Status label: `"Hazır ✓"` | feedback-implementation.md | ❌ Shows "Ready" |
| Page heading: `"Videolar üretiliyor..."` | feedback-implementation.md | ❌ Shows "Generating videos..." |
| Completion heading: `"Tüm videolar hazır!"` | feedback-implementation.md | ❌ Shows "All videos ready!" |
| CTA label: `"Videoları incele →"` | feedback-implementation.md | ❌ Shows "Review videos →" |
| Early note: `"İncelemeye başlayabilirsiniz"` | feedback-implementation.md | ❌ English verbose equivalent |
| `"İncele"` button on ready cards | feedback-implementation.md | ❌ Unclickable thumbnail instead |
| Campaign/folder context visible | product.md | ❌ Not present anywhere on screen |

---

## 7. Old Assumptions Still Visible

**7.1 Real-world timing displayed in a demo-speed simulation**
- The decision to use `ESTIMATED_MINUTES_PER_VIDEO = 2` for the displayed remaining time was made for the real product. In the demo, this constant is misapplied — it creates the illusion of a real backend process that immediately contradicts itself.
- This assumption ("show the user how long it would really take") is valid for a production implementation, not for a compressed 3-second-per-video demo prototype.

**7.2 English-only labels throughout**
- Continuing the Phase 2/3 pattern: status labels, headings, CTAs, and notes are all in English despite the product.md being a Turkish-language product and feedback-implementation.md specifying Turkish labels.

**7.3 Product image as video output placeholder**
- Showing `job.productImage` as the "video thumbnail" in the ready card with a play button overlay carries over the assumption that a product image is a reasonable proxy for a generated video thumbnail.
- In a real implementation, the AI service would return a thumbnail frame. Using the input image as the output thumbnail creates a visual where "before" and "after" are indistinguishable — the product photo and the "video thumbnail" look the same.

---

## 8. Must-Fix Items

1. **Fix the timing display** — Either (a) remove "~X min remaining" entirely in demo mode and replace with a demo-honest note, (b) compute remaining time from `DEMO_VIDEO_GENERATION_DELAY_MS` instead of `ESTIMATED_MINUTES_PER_VIDEO`, or (c) add a visible demo-mode qualifier. Showing "~10 min remaining" when 30 seconds will pass makes the prototype undemonstrable.
2. **Translate all status labels and headings** — "Pending" → "Sırada bekliyor", "Generating..." → "Üretiliyor...", "Ready" → "Hazır ✓", page heading → "Videolar üretiliyor...", CTA → "Videoları incele →", completion → "Tüm videolar hazır!" per spec.
3. **Add zero-ready state messaging** — Before any video is ready, show a "sit tight" guidance note so the user isn't staring at a progress bar with no direction.
4. **Fix the unclickable play button on ready cards** — Remove the play icon if clicking does nothing, or implement the "İncele" button as spec requires. A visible interactive affordance with no action is a usability failure.
5. **Add template/guided prompt context** — Show which template and campaign context is being used for generation, so the user has confirmation of what they set up in Phase 3.

---

## 9. Nice-to-Have Later

- Add `template` and `guidedPrompt` as props per spec, and display them in the header as generation context.
- Consider reserving space for the "Review videos →" CTA from the start (rendered but disabled) to prevent layout shift.
- Visual grouping of ready / generating / pending sections as jobs progress.
- Use a different visual for the "video thumbnail" in ready cards — even a colored gradient or a distinct icon would be better than the product input image shown as output.
- Increase progress bar height (h-2 or h-2.5) for better visibility.
- Reduce pending card opacity from 50% to something more readable (e.g., 70%).

---

## 10. Recommended Fix Direction

Phase 4 is technically the most solid phase so far — the staggered simulation, timeout cleanup, three-state visual feedback, and early review CTA all work correctly. The implementation correctly handles the edge case of early navigation (force-completing all jobs in the parent state).

The single most critical problem is the **timing display mismatch**: showing "~10 min remaining" when the demo will finish in 30 seconds is not a minor copy issue — it actively breaks the prototype's credibility during any stakeholder demo or user test. This needs to be resolved before this screen is shown to anyone. The fix is straightforward: either remove the minute estimate entirely from the demo (show only the progress counter), or compute a demo-appropriate estimate from `DEMO_VIDEO_GENERATION_DELAY_MS`.

The second priority is **language consistency** — translating status labels and headings to Turkish brings Phase 4 in line with the rest of the validated spec and the language of the guided fields the user just filled in Phase 3.

The third priority is the **unclickable play button** on ready cards — it's a dead affordance that will confuse anyone who tries to preview a video. Either implement the "İncele" button or remove the play icon.

---

---

# Phase 5 Audit: Review + Edit Prompt

## 1. What Works

- **PreviewStep removed from active flow** — `PreviewStep.tsx` remains on disk (correctly, per spec) but is not imported or rendered anywhere in the active route. The validated `ReviewStep` + `ReviewVideoCard` architecture is used instead.
- **Per-video review model** — Each product has its own `ReviewVideoCard` with three independent actions. The old carousel (one video at a time with arrows) is gone.
- **Correct action order** — Approve / Edit Prompt / Reject appears in the order specified by product.md and feedback-implementation.md. ✅
- **Mutually exclusive toggle logic** — `handleApprove` filters the product from `rejectedIds` and vice versa. Clicking Approve while already approved removes approval (toggle). Clicking Reject while already rejected removes rejection. ✅
- **Approved visual state** — Green border (`border-success/25 bg-success/5`) and "Approved" badge clearly distinguish approved cards from others.
- **Rejected visual state** — `opacity-55` fade gives rejected cards a visually "out of the running" appearance without removing them from the list.
- **"Undo reject" label** — When a video is already rejected, the Reject button correctly relabels to "Undo reject," making reversibility obvious.
- **Edit Prompt opens correct product context** — `editingProductId` is set before navigating to `"edit-prompt"` stage, and `EditPromptStep` receives the correct product (image, name, brand).
- **Example prompt chips** — 6 contextual Turkish chips ("Süet, tokalı, babet — zarif ve minimal sunum", "Siyah arka plan, dramatik aydınlatma, premium his", etc.) click to append to the textarea. Contextually excellent, right language register.
- **Token cost confirmation in EditPromptStep** — Cost is shown before the regeneration CTA. Insufficient balance disables the CTA and shows a warning.
- **2s mock regeneration delay** — 2-second `setTimeout` before `onRegenerate()` is called, giving feedback that something is happening.
- **Regeneration resets review state** — `handleEditRegenerate` filters the product from both `approvedIds` and `rejectedIds` so the user must re-review the updated video. ✅
- **List/grid view toggle** — Both views are functional and preserve review state.
- **Video plays 1:1** — Grid view uses `aspect-square`, list view uses a 136×136 box. Both correctly represent the 1:1 output format.
- **`canContinue = approvedCount > 0`** — The CTA is correctly gated on at least one approval. Sticky bar shows "Approve at least one video to continue" when count is zero.
- **Dynamic subtitle count** — "X approved · Y pending review · Z rejected" updates reactively as the user acts on each video.

---

## 2. Messaging Issues

**2.1 Page title and all review screen copy is in English**
- "Review videos", "Approve at least one video to continue", "Export approved", "Continue to export", "List", "Grid" — all English.
- product.md is a Turkish-language product. The guided fields in the previous step were Turkish; arriving at an all-English review screen continues the language inconsistency.
- feedback-implementation.md spec calls the CTA "Dışa Aktar →" — Turkish.

**2.2 EditPromptStep title, subtitle, and placeholder are in English**
- Title: `"Edit prompt"` — English.
- Subtitle: `"Describe how you'd like the video to look. Be specific — style, mood, setting, presentation."` — English.
- Textarea placeholder: `"e.g. Clean white background, product rotating slowly, soft shadows, premium feel..."` — English.
- Cost label: `"Regeneration cost"` — English.
- CTA: `"Regenerate video"` — English. feedback-implementation.md spec: `"Yeniden üret"`.
- This is especially jarring because the example prompt chips directly below are all in Turkish. The user reads Turkish chips and an English placeholder simultaneously.

**2.3 "Approve" button does not signal its toggle nature**
- When a video is approved, the Approve button changes to green and reads `"Approved"`.
- "Approved" looks like a completed/immutable state. It does not hint that clicking it again will undo the approval.
- The Reject button correctly handles this with `"Undo reject"` — but Approve has no equivalent `"Undo approve"` label. The two actions are inconsistent in communicating reversibility.

**2.4 Sticky bar has two CTAs calling the same handler**
- "Export approved" (outline, Download icon) and "Continue to export" (filled, Send icon) — both trigger `onContinue` → `handleGoToExport`.
- A user reading two buttons assumes two different outcomes. "Export approved" implies downloading/saving, "Continue to export" implies proceeding to the next step. They are identical in function.
- This creates decision paralysis and false choice.

**2.5 "Top up to regenerate this video" implies a feature that does not exist**
- `EditPromptStep` line 129: `"Insufficient balance. Top up to regenerate this video."`
- There is no "top up" or credit purchase flow in this prototype. The message sets an expectation the product cannot fulfill.

**2.6 No guidance on what "Edit Prompt" means for a user unfamiliar with AI prompting**
- The term "Edit Prompt" is internally understood by product/engineering, but a performance marketer may not immediately grasp what "editing a prompt" means in this context.
- The subtitle does explain it ("Describe how you'd like the video to look") but the title itself — "Edit prompt" — is unexplained jargon for non-technical users.
- product.md describes this as "revision" of a video, not prompt editing per se.

**2.7 No "all reviewed" completion message**
- When the user has acted on all videos (some approved, some rejected, none pending), the subtitle still shows the count breakdown but nothing signals "you've reviewed everything — you're ready to continue."
- A user who just rejected their last video sees the same screen with the sticky bar's "Approve at least one video to continue" (if some are approved) or the disabled CTA (if none are approved), with no sense of completion or next-step nudge.

---

## 3. UI/UX Issues

**3.1 No video playback controls — user cannot properly review videos**
- List view: 136×136 `<video>` auto-plays muted with no controls, no pause button, no unmute toggle.
- Grid view: `aspect-square` `<video>` auto-plays muted with no controls.
- A performance marketer reviewing a video to decide whether to approve it for a feed campaign needs to watch it properly. Auto-muted loop with no controls makes it impossible to assess audio, tempo, or specific moments.
- product.md names this the "Preview / Review" step — the word "preview" implies the user can actually watch the video. Currently they can only see it loop silently.
- The old `PreviewStep.tsx` had play/pause and mute/unmute controls directly on the video. The new ReviewVideoCard lost these entirely.

**3.2 List view video thumbnail is too small for meaningful review**
- 136×136 pixels. On a 1440px-wide screen, this is a small square in the far right of a row. A user reviewing a product video for an ad campaign cannot make a quality judgement from a 136px auto-playing loop.
- The grid view is larger (aspect-square within a column) but still has no controls.

**3.3 No campaign/folder context visible (continues Phase 2–3 gap)**
- Same issue across Phases 2, 3, and now 5. The review screen shows product names but no indication of which campaign/folder these videos belong to.
- A user reviewing 8 videos for "Anneler Günü Kampanyası" sees the same screen as someone reviewing 8 videos for "Yaz Koleksiyonu." The campaign-based organization principle of product.md is invisible here.

**3.4 EditPromptStep has no original context visible**
- The user opens Edit Prompt for a product. They see the product image/name/brand.
- They do NOT see: which template was used for the original generation, what sector/theme/background/product type was set in Phase 3.
- If a user wants to change just the theme (keep the template and sector the same), they have no reference for what the original settings were. They must remember.
- feedback-implementation.md spec: `"Mevcut şablon bilgisi"` (current template info) should be shown. It is not.

**3.5 Grid view shows all videos playing simultaneously**
- With 8-10 products in grid view, every video is auto-playing at once. This creates visual noise and potential browser performance issues with simultaneous video decoding.
- The user's attention is fragmented across multiple simultaneously animated cards.

**3.6 Pending card has no visual call-to-action**
- Pending cards look like plain bordered boxes with product info and action buttons.
- There's no visual nudge like "awaiting your review" or a highlight that says "act on this one."
- Approved/rejected cards have prominent visual states; pending cards blend into the background and don't draw attention.

**3.7 No "all rejected" warning state**
- If a user rejects all videos, `canContinue` becomes false and the CTA is disabled.
- The only feedback is the static "Approve at least one video to continue" text in the sticky bar. There's no stronger signal, no modal, no "are you sure?" prompt.
- A user who accidentally rejected all videos has no clear recovery path other than clicking "Undo reject" on each card — which they might not remember to do.

**3.8 Edit Prompt is the middle button — harder to reach on compact screens**
- On mobile/compact layouts, "Edit Prompt" is sandwiched between Approve and Reject. With `compact` mode (grid view), buttons wrap — Edit Prompt may end up on a second line, reducing discoverability.
- product.md says Edit Prompt is an important path ("Edit Prompt → edit akışı açılır; kullanıcı revize eder") but it's not given primary visual treatment.

---

## 4. Product Logic Issues

**4.1 EditPromptStep is missing dropdown preset fields — "hybrid model" is half-implemented**
- product.md explicitly defines the Edit Prompt structure as a **hybrid model**: `"Dropdown / preset seçenekleri (sektöre ve şablona göre değişen öneriler) + Free text prompt alanı + Örnek promptlar / guidance"`.
- feedback-implementation.md Phase 5: `"Dropdown presetler (sektöre/şablona göre) + Free text textarea (max 200 karakter, placeholder ile örnek prompt) + Örnek prompt önerileri (tıklanınca textarea'ya dolar)"`.
- **Current:** Only free text + example chips. No dropdown presets. The "dropdown" half of the hybrid model is completely absent.
- product.md specifically justifies free text with: "Moda/tekstil gibi sektörlerde sınırsız varyasyon gerekebilir. Yalnızca dropdown ile bu ihtiyaç karşılanamaz." — free text is needed *in addition to* dropdowns, not instead of them.

**4.2 Prompt text typed in EditPromptStep is discarded — never reaches Videos.tsx**
- `EditPromptStep.handleRegenerate()` calls `onRegenerate(product.id)`.
- `Videos.tsx handleEditRegenerate(productId)` receives only the productId, not the prompt.
- The `promptText` local state inside `EditPromptStep` is lost when the component unmounts (stage changes to "review").
- feedback-implementation.md spec: `onRegenerate(newPrompt)` — the updated prompt should be passed back.
- In a real implementation the new prompt is the whole point of the action. Discarding it makes the Edit Prompt loop meaningless beyond visual feedback.

**4.3 Regenerated video is identical to the original — no visual differentiation**
- `handleEditRegenerate` sets `videoUrl: j.videoUrl` — the same `SAMPLE_VIDEO` URL from before.
- After a "regeneration," the card looks identical to before. The user has no way to know a new video was produced.
- This is expected for a prototype, but even a visual cue (e.g., a brief "New" badge, a slightly different poster frame) would make the mock feel more credible.

**4.4 Free-text max length is 500, spec says 200**
- `EditPromptStep` textarea: `maxLength={500}`.
- feedback-implementation.md: `"Free text textarea (max 200 karakter)"`.
- The 500-char limit also contradicts the GuidedPromptFields free-text (200 chars). Inconsistent across the two text input surfaces.

**4.5 Token balance deduction at handleEditRegenerate is unconditional**
- `handleEditRegenerate` runs `setTokenBalance((b) => b - TOKEN_COST_PER_VIDEO)` immediately, without verifying the current balance covers it.
- `EditPromptStep` already blocks the button when `insufficient = tokenBalance < TOKEN_COST_PER_VIDEO`, so the guard is in the child. But if `tokenBalance` were to change between render and callback (parallel state changes), the deduction could push balance negative.
- Low risk in a prototype, but not spec-clean.

---

## 5. Code / State Flow Issues

**5.1 `EditPromptStep` is missing `template` and `currentPrompt` props per spec**
- feedback-implementation.md spec: `Props: product, template, currentPrompt: GuidedPrompt, tokenBalance, tokenCostPerEdit, onRegenerate(newPrompt), onCancel()`.
- Current props: `product, tokenBalance, onRegenerate(productId), onCancel`.
- Missing: `template` (which template was used), `currentPrompt` (the original guided prompt), `tokenCostPerEdit` (hardwired via import instead), and the prompt return in `onRegenerate`.

**5.2 `TOKEN_COST_PER_VIDEO` imported directly, not injected as `tokenCostPerEdit` prop**
- Same pattern as `CostEstimateBar` (Phase 2) and `GenerateCostConfirm` (Phase 3). Consistent but non-spec-compliant across all three cost-aware components.

**5.3 `videoJob.videoUrl ?? SAMPLE_VIDEO` fallback in ReviewVideoCard**
- If `videoJob.videoUrl` is `null` (which it is for `pending` status jobs), the fallback `SAMPLE_VIDEO` is used immediately.
- All jobs are set to `"ready"` with `SAMPLE_VIDEO` before `ReviewStep` is entered (`handleProgressComplete` in Videos.tsx), so in practice this fallback is never needed. But it's defensive code protecting against a state that should not occur by the time this step runs.

**5.4 `getVideoJob` fallback in ReviewStep creates phantom jobs**
- `getVideoJob(productId)` returns a fabricated `{ productId, status: "ready", videoUrl: null }` if no job is found.
- Since all products are initialized in `handleStartGeneration` as jobs, this fallback is unreachable. But the `null` videoUrl in the fabricated fallback would trigger the `SAMPLE_VIDEO` fallback in `ReviewVideoCard`, maintaining the illusion.

**5.5 `pb-36` on the main container to avoid sticky bar overlap**
- `ReviewStep` uses `pb-36` (144px) padding-bottom to prevent sticky bar overlap.
- This is a common approach but fragile — if the sticky bar height changes, the padding needs manual updates. A CSS variable or a more robust spacer would be cleaner.

**5.6 Sticky bar CTA duplication is a code-level smell too**
- Two `<Button>` elements with identical `onClick={onContinue}` and `disabled={!canContinue}` — any future change to one needs to happen in both. No single source of truth for the export action.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| Dropdown preset fields in EditPromptStep (sector/template-based options) | product.md + feedback-implementation.md | ❌ Not present — hybrid model is free text + chips only |
| `template` prop on EditPromptStep | feedback-implementation.md | ❌ Not passed, not displayed |
| `currentPrompt: GuidedPrompt` prop on EditPromptStep | feedback-implementation.md | ❌ Not passed, original context invisible to user |
| `onRegenerate(newPrompt)` — prompt returned to parent | feedback-implementation.md | ❌ Only productId returned, prompt text discarded |
| `tokenCostPerEdit` as prop (not direct import) | feedback-implementation.md | ❌ Imported directly from tokens.ts |
| Free-text max 200 chars | feedback-implementation.md | ❌ Set to 500 chars |
| CTA label "Yeniden üret" | feedback-implementation.md | ❌ Shows "Regenerate video" (English) |
| "Mevcut şablon bilgisi" visible in EditPromptStep | feedback-implementation.md | ❌ Not shown |
| Video playback controls for review | product.md ("preview" implies watchability) | ❌ No pause/unmute controls |
| Campaign/folder context visible | product.md (campaign-based org) | ❌ Not present (same as Phase 2–3) |

---

## 7. Old Assumptions Still Visible

**7.1 PreviewStep.tsx on disk — the entire discarded review architecture**
- The file has: carousel navigation (ChevronLeft/ChevronRight), per-index approve that moves to the next product (not per-video toggle), `"Regenerate"` button (not "Edit Prompt"), `"Draft"` status badge, inline Play/Pause and Mute controls on the video player, `onApproveAll` and `onBack` props, import of `Template` type from `GenerateDialog`.
- This is the full pre-validated prototype's approach to video review. It's preserved correctly per spec, but represents a radically different UX contract — most notably that it had video playback controls which the new implementation lacks.

**7.2 "Regenerate" vs "Edit Prompt" naming**
- The legacy `PreviewStep` used "Regenerate." The validated spec replaced it with "Edit Prompt." The new `ReviewVideoCard` correctly uses "Edit Prompt."
- However, `EditPromptStep.tsx`'s CTA button still reads "Regenerate video" — reverting to the old action name at the point of commitment. The action is named "Edit Prompt" to reach the step, then "Regenerate" to complete it. The naming is inconsistent within the same mini-flow.

**7.3 "Draft" badge in PreviewStep**
- The legacy `PreviewStep` showed a `"Draft"` badge on each video — a pre-validated concept of "draft videos before approval." The new `ReviewVideoCard` doesn't use "Draft" language, which is correct. But "Draft" wording in the on-disk file continues to represent the old vocabulary.

**7.4 "Top up" message assumption**
- `"Insufficient balance. Top up to regenerate this video."` assumes a credit top-up flow exists. This was likely carried over from an assumption about what the product would eventually support. For the current validated prototype there is no top-up mechanism.

---

## 8. Must-Fix Items

1. **Add video playback controls to `ReviewVideoCard`** — At minimum: a play/pause toggle and mute toggle. A user must be able to properly watch a video before approving it. This is the most critical UX gap in this phase.
2. **Add dropdown preset fields to `EditPromptStep`** — product.md explicitly requires the hybrid model. The preset dropdown side (sector, template-type-based options) is entirely missing. Free text alone does not fulfill the spec.
3. **Remove the duplicate "Export approved" button** from the sticky bar — keep a single "Continue to export" CTA. Two buttons calling the same handler create false choice.
4. **Rename Approve toggle label from "Approved" → "Undo approve"** when in approved state — for consistency with "Undo reject" and to signal reversibility.
5. **Fix CTA in EditPromptStep from "Regenerate video" → "Yeniden üret"** — naming inconsistency with the "Edit Prompt" button that opened this step.
6. **Remove "Top up" message** — replace with a message that describes what to do within the current product's constraints (e.g., "Bakiye yetersiz — yeniden üretim yapılamaz").
7. **Fix EditPromptStep textarea max from 500 → 200** per spec.
8. **Show original template and guided prompt context in EditPromptStep** — the user needs to know what settings were used when deciding what to change.

---

## 9. Nice-to-Have Later

- Translate all review and edit-prompt copy to Turkish for consistency with Phase 1 and the product's target language.
- Pass `template` and `currentPrompt` as props to `EditPromptStep` per spec.
- Pass `newPrompt` back via `onRegenerate(newPrompt)` instead of just productId.
- Add a brief visual differentiation for "regenerated" videos (e.g., "Updated" badge) so the user knows a new video was produced.
- Add an "all reviewed" completion state message nudging the user toward export when all videos have been acted on.
- Add campaign/folder context (breadcrumb or subtitle) — consistent with Phase 2–3 gap.
- Inject `tokenCostPerEdit` as a prop rather than importing directly.
- Consider lazy-loading or intersection-observer-based video playback in grid view to avoid simultaneously decoding 8–10 videos.

---

## 10. Recommended Fix Direction

Phase 5 has two problems of different severity.

The first is a **functional gap**: video playback controls are missing from both review views. A review step where the user cannot pause or unmute the video is not a functional review step — it's a display. product.md calls this the "Preview / Review" screen; preview implies watching. The old `PreviewStep.tsx` had these controls; they were lost in the rework. This is the highest-priority fix.

The second is a **spec gap**: `EditPromptStep` is missing the dropdown/preset half of the hybrid model that product.md and feedback-implementation.md both explicitly describe. The example prompt chips (in Turkish, contextually excellent) cover the "inspiration" use case well, but they are not the structured preset dropdowns that let a performance marketer quickly change sector or theme without writing free text. The screen currently has one input modality (free text + chips) when the spec calls for two (structured dropdowns + free text + chips).

Below these two gaps, the duplicate CTA buttons, the "Approved" toggle clarity issue, and the language inconsistencies are meaningful but lower urgency — they reduce polish and create confusion without fully breaking the flow.

---

---

# Phase 6 Audit: Export / Apply to Exports

## 1. What Works

- **SendStep removed from active flow** — `SendStep.tsx` is on disk (correctly preserved per spec) but not imported or rendered anywhere in the active route. `ExportStep` is used instead. ✅
- **"Apply to Exports" per-feed-card pattern** — The UX correctly follows the product.md reference: 2-column feed card grid, each card with channel badge, export name, source, product count, video attribute dropdown, and Apply button. The right pattern is implemented.
- **Per-card `applied` state** — Each feed card tracks its own applied state independently. Applying one feed does not affect others. ✅
- **500ms apply animation per card** — `ExportFeedCard` local `applying` state gives brief feedback before committing the applied state. Feels responsive. ✅
- **"Applied ✓" badge and "Re-apply" affordance** — Once applied, the card shows a green badge and the button relabels to "Re-apply," allowing the user to re-apply after changing the attribute dropdown. ✅
- **Video attribute dropdown** — Each card has a `<select>` populated from `VIDEO_ATTRIBUTE_OPTIONS` with the feed's default pre-selected. Matches the product.md reference for per-feed video attribute mapping. ✅
- **"Apply All" button** — Correctly appears in the header only when not all feeds are applied, and hides once all are applied. ✅
- **`canComplete = appliedCount > 0`** — "Complete →" is disabled until at least one feed is applied. ✅
- **"Skip and complete" always available** — User can always bypass export. Matches spec. ✅
- **`onComplete(appliedNames)` passes feed names upstream** — Videos.tsx receives the list of applied feed names, passes to SuccessStep for the summary message. The data flow is correct. ✅
- **SuccessStep shows correct summary** — "Applied to X and Y" (≤2 feeds), "Applied to N feed exports" (>2), "Saved as draft" (0). Handles all edge cases. ✅
- **Channel badge differentiation** — G (blue), M (indigo), C (orange) clearly distinguishes Google from Meta from Criteo at a glance. Uses color without requiring real logo SVGs. ✅
- **ZIP mock download** — `isDownloadingZip` state disables the button during the 1s mock delay, preventing double-clicks. ✅
- **Token balance unchanged on export** — Exporting does not deduct tokens. product.md defines token use at generation and edit-regen only. ✅

---

## 2. Messaging Issues

**2.1 All copy is in English — no Turkish**
- Page title: `"Apply to exports"` — English.
- Subtitle: `"{approvedCount} approved video{s} ready to export"` — English.
- "Apply all" button — English.
- "Download videos" section header — English.
- Download button labels: `"Download MP4 ({n} file{s})"`, `"Download as ZIP"` — English.
- CTA: `"Complete →"` — English. feedback-implementation.md spec: `"Tamamla"`.
- Skip link: `"Skip and complete"` — English. feedback-implementation.md spec: `"Atla ve tamamla"`.
- This continues the language inconsistency observed across all previous phases. The entire export screen is English, coming directly after a review screen that mixed English and Turkish.

**2.2 "Apply to exports" title does not explain what the action means**
- A performance marketer seeing this title for the first time may not know what "exports" refers to in this context. product.md's full name for this step is "Send to Feed" / "Apply to Exports" — the connection to feed channels (Google, Meta) is in the cards themselves, not the title.
- The subtitle "X approved videos ready to export" uses "export" as a verb, while the title uses "exports" as a noun (referring to feed configurations). The same word means different things in consecutive lines.

**2.3 Download button says "X files" but downloads 1 SAMPLE_VIDEO**
- `"Download MP4 ({approvedCount} file{s})"` — implies N files will be downloaded (one per approved video). Clicking the `<a>` tag downloads a single `SAMPLE_VIDEO` file named `"approved-video.mp4"`.
- The count is visually accurate (user approved N videos) but the download behavior is a single generic sample file. The mismatch between stated count and actual file count could confuse a user who approved 5 videos and receives 1 file.

**2.4 No explanation that "Apply" is a mock/prototype action**
- Clicking "Apply" on a feed card turns it green with "Applied ✓." In a real implementation this would push video URLs to the feed. In the prototype, nothing happens to any real system.
- There is no "this is a prototype — in production, this would update your feed" disclaimer. A stakeholder demo where someone clicks Apply might believe the feed was actually updated.
- feedback-implementation.md spec does not explicitly require a mock disclaimer, but the absence creates false impression of real integration.

**2.5 "Preparing ZIP..." appears on the button, not as a toast**
- feedback-implementation.md spec: `"mock: toast gösterir 'ZIP hazırlanıyor... İndirme başladı'"` — a toast notification was specified.
- Current: the button text changes to `"Preparing ZIP..."` for 1 second. No toast appears. This is functional feedback but doesn't match the spec and is less visible than a toast (which would appear in a consistent location the user's eye is trained to watch).

**2.6 "Re-apply" label is slightly ambiguous**
- When a card is in applied state, the button reads "Re-apply." This could mean "apply again (same settings)" or "apply with different settings." The intended flow is: change the dropdown → Re-apply. But nothing communicates this sequence — the user might click "Re-apply" without first changing the attribute, wondering what the point is.

**2.7 No empty-state message for the case where no feeds exist**
- If `FEED_EXPORTS` were empty (edge case in real use), `ExportStep` would render a header and an empty grid with no guidance. No "no exports configured" message. Minor, but worth noting.

---

## 3. UI/UX Issues

**3.1 Approved video identities are completely invisible on this screen**
- The user just reviewed videos and approved specific products. On the export screen, they see only a count — `"3 approved videos ready to export"` — with no list of which products those are.
- There is no product image strip, no name list, no confirmation of "you're applying videos for: Adidas Originals Forum Low, Nike Air Max 90, Puma RS-X." The approved products are anonymized to a number.
- This breaks the user's sense of control: they approved specific videos and now have no way to verify which ones are about to be applied to their feeds.

**3.2 All 5 feed cards show the identical product count — "3 of 147"**
- `approvedCount` is passed to all cards and displayed as "3 of 147 products" on every card.
- In reality, different feed exports might cover different product subsets. "Meta Export (Copy)" and "Meta export with dynamic creative" are distinct configurations that may map to different product sets. Showing the same number on all 5 implies they are interchangeable.
- The `productCount: 147` is also identical for all 5 feeds in mock data — which makes the counts feel fabricated rather than meaningful.
- The feedback-implementation.md spec included `selectedCount` as a separate field (distinct from `productCount`) representing how many of the batch products match the feed. This was not implemented — the distinction between "total products in this feed" and "your approved videos that will be applied" is collapsed into the single `approvedCount` number.

**3.3 "Apply All" bypasses per-feed attribute review**
- Clicking "Apply All" instantly marks all 5 feeds as applied without requiring the user to review or confirm the video attribute for each.
- Different feeds have different default attributes: "Custom Label" (Google Ads Page Feed), "g:custom_label_4" (Google Merchant Export), "internal_label" (Meta feeds). A user who clicks "Apply All" without checking may map video URLs to the wrong attribute for some feeds.
- No confirmation step, warning, or "you haven't reviewed all attributes" notice before Apply All executes.

**3.4 No campaign/folder context (continues Phase 2–5 gap)**
- Five phases in and the campaign name from Phase 1 has never appeared again. The export screen has no indication of which campaign these videos are being applied for.

**3.5 Feed card "source" line is identical for all 5 cards**
- Every card shows `"Shopify Feed (all collections)"` as the source. On a real Optifeed export screen, feeds would have different sources. The uniform source line makes the cards feel like copies of each other, reducing the perception that these are distinct, meaningful configurations.

**3.6 "Meta Export (Copy)" name looks like a UI accident**
- The feed name "Meta Export (Copy)" — with the "(Copy)" suffix — looks like it was duplicated in a UI and not renamed. To a stakeholder or user seeing the prototype, this reads as a mistake, not an intentional feed configuration.

**3.7 No visual connection between approved videos and the export action**
- The flow goes: ReviewStep (user sees videos, approves them) → ExportStep (user sees feed cards).
- There is no bridge: no "you approved these 3 videos" summary before the feed cards, no thumbnail strip, no product names.
- The approved video state exists in `approvedIds` in Videos.tsx but is not passed to ExportStep at all. ExportStep only receives `approvedCount: number`.

**3.8 Download section is visually separated but logically part of the same action**
- The "Download videos" card sits between the feed cards and the CTAs. Visually it reads as a secondary/optional section. But for some users, downloading is their *primary* export path (no feed integration), not a secondary option.
- A user who only wants to download (not apply to feeds) might click "Download MP4" and then not know what to do — the "Complete →" button below is still disabled because they haven't "applied" anything.
- The only way to complete without applying is the "Skip and complete" link — which is styled as the least prominent element on the page (text link, smallest).

---

## 4. Product Logic Issues

**4.1 ExportStep receives only `approvedCount`, not the approved product list**
- `ExportStep` props: `approvedCount: number, onComplete: (feedNames: string[]) => void, onSkip: () => void`.
- The component has no knowledge of which products are approved, their names, images, or video URLs.
- product.md: "Onaylanan videolar seçilen kanallara gönderilir" — the export is supposed to send specific approved videos to specific feeds. Without knowing which products are approved, the component cannot meaningfully represent "what is being exported."

**4.2 `FeedExport` mock data missing `selectedCount` field per spec**
- feedback-implementation.md Phase 0 spec: `FeedExport interface: id, name, channel, source, productCount, selectedCount, videoAttribute`.
- `selectedCount` (mock: 26 — how many of the feed's products match this batch) is absent from the implementation. `approvedCount` is passed as a prop instead.
- These are semantically different: `selectedCount` is a per-feed metric (how many of the feed's 147 products are in the current batch), while `approvedCount` is the review decision count. In the current implementation they are conflated.

**4.3 No guard preventing export with 0 approved videos in ExportStep itself**
- `ReviewStep` gates forward navigation on `canContinue = approvedCount > 0`. But `ExportStep` itself has no defensive check.
- If `approvedCount === 0` somehow (e.g., via direct state manipulation or future navigation changes), `ExportStep` renders normally showing `"0 approved videos ready to export"` with all feed cards showing "0 of 147 products" — nothing prevents the user from applying 0 videos to their feeds.

**4.4 "Apply" is irreversible within the card but has no consequence**
- Once applied, the card shows "Applied ✓" and the button says "Re-apply." The user can change the attribute and re-apply. But there's no way to un-apply a feed (set it back to unapplied state) without re-applying.
- This means `canComplete` can never go back to `false` once it becomes `true` — the "Complete →" button stays enabled even if the user's intent was to undo.

**4.5 "Skip and complete" has the same effect as "Complete with 0 feeds applied"**
- `onSkip` calls `handleExportComplete([])` — same as `onComplete([])` with no applied feeds.
- SuccessStep shows "Saved as draft" for both cases.
- The distinction between "skip" (deliberately bypassing) and "complete with nothing applied" (accidentally not applying) is not communicated differently to the user.

---

## 5. Code / State Flow Issues

**5.1 `handleExportComplete` in Videos.tsx calls `setExportedFeeds` and `setStage("success")` — no state cleanup**
- On success, `exportedFeeds` is set and stage changes. But `videoJobs`, `approvedIds`, `rejectedIds`, `feedStates` (local to ExportStep) are not reset.
- `feedStates` is local to ExportStep and resets on unmount, so that's fine. But `approvedIds` and `videoJobs` persist in Videos.tsx state until `handleAnother` is called (stage → "success" → user clicks "Create another video").
- This is correct behavior — the data should persist until the user explicitly starts a new flow. No issue here.

**5.2 `handleAnother` does not reset `exportedFeeds` to `[]`**
- Wait, actually looking at the summary context: `handleAnother` resets: `selectedIds, approvedIds, rejectedIds, videoJobs, guidedPrompt, editingProductId, exportedFeeds, stage→library`. ✅ `exportedFeeds` is reset. No issue.

**5.3 `isDownloadingZip` state is local to `ExportStep` — resets if user navigates away and back**
- If the user navigates back to review and returns to export, `isDownloadingZip` resets to `false`. But `feedStates` also resets — all applied feeds go back to unapplied. The user loses all their apply progress.
- This is expected behavior for a frontend-only prototype with no persistence, but it means Back navigation from export is destructive to export state.

**5.4 `feedStates` initialization uses `feedExports.ts` default `videoAttribute` as starting value**
- `useState(() => Object.fromEntries(FEED_EXPORTS.map((f) => [f.id, { attribute: f.videoAttribute, applied: false }])))` — each feed starts with its configured default attribute. ✅ This is correct behavior.

**5.5 ZIP download trigger: `document.createElement("a")` / `.click()` / `.remove()` pattern**
- Standard browser download trigger pattern. Works correctly. No issues.

**5.6 `FEED_EXPORTS` has no `selectedCount` — `approvedCount` prop fills the role**
- The card shows `{approvedCount} of {feed.productCount} products`. This displays the same `approvedCount` for every card, which is technically incorrect (each feed might cover a different subset of the batch). Architecturally, `approvedCount` is passed down because `selectedCount` was never added to the mock data.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| CTA label "Tamamla" | feedback-implementation.md | ❌ Shows "Complete →" (English) |
| Skip label "Atla ve tamamla" | feedback-implementation.md | ❌ Shows "Skip and complete" (English) |
| Toast notification for ZIP: "ZIP hazırlanıyor... İndirme başladı" | feedback-implementation.md | ❌ Button text changes instead of toast |
| `selectedCount` field in `FeedExport` interface | feedback-implementation.md Phase 0 | ❌ Field absent from mock data and interface |
| Approved video list visible on export screen | product.md ("Onaylanan videolar seçilen kanallara gönderilir") | ❌ Only count passed; no product names/images |
| Campaign/folder context visible | product.md (campaign-based org) | ❌ Not present (same as Phase 2–5) |
| Page title in Turkish: "Videoları feed'e uygula" | feedback-implementation.md (one option given) | ❌ Uses English "Apply to exports" |

---

## 7. Old Assumptions Still Visible

**7.1 SendStep.tsx on disk — channel-toggle paradigm**
- The legacy SendStep used 3 toggle buttons: Google feed, Meta feed, TikTok feed — platform-level selection rather than per-feed-export-configuration selection.
- It had a single "Send video" CTA that sent to all selected channels at once.
- It pre-selected "meta" by default — an old assumption that Meta was the primary channel.
- The new ExportStep correctly uses the per-export-config pattern from product.md's "Apply to Exports" reference.
- SendStep also had TikTok as a channel option. The new mock data has only Google and Meta feeds (no TikTok). product.md mentions TikTok in the Export/Feed Logic section ("Google Merchant Center, Meta Catalog, TikTok Catalog") but the mock data doesn't include a TikTok feed. This may or may not be intentional for the prototype.

**7.2 All feed mock data sourced from "Shopify Feed (all collections)"**
- Every feed has identical `source` and identical `productCount: 147`. This is a placeholder pattern — real feeds would have different sources, counts, and configurations. For a stakeholder demo, this makes the screen feel like a placeholder rather than a real product representation.

**7.3 "Meta Export (Copy)" name**
- This reads as an accidentally duplicated item in a configuration UI, not an intentional feed named "Copy." It's a carry-over from a quick mock that was never cleaned up.

**7.4 Download triggering SAMPLE_VIDEO for "approved videos"**
- Using a generic fire video (`ForBiggerBlazes.mp4`) named `"approved-video.mp4"` for a download labeled "Download MP4 (N files)" assumes the user won't actually try to use the downloaded file. For a demo this is fine, but for a user testing the flow, downloading a fire video labeled as their product video is jarring.

---

## 8. Must-Fix Items

1. **Show approved video identities on the export screen** — Pass `approvedIds` and `selectedProducts` to ExportStep so the user can see a product strip (images + names) of what they're about to export. The connection between "approved in review" and "exported to feed" must be visible.
2. **Fix download count vs. behavior mismatch** — Either don't show `approvedCount` in the download button label (since only 1 SAMPLE_VIDEO downloads), or add a note that this is a prototype download. "Download sample video" is more honest than "Download MP4 (3 files)."
3. **Translate CTAs** — "Complete →" → "Tamamla", "Skip and complete" → "Atla ve tamamla", per feedback-implementation.md spec.
4. **Add ZIP toast notification** — Per spec: "ZIP hazırlanıyor... İndirme başladı" should appear as a toast, not as button text change.
5. **Add warning or confirmation before "Apply All"** — Alert the user that applying all at once uses each feed's current attribute setting, and prompt them to verify if needed.
6. **Fix "Meta Export (Copy)" name** — Rename to something meaningful (e.g., "Meta Retargeting Export") to avoid looking like a UI mistake in demos.
7. **Campaign/folder context** — Six phases in, still missing. At minimum, add the campaign name as a breadcrumb or page subtitle.

---

## 9. Nice-to-Have Later

- Add `selectedCount` field to `FeedExport` mock data per spec, and use it in feed card display alongside `approvedCount` to differentiate "products in this feed" from "videos you're applying."
- Vary `productCount` and `source` across mock feeds so they feel like distinct real configurations.
- Add TikTok feed export to mock data to match product.md's channel list.
- Make "Download" CTA complete the flow without requiring "Apply" — currently a user who only wants to download must use "Skip and complete," which is the least prominent element.
- Add a brief "what happens next" explanation at the top — e.g., "Your video URLs will be written to the selected attribute field in each export. The feeds will include the video on next sync."
- Diversify the mock video thumbnail in the download section (product image instead of SAMPLE_VIDEO URL).

---

## 10. Recommended Fix Direction

Phase 6's structural implementation is the most faithful to the product.md spec of any phase audited so far. The "Apply to Exports" per-feed-card pattern is correctly implemented, the attribute dropdown is present, applied state is clear, and the data flow to SuccessStep is correct.

The dominant problem is **disconnection**: the user spent Phase 5 making careful per-video decisions, and Phase 6 gives them no confirmation of what those decisions produced. `approvedCount: number` erases all product identity — the user sees a number, not their work. Passing `approvedIds` and `selectedProducts` to ExportStep and rendering a product strip would resolve this with minimal code change.

The secondary problem is **mock honesty**: the download button claiming "N files" when it delivers one generic sample video, and the Apply button appearing to push to real feeds when nothing happens, both create false impressions. Small copy changes ("Download sample" instead of "Download MP4 (N files)") or a lightweight prototype disclaimer would address this without changing the UX structure.

The language inconsistency (all-English export screen following Turkish-labeled guided fields in Phase 3) continues here but is a systemic issue that needs a single product-wide decision rather than a per-phase fix.

---

---

# Phase 7 Audit: Integration + Cleanup

## 1. What Works

- **Active flow is structurally correct** — `library → select → template → progress → review → (edit-prompt) → export → success` matches the validated product.md flow exactly. All 8 stages are defined, all transitions are wired. ✅
- **Legacy components isolated** — `GenerateDialog.tsx`, `PreviewStep.tsx`, `SendStep.tsx`, `EntryStep.tsx` are all on disk but none are imported in the active flow. No legacy stage is reachable through normal navigation. ✅
- **Stage machine is clean** — `Stage` union type defines only the validated stages. No dead stage definitions remain in the type. ✅
- **`stageToStep` mapping is correct** — `edit-prompt` correctly shares step 4 with `review`. `library` at 0 is hidden. Steps 1–6 map correctly. ✅
- **`handleAnother` resets full flow state** — `selectedIds`, `approvedIds`, `rejectedIds`, `videoJobs`, `guidedPrompt`, `editingProductId`, `exportedFeeds` all reset to initial values. Stage returns to `"library"`. ✅
- **Token deduction is in the right place** — Tokens deducted at `handleStartGeneration` (generation start), again at `handleEditRegenerate` (edit regen). Never deducted at selection, review, or export. ✅
- **`showStepBar = stage !== "library"`** — Step bar correctly hidden on the library entry screen. ✅
- **TokenBadge live-updates** — `tokenBalance` state in Videos.tsx flows down to `TokenBadge` in the step bar and to all cost confirmation components. User sees real-time balance throughout. ✅
- **Build passes cleanly** — Verified in Phase 7 implementation: `✓ built in 7.42s`, zero TypeScript errors. ✅
- **Timeout cleanup in GenerationProgressStep** — `useRef<number[]>` collects all timeout IDs, `useEffect` cleanup clears them on unmount. No memory leaks. ✅
- **`Toaster` and `Sonner` providers mounted in App.tsx** — Both toast infrastructure components are available globally if needed. ✅
- **`selectedProducts` derived via `useMemo`** — Filters `PRODUCTS` by `selectedIds`. Correctly reactive to selection changes. ✅
- **`editingProductId` guard on EditPromptStep render** — `{stage === "edit-prompt" && editingProductId && ...}` — prevents render with null product. ✅

---

## 2. Messaging Issues

**2.1 Step bar title is static and generic across all stages**
- The step bar header shows `"Create product videos"` on every stage from select through success.
- No campaign/folder context appears here. A user working on "Anneler Günü Kampanyası" sees a generic title throughout the entire flow.
- No stage-specific context ("Selecting products", "Reviewing 5 videos", etc.) is shown.

**2.2 StepIndicator labels are all English**
- STEPS = `["Select", "Template", "Progress", "Review", "Export", "Done"]`
- "Done" is the final step label — generic. "Success" or the Turkish equivalent would be more meaningful.
- The step labels are the most globally visible text in the entire flow (always in the header, all 6 steps visible at once) yet they're English in a Turkish-targeted product.

**2.3 Back button label is English ("Back") throughout**
- Every stage shows "Back" in the step bar. The product's Turkish-facing fields and folder names contrast with the navigation controls being in English.

**2.4 "Exit" button label**
- The step bar Exit button reads `"Exit"` — English. No tooltip or confirmation before abandoning mid-flow.

**2.5 `SuccessStep` `count` shows selected count, not approved count — factually wrong**
- `SuccessStep` receives `count={selectedProducts.length}`.
- Copy: `"{count} product{s} now have a video asset"`.
- If the user selected 5 products but only approved 3, the message says "5 products now have a video asset" — which is incorrect. Only approved products have video assets. Rejected ones do not.
- `count` should be `approvedIds.length`.

**2.6 "Go to feed" button in SuccessStep navigates to library, not a feed**
- `SuccessStep` has `onViewProducts` called by both "View products" and "Go to feed" buttons, which maps to `setStage("library")`.
- "Go to feed" → library is a category error. "Feed" in the Optifeed context means the export feed destination (Google Merchant, Meta), not the product library. A user expecting to view their updated feed is taken to the folder library instead.
- All other nav routes (Exports, Feed Sources) hit NotFound in the current app, so there's nowhere else to route this — but the label creates a false expectation.

**2.7 Hardcoded `{10}` in LibraryStep bottom hint**
- `LibraryStep.tsx` line 146: `"Her video oluşturma {10} token harcar."`
- The literal `{10}` is a JSX expression with a hardcoded number, not using `TOKEN_COST_PER_VIDEO`. If the constant changes, this copy won't update.
- Identified in Phase 1 audit. Still present.

**2.8 Language is never consistent across the full flow**
- Phase 1 (Library): Turkish
- Phase 2 (Select): English
- Phase 3 (Template): Mixed — English headers, Turkish field labels
- Phase 4 (Progress): English ("All videos ready!", "Pending", "Ready", "Generating...", "Review videos →")
- Phase 5 (Review): English
- Phase 5 (Edit Prompt): Mixed — English title/subtitle, Turkish example chips
- Phase 6 (Export): English
- Phase 7 (Success): English
- Step bar: English throughout
- No single screen is consistent with the one that precedes it. Every phase transition involves a language register shift.

---

## 3. UI/UX Issues

**3.1 Back button is visible but non-functional at "progress" and "success" stages**
- At `progress`: `getPreviousStage("progress") = null`. The Back button renders, is clickable, but does nothing when clicked.
- At `success`: `getPreviousStage("success") = null`. Same — renders, clickable, silent failure.
- A user clicking Back at the progress screen (wanting to cancel generation) will click a button that appears interactive but produces no response. This is a broken interaction pattern.
- The button should either be hidden, visually disabled, or show a confirmation dialog ("Cancel generation?") at the progress stage.

**3.2 Back navigation from "review" → "template" allows double token deduction**
- `getPreviousStage("review") = "template"`. The user can navigate Back from the review screen to the template screen.
- `handleStartGeneration` deducts `selectedIds.length × TOKEN_COST_PER_VIDEO` tokens every time it is called.
- If the user navigates Back from review to template and clicks "Generate videos" again, tokens are deducted a second time for the same products. The first generation is orphaned (its `videoJobs` are overwritten), but the tokens are gone.
- This is both a product logic bug and a UX issue — the Back button from review implicitly enables a double-spend.

**3.3 "Exit" button clears stage without resetting state**
- The Exit button in the step bar calls `setStage("library")` directly. It does NOT reset `selectedIds`, `videoJobs`, `approvedIds`, etc.
- If a user clicks Exit mid-review and then opens any folder again (which calls `handleOpenFolder` → `setStage("select")`), they arrive at SelectStep with their previous selection still intact. This stale state could confuse a user starting a new batch.
- No confirmation dialog warns the user that exiting will abandon their current work.

**3.4 TokenBadge position jumps between library and all other stages**
- At `library` stage: TokenBadge renders inside `LibraryStep`'s own page header (right side of the in-page content area).
- At all other stages: TokenBadge renders in the sticky step bar (top of the page, above all content).
- The badge visually teleports between two positions at the library → select transition.
- feedback-implementation.md spec: "TokenBadge AppShell header'ına yerleştirilecek" — it was intended to live in AppShell permanently. It is not in AppShell.
- Identified in Phase 1 audit. Still present.

**3.5 AppShell sidebar nav links lead to NotFound**
- Dashboard, Feed Sources, Exports, Dynamic Templates, GA4 Analytics, Meta Ads — all links lead to paths not defined in App.tsx routes, hitting the `NotFound` page.
- For a stakeholder demo, any accidental click on the sidebar (which is always visible) breaks the experience entirely.
- The "Videos" link does work (routes to `/videos`). All others are dead links.

**3.6 Hardcoded developer identity in AppShell**
- AppShell bottom user section: `"Erdeniz Tunç"` and `"erdeniz.tunc@optifeed.com"` are hardcoded.
- In a stakeholder demo, a different person's name/email appears at the bottom of the sidebar. This is fine for internal review but would need to be generalized or replaced for demos with external stakeholders.

**3.7 Step bar shows at "success" with non-functional Back and Exit**
- At the success stage, the step bar is shown (success ≠ library). The step bar displays:
  - Back button → does nothing (no previous stage from success)
  - "Create product videos" title
  - StepIndicator with all steps done + "Done" active
  - TokenBadge with depleted balance
  - Exit → library
- A completion screen with a non-functional Back button and a navigation bar for a flow that's already done is noisy. The success screen should be clean and focused, not wrapped in a multi-step progress header.

**3.8 `TemplateSelectionStep` local state always resets on Back navigation**
- If user navigates Back from review to template, `TemplateSelectionStep` remounts with `DEFAULT_GUIDED_PROMPT` and `"product-spotlight"` defaults — losing whatever they previously configured.
- The user arrives at an empty template screen with their tokens already spent for the first generation. This is the back-to-template double-deduction scenario compounded by a wiped form.

**3.9 Cognitive load: no persistent breadcrumb or campaign identifier**
- Across all 7+ screens the user navigates, there is never a visible reference to which campaign/folder they're working in.
- The step bar title "Create product videos" is the only header, and it never changes.
- product.md's entire architectural rationale is campaign-based organization. The implementation delivers a campaign-agnostic flow.

---

## 4. Product Logic Issues

**4.1 `template` and `guidedPrompt` states in Videos.tsx are write-only — never read**
- Both `const [template, setTemplate]` and `const [guidedPrompt, setGuidedPrompt]` are set in `handleStartGeneration` and reset in `handleAnother`.
- Neither is ever passed to any component as a prop in the render tree.
- `GenerationProgressStep` receives no template or guidedPrompt.
- `EditPromptStep` receives no template or guidedPrompt (per the Phase 5 audit — spec says they should).
- These two state variables exist in the controller but have no consumers — they are dead state in the current implementation.

**4.2 `SuccessStep count` uses `selectedProducts.length` instead of `approvedIds.length`**
- `<SuccessStep count={selectedProducts.length} ...>` — displays "N products now have a video asset."
- Only approved products have a video asset. Rejected products do not. The count should be `approvedIds.length`.
- Scenario: 10 selected, 2 approved, 8 rejected → success screen says "10 products now have a video asset" — factually incorrect.

**4.3 `review → template` back navigation exposes double token deduction**
- As noted in UI/UX Issues 3.2. This is also a product logic issue: the back navigation allows re-triggering `handleStartGeneration`, which unconditionally deducts tokens. No guard prevents this.

**4.4 Two separate video job tracking systems never synced**
- `GenerationProgressStep` maintains its own `VideoProgressJob[]` state internally (with `productName`, `productImage`, animated status transitions).
- `Videos.tsx` maintains `videoJobs: VideoJob[]` (simpler, just productId/status/videoUrl).
- `onComplete()` in GenerationProgressStep takes no arguments — when called, Videos.tsx blindly marks all jobs as ready via `handleProgressComplete`, regardless of what GenerationProgressStep's internal state shows.
- If GenerationProgressStep's simulation were extended to support failed jobs, Videos.tsx would never know — it always marks all jobs ready on `onComplete()`.
- The two systems should either be unified or `onComplete` should pass the final job states.

**4.5 Exit mid-flow leaves stale state**
- Exit calls `setStage("library")` without resetting any flow state. A user returning to the flow after exit carries forward `selectedIds`, `approvedIds`, `videoJobs`, etc. from the previous session.
- This can lead to confusing states: reviewing videos for products from a previous selection, or generating new videos that mix with old `videoJobs`.

---

## 5. Code / State Flow Issues

**5.1 `template` and `guidedPrompt` imported from `@/types/video-flow` but never consumed after being set**
- `import { type GuidedPrompt, DEFAULT_GUIDED_PROMPT, type VideoJob, type TemplateId, type VideoStatus } from "@/types/video-flow"` — all are used.
- But `template` and `guidedPrompt` state variables have no readers in the current prop tree. They are set, held, and reset — but no component reads them.

**5.2 `SAMPLE_VIDEO` imported in Videos.tsx but used only in `handleProgressComplete`**
- `handleProgressComplete` sets `videoUrl: SAMPLE_VIDEO` on all jobs. This is the correct use — simulating completion with the sample video. ✅
- However, `SAMPLE_VIDEO` is also imported directly in `ReviewVideoCard.tsx`, `GenerationProgressStep.tsx`, `ExportStep.tsx`, and `ExportFeedCard.tsx` — each file imports it independently. The constant is correct (single source in tokens.ts) but many files import it separately.

**5.3 `as VideoStatus` cast in `handleProgressComplete` is redundant**
- `{ ...j, status: "ready" as VideoStatus, videoUrl: SAMPLE_VIDEO }` — `"ready"` is already a valid `VideoStatus` value. The explicit cast adds noise without utility. TypeScript would accept `"ready"` directly.

**5.4 `onContinue` prop name on `SelectStep` is generic — spec named it `onChooseTemplate`**
- feedback-implementation.md Phase 2 spec: `"CTA handler: onContinue prop adı → onChooseTemplate (anlamlı isim)"`.
- The prop was specified to be renamed to `onChooseTemplate` for semantic clarity. It remains `onContinue` in both `SelectStep.tsx` and `Videos.tsx`.

**5.5 `handleOpenFolder(_folderId: string)` — underscore-prefixed param is silently dropped**
- `_folderId` is never used. Phase 7 cleanup kept the param (for interface compatibility) but the folder context is never tracked.
- Identified in Phase 1 audit. Still present. The `_` prefix is a Linter convention for "intentionally unused," but for a props-facing API this signals a broken contract.

**5.6 `handleCreateFolder` creates new folders with `videoCount: 0, status: "draft"` — hardcoded**
- Newly created folders start with `status: "draft"` hardcoded. There's no mechanism to make them "active."
- The folder `status` field ("Aktif" / "Taslak") has no defined lifecycle transition. Identified in Phase 1 audit.

**5.7 `EntryStep.tsx` has hardcoded "124 products have no video assets"**
- Not in the active flow, but as a preserved legacy file it contains stale data. If accidentally re-imported, it would show a fabricated number.

**5.8 Legacy `PreviewStep.tsx` still imports `Template` type from `GenerateDialog.tsx`**
- `import type { Template } from "./GenerateDialog"` — this creates a live dependency between two legacy files. If either were deleted, TypeScript would fail. Since both are kept on disk, this is benign but adds a type coupling between orphaned files.

**5.9 `Sonner` toast provider mounted but unused**
- `<Sonner />` in App.tsx is available as a toast system. `ExportStep`'s ZIP download was spec'd to use a toast. Instead, it uses button text change. The infrastructure exists but the integration wasn't completed.

---

## 6. Missing Requirements from product.md or feedback-implementation.md

| Requirement | Source | Status |
|---|---|---|
| `SuccessStep count` = approved count, not selected count | product logic | ❌ Uses `selectedProducts.length` — overcounts |
| Back button disabled/hidden at "progress" stage | feedback-implementation.md: "Back butonu yok" | ❌ Renders and is clickable, does nothing |
| Double token deduction guard on review → template back | product.md (token transparency) | ❌ No guard; `handleStartGeneration` deducts unconditionally |
| `onContinue` renamed to `onChooseTemplate` on SelectStep | feedback-implementation.md Phase 2 | ❌ Still `onContinue` |
| TokenBadge in AppShell header (always visible, stable position) | feedback-implementation.md Phase 1 | ❌ In LibraryStep page header (library) + step bar (all other stages) |
| Campaign/folder context visible throughout flow | product.md (campaign-based org) | ❌ Never shown after library stage |
| `template` and `guidedPrompt` passed to `EditPromptStep` | feedback-implementation.md Phase 5 | ❌ Not passed |
| `Exit` confirmation before abandoning mid-flow | product.md (human control) | ❌ No confirmation; exits and leaves stale state |
| All step names in Turkish or consistent language | product.md (Turkish product) | ❌ All English: "Select, Template, Progress, Review, Export, Done" |

---

## 7. Old Assumptions Still Visible

**7.1 `EntryStep.tsx` — "124 products have no video assets" hardcoded**
- The old prototype entry point had a hardcoded stat. This number has no relation to the actual mock data (12 products in PRODUCTS array, with various statuses). If somehow this file were visible, it would show a false metric.

**7.2 `PreviewStep.tsx` imports from `GenerateDialog.tsx` (legacy-to-legacy coupling)**
- Both files are preserved, but `PreviewStep` depends on `GenerateDialog`'s `Template` type. This is a preserved relic of the old architecture where both were active. The type is now also defined in `@/types/video-flow` as `TemplateId`.

**7.3 AppShell sidebar has hardcoded developer name and email**
- "Erdeniz Tunç" / "erdeniz.tunc@optifeed.com" — from an earlier development iteration where the user profile was mocked with real data. For a stakeholder demo this should be generic ("Demo User" or removed).

**7.4 AppShell sidebar nav items route to dead paths**
- Dashboard, Feed Sources, Exports, Dynamic Templates, GA4 Analytics, Meta Ads — all link to undefined routes. This is acceptable for a prototype but means any sidebar click (other than Videos) breaks the demo flow.

**7.5 "Videos" sidebar badge says "New"**
- The "New" badge on the Videos nav item signals that this feature is newly added to the product. For an internal prototype or early demo this is fine, but it implies the feature is new relative to a broader product — which is accurate context but could create questions about what the rest of the product does (all other nav items lead to NotFound).

**7.6 `Toaster` AND `Sonner` both mounted in App.tsx**
- Two separate toast systems initialized. Only `Sonner` was referenced in the ZIP download spec. The dual mount is from an earlier scaffold and is never a practical problem (both are React portals), but it's unresolved infrastructure clutter.

---

## 8. Must-Fix Items

1. **Fix `SuccessStep count` prop** — Change `count={selectedProducts.length}` to `count={approvedIds.length}`. A user who approved 3 of 5 products should see "3 products now have a video asset," not "5."
2. **Disable or hide Back button at "progress" stage** — `getPreviousStage("progress") = null` causes a visible, clickable button that does nothing. Either hide the back button when `getPreviousStage(stage) === null`, or at the progress stage show a "Cancel generation?" confirmation modal.
3. **Guard against double token deduction on review → template back** — Either: (a) change `getPreviousStage("review")` to `null` (no back from review), or (b) add a guard in `handleStartGeneration` to not deduct tokens if `videoJobs` already contains jobs for the same product set, or (c) add a confirmation ("Going back will keep your generated videos. Are you sure?") before navigating back.
4. **Reset state on Exit** — `Exit` should either call `handleAnother()` (full reset to library) or show a confirmation before clearing the flow. Silently changing stage without resetting state is a hidden footgun.
5. **Pass `template` and `guidedPrompt` to `EditPromptStep`** — These are already in Videos.tsx state; they just need to be wired as props. The Edit Prompt screen should show the original template and campaign context.
6. **Pass `approvedIds` and `selectedProducts` to `ExportStep`** — Currently only `approvedCount: number`. The export screen needs to show which specific videos are being exported (product names/images).

---

## 9. Nice-to-Have Later

- Rename `onContinue` to `onChooseTemplate` in SelectStep for semantic clarity.
- Decide and enforce a single product language (Turkish or English). The mixed-language state across phases is the single most pervasive UX inconsistency.
- Add campaign/folder name as a breadcrumb or step bar subtitle — appears once, visible throughout the flow, resolves the 6-phase gap.
- Move TokenBadge into AppShell header so it appears in a stable position regardless of stage. Removes the library-to-select teleport.
- Replace dead sidebar nav routes with NotFound-specific stub pages or route guards showing "Coming soon" rather than a generic 404.
- Generalize the AppShell user profile (remove hardcoded name/email).
- Remove the redundant `as VideoStatus` cast in `handleProgressComplete`.
- Use the available `Sonner` toast for ZIP download feedback per spec, removing the `Toaster` duplicate or clarifying which toast system is canonical.
- Show Back button at success stage only if the step bar is hidden at success, or suppress the step bar entirely on the success screen (success is a terminal state, not a workflow step to navigate within).
- Pass template and guided prompt through `GenerationProgressStep.onComplete(jobs)` so Videos.tsx can track completed job states from the progress screen instead of blindly marking all as ready.

---

## 10. Recommended Fix Direction

Phase 7 integration is largely clean at the architectural level. The stage machine is correct, transitions work, legacy code is isolated, and the build is clean. The issues that remain are three categories:

**Category 1 — Data bugs**: `SuccessStep count` is the most visible correctness bug: showing the wrong number on the final success screen directly contradicts what just happened in review. It takes one prop change. Fix it first.

**Category 2 — Navigation footguns**: The Back button doing nothing at `progress`, and the Exit button abandoning state silently, are interaction promises the UI makes that it doesn't keep. Both require small targeted fixes — hiding/disabling the back button when `getPreviousStage` returns null, and adding a reset or confirmation to Exit. The back-from-review double-token deduction is the most dangerous of the three: it silently costs the user money in a real integration.

**Category 3 — Systemic gaps that were never resolved**: Campaign context, language consistency, and TokenBadge position have been identified in every phase audit (Phase 1 through Phase 6). They are not phase-specific bugs — they are architectural decisions that were either deferred or missed during the validated prototype build. These cannot be fixed one phase at a time; they require: (a) a product decision on language (commit to Turkish or English), (b) a single place in the URL/state to hold the current campaign context and surface it in the step bar, and (c) a TokenBadge placement decision that's made once in AppShell rather than duplicated in LibraryStep and the step bar.

The prototype is functionally complete as a click-through demo. The fixes needed to make it a credible validated product representation — accurate success count, working back button, campaign context — are all small, bounded changes that would substantially close the gap between what the code does and what product.md describes.
