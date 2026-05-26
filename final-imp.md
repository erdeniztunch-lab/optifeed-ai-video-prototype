# Final Implementation Plan

## 1. Purpose

This document turns the latest UX, IA, messaging, and UI feedback into a controlled, phased implementation plan for the OptiVideo prototype.

The prototype is already demo-ready after MFX0 and MFX1. The goal of this plan is final polish and alignment — not feature expansion, not architectural change, and not scope creep.

Every phase in this plan:
- Makes the smallest safe change that addresses the stated problem
- Does not delete large components
- Does not rewrite screens from scratch
- Requires explicit approval before implementation begins
- Stops after completion to allow review before the next phase starts

---

## 2. Global Rules

These rules apply to every phase without exception.

- **Frontend-only.** No backend, API, database, authentication, or payment integration.
- **Mock data only.** All data remains static. No real feed, no real generation, no real account state.
- **No real AI generation.** The sample video remains the fixed static MP4.
- **No real ZIP download.** ZIP interaction remains a toast-only affordance.
- **No real persistence claims.** Copy must not imply that work survives a browser refresh if it does not.
- **No large component deletion.** Existing components stay. Restructure or adjust; do not remove.
- **No screen rewrite.** Work within existing component structures. Targeted edits only.
- **No routing or state changes** unless explicitly required by the phase scope and separately approved.
- **Preserve the happy path.** Select products → choose template → confirm → generate → review → export must work end-to-end after every phase.
- **Build and lint after every phase.** `npm run build` must pass. `npm run lint` must introduce 0 new issues beyond the established baseline of 11.
- **Stop after every phase.** Do not proceed to the next phase without explicit approval.
- **No em dash in user-facing copy.** The character "—" must not appear in any string visible to users.

---

## 3. Problem Summary

| ID | Area | Problem | Severity | Risk | Notes |
|----|------|---------|----------|------|-------|
| IA-01 | Sidebar | Sidebar IA is unclear; Video sub-items (Create new / Library) are missing; Dynamic Creative has no empty state | High | Medium | Affects product comprehension and navigation confidence |
| MSG-01 | SelectStep | Hero and onboarding copy repeat the same message; both explain what the screen does | Medium | Low | Copy-only fix; interactive onboarding block must stay |
| TMP-01 | Templates | Template messaging is not textile/fashion-specific enough; descriptions feel vague | Medium | Low | Data-only change to templates.ts; IDs must stay stable |
| REV-01 | GenerateReviewStep | "Onayı geri al" and "Önizle" buttons are too close and visually collide | High | Low | Spacing/layout fix in existing card component |
| EXP-01 | ExportStep | ZIP download section looks like a channel card; user does not immediately understand it is a download | High | Medium | Visual restructure of ExportStep; no logic change |
| TOK-01 | GenerateReviewStep | "X token harcandı" toast overlaps with "Dışa aktar" CTA | High | Low | Toast position or timing adjustment; no token logic change |
| DRAFT-01 | GenerateReviewStep | No confidence signal that generated videos will not disappear | High | Low | Copy/microcopy only; no false persistence claim |
| MODAL-01 | Approval modal/popup | Approval popup does not offer an undo approval action | Medium | Medium | Reuse existing unapprove logic; no new state model |
| EXP-02 | ExportStep | Export screen visual hierarchy should align with CTO reference screenshot | Medium | Medium | Visual polish; channel and download separation; no logic change |
| SUC-01 | SuccessStep | "Kampanyalarıma git" and "Kütüphaneye dön" appear duplicate | Medium | Low | Remove or consolidate duplicate post-success action |
| CAT-02 | Advanced filters | "Ek görsel sayısı" as 1+/2+/3+ is not user-meaningful | Medium | Low to medium | Reframe as image readiness instead of raw count |
| CAT-03 | Catalog search | ID and group search capability is not clear enough | Medium | Low | Make search intent clearer in placeholder or compact helper copy |
| CAT-04 | Catalog sorting | Sorting options feel placeholder-like and not decision-oriented | Medium | Low to medium | Rework sorting into user-intent-based options |

