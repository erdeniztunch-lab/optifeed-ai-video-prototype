# Design Gap Closure Plan

## 1. Purpose

This document turns the final design.md gap analysis into a phased implementation plan. It defines which remaining gaps should be closed, in what order, and which should be accepted as prototype limitations.

The prototype is already demo-ready as of the Final Stabilization Fix. The goal of this plan is not feature expansion. The goal is controlled design alignment and demo polish — closing only the gaps that materially improve demo clarity or eliminate obvious inconsistencies.

## 2. Current Verdict

- **Overall verdict:** Mostly aligned, minor accepted gaps.
- No critical design gaps block the demo.
- Remaining gaps are mostly copy cleanup, visual polish, secondary interactions, or intentional prototype constraints.
- The core flow (catalog → campaign setup → template → confirm → generate-review → export → success) is fully implemented and demo-ready.

## 3. Guiding Principles

1. **Preserve demo-ready state.** Every change must leave the prototype in a working, demo-able state.
2. **Implement small phases only.** Each phase is scoped to specific, low-risk changes.
3. **Run build/lint after every phase.** `npm run build` must pass. `npm run lint` must introduce 0 new issues beyond the 11 pre-existing baseline.
4. **Stop after each phase and request approval.** No phase starts without explicit user approval.
5. **No backend, real AI generation, real channel sending, real ZIP, token purchase, account connection, or mobile support.** These are permanently out of scope.
6. **Do not rewrite working flows.** If something works and communicates the intent, leave it alone.
7. **Do not implement high-risk polish.** Complex interactions (frame-step, version history, sortable table) have low demo value relative to their implementation risk.
8. **Prefer copy and visual alignment over new interaction complexity.** A label fix beats a new feature.

## 4. Gap Classification

| Gap ID | Gap | Design.md expectation | Current behavior | Risk | Demo impact | Decision |
|--------|-----|----------------------|-----------------|------|-------------|----------|
| G1 | Sidebar "Campaigns" label | "Kampanyalarım" (Turkish) | "Campaigns" (English) — only English item in Turkish UI | Very low | High — breaks language consistency | **Fix in D0** |
| G2 | "Ürünlere git" routes to Library | "Kampanyayı görüntüle" → Library | Both "Ürünlere git" and "Kütüphaneye dön" call same handler; "Ürünlere git" implies product catalog | Very low | Medium — misleading label | **Fix in D0** |
| G3 | Completed step indicator steps not clickable | Tamamlanan adımlara tıklanabilir (§2.2) | Visual-only, no click handler | Medium | Low — navigation UX, not on demo path | **Accepted limitation / Defer** |
| G4 | Success screen has no 3 summary cards | [N Gönderilen] [Meta Kanal] [24 tok Harcanan] cards (§12.2) | Count and channel shown as inline text | Low | Medium — success screen feels light without them | **Consider in D1** |
| G5 | Success step bar hidden (design.md says show it) | "Step indicator hâlâ görünür (tüm yeşil)" (§12.5) | Step bar hidden on success (Stabilization Fix 2) | N/A | Low — hiding is cleaner UX | **Accepted deviation** |
| G6 | History warning: native tooltip, no styled tooltip | Styled tooltip with campaign name, date, "Kampanyayı gör" link (§4.5) | `title` attribute only | Low-Medium | Low — badge still communicates intent | **Defer or optional D2** |
| G7 | Product view: grid/list toggle, not fixed table | Fixed table with sortable columns (§4.3) | Grid and list view toggle | High | Low — communicates same data | **Accepted limitation / Defer** |
| G8 | Generate-review lacks "Tümünü yeniden üret" + "İndir dropdown" | Three bulk actions (§9.5) | Only "Tümünü onayla" implemented | Medium | Low — not on demo happy path | **Defer** |
| G9 | Video player lacks frame-step, speed, prev/next | Frame step ◁/▷, speed 0.5-2×, prev/next navigation (§9.7) | Play/pause, mute, full-screen, download, approve/reject | High | Low — modal already demonstrates preview concept | **Defer** |
| G10 | Edit prompt: no confirmation before regenerating | ConfirmDialog showing token cost before regenerate (§10.3) | Regenerates directly after 2s spinner | Low | Low — cost is visible in the card below | **Defer** |
| G11 | Edit prompt: no "Önceki versiyon" dropdown | Collapsible version history dropdown (§10.6) | No version history UI | Medium | Low — not on demo happy path | **Defer** |
| G12 | Filter result count not displayed | "24 ürün gösteriliyor" count visible (§2.11) | No result count shown separately | Low | Medium — improves catalog clarity | **Consider in D2** |
| G13 | Library: no dashed "+" card at end of grid | Dashed "+" card → ürün kataloğuna döner (§6.2) | "+ Yeni kampanya" header CTA only | Low | Low — header CTA covers same intent | **Accepted limitation** |
| G14 | Unused legacy components remain | Clean codebase | GenerationProgressStep, ReviewStep, ReviewVideoCard, VideoProgressCard, GuidedPromptFields, TemplateActionBar, ExportFeedCard, EntryStep, PreviewStep, GenerateDialog, SendStep, GenerateCostConfirm still in filesystem | None | None — not user-visible | **Accepted post-demo cleanup** |
| G15 | SAMPLE_VIDEO unused import in Videos.tsx | Clean imports | Imported on line 15, no longer used after handleProgressComplete removal | Very low | None | **Fix in D0** |

