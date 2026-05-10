# Consolidated Fix Plan
## Optifeed AI Video — Validated Prototype

> **Sources:** audit.md (Phases 1–7), product.md, feedback-implementation.md
> **Constraint:** Frontend-only. No backend, no real API, no auth changes.
> **Approach:** Fix what the prototype communicates incorrectly; do not add features.

---

## 1. Executive Summary

The prototype's core flow is structurally sound — all eight stages exist, all transitions are wired, and the fundamental product decisions from product.md are reflected in the architecture. However, several issues would cause a stakeholder review to communicate the wrong product. The most critical is the timing display on the progress screen: showing "~10 min remaining" when the demo completes in under 30 seconds immediately breaks the prototype's credibility. A close second is the SuccessStep showing the wrong count — "5 products now have a video asset" when only 3 were approved is factually incorrect on the final screen. The review experience is partially broken because auto-playing muted video with no controls does not enable genuine video review, and there are dead affordances (an unclickable play button, a duplicate export CTA). The Edit Prompt screen is missing the dropdown preset half of the hybrid model that product.md explicitly requires. Across all phases, campaign/folder context disappears completely after the library screen, contradicting product.md's campaign-based organizational model. The language split — Turkish in Phase 1, English in Phases 2–7, mixed in Phase 3 — is the most pervasive inconsistency and needs a single product-wide decision before any screen-by-screen fixes are applied.

---

## 2. Critical Must-Fix Before Stakeholder Review

Issues that would cause a stakeholder to conclude the product is broken, misrepresent the product's value proposition, contain personal developer data, or show factually incorrect information.

---

### 2.1 SuccessStep shows wrong video count

- **Issue:** `<SuccessStep count={selectedProducts.length} ...>` — displays "N products now have a video asset." Only approved products have a video asset; rejected products do not.
- **Source phase:** Phase 7
- **Why it matters:** The final screen of the entire flow states incorrect information. A user who selected 10 and approved 3 is told "10 products now have a video asset" — directly contradicting the review decisions they just made.
- **Recommended fix:** Change the prop in `Videos.tsx`:
  ```tsx
  // Before
  <SuccessStep count={selectedProducts.length} ... />
  // After
  <SuccessStep count={approvedIds.length} ... />
  ```
- **Affected files:** `src/pages/Videos.tsx`
- **Acceptance criteria:** With 5 selected and 3 approved, SuccessStep shows "3 products now have a video asset."

---

### 2.2 Progress screen timing display destroys demo credibility

- **Issue:** `estimatedRemainingMin = inFlightCount × ESTIMATED_MINUTES_PER_VIDEO` (2 minutes/video). With 5 products selected, the screen shows "~10 min remaining" at start. The demo completes in ~15 real seconds. The estimate is immediately and visibly wrong.
- **Source phase:** Phase 4
- **Why it matters:** In any stakeholder demo or user test, this is the first moment that breaks the suspension of disbelief. A prototype that tells you "10 minutes" and finishes in 15 seconds is not usable as a representation of the product.
- **Recommended fix:** Replace the minutes estimate with a demo-appropriate display. Two options:
  - **(A — Simplest):** Remove the time estimate entirely from the progress screen. Show only `{readyCount} / {total} video hazır`. No time counter.
  - **(B — Honest demo):** Compute from `DEMO_VIDEO_GENERATION_DELAY_MS`: `remainingSeconds = (total - readyCount) × (DEMO_VIDEO_GENERATION_DELAY_MS / 1000)` and display as "~{n} saniye" in demo mode.
  Option A is recommended — it avoids the conflation problem entirely and is faster to implement.
- **Affected files:** `src/components/videos/GenerationProgressStep.tsx`
- **Acceptance criteria:** Progress screen no longer shows a minute-based remaining time estimate that contradicts the demo speed.

---

### 2.3 Back button is visible and clickable but does nothing at "progress" stage

- **Issue:** `getPreviousStage("progress")` returns `null`. The step bar renders a "Back" button that is fully interactive but triggers no action when clicked.
- **Source phase:** Phase 7
- **Why it matters:** A user wanting to cancel generation clicks Back and nothing happens. This is a broken interaction promise — a visible, styled, clickable button that does nothing.
- **Recommended fix:** In the step bar component, conditionally hide or disable the Back button when `getPreviousStage(stage) === null`. The "progress" and "success" stages both have this problem.
  ```tsx
  const prevStage = getPreviousStage(stage)
  // Only render Back button if prevStage !== null
  {prevStage && <Button onClick={handleBack}>Back</Button>}
  ```
- **Affected files:** `src/pages/Videos.tsx` (step bar render logic) or `src/components/videos/StepIndicator.tsx` depending on where the back button lives
- **Acceptance criteria:** At "progress" and "success" stages, no Back button is visible. At all other stages, Back button renders and navigates correctly.

---

### 2.4 Unclickable play button on VideoProgressCard ready state