---

## 4. Recommended UX Direction

**AI Studio as a suite, not a feature.**
The sidebar should communicate that Optifeed has a coherent AI creative suite. AI Studio is the section container. Under it, Video and Dynamic Creative are sibling modules — not peer menu items in a flat list. This hierarchy makes the platform feel intentional and scalable.

**Video with two clear destinations.**
Within the Video module, users have two jobs: start a new creation, or return to work in progress. The sidebar should make both paths visible — "Yeni video oluştur" and "Kütüphane" — so users never wonder where their past campaigns went.

**Dynamic Creative as a visible but inactive module.**
Dynamic Creative has no content yet. Rather than hiding it, showing it with a clear "yakında" or empty state communicates the roadmap without overpromising. This supports the sales demo narrative: "here is what's coming next."

**SelectStep with no repetition.**
The hero area should state the action ("Ürün seçin"). The onboarding block should explain the value and the sequence ("Önce ürün, sonra şablon"). These are two different jobs. Assigning one job to each eliminates the redundancy without removing either element.

**Templates that communicate scenarios, not capabilities.**
Each template card should answer "what will my video look like?" in one concrete sentence. No vague taglines. No technical framing. No promises the sample video cannot support.

**Review that communicates safety and reversibility.**
Users who spend tokens on generation need two things: (1) confirmation that their work is safe for review during the current session, and (2) the ability to reverse decisions without consequence. Both should be visible without requiring explanation.

**Export with a clear hierarchy.**
Channel sending and file download are different actions and should look different. Channel cards communicate integration. The download section communicates a local file. The visual language for each should be distinct enough that the user never needs to read carefully to understand which is which.

**Token feedback that does not block primary actions.**
The "X token harcandı" notification is informational. It should appear where informational content belongs — not overlapping a CTA. The export button is an action. They must not compete for the same visual space.

---

## 5. Proposed Phases

---

### Phase F0 — Sidebar IA and copy cleanup

**Scope**

Revise the sidebar navigation structure to match the CTO's sketched IA:

```
AI Studio               ← section heading only, not a clickable item
  Video                 ← parent item, links to /videos
    Yeni video oluştur  ← sub-item, links to new campaign flow
    Kütüphane           ← sub-item, links to library view
  Dynamic Creative      ← sibling item under AI Studio, empty/coming-soon state
```

IA decisions:
- **AI Studio** remains a section heading, not a clickable parent item. It labels the suite without adding a navigation layer.
- **Video** is the module label. It may stay "Video" or be renamed "AI Video" — decide at implementation time based on what reads most clearly alongside "Dynamic Creative." Either is acceptable; consistency with the section brand matters more than the specific word.
- **Yeni video oluştur** and **Kütüphane** are nested sub-items under Video. They provide direct access to the two destinations users need.
- **Dynamic Creative** appears at the same hierarchy level as Video (sibling under AI Studio). It is not indented under Video. It links to `/templates` and displays as a distinct module.
- **Dynamic Creative empty state:** If the Dynamic Creative route has no content, the sidebar item remains visible. It either navigates to an empty-state page or shows a "yakında" badge inline on the sidebar item. Do not hide it.

Deduplicate the SelectStep hero and onboarding copy:
- **Hero area** (top of SelectStep, above the product grid): should state the immediate action only. Proposed: "Ürün seçin" as the heading, with "Maliyet ve süre tahmini seçiminize göre güncellenir." as a single supporting line. Remove the redundant explanation sentence.
- **Onboarding block** (interactive dismissable element): should explain the value proposition and sequence — "Önce ürün seçin, sonra şablona karar verin." Keep "Nasıl çalışır?" and "Anladım, başlayalım" interactions. The onboarding block's job is to orient a first-time user; the hero's job is to label the screen and set the immediate task.