## 5. Proposed Phases

### Phase D0 — Zero-risk cleanup

**Goal:** Close obvious copy/code hygiene gaps with no logic changes and no risk.

**Included gaps:**
- G1: `src/components/AppShell.tsx` line 28 — `"Campaigns"` → `"Kampanyalarım"`
- G2: `src/components/videos/SuccessStep.tsx` — `"Ürünlere git"` → `"Kampanyalarıma git"` (or remove the redundant button)
- G15: `src/pages/Videos.tsx` line 15 — remove `SAMPLE_VIDEO` from import

**Risk:** Very low — label changes and one import removal. No logic, no state, no routing changes.

**Acceptance criteria:**
- [ ] Sidebar language is consistent (all Turkish)
- [ ] Success CTA label matches destination
- [ ] Unused import removed from Videos.tsx
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues (baseline remains 11)

**Stop after this phase and ask for approval before D1.**

---

### Phase D1 — Success screen visual alignment

**Goal:** Make the success screen closer to design.md §12.2 without changing flow logic or CTAs.

**Included gap:**
- G4: Add 3 lightweight summary cards to SuccessStep

**Suggested cards:**
- Video count: approved/sent video count (already available as `count` prop)
- Channel summary: selected export channels (already available as `exportedFeeds` prop)
- Token estimate: spent tokens (derive from `count × TOKEN_COST_PER_VIDEO`)

**Rules:**
- No routing changes
- No state changes unless existing props already expose the data
- Do not re-add the step bar on success
- Keep success screen simple — cards should be lightweight visual elements, not interactive

**Risk:** Low — additive visual change, no logic touched

**Acceptance criteria:**
- [ ] Success screen shows 3 summary cards (count, channel, token estimate)
- [ ] Existing "Yeni video oluştur" and "Kampanyalarıma git" CTAs still work
- [ ] First campaign message still renders when applicable
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase and ask for approval before D2.**

---

### Phase D2 — Catalog clarity polish

**Goal:** Improve product catalog clarity without rewriting the product grid/list.

**Included gap:**
- G12: Display filter result count ("N ürün gösteriliyor") in SelectStep

**Optional (only if low risk):**
- G6: Improve history warning tooltip to a lightweight Tooltip component (without navigation complexity — no "Kampanyayı gör" link)