- **Issue:** `VideoProgressCard` in the "ready" state shows a product image with a Play icon overlay. There is no `onClick` handler. The play button is a visible, interactive-looking affordance that does nothing when clicked.
- **Source phase:** Phase 4
- **Why it matters:** Dead affordances teach users that the UI is unreliable. In a demo context, a stakeholder clicking the play icon expects to see the video — and nothing happens.
- **Recommended fix:** Remove the play icon overlay from the ready thumbnail in `VideoProgressCard`. The thumbnail can remain as visual confirmation of completion without implying playability. The `"İncele"` action that the spec requires would be a separate explicit button; for this fix, simply removing the unclickable icon resolves the broken affordance.
- **Affected files:** `src/components/videos/VideoProgressCard.tsx`
- **Acceptance criteria:** Ready-state cards show a completion visual (green check, product thumbnail) without any play icon that implies but doesn't enable playback.

---

### 2.5 ReviewStep sticky bar has two CTAs that do the same thing

- **Issue:** The sticky bar has two `<Button>` elements — "Export approved" (outline, Download icon) and "Continue to export" (filled, Send icon) — both calling `onContinue` with identical `disabled={!canContinue}`. The user sees two distinct-looking options that produce the same outcome.
- **Source phase:** Phase 5
- **Why it matters:** Two buttons imply two choices. A user reading "Export approved" vs "Continue to export" will pause to understand the difference. When they realize there is none, trust in the UI decreases. It also creates a false impression that one action downloads immediately while the other proceeds to the next screen.
- **Recommended fix:** Remove "Export approved" (the outline button). Keep only "Continue to export" (or the Turkish equivalent per the language decision). One action, one button.
- **Affected files:** `src/components/videos/ReviewStep.tsx`
- **Acceptance criteria:** Sticky bar has exactly one CTA for export. Clicking it navigates to the export stage.

---

### 2.6 Video playback controls missing — review is not functional

- **Issue:** Both list and grid view in `ReviewVideoCard` render `<video autoPlay muted loop playsInline>` with no controls, no pause button, and no unmute toggle. Users cannot stop the video, replay a specific moment, or hear audio.
- **Source phase:** Phase 5
- **Why it matters:** product.md calls this the "Preview / Review" step. "Preview" implies watching. A performance marketer approving a video for an ad campaign cannot make a quality judgment from an auto-muted silent loop. The old `PreviewStep.tsx` (now preserved but unused) had play/pause and mute/unmute controls — these were lost in the rework.
- **Recommended fix:** Add `controls` to the `<video>` element, or implement a minimal custom control overlay: play/pause toggle button + mute/unmute toggle. At minimum, the native browser `controls` attribute resolves the problem immediately.
  ```tsx
  <video src={videoJob.videoUrl ?? SAMPLE_VIDEO} controls muted loop playsInline ... />
  ```
  Or a small custom control bar with `onClick` handlers on the video element for play/pause and mute toggle.
- **Affected files:** `src/components/videos/ReviewVideoCard.tsx`
- **Acceptance criteria:** User can pause, resume, and toggle mute on each video in the review screen.

---

### 2.7 EditPromptStep is missing the dropdown preset half of the hybrid model

- **Issue:** product.md explicitly defines Edit Prompt as a **hybrid model**: "Dropdown / preset seçenekleri (sektöre ve şablona göre değişen öneriler) + Free text prompt alanı + Örnek promptlar / guidance." feedback-implementation.md Phase 5 spec: "Dropdown presetler (sektöre/şablona göre) + Free text textarea (max 200 karakter, placeholder ile örnek prompt) + Örnek prompt önerileri (tıklanınca textarea'ya dolar)." The current implementation has only free text + chips. No dropdown presets.
- **Source phase:** Phase 5
- **Why it matters:** product.md justifies free text by saying "Moda/tekstil gibi sektörlerde sınırsız varyasyon gerekebilir. Yalnızca dropdown ile bu ihtiyaç karşılanamaz." — meaning free text is *in addition to* dropdowns, not instead of them. The structured preset side of the hybrid (quick sector/theme/background changes) is entirely absent. This is a spec non-compliance, not a style preference.
- **Recommended fix:** Add dropdown selects for Sektör, Tema/kampanya bağlamı, and Background/concept above the free text area, using the same `SECTOR_OPTIONS`, `THEME_OPTIONS`, `BACKGROUND_OPTIONS` from `src/data/guidedPromptOptions.ts`. These are already used in `GuidedPromptFields.tsx` for Phase 3. Reuse the same options.
- **Affected files:** `src/components/videos/EditPromptStep.tsx`, `src/data/guidedPromptOptions.ts`
- **Acceptance criteria:** EditPromptStep shows sector/theme/background dropdowns above the free text textarea. Selecting a preset option updates the textarea with the preset value (if textarea is empty) or appends it. Free text area remains independently editable.

---

### 2.8 ExportStep receives only approvedCount — product identities are invisible

- **Issue:** `ExportStep` props are `approvedCount: number, onComplete: (feedNames: string[]) => void, onSkip: () => void`. The component has no knowledge of which specific products are approved, their names, or their images. The user just spent Phase 5 reviewing individual products — the export screen shows them a number, not their work.
- **Source phase:** Phase 6
- **Why it matters:** product.md: "Onaylanan videolar seçilen kanallara gönderilir" — the export step is about sending *specific* approved videos to specific feeds. The connection between "I approved these 3 videos" and "I'm about to apply them to these feeds" must be visible. A user cannot confirm what they're exporting when they see only a count.
- **Recommended fix:** Pass `approvedIds: string[]` and `selectedProducts: Product[]` to `ExportStep` from `Videos.tsx`. Render a small product strip (product image + name, max 5 with "+N more") at the top of the export screen to confirm which videos are being applied.
- **Affected files:** `src/pages/Videos.tsx`, `src/components/videos/ExportStep.tsx`
- **Acceptance criteria:** Export screen shows a visual list/strip of the approved products (images + names) at the top, so the user can confirm what they're about to apply.