**Risk:** Low to medium. Sidebar nav is data-driven in `AppShell.tsx` — the navItems array controls structure. Adding sub-items requires verifying how indent depth is currently handled. Copy changes are string-only.

**Likely files:**
- `src/components/AppShell.tsx` — navItems array, sidebar rendering
- `src/components/videos/SelectStep.tsx` — hero heading and subtext
- `src/components/videos/OnboardingBanner.tsx` — if the onboarding block is a separate component

**Acceptance criteria:**
- [ ] Sidebar shows AI Studio as a section heading
- [ ] Video (or AI Video) appears under AI Studio with two visible sub-items: Yeni video oluştur and Kütüphane
- [ ] Dynamic Creative appears as a sibling item under AI Studio (not nested under Video)
- [ ] Dynamic Creative links correctly and displays an appropriate empty/coming-soon state if its page has no content
- [ ] Hero area in SelectStep no longer explains the sequence; it only labels the screen and action
- [ ] Onboarding block still explains the value and the sequence; it still has dismiss/learn interactions
- [ ] No routing regression — all existing navigation paths work
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F1 — Textile template messaging alignment

**Scope**

Review all four template entries in `src/data/templates.ts`. Improve copy so each template communicates a concrete, realistic textile/fashion scenario — not a vague tagline or a generic product description.

The description field for each template should answer: "What will the viewer see in this video?" in one direct sentence. Scenario language should be concrete but must not promise exact choreography, duration, named locations, or multi-angle output that the static sample video cannot demonstrate.

Current template landscape (IDs must remain stable):
- `vitrine-bakan-kadin` — Textile. May receive a description polish.
- `paris-yuruyen-kadin` — Textile. May receive a description polish. Do not add further Paris-specific detail beyond the existing label.
- `bahce-bulusmasi` — Updated to "Günlük moda sahnesi" in MFX1. Evaluate whether the description is sufficiently use-case-driven or needs another pass.
- `product-spotlight` — Updated to "Ürün odak sahnesi" in MFX1. Evaluate whether the description communicates the textile product-display use case clearly enough.

**Risk:** Low. Data-only change. No component changes. The MFX0 ConfirmStep description echo will automatically reflect any updated description.

**Likely files:**
- `src/data/templates.ts`

**Acceptance criteria:**
- [ ] All 4 templates feel textile/fashion-compatible at a glance
- [ ] Each description answers "what will the viewer see?" in one concise sentence
- [ ] No description promises duration, named streets/cities, specific model motion, or multi-angle coverage
- [ ] No hover preview added
- [ ] Template count remains exactly 4
- [ ] Template IDs unchanged
- [ ] ConfirmStep description echo still renders new descriptions without layout issue
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F2 — Review screen action spacing and draft confidence

**Scope**

Two independent fixes on the generate-review screen:

**Fix 1 — Action spacing:** "Onayı geri al" and "Önizle" are visually colliding. Increase spacing between them so both are clearly readable and tappable without confusion. This is a layout adjustment inside the approved video card action row. Do not change the actions themselves or their behavior.

**Fix 2 — Draft confidence:** Add a short session-safe message on the generate-review screen that communicates "your videos are here for review while you work through them." This message must not imply backend persistence or promise that work survives a browser refresh. The wording should reference the current session only.

Proposed copy direction: "Üretilen videolar bu oturumda incelemeniz için burada kalır. Onay vermeden hiçbir video kanala gönderilmez."

Placement: Below the header paragraph or below the progress bar — whichever location is less visually disruptive. Low visual weight: `text-xs text-muted-foreground`.

**Risk:** Medium. GenerateReviewStep.tsx is a complex component. The action spacing fix requires identifying where the approved video card actions are rendered — likely a sub-component or an inline section within the card. Care must be taken not to disturb the generating/pending/rejected card layouts.

**Likely files:**
- `src/components/videos/GenerateReviewStep.tsx`
- Approved video card sub-component if actions are extracted (verify at implementation time)