**Rules:**
- Do not rewrite product grid/list into fixed table
- Do not add sortable column headers
- Do not add "Kampanyayı gör" link unless a safe, non-breaking route exists
- Do not change selection behavior or CostEstimateBar logic

**Risk:** Low to medium — additive text display, no logic changes; optional G6 slightly higher if Tooltip component is new

**Acceptance criteria:**
- [ ] Catalog shows result count respecting search + basic filters + advanced filters
- [ ] Count updates reactively as filters change
- [ ] Empty states still work correctly
- [ ] Product selection still works
- [ ] `npm run build` passes
- [ ] `npm run lint` introduces 0 new issues

**Stop after this phase.**

---

### Phase D3 — Generate-review secondary actions (deferred)

**Included gap:** G8 — "Tümünü yeniden üret" + "İndir dropdown"

**Decision:** Defer.

**Reason:** Adds token logic and mock download interactions to an already demo-ready screen. The "Tümünü onayla" bulk action already demonstrates the pattern. Low demo value, moderate complexity.

---

### Phase D4 — Video player quality controls (deferred)

**Included gap:** G9 — frame-step, speed selector, prev/next video navigation

**Decision:** Defer.

**Reason:** Requires deeper `<video>` element integration (requestVideoFrameCallback for frame-step, playbackRate for speed). Not needed for the current demo; the modal already demonstrates the preview concept.

---

### Phase D5 — Edit prompt versioning/confirmation (deferred)

**Included gaps:**
- G10: Confirmation dialog before regenerating
- G11: "Önceki versiyon" dropdown for version history

**Decision:** Defer.

**Reason:** Version history requires additional state management (previousVersions[] array, version tracking). The confirmation dialog might slow demo interactions. Both are secondary edit-prompt features not on the happy demo path.

---

### Phase D6 — Accepted limitations (not to be implemented)

The following gaps are intentionally accepted as prototype constraints and should NOT be implemented:

- **G3:** Clickable completed step indicator — medium complexity, low demo impact
- **G5:** Success step bar visible all-green — our Fix 2 is better UX than the spec
- **G7:** Full fixed product table with sortable headers — high rewrite risk, low demo impact
- **G13:** Dashed "+" card in library grid — header CTA covers same intent
- **G14:** Unused legacy component files — git history value, post-demo cleanup only
- **Keyboard shortcuts** — explicitly skipped per session scope
- **Real AI video generation** — permanently out of scope
- **Real API/backend** — permanently out of scope
- **Real channel sending (Meta/Google/TikTok)** — permanently out of scope
- **Real ZIP download** — permanently out of scope
- **Real token purchase** — permanently out of scope
- **Real channel account connection** — permanently out of scope
- **Mobile responsive support** — permanently out of scope (1280px min, blocker in place)

## 6. Recommended Implementation Order

1. **Phase D0** — implement first (trivial, no risk)
2. **Phase D1** — implement after D0 approval (low risk, visible improvement)
3. **Phase D2** — implement after D1 approval, only if still useful
4. **Stop**

Do not proceed to D3–D5 before the demo unless explicitly approved with specific scope.

## 7. Phase Approval Rule

Every phase must follow this routine:

1. Implement only the approved phase — no scope expansion
2. Run `npm run build` — must pass with 0 errors
3. Run `npm run lint` — must introduce 0 new issues beyond the 11 pre-existing baseline
4. Report all files changed
5. Confirm each acceptance criterion
6. Explicitly separate pre-existing lint issues from any new issues
7. Stop and ask for approval before the next phase

## 8. Final Recommendation

**Recommended path before demo:**
- Implement **D0** (copy + import hygiene — very low risk, high clarity value)
- Consider **D1** (success screen cards — low risk, visible improvement)
- **D2 optional** (catalog result count — additive, low risk)
- **Defer D3–D6** (moderate-to-high complexity, low demo value relative to risk)

---

*Do not implement anything from this plan until a specific phase is approved.*