---

### 2.9 Download button label is misleading — claims N files, delivers 1

- **Issue:** `"Download MP4 ({approvedCount} file{s})"` — implies N individual files will be downloaded. Clicking the `<a>` tag downloads one `SAMPLE_VIDEO` file named `approved-video.mp4`. A user who approved 5 videos and receives 1 generic fire video labeled as their product will immediately distrust the prototype.
- **Source phase:** Phase 6
- **Why it matters:** The mismatch between stated count and delivered file is jarring enough to break trust in a demo. For a stakeholder who clicks it, this is a red flag.
- **Recommended fix:** Change the button label to remove the count claim: `"Örnek video indir (MP4)"` or simply `"İndir (örnek)"`. Alternatively, add a small note next to the button: "Demo: sample dosya indirilir." Either approach is honest without requiring real multi-file download.
- **Affected files:** `src/components/videos/ExportStep.tsx`
- **Acceptance criteria:** Download button label does not claim to deliver N files when only 1 sample file is delivered.

---

### 2.10 Hardcoded developer identity in AppShell sidebar

- **Issue:** `AppShell.tsx` shows `"Erdeniz Tunç"` and `"erdeniz.tunc@optifeed.com"` as the logged-in user identity, hardcoded in the sidebar bottom section.
- **Source phase:** Phase 7
- **Why it matters:** In any stakeholder demo or user test involving a person other than the developer, their personal name and email appear at the bottom of every screen throughout the flow. This is unprofessional and potentially inappropriate.
- **Recommended fix:** Replace with a generic demo identity: `"Demo User"` / `"demo@optifeed.com"` or a placeholder like `"Optifeed Kullanıcısı"`.
- **Affected files:** `src/components/AppShell.tsx`
- **Acceptance criteria:** Sidebar shows a generic identity, not the developer's personal name or email.

---

### 2.11 "Top up to regenerate this video" copy implies a non-existent feature

- **Issue:** `EditPromptStep` insufficient-balance message: `"Insufficient balance. Top up to regenerate this video."` There is no "top up" or credit purchase flow in this prototype or in the MVP scope.
- **Source phase:** Phase 5
- **Why it matters:** The message sets an expectation the product cannot fulfil. A stakeholder testing the flow may ask "where's the top-up button?" or assume they missed part of the UX.
- **Recommended fix:** Replace with a message that is honest about the current constraints: `"Bakiye yetersiz. Yeniden üretim yapılamaz."` or similar — stating the state without implying a purchase flow exists.
- **Affected files:** `src/components/videos/EditPromptStep.tsx`
- **Acceptance criteria:** Insufficient-balance message does not imply a top-up or purchase flow.

---

## 3. Messaging Fixes

All copy/messaging issues grouped by screen. These do not block flow but affect how well the prototype communicates the product.

---

### 3.1 Language consistency — systemic decision needed

- **Current problem:** Phase 1 (Library) is entirely Turkish. Phase 2 (Product Selection) is entirely English. Phase 3 is mixed — English page-level copy, Turkish field labels. Phases 4–7 are English. The step bar is English throughout. This is not a per-phase bug; it accumulated as each phase was built in the developer's default language.
- **Better direction:** Make a single decision and apply it uniformly. product.md is written for a Turkish-language product ("Anneler Günü Kampanyası," "sektör," etc.) targeting Turkish performance marketers. The spec copies across all phases are in Turkish. **Recommended: Turkish throughout.** This resolves all per-phase copy inconsistencies in one pass.
- **Affected screens:** All screens; step bar labels; all CTA labels

---

### 3.2 Library — empty state copy