**Acceptance criteria:**
- [ ] "Onayı geri al" and "Önizle" no longer collide visually; both are clearly readable
- [ ] Draft confidence message appears on the generate-review screen
- [ ] Message copy does not claim backend persistence or refresh-safe state
- [ ] Main approve/reject/preview/edit flow unchanged
- [ ] Generating, pending-review, rejected card layouts unaffected
- [ ] Progress bar and token-spent note unaffected
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F3 — Approval popup undo action

**Scope**

The generate-review step shows a popup or toast when a video is approved. Add an "Onayı geri al" action to that popup so the user can immediately reverse the approval without dismissing the popup and finding the card-level undo.

Before implementing, verify:
- Whether the approval confirmation is a modal, a toast, or an inline notification
- Whether the existing "unapprove" logic (card-level undo) is already a callable function or requires extraction
- Whether adding the action to the popup requires a new state variable or can reuse the existing approval state map

The card-level undo approval must continue to work independently.

**Risk:** Medium. Requires understanding the exact approval confirmation UI pattern before editing. If it is a Sonner toast, adding an action button to it is straightforward (`toast(message, { action: ... })`). If it is a custom modal, the edit is slightly larger.

**Likely files:**
- `src/components/videos/GenerateReviewStep.tsx`
- Approval modal/popup component if extracted separately (verify at implementation time)

**Acceptance criteria:**
- [ ] Approval popup/toast shows an "Onayı geri al" action
- [ ] Clicking it returns the video from approved to pending-review (or equivalent existing pre-approval state)
- [ ] Card-level "Onayı geri al" still works independently
- [ ] No duplicate state or conflicting approval transitions
- [ ] Approval count in the sticky footer updates correctly after undo from popup
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F4 — Export screen visual and ZIP affordance polish

**Scope**

Restyle the export screen so that channel sending and ZIP download are immediately distinguishable without requiring the user to read carefully.

Current problem: The ZIP card uses similar visual weight and card styling to the channel toggle cards. A user scanning the screen cannot instantly tell that one group is "send to platform" and the other is "download to device."

Direction:
- Channel toggle cards remain the primary visual zone — they represent the main export action
- ZIP download section is repositioned or restyled as a clearly secondary affordance — visually lighter, uses a different pattern (link-style, small button, or a muted section with a download icon)
- A section label or divider between the channel area and the download area ("veya indirin" / "sadece indirmek için") can help orient the user without adding cognitive load
- The CTO reference screenshot should inform the visual hierarchy and grouping — adapt it to the current component structure without copying it blindly

The demo-mode ZIP behavior (toast only, no file download) is unchanged.

**Risk:** Medium. ExportStep.tsx will require JSX restructuring. ChannelToggleCard.tsx may or may not need changes depending on the final layout decision. No logic changes — only visual restructuring.

**Likely files:**
- `src/components/videos/ExportStep.tsx`
- `src/components/videos/ChannelToggleCard.tsx` (if visual changes are needed there)

**Acceptance criteria:**
- [ ] ZIP/download section is visually distinct from channel toggle cards at a glance
- [ ] Channel cards remain primary — they are the first visible export option
- [ ] ZIP section reads as a secondary "download" path, not a third channel
- [ ] Clicking ZIP still shows the demo-mode toast only; no file is created or downloaded
- [ ] "Atla (taslak olarak kaydet)" link is still visible and functional
- [ ] Export screen hierarchy is clearer and closer to CTO reference intent
- [ ] Approved video count in the header remains visible and correct
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F5 — Token notification collision fix

**Scope**

The "X token harcandı" toast notification appears after generation starts and overlaps with the "Dışa aktar" CTA in the sticky footer of the generate-review step.

Identify where the toast is fired (likely in `Videos.tsx` in the `handleConfirm` callback, per UXR4 implementation) and adjust one of the following:
- Toast position: Move the Sonner toast anchor so it does not overlap the sticky bottom bar (e.g., use `position: "top-center"` or `position: "bottom-left"` instead of the default bottom-right if bottom-right overlaps the footer)
- Toast timing: Delay the toast by a short interval so it fires after the screen transition is complete and the sticky bar has rendered in its final position
- Toast container: If the sticky footer has a high z-index that causes the overlap, ensure the toast layer has a higher z-index than the footer

Do not change the token amount calculation. Do not change when the toast is triggered relative to generation start. Do not remove the toast.

**Risk:** Low to medium. Toast configuration is typically one line. Identifying the exact collision cause (z-index vs position vs timing) requires a brief investigation at implementation time.

**Likely files:**
- `src/pages/Videos.tsx` — handleConfirm callback where the toast is fired
- `src/components/videos/GenerateReviewStep.tsx` — if the sticky footer z-index is defined here
- Sonner toast global configuration if centralized (verify at implementation time)

**Acceptance criteria:**
- [ ] "X token harcandı" toast is visible without overlapping the "Dışa aktar" button
- [ ] Token amount in the toast remains correct
- [ ] No duplicate toast fires
- [ ] "Dışa aktar" CTA remains visible and clickable while the toast is on screen
- [ ] No token logic changed
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase F6 — Catalog and Success CTA polish

**Scope**

Four targeted fixes across SuccessStep and the catalog/filter area of SelectStep.

**Fix 1 — Success screen CTA consolidation (SUC-01)**

SuccessStep currently shows three CTAs: "Yeni video oluştur", "Kampanyalarıma git", "Kütüphaneye dön". The latter two navigate to the same or equivalent destination, which creates duplicate action paths. Consolidate to:
- One primary CTA: "Yeni video oluştur"
- One secondary CTA: a single return path — whichever of "Kampanyalarıma git" / "Kütüphaneye dön" accurately names its destination; remove the other

At implementation time, read `SuccessStep.tsx` and check what `onAnother` and `onViewProducts` do — keep the prop whose destination is most useful to the user post-success. No new routes or flows.

**Fix 2 — Image readiness filter reframe (CAT-02)**

Replace the "Ek görsel sayısı" filter (chip buttons 0 / 1+ / 2+ / 3+) with a label and options that communicate readiness rather than a raw count:

- Label: "Görsel hazırlık"
- Options: Tümü / Ek görsel var / Ek görsel yok

Logic mapping:
- "Ek görsel var" maps to `additionalImageCount > 0`
- "Ek görsel yok" maps to `additionalImageCount === 0`

Do not claim the AI uses multiple images. No multi-image AI copy anywhere. The filter is a selection aid only.

The `AdvFilters` interface currently types `imageMin` as `0 | 1 | 2 | 3`. Change this to a string enum (e.g., `"" | "has-extra" | "no-extra"`) and update all references in SelectStep.tsx and AdvancedFilterPanel.tsx accordingly.

**Fix 3 — Search placeholder clarity (CAT-03)**

Change the search input placeholder from "İsim, ID veya grup ile ara..." to "Ürün adı, ID veya grup ara". One-line change. No search logic change.

**Fix 4 — Sorting options improvement (CAT-04)**

Replace current sort options (Son eklenen / Ürün adı / Marka / Durum) with user-intent-based options:
- Son eklenen
- Video için uygun
- Videosu olmayanlar
- Ürün adı

Remove "Marka" and "Durum". Logic:
- "Video için uygun" — sort products with `additionalImageCount > 0` first
- "Videosu olmayanlar" — sort products without video history first
- "Ürün adı" — existing alphabetical sort, keep as-is

Update the `sortBy` union type in `AdvFilters` to include the new values and remove the old ones.

**Risk:** Low to medium. SuccessStep.tsx is a small component. AdvancedFilterPanel.tsx requires label, options, and type changes. SelectStep.tsx must update filter logic and sort logic to match the new `AdvFilters` values. No routing changes.