- **Current problem:**
  - Title: `"Henüz klasör yok"` — spec: `"Henüz video klasörünüz yok"` (possessive is more personal)
  - CTA: `"İlk klasörü oluştur"` — product.md: `"İlk videoyu oluştur"` (focus on the user's goal: videos, not folders)
  - Subtitle is administratively framed ("organize your product videos") rather than goal-oriented
- **Better direction:**
  - Title: `"Henüz video klasörünüz yok"`
  - CTA: `"İlk videonuzu oluşturun"` (video creation intent, not folder creation)
  - Subtitle: `"Kampanyalarınız için ürün videoları oluşturun ve yönetin."`
- **Affected screen:** `LibraryStep.tsx`

---

### 3.3 Library — bottom token-cost hint

- **Current problem:** `"Her video oluşturma {10} token harcar."` rendered at the bottom of the library. Two problems: (1) cost transparency belongs at the template/cost confirmation step per product.md, not at the library entry; (2) `{10}` is a JSX literal, not using `TOKEN_COST_PER_VIDEO` constant.
- **Better direction:** Remove the hint entirely from the library screen. It belongs on the `GenerateCostConfirm` widget at template selection, where it already exists. If kept, replace `{10}` with `{TOKEN_COST_PER_VIDEO}`.
- **Affected screen:** `LibraryStep.tsx`

---

### 3.4 Product selection — trust microcopy missing

- **Current problem:** The `CostEstimateBar` shows `"~40 tokens"` with no reassurance that tokens are not deducted at selection time. product.md explicitly notes: `"Bu aşamada ödeme alınmayacaktır" veya benzeri güven veren mikrocopy (değerlendirmeye alınmalı)`.
- **Better direction:** Add a small line below the cost estimate: `"Token, yalnızca video üretimi başladığında düşülür."` This is one sentence that eliminates uncertainty.
- **Affected screen:** `CostEstimateBar.tsx`

---

### 3.5 Template selection — heading and section label language

- **Current problem:**
  - Page subtitle: `"Select the video format, then optionally configure the production context."` — "production context" is internal/technical jargon.
  - Section label: `"PRODUCTION SETTINGS"` — sounds like studio/technical settings, not campaign creative parameters.
  - Cost confirm heading: `"Ready to generate {n} videos"` — status language. feedback-implementation.md spec: `"{n} video üretilecek"` (direct declarative).
  - Cost confirm stat labels: "Videos", "Estimated time", "Token cost" — all English; spec: `"Tahmini süre"`, `"Tahmini maliyet"`, `"Kalan bakiye"`.
  - "All fields optional — fill what's relevant" — English inside a Turkish field group.
- **Better direction:**
  - Section label: `"Kampanya bağlamı"` or `"Yaratıcı bağlam"`
  - Cost confirm heading: `"{n} video üretilecek"`
  - Stat labels: `"Tahmini süre"` / `"Tahmini maliyet"` / `"Kalan bakiye"` per spec
  - Hint: `"Tüm alanlar isteğe bağlıdır — ilgili olanları doldurun."`
- **Affected screens:** `TemplateSelectionStep.tsx`, `GenerateCostConfirm.tsx`

---

### 3.6 Generation progress — all labels in English

- **Current problem:** "Pending", "Generating...", "Ready", "All videos ready!", "Review videos →" — all English. feedback-implementation.md specs all in Turkish: "Sırada bekliyor", "Üretiliyor...", "Hazır ✓", "Tüm videolar hazır!", "Videoları incele →".
- **Better direction:** Replace all status labels and headings with the Turkish equivalents specified in feedback-implementation.md.
- **Affected screen:** `VideoProgressCard.tsx`, `GenerationProgressStep.tsx`

---

### 3.7 Review — "Approved" button does not signal toggle-ability

- **Current problem:** When approved, the button changes to green and reads `"Approved"` — looks like a completed state. The Reject button correctly shows `"Undo reject"` to signal reversibility. Approve is inconsistent.
- **Better direction:** When in approved state, relabel to `"Onayı geri al"` (or `"Undo approve"`) to match the Reject button's reversibility convention.
- **Affected screen:** `ReviewVideoCard.tsx`

---

### 3.8 Edit Prompt — English copy mixed with Turkish chips

- **Current problem:** Title "Edit prompt", subtitle "Describe how you'd like the video to look...", placeholder "e.g. Clean white background...", CTA "Regenerate video" — all English. But the 6 example prompt chips are in excellent contextual Turkish. The two languages appear in the same component simultaneously.
- **Better direction:** Translate all UI chrome to Turkish:
  - Title: `"Promptu düzenle"` or `"Videonuzu düzenleyin"`
  - CTA: `"Yeniden üret"` per spec
  - Subtitle and placeholder in Turkish
- **Affected screen:** `EditPromptStep.tsx`

---

### 3.9 Export — CTAs and labels in English

- **Current problem:** "Complete →", "Skip and complete", "Apply all", "Download videos", "Download MP4 (N files)", "Download as ZIP" — all English. feedback-implementation.md spec: `"Tamamla"`, `"Atla ve tamamla"`, `"ZIP hazırlanıyor... İndirme başladı"` (toast).
- **Better direction:** Translate all CTAs to Turkish per spec. Also add toast for ZIP download instead of button text change (spec requires toast via `Sonner`, which is already mounted in `App.tsx` but unused).
- **Affected screen:** `ExportStep.tsx`

---

### 3.10 SuccessStep — "Go to feed" navigates to library

- **Current problem:** "Go to feed" button calls `setStage("library")`. In Optifeed's context, "feed" means the export/channel feed (Google Merchant, Meta Catalog), not the product library. The label creates a false expectation.
- **Better direction:** Either rename to `"Kütüphaneye dön"` / `"Library'e dön"` (accurate), or remove this secondary CTA if the library is the only valid destination.
- **Affected screen:** `SuccessStep.tsx`

---

### 3.11 StepIndicator — all step labels in English

- **Current problem:** `STEPS = ["Select", "Template", "Progress", "Review", "Export", "Done"]` — all English. Always visible across the entire flow.
- **Better direction:** Translate per the language decision: `["Seç", "Şablon", "Üretim", "İncele", "Dışa Aktar", "Tamamlandı"]` or similar Turkish equivalents.
- **Affected screen:** `StepIndicator.tsx`

---

## 4. UI/UX Fixes

Layout, hierarchy, interaction, state clarity, and visual consistency issues.

---

### 4.1 Folder grid is 3 columns — spec says 2

- **Current problem:** `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` — 3 columns on large screens. feedback-implementation.md Phase 1 spec: `"2 kolonlu kart grid (masaüstü), 1 kolon (mobil)"`.
- **Recommended fix:** Change to `grid-cols-1 sm:grid-cols-2` — removes the 3-column breakpoint entirely.
- **Affected screen:** `LibraryStep.tsx`

---

### 4.2 TokenBadge position jumps between library and all other stages

- **Current problem:** At "library" stage, TokenBadge is inside `LibraryStep`'s own page header. At all other stages, it's in the sticky step bar. The badge visually teleports between two different positions at the library → select transition. feedback-implementation.md: `"TokenBadge AppShell header'ına yerleştirilecek"` — intended to live in AppShell permanently.
- **Recommended fix:** Move TokenBadge into AppShell's header so it appears in one stable position regardless of stage. Remove it from `LibraryStep`'s in-page header.
- **Affected files:** `src/components/AppShell.tsx`, `src/components/videos/LibraryStep.tsx`, `src/pages/Videos.tsx` (pass tokenBalance down to AppShell)

---

### 4.3 Back button visible at "success" stage

- **Current problem:** The step bar shows at "success" (since `stage !== "library"`), and the Back button renders — but `getPreviousStage("success")` returns `null`, so it does nothing. A completion screen wrapped in a navigation header with a non-functional Back button is confusing.
- **Recommended fix:** Covered partially by Fix 2.3. If Back button is hidden when `getPreviousStage === null`, this is automatically resolved. Optionally, suppress the entire step bar at the "success" stage — success is a terminal state, not a step to navigate within.
- **Affected files:** `src/pages/Videos.tsx`

---

### 4.4 Campaign/folder context never shown after library stage

- **Current problem:** After selecting "Anneler Günü Kampanyası" from the library and entering the flow, the campaign name never appears again on any screen (select, template, progress, review, export, success). The step bar always shows the generic title "Create product videos." product.md's organizing principle is campaign-based work — this is invisible throughout the entire active flow.
- **Recommended fix:** Add the active folder/campaign name as a subtitle to the step bar header: "Anneler Günü Kampanyası" shown in small muted text below "Video Oluştur." This requires passing the folder name from `Videos.tsx` to the step bar — a small prop addition.
- **Affected files:** `src/pages/Videos.tsx`, step bar component

---

### 4.5 Progress pending cards at 50% opacity are hard to read

- **Current problem:** `isPending && "opacity-50"` — the product name and image on pending cards are noticeably faded. Readability suffers, especially on lower-quality screens.
- **Recommended fix:** Reduce to `opacity-60` or use a more selective approach: mute only the status area, not the entire card. Alternative: keep full opacity but use a lighter border color (`border-border/40`) to signal "not yet active."
- **Affected screen:** `VideoProgressCard.tsx`

---

### 4.6 "Apply All" bypasses per-feed attribute review without warning

- **Current problem:** Clicking "Apply All" instantly marks all feeds as applied using their current dropdown values, without any confirmation. Different feeds have different default attributes. A user who clicks "Apply All" without reviewing each feed's attribute may map video URLs to the wrong attribute for some feeds.
- **Recommended fix:** Either: (a) add a simple confirmation: "Tüm feed'lere mevcut attribute ayarlarıyla uygulanacak. Devam edilsin mi?" before executing, or (b) change "Apply All" to set cards to a "ready to apply" pre-applied state that requires one more confirmation CTA rather than executing instantly.
- **Affected screen:** `ExportStep.tsx`

---

### 4.7 ZIP download uses button-text change instead of toast

- **Current problem:** feedback-implementation.md spec: `"mock: toast gösterir 'ZIP hazırlanıyor... İndirme başladı'"`. Current behavior: button text changes to "Preparing ZIP..." for 1 second. `Sonner` is mounted in `App.tsx` but unused.
- **Recommended fix:** Use `sonner`'s `toast()` to show the notification: `toast("ZIP hazırlanıyor... İndirme başladı")` when the button is clicked.
- **Affected files:** `src/components/videos/ExportStep.tsx`

---

### 4.8 "Meta Export (Copy)" feed name reads as UI accident

- **Current problem:** One of the 5 mock feed exports is named `"Meta Export (Copy)"` — looks like an accidentally duplicated entry, not a real feed configuration.
- **Recommended fix:** Rename to something purposeful, e.g., `"Meta Retargeting Export"` or `"Meta Dynamic Creative Export"`.
- **Affected files:** `src/data/feedExports.ts`

---

## 5. Product Flow Fixes

Issues related to stage transitions, user intent, context continuity, and active flow correctness.

---

### 5.1 Exit button leaves stale state without reset or confirmation

- **Current problem:** The step bar Exit button calls `setStage("library")` directly. It does not reset `selectedIds`, `videoJobs`, `approvedIds`, `rejectedIds`, `editingProductId`, or any other flow state. If the user clicks Exit mid-review and then opens any folder, they arrive at SelectStep with their previous selection still intact.
- **Recommended fix:** Either: (a) call `handleAnother()` on Exit (which performs the full state reset), or (b) show a simple confirmation before exiting: `"Akıştan çıkmak istediğinizden emin misiniz? İlerlemeniz kaybolacak."` — and only reset state if confirmed.
- **Affected files:** `src/pages/Videos.tsx`

---

### 5.2 review → template back navigation enables double token deduction

- **Current problem:** `getPreviousStage("review") = "template"`. The user can navigate Back from review to template. `handleStartGeneration` deducts `selectedIds.length × TOKEN_COST_PER_VIDEO` every time it is called. Navigating Back and clicking "Generate videos" again deducts tokens a second time for the same products.
- **Recommended fix:** Choose one of:
  - **(A)** Set `getPreviousStage("review")` to `null` — no back from review. This is the simplest and safest. product.md does not explicitly support back-from-review.
  - **(B)** Add a guard in `handleStartGeneration`: if `videoJobs.length > 0` and the selected product IDs match the existing jobs, skip the token deduction (treat as a re-generation, not a new generation).
  - Recommended: Option A — aligns with product.md's "insan onayı" principle; once generation starts, you proceed forward.
- **Affected files:** `src/pages/Videos.tsx`

---

### 5.3 `template` and `guidedPrompt` states are write-only in Videos.tsx

- **Current problem:** `const [template, setTemplate]` and `const [guidedPrompt, setGuidedPrompt]` are set in `handleStartGeneration` and reset in `handleAnother`. Neither is ever passed to any component as a prop. `EditPromptStep` (which needs them per spec) and `GenerationProgressStep` (which needs them for context display per spec) both lack these values.
- **Recommended fix:** Pass `template` and `guidedPrompt` as props to `EditPromptStep`. This enables Edit Prompt to show "current template info" (spec requirement) and pre-populate dropdowns with the original generation settings.
  - `GenerationProgressStep` receiving these for context display is a nice-to-have (see Section 8).
- **Affected files:** `src/pages/Videos.tsx`, `src/components/videos/EditPromptStep.tsx`

---

### 5.4 `onRegenerate(productId)` discards the typed prompt

- **Current problem:** `EditPromptStep.handleRegenerate()` calls `onRegenerate(product.id)`. `Videos.tsx handleEditRegenerate(productId)` receives only the productId. The `promptText` typed by the user is discarded when the component unmounts.
- **Recommended fix:** Change `onRegenerate` signature to `onRegenerate(newPrompt: string)` per spec. `Videos.tsx` can store the new prompt in the video job or in a local map keyed by productId, for future use. In the prototype, the video URL doesn't change — but the new prompt should at least flow through the architecture correctly.
- **Affected files:** `src/components/videos/EditPromptStep.tsx`, `src/pages/Videos.tsx`

---

### 5.5 EditPromptStep free-text max is 500 — spec says 200

- **Current problem:** `maxLength={500}` in `EditPromptStep.tsx`. feedback-implementation.md Phase 5 spec: `"Free text textarea (max 200 karakter)"`. Also inconsistent with `GuidedPromptFields.tsx` free text (max 200 per audit, though spec says 100).
- **Recommended fix:** Set `maxLength={200}` in `EditPromptStep.tsx` to match spec.
- **Affected files:** `src/components/videos/EditPromptStep.tsx`

---

### 5.6 TOKEN_COST_PER_VIDEO hardcoded as literal `{10}` in LibraryStep

- **Current problem:** `LibraryStep.tsx` line ~146: `"Her video oluşturma {10} token harcar."` — literal `{10}`, not using the `TOKEN_COST_PER_VIDEO` constant from `src/data/tokens.ts`.
- **Recommended fix:** Replace with `{TOKEN_COST_PER_VIDEO}`. If the hint is removed per Fix 3.3, this becomes moot.
- **Affected files:** `src/components/videos/LibraryStep.tsx`

---

## 6. State Machine / Code Flow Fixes

Technical flow issues that affect product behavior in the prototype.

---

### 6.1 Two parallel video job tracking systems — never synced

- **Current problem:** `GenerationProgressStep` maintains its own `VideoProgressJob[]` local state (with `productName`, `productImage`, animated status transitions). `Videos.tsx` maintains `videoJobs: VideoJob[]` (simpler, just productId/status/videoUrl). These are initialized independently and evolve independently. `onComplete()` takes no arguments — `handleProgressComplete` blindly marks all parent jobs as "ready" without knowing the local state.
- **Recommended fix for prototype:** This works correctly in the current implementation because `handleProgressComplete` always marks all jobs ready and `SAMPLE_VIDEO` is the URL for all of them. The systemic fix (passing final job states via `onComplete(jobs)`) is a nice-to-have architectural improvement. For now, add a comment in `handleProgressComplete` explaining the intentional dual-state design and the force-completion behavior.
- **Affected files:** `src/components/videos/GenerationProgressStep.tsx`, `src/pages/Videos.tsx`

---

### 6.2 `Toaster` and `Sonner` both mounted — canonical toast system unclear

- **Current problem:** `App.tsx` has both `<Toaster />` (shadcn) and `<Sonner />` mounted. The ZIP toast (Fix 4.7) should use `Sonner`. Nothing in the codebase currently uses either.
- **Recommended fix:** When implementing the ZIP toast (Fix 4.7), use `sonner`'s `toast()`. Remove `<Toaster />` to leave one canonical toast provider. Or document which is canonical.
- **Affected files:** `src/App.tsx`

---

### 6.3 `as VideoStatus` cast in handleProgressComplete is redundant

- **Current problem:** `{ ...j, status: "ready" as VideoStatus, ... }` — `"ready"` is already a valid `VideoStatus` literal. The cast adds no type safety.
- **Recommended fix:** Remove the cast: `status: "ready"`.
- **Affected files:** `src/pages/Videos.tsx`

---

### 6.4 `FeedExport` mock data missing `selectedCount` field per spec

- **Current problem:** feedback-implementation.md Phase 0 spec includes `selectedCount: number` on `FeedExport` (mock: 26 — how many of the feed's products match this batch). The field is absent; `approvedCount` prop is used as a substitute. This conflates "how many of your batch are approved" with "how many of this feed's products match."
- **Recommended fix:** Add `selectedCount: number` to the `FeedExport` interface and set a varied mock value per feed (e.g., 26, 31, 18, 24, 12). Display as `"{approvedCount} of {feed.selectedCount} products"` (approved videos out of the matching subset), replacing the current uniform `"X of 147"`.
- **Affected files:** `src/data/feedExports.ts`, `src/components/videos/ExportFeedCard.tsx`

---

## 7. Out-of-Scope Items to Avoid

Do not implement these, even if mentioned in audits. All are either product.md Out of Scope, require backend, or are V2 features.

| Item | Reason |
|---|---|
| Text overlay / font / kampanya metni editörü | product.md Out of Scope: "ayrı feature veya Dynamic Creative ürününün parçası" |
| Multi-dimension / aspect ratio üretimi | product.md Out of Scope: "V2" |
| Hover video preview on template cards | product.md Out of Scope: "nice-to-have, V2 olabilir" |
| Real AI video generation (Runway, Pika, Kling) | Frontend-only constraint; no real API |
| Real feed publishing (actual write to Google/Meta/TikTok) | Frontend-only; product.md: "Open Question #2" (webhook/polling unresolved) |
| Top-up / credit purchase flow | No such feature defined in product.md or feedback-implementation.md |
| Scheduling (start/end date automation) | product.md Out of Scope: "V1 dışı" |
| Bulk upload (user uploads prepared list) | product.md Out of Scope: "V1 dışı" |
| Email / in-app notifications | product.md Out of Scope: "V1 dışı" |
| Auth changes | Frontend-only constraint |
| Real backend / API / database | Frontend-only constraint |
| 1000-product bulk generation | product.md Out of Scope: "farklı mimari gerektirir" |
| Folder content view (viewing existing videos per folder) | product.md feature but not in the active flow; mock videoCount values are decorative |
| Advanced video editor | product.md: "Araç, sınırsız AI video editörü değildir" |
| Version management (multiple video versions per product) | product.md: "Open Question #4, Düşük" |
| TikTok feed export in mock data | Not blocking; SendStep had TikTok; current mock has Google+Meta only — leave as-is |

---

## 8. Nice-to-Have Later

Non-blocking improvements, deferred to post-stabilization.

- **Campaign/folder context in EditPromptStep** — show which campaign this video was generated for, in addition to the template info fix (Fix 5.3). Currently both template and campaign are invisible in the Edit Prompt screen.
- **`GenerationProgressStep` receives `template` and `guidedPrompt` as props** — enables showing "Üretim: Product Spotlight — Anneler Günü — Moda & Giyim" context during the wait, so the user has confirmation of what's being generated.
- **Per-card "İncele" button on VideoProgressCard ready state** — spec-required per feedback-implementation.md Phase 4, enabling per-video review access from the progress screen. Deferred because the early-review CTA covers the primary use case.
- **`onChooseTemplate` prop name on SelectStep** — `onContinue` → `onChooseTemplate` per feedback-implementation.md Phase 2 semantic naming spec. Non-behavioral change.
- **`tokenCostPerVideo` as prop** on `CostEstimateBar`, `GenerateCostConfirm`, and `EditPromptStep` instead of importing directly from `tokens.ts`. Architecture cleanup per spec.
- **`onBack` prop on `TemplateSelectionStep`** — spec-required but currently handled by the step bar externally. No functional gap for now.
- **Visual differentiation for regenerated video** — a brief "Güncellendi" badge after Edit Prompt regeneration so the user knows a new video was produced. Currently the card looks identical.
- **Stacked-card visual metaphor for `StackedImageIndicator`** — product.md: "iskambil kağıdı benzeri indicator." Currently a badge overlay. Nice-to-have cosmetic.
- **Vary mock feed data** — different `source`, `productCount`, `selectedCount` values per feed to make the export screen feel like real distinct configurations.
- **`GuidedPromptFields` free-text max from 200 to 100** — spec says 100, implemented as 200. Non-blocking, minor spec alignment.
- **All-rejected warning state** — a stronger signal when all videos are rejected (currently only the disabled CTA indicates this).
- **Lazy video loading in grid review view** — avoid simultaneous decoding of 8–10 videos. Not needed for prototype fidelity but improves browser performance.

---

## 9. What Not to Fix Now

Items explicitly excluded from this fix pass to prevent scope creep.

| Item | Why to leave it |
|---|---|
| `ProductTag` / `tags` field in Product interface | Legacy dead data; removing requires touching all 12 mock products. No UI impact. Safe to leave. |
| `_folderId` parameter in `handleOpenFolder` | Underscore-prefix acknowledges intentional unused status. Prototype has no folder persistence anyway. |
| `activeFolderId` state being absent | Folder context is addressed via Fix 4.4 (display folder name); full state tracking is a V1+ concern. |
| `EntryStep.tsx` on disk | Correctly preserved per spec (import removed, file kept). Leave as-is. |
| `GenerateDialog.tsx` on disk | Correctly preserved per spec. Leave as-is. |
| `PreviewStep.tsx` on disk | Correctly preserved per spec. Leave as-is. |
| `SendStep.tsx` on disk | Correctly preserved per spec. Leave as-is. |
| `ProductCard.tsx` list view metadata hidden on small screens | Acceptable responsive trade-off; does not block stakeholder review. |
| Social Story TemplateCard showing landscape preview | Minor visual inconsistency; helperText already notes MVP 1:1 format. Not blocking. |
| `handleOpenFolder` → `setStage("select")` not showing folder contents | product.md feature; folder-content view is not in active flow and mock data videoCount is decorative. Leave mock counts as-is. |
| Folder `status: "active" \| "draft"` lifecycle | No defined lifecycle transition. Leave as-is; does not affect flow. |
| Legacy `PreviewStep.tsx` importing from `GenerateDialog.tsx` | Both are preserved orphan files. Leave the coupling in place; removing it offers no benefit. |
| "Recently added" sort control not interactive | Acceptable for prototype; no actual sort logic to implement. |
| `CostEstimateBar` positive balance green indicator | Low priority visual gap; the amber/insufficient state is what matters for stakeholder review. |

---

## 10. Recommended Implementation Order

A safe, controlled sequence. Each group can be committed independently. Earlier groups unblock or provide context for later groups.

### Group A — Data & Logic Bugs (zero visual risk, high correctness gain)
1. Fix `SuccessStep count` prop: `selectedProducts.length` → `approvedIds.length` (**Fix 2.1**)
2. Replace `{10}` literal with `{TOKEN_COST_PER_VIDEO}` in LibraryStep (**Fix 5.6**)
3. Remove `as VideoStatus` cast in `handleProgressComplete` (**Fix 6.3**)
4. Add `selectedCount` to `FeedExport` interface and vary mock data (**Fix 6.4**)
5. Rename "Meta Export (Copy)" to a real-looking feed name (**Fix 4.8**)

### Group B — Broken Interactions (fix dead affordances and untrustworthy controls)
6. Hide Back button when `getPreviousStage(stage) === null` — covers "progress" and "success" (**Fix 2.3**)
7. Remove unclickable play icon from VideoProgressCard ready state (**Fix 2.4**)
8. Remove duplicate "Export approved" CTA from ReviewStep sticky bar (**Fix 2.5**)
9. Replace "Top up" message with honest insufficient-balance copy (**Fix 2.11**)
10. Replace hardcoded developer identity in AppShell (**Fix 2.10**)

### Group C — Demo Credibility (makes the prototype presentable)
11. Fix progress screen timing display — remove minute estimate or replace with demo-appropriate version (**Fix 2.2**)
12. Fix download button label — remove misleading file count (**Fix 2.9**)
13. Add ZIP download toast via `Sonner`, remove duplicate `Toaster` (**Fix 4.7**, **Fix 6.2**)

### Group D — Review Flow (makes the core review action functional)
14. Add video playback controls to ReviewVideoCard (`controls` attribute minimum) (**Fix 2.6**)
15. Rename "Approved" toggle label to "Undo approve" for consistency (**Fix 3.7**)

### Group E — Edit Prompt (complete the hybrid model)
16. Add dropdown preset fields (Sektör, Tema, Background) to EditPromptStep (**Fix 2.7**)
17. Pass `template` and `guidedPrompt` props to EditPromptStep (**Fix 5.3**)
18. Change `onRegenerate(productId)` → `onRegenerate(newPrompt: string)` (**Fix 5.4**)
19. Fix EditPromptStep free-text maxLength from 500 → 200 (**Fix 5.5**)

### Group F — Export Identity (connect the approved work to the export action)
20. Pass `approvedIds` and `selectedProducts` to ExportStep, render product strip (**Fix 2.8**)
21. Add "Apply All" confirmation before executing (**Fix 4.6**)

### Group G — Language & Messaging (apply the language decision uniformly)
22. Decide product language: Turkish (recommended) or English — document the decision
23. Translate all screen copy to the chosen language:
    - LibraryStep empty state (**Fix 3.2**), remove cost hint (**Fix 3.3**)
    - CostEstimateBar trust microcopy (**Fix 3.4**)
    - TemplateSelectionStep section labels, GenerateCostConfirm stat labels (**Fix 3.5**)
    - VideoProgressCard and GenerationProgressStep labels (**Fix 3.6**)
    - EditPromptStep UI chrome (**Fix 3.8**)
    - ExportStep CTAs (**Fix 3.9**)
    - SuccessStep "Go to feed" label (**Fix 3.10**)
    - StepIndicator step labels (**Fix 3.11**)

### Group H — Navigation & Context (structural UX improvements)
24. Guard Exit button with confirmation or route to handleAnother (**Fix 5.1**)
25. Set `getPreviousStage("review")` to `null` to prevent double token deduction (**Fix 5.2**)
26. Move TokenBadge into AppShell header (**Fix 4.2**)
27. Add campaign/folder name as step bar subtitle (**Fix 4.4**)
28. Fix folder grid to 2 columns (**Fix 4.1**)
29. Reduce pending card opacity from 50% to 60% (**Fix 4.5**)

---

> **Total scope:** 29 bounded fixes across 8 groups. All frontend-only. No new product features. Groups A–D are the minimum for a credible stakeholder review. Groups E–H complete the prototype's alignment with product.md and feedback-implementation.md.