**Likely files:**
- `src/components/videos/SuccessStep.tsx`
- `src/components/videos/AdvancedFilterPanel.tsx`
- `src/components/videos/SelectStep.tsx`

**Acceptance criteria:**
- [ ] Success screen shows exactly 2 CTAs: one primary (Yeni video oluştur), one secondary (single non-duplicate return path)
- [ ] No routing regression — all navigation paths from success still work
- [ ] Image filter label reads more meaningfully than "Ek görsel sayısı"
- [ ] Image filter options are clearer than 1+/2+/3+ chip buttons
- [ ] No multi-image AI claim introduced in any copy
- [ ] Search placeholder clearly communicates ID and group support
- [ ] Sorting options feel useful for product selection decisions
- [ ] "Marka" and "Durum" sort options removed
- [ ] Product selection still works
- [ ] Filter result count updates correctly
- [ ] Empty state triggers when all filters combined return 0 results
- [ ] Clearing filters resets all controls
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

## 6. Phase Priority

**Recommended implementation order:**

1. F0 — Sidebar IA and copy cleanup
2. F6 — Catalog and Success CTA polish
3. F1 — Textile template messaging alignment
4. F2 — Review screen action spacing and draft confidence
5. F3 — Approval popup undo action
6. F4 — Export screen visual and ZIP affordance polish
7. F5 — Token notification collision fix

**If time is limited before demo, prioritize:**
F0 and F6 first. F0 fixes navigation comprehension. F6 fixes catalog/filter clarity and the duplicate success CTA. Then F2, F4, and F5 if time allows.

**F1 may be skipped** if the MFX1 template updates are already sufficient for the demo audience. Review the template screen before deciding.

**F3 may be deferred** if the approval popup is not central to the demo script and the card-level undo approval is sufficient.

---

## 7. What Not To Do

- Do not rewrite the app or any full screen from scratch
- Do not delete large components (AppShell, SelectStep, GenerateReviewStep, ExportStep, etc.)
- Do not build real backend persistence
- Do not fake a real ZIP download with a blob or mock file
- Do not promise real AI generation behavior in copy
- Do not over-explain templates with long paragraph copy
- Do not add hover video preview to template cards
- Do not add duration copy ("8-10 saniye" or any range) to any screen
- Do not add multi-image AI claims
- Do not create a new navigation system from scratch
- Do not change routing structure unless F0 explicitly requires it and it is approved

---

## 8. Implementation Approval Rule

Each phase must follow this protocol without exception:

1. Receive explicit approval for that specific phase before any code changes
2. Implement only the stated scope for that phase — no adjacent improvements
3. Run `npm run build` — must pass with 0 errors
4. Run `npm run lint` — report total issue count and confirm 0 new issues beyond the pre-existing baseline of 11
5. Report the exact files changed and what changed in each
6. Confirm each acceptance criterion individually
7. Separate pre-existing lint issues from any new issues in the report
8. Stop and await approval before beginning the next phase

---

## 9. Next Step

Do not implement anything from this plan until a specific phase is approved.

---

## 10. Final Feedback Addendum

This section adds the last feedback items before implementation begins. All four issues are assigned to Phase F6.

---

### 10.1 Success screen CTA duplication (SUC-01)

**Current state:**
The success screen shows three CTAs:
- Yeni video oluştur
- Kampanyalarıma git
- Kütüphaneye dön

**Problem:**
"Kampanyalarıma git" and "Kütüphaneye dön" appear to serve the same destination. This creates duplicate action paths on a screen that should feel like a clean endpoint.

**Principle:** No duplicate action, no duplicate information.

**Direction:**
Keep the success screen simple:
- One primary CTA for creating another video
- One secondary CTA for returning to campaign/library context
- Remove whichever of the two return-path CTAs is redundant

At implementation time: read `SuccessStep.tsx`, check what `onAnother` and `onViewProducts` actually navigate to, and keep the one whose destination is most meaningful post-success. No new routes or flows added.

**Acceptance criteria for Phase F6:**
- Success screen no longer shows two CTAs with equivalent destinations
- Primary CTA remains visually dominant
- Secondary CTA destination is clearly named
- No routing regression

---

### 10.2 Advanced filter: "Ek görsel sayısı" reframe (CAT-02)

**Current state:**
The filter "Ek görsel sayısı" uses chip buttons: Tümü / 1+ / 2+ / 3+

**Problem:**
Raw counts feel arbitrary and are not useful for the product selection workflow. A user choosing products for video generation is not thinking in terms of "I want products with exactly 2+ additional images." They are thinking about image readiness.

**Important constraint:**
Do not claim that the AI actually uses multiple images. Do not add copy like "AI tüm görselleri kullanır." This filter is a selection aid, not a capability claim.

**Direction:**
Reframe from a raw count filter to an image readiness filter:

- Label: "Görsel hazırlık"
- Options: Tümü / Ek görsel var / Ek görsel yok

The underlying logic is simple: "Ek görsel var" filters to `additionalImageCount > 0`; "Ek görsel yok" filters to `additionalImageCount === 0`. The `AdvFilters` interface type for this field must be updated from `0 | 1 | 2 | 3` to a string enum.

**Acceptance criteria for Phase F6:**
- Filter label is more user-meaningful than "Ek görsel sayısı"
- Options are clearer than 1+/2+/3+ chip buttons
- Filtering behavior remains frontend-only
- No multi-image AI claim introduced anywhere
- Empty states and result count still work

---

### 10.3 Search by ID and group should be clearer (CAT-03)

**Current state:**
Placeholder: "İsim, ID veya grup ile ara..."

**Problem:**
The phrasing is slightly indirect ("ile ara" instead of the simpler "ara"). The capability is there but not stated as clearly as it could be.

**Direction:**
Change placeholder to: "Ürün adı, ID veya grup ara"

This is a one-line placeholder change. No helper text block needed. No search logic change.

**Acceptance criteria for Phase F6:**
- User can immediately understand that search supports product name, ID, and group
- Placeholder is concise
- Search behavior unchanged
- No visual clutter added

---

### 10.4 Sorting feels placeholder-like (CAT-04)

**Current state:**
Sort options: Son eklenen / Ürün adı / Marka / Durum

**Problem:**
These options mirror what a database table export would offer. They do not help the user decide what to select for video generation.

**Think like the user:**
A user selecting products for video generation likely cares about:
- Which products are newest (default)
- Which products are visually ready (have extra images)
- Which products have never had a video generated
- Alphabetical lookup (already available)

They do not need to sort by "Marka" or "Durum" as top-level sort controls — these belong in the filter panel (and already exist there as filter options).

**Direction:**
Replace current sort options with:
- Son eklenen
- Video için uygun
- Videosu olmayanlar
- Ürün adı

Remove "Marka" and "Durum". Update the `sortBy` union type in `AdvFilters` to match.

**Acceptance criteria for Phase F6:**
- Sorting options feel useful for product selection
- "Marka" and "Durum" removed
- Options are simple and not too many (4 maximum)
- Existing sort behavior preserved where options overlap
- No backend or new data required

---

### 10.5 Phase mapping

All four issues above are assigned to **Phase F6 — Catalog and Success CTA polish**:

| Issue | Phase |
|-------|-------|
| SUC-01 | F6 |
| CAT-02 | F6 |
| CAT-03 | F6 |
| CAT-04 | F6 |

Phase F6 is defined in Section 5 of this document.

---

### 10.6 Final recommendation

Before implementation begins, prioritize:
1. **F0** — Sidebar IA and copy deduplication (navigation comprehension)
2. **F6** — Catalog filtering, sorting, search clarity, and success CTA cleanup
3. **F2 / F4 / F5** — Review spacing, export visual, token collision — if still visually problematic after F0 and F6

Do not start implementation until a specific phase is approved.

This addendum closes the feedback intake phase. No further issues will be added to this document before implementation begins.
