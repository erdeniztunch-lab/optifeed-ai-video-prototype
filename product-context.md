# Product Context Document — Optifeed AI Video Prototype

Generated from prototype inspection. No speculation — only what the prototype shows.

---

## 1. Product Purpose

Optifeed AI Video lets e-commerce merchants generate short video ads from their product catalog by selecting products, choosing a video scenario template, and exporting the results to ad channels — with per-video review and approval before anything is sent.

**Key User Action:** Select products → approve generated videos → send to channels.

---

## 2. Screens & Content

### 2.1 Sidebar (persistent)

Present on every screen. Fixed left at 256px width. Requires minimum 1280px viewport; below that a full-screen blocker appears ("Bu özellik şu an sadece desktop'ta kullanılabilir").

**Navigation items:**
- Dashboard, Feed Sources, Exports (top group)
- Section header: "AI Studio"
- "AI Video" — non-clickable group label with "New" badge
  - "Yeni video oluştur" → `/videos`
  - "Kütüphane" → `/videos?view=library`
- "Dynamic Creative" → `/templates` with "Yakında" badge
- GA4 Analytics, Meta Ads (bottom group)

**Bottom of sidebar:**
- Token balance badge — shows current balance and weekly spend
- User row: avatar, "Optifeed Kullanıcısı", "demo@optifeed.com", settings icon

---

### 2.2 Library

**Route:** `/videos?view=library`
**Entry point:** App default; "Kütüphane" nav link; "Kampanyalarıma git" from Success screen.

**Displayed:**
- Header: "Video Kütüphanesi" + "Yeni video oluştur" button
- Tab bar: Tümü / Aktif / Taslak / Üretim sürüyor / Arşiv
- Sort dropdown: Son güncelleme / Oluşturma tarihi / İsim
- Search input
- Grid of folder cards (one card per campaign)

**Folder card shows:**
- Campaign name
- Status badge (aktif / taslak / üretim sürüyor / arşiv)
- Product count and video count
- "Devam et" button if production is in progress
- Three-dot menu: Yeniden adlandır, Arşivle, Sil
- Pending video count badge if applicable

**Interactions:**
- Tab filters by status
- Sort re-orders the list
- Search filters by campaign name
- "Yeni video oluştur" starts new campaign flow (→ SelectStep)
- Clicking a folder card opens the campaign
- "Devam et" resumes an in-progress generation
- Three-dot menu actions trigger inline rename (editable text) or confirmation dialogs

**Empty state:**
- "Henüz video kampanyanız yok" with "İlk kampanyanı oluştur" button

---

### 2.3 Select Products

**Route:** `/videos` (default when not in library view)

**Displayed:**
- Dismissible onboarding banner: "Ürünlerinden saniyeler içinde video reklam üret." with "Nasıl çalışır?" and "Anladım, başlayalım" actions
- Header: "Ürün seçin" + "Kütüphane" shortcut button
- Supporting text: "Maliyet ve süre tahmini seçiminize göre güncellenir."
- Toolbar row:
  - Selected count badge (accent background, primary background at limit)
  - "Tümünü seç" / "Seçimi temizle" toggle button
  - "Gelişmiş filtre" toggle button with active-count badge
  - Grid / Liste view toggle
  - Search input ("Ürün adı, ID veya grup ara")
- Advanced filter panel (collapsible):
  - Kategori — native select
  - Marka — native select
  - Görsel hazırlık — chip group: Tümü / Ek görsel var / Ek görsel yok
  - Video durumu — chip group: Tümü / Videosu yok / Hazır
  - Video geçmişi — toggle button: "Daha önce video üretildi"
  - Sıralama — chip group: Son eklenen / Video için uygun / Videosu olmayanlar / Ürün adı
  - "Gelişmiş filtreleri sıfırla" link (appears when any filter is active)
- Product count label: "X ürün gösteriliyor"
- Product grid (1 col mobile / 2 sm / 3 lg / 4 xl) or list view
- Limit warning banner when 10 products selected
- Sticky bottom bar (CostEstimateBar): estimated token cost, estimated duration, "Devam →" button

**Product card (grid view) shows:**
- Product image
- Product name
- Brand + category
- Status badge (no-video / ready)
- Additional image count indicator
- Selection overlay with checkmark

**Product card (list view) shows:**
- Two-column layout: product info + detail metadata
- Same selection behavior

**Interactions:**
- Clicking a card toggles selection (max 10)
- "Tümünü seç" selects up to the remaining limit from visible products
- "Seçimi temizle" deselects all visible products from current selection
- Filters and search update the visible product list in real time
- Sorting re-orders the list
- Devam → disabled when 0 products selected; triggers Campaign Setup Modal when clicked

**Empty state (filtered):** "Sonuç bulunamadı" with "Filtreyi sıfırla" action
**Empty state (catalog empty):** "Ürün kataloğu boş" with no action
**Loading state:** 8 skeleton cards shown for 300ms on mount

---

### 2.4 Campaign Setup Modal

**Trigger:** Clicking "Devam →" in SelectStep
**Type:** Modal dialog (max-w-md)

**Displayed:**
- Title: "Kampanyanı tanımla"
- Subtitle: "Şablon seçimine geçmeden önce kampanya bilgilerini girin."
- Kampanya adı (required, min 3 chars, max 60)
- Sektör (required) — chip group with all sectors
  - "Moda & Giyim" chip has a small "Prototip" badge with info icon (tooltip: "Bu prototipte tekstil sektörüne özel şablon mevcuttur")
- Kampanya teması (optional) — native select; selecting "Diğer" reveals a free-text input
- Ürün tipi (optional) — native select
- Buttons: "İptal" / "Şablona geç →"

**Sector options:** Moda & Giyim, Elektronik, Ev & Yaşam, Güzellik & Kişisel Bakım, Spor & Outdoor, Gıda & İçecek, Takı & Aksesuar, Diğer

**Interactions:**
- "Şablona geç →" disabled until name (≥3 chars) and sector are filled
- Enter key on name field triggers confirm if valid
- İptal resets all fields and closes modal

---

### 2.5 Template Selection — Generic

**Shown for:** All sectors except "Moda & Giyim"

**Displayed:**
- Header: "Şablon seçin"
- Supporting text: "Ürünlerinize en uygun video senaryosunu seçin."
- Campaign context summary line (sector · theme · product type)
- 2×2 grid of template cards
- "Ek detay" textarea (optional, max 300 chars, live character count)
- Info note: "Videolar 8-10 saniye, 1:1 formatta üretilir. Fiyat/marka bilgisi sonradan Dynamic Creative ile eklenebilir."
- Sticky bottom bar: product count + selected template name, Geri + Devam

**Template card shows:**
- 16:9 preview image (slight scale on hover)
- Selection indicator (top-right)
- Template name
- Info popover button (does not select the card)
- Description text
- "Önerilen" badge when sector matches
- helperText chip

**Info popover content:**
- "Ne zaman kullanılır" paragraph
- "Güçlü yanları" list
- "Dikkat" warning note

**Interactions:**
- Clicking a card selects it (single selection)
- Devam disabled until template is selected
- Geri returns to Campaign Setup Modal flow

---

### 2.6 Template Selection — Textile

**Shown for:** "Moda & Giyim" sector only

**Displayed:**
- Header: "Sahneyi seçin"
- Supporting text: "Her sahne 8-10 saniye olup kıyafeti farklı açılardan gösterir."
- Campaign context summary line
- Textile info banner: "Bu şablonlar Moda & Giyim sektörüne özel hazırlanmıştır. En iyi sonuç için ürününüzün ön, arka ve yan fotoğraflarını yüklediğinizden emin olun."
- 2×2 grid of textile template cards (portrait 3:4 ratio)
- "Ek detay" textarea (identical to generic screen)
- Info note (identical to generic screen)
- Sticky bottom bar (identical structure)

**Textile template card shows:**
- Portrait (3:4) video area — video plays on hover, pauses and resets on mouse-leave
- Selection indicator (top-right, same as generic)
- Bottom-left overlay (always visible): scene type chip (Sokak / Mağaza / Plaj / Dinamik) + "8-10 sn" chip
- Bottom-left overlay (hover only): "▶ Önizle" pill
- Template name (bold)
- Info popover button
- Scene context line (e.g. "Alışveriş sokağında yürüyüş, vitrin duraklama anı")
- "Önerilen" badge (on all 4 cards)
- Scene type chip (repeated in card body)

**4 available scenes:**
| Name | Scene | Suitable for |
|---|---|---|
| Sokakta Yürüyen Kız | Alışveriş sokağı | Elbise, Üst Giyim, Dış Giyim, Takım |
| Mağaza Önünde Kız | Mağaza cephesi | Kombin Set, Üst Giyim |
| Plajda Yürüyen Kız | Sahil | Yazlık, Pareo, Plaj Giyim |
| Zıplayan Kız | Açık alan, kentsel | Casual, Activewear, Spor |

**Textile info popover content:**
- "Senaryo akışı" paragraph
- "Uygun ürün tipi" chips
- "Aksesuar" note

---

### 2.7 Confirm

**Displayed:**
- Header: "Üretimi onayla"
- Supporting text: "Üretim başladıktan sonra token bakiyenizden düşülecektir."
- Campaign name shown below header (if set)
- 3 summary cards: Ürün sayısı / Tahmini süre / Tahmini token
- Selected template card: name, description, "X ürün için bu şablon kullanılacak." + "Düzenle" button
- AI scope note: "AI Video yalnızca sahne videosunu üretir. Fiyat, marka ve kampanya metinleri Dynamic Creative ile sonradan eklenir."
- Token balance breakdown: Mevcut bakiye / Bu üretim / Tahmini kalan
- Insufficient balance state: amber warning with "X token daha gerekiyor" + "Token al" button
- Notification checkbox: "Üretim bittiğinde bana bildir" (triggers browser notification permission)
- Footer: Geri / "Üretimi başlat"

**Interactions:**
- "Düzenle" returns to template selection
- "Token al" shows inline toast: "Token satın alma yakında kullanıma açılacak."
- "Üretimi başlat" disabled when token balance insufficient
- Notification checkbox requests browser permission; shows warning if denied or unsupported
- Geri returns to template selection

---

### 2.8 Generate & Review

**Displayed:**
- Header: "Videolar üretiliyor" (during generation) → "İnceleme" (when complete)
- Supporting text + "Onay vermeden hiçbir video kanala gönderilmez."
- Session confidence note: "Üretilen videolar bu oturumda incelemeniz için burada kalır. Onay vermeden hiçbir video kanala gönderilmez."
- Progress bar with percentage and completion count ("X / Y tamamlandı")
- Token cost label: "X token harcandı"
- Per-product video cards
- Sticky bottom bar: approved count / total, "Dışa aktar →" button

**Per-product video card states:**
1. **Generating:** spinner + "Üretiliyor..." + product name and image
2. **Pending review:** video player (inline), product info, Onayla + Reddet buttons + "Önizle" button + "Prompt düzenle" link
3. **Approved:** green "Onaylandı" badge, "Onayı geri al" text button + "Önizle" button (side by side)
4. **Rejected:** red "Reddedildi" badge, "Yeniden üret" button

**Interactions:**
- Onayla marks video as approved
- Reddet marks as rejected
- "Onayı geri al" reverts approved back to pending
- "Önizle" opens full video player modal
- "Prompt düzenle" navigates to EditPromptStep for that product
- "Dışa aktar →" disabled until at least 1 video is approved; navigates to ExportStep

---

### 2.9 Edit Prompt

**Trigger:** "Prompt düzenle" from Generate & Review card

**Displayed:**
- Product name and image
- Current template name
- Guided prompt fields (sector, theme, background, product type)
- Free-text additional note field
- "Yeniden üret" button
- Cancel / back action

**Interactions:**
- Submitting regenerates just that product's video (simulated)
- Returns to Generate & Review on completion

---

### 2.10 Export

**Displayed:**
- Header: "Kanallara gönder"
- Supporting text: "Onaylanan videoları bağlı katalog kanallarına gönderin. Kanal seçmeden devam etmek için alttaki ZIP seçeneğini kullanabilirsiniz."
- Approved video count badge: "X video onaylandı"
- Channel cards (2-column grid):
  - Meta Catalog — connected ("Optifeed Demo Store")
  - Google Merchant Center — connected ("Optifeed Demo Store")
  - TikTok Catalog — not connected; shows "Bağla" button
- "ZIP indir" row (dashed border): "X video için demo indirme akışını simüle eder." + "Demo" badge
- Sticky footer: Geri / "Atla (taslak olarak kaydet)" text link / "Gönder →" button

**Interactions:**
- Clicking a connected channel card toggles selection
- Clicking an unconnected channel shows toast: "[Channel name]: Bu adım yakında"
- "Gönder →" disabled until at least one connected channel is selected
- Clicking "Gönder →" shows 1500ms loading spinner then navigates to Success
- "Atla (taslak olarak kaydet)" skips channel selection and goes to Success with no channels
- "ZIP indir" shows toast: "Demo modunda indirme simüle edildi."
- Geri returns to Generate & Review

---

### 2.11 Success

**Displayed:**
- Green checkmark icon in circular bg
- "Videolar başarıyla dışa aktarıldı"
- Supporting text: "X ürün artık video içeriğine sahip"
- 3 summary cards: Video count / Channel(s) / "Harcanan" token count
- First-time user banner (localStorage-gated): "Bu senin ilk video kampanyan! Library'den her zaman tekrar gözden geçirebilirsin." (shown once per browser)
- Primary button: "Yeni video oluştur"
- Secondary button (outline): "Kampanyalarıma git"

**Channel label logic:**
- 0 channels selected: "Taslak"
- 1 channel: channel name
- 2 channels: "Channel 1 + Channel 2"
- 3+ channels: "X kanal"

**Interactions:**
- "Yeni video oluştur" resets flow and returns to SelectStep
- "Kampanyalarıma git" navigates to Library

---

## 3. User Flows

### Primary Flow — Create and export videos

Step 1: Land on Library or `/videos` → click "Yeni video oluştur"
Step 2 (SelectStep): Browse catalog, apply filters if needed, select 1–10 products
Step 3: Click "Devam →" in bottom bar → Campaign Setup Modal opens
Step 4 (Modal): Enter campaign name, select sector (required), optionally choose theme and product type → click "Şablona geç →"
Step 5 (TemplateSelectionStep): Select a template → optionally add note → click "Devam →"
Step 6 (ConfirmStep): Review summary, verify token balance → optionally enable notification → click "Üretimi başlat"
Step 7 (GenerateReviewStep): Wait for videos to simulate generation → review each video → approve or reject
Step 8: Click "Dışa aktar →" → ExportStep opens
Step 9 (ExportStep): Select one or more connected channels → click "Gönder →" → 1.5s loading
Step 10 (SuccessStep): See summary → click "Yeni video oluştur" or "Kampanyalarıma git"

**Outcome:** Campaign appears in Library as "Aktif" with video count.

---

### Textile Flow (sector = Moda & Giyim)

Steps 1–3: Same as primary flow
Step 4 (Modal): Select "Moda & Giyim" sector → modal shows "Prototip" badge on that chip
Step 5 (TextileTemplateSelectionStep): Textile-specific screen appears — 4 portrait video cards; hover plays preview video; select a scene → optionally add note → Devam
Steps 6–10: Same as primary flow

---

### Secondary Flow — Skip export (save as draft)

Steps 1–7: Same as primary flow through GenerateReviewStep
Step 8: Click "Dışa aktar →"
Step 9 (ExportStep): Click "Atla (taslak olarak kaydet)" without selecting channels
Step 10 (SuccessStep): Channel label shows "Taslak"

---

### Secondary Flow — Edit prompt and regenerate

Triggered from GenerateReviewStep when a video is in "pending_review" state.
Step 1: Click "Prompt düzenle" on a video card
Step 2 (EditPromptStep): Adjust guided fields or free text → "Yeniden üret"
Step 3: Returns to GenerateReviewStep; that video regenerates (simulated)

---

### Secondary Flow — Resume in-progress campaign

Step 1: Open Library
Step 2: Find a campaign with status "Üretim sürüyor"
Step 3: Click "Devam et" on the folder card
Step 4: Returns to GenerateReviewStep for that campaign

---

### Secondary Flow — Return to template selection from Confirm

Step 1: In ConfirmStep, click "Düzenle" on the template card
Step 2: Returns to TemplateSelectionStep (or TextileTemplateSelectionStep)
Step 3: User selects a different template → continues forward again

---

## 4. UX Decisions

**Token-gated progression.** "Üretimi başlat" is disabled when balance is insufficient. The user sees exactly how many tokens are needed. The "Token al" button is a placeholder (no real purchase flow).

**Mandatory per-video approval.** No videos are sent to channels automatically. Every video must be individually approved. Rejected videos remain in the campaign (not deleted) because tokens were already spent.

**Textile sector branching.** The template selection screen is entirely replaced for "Moda & Giyim" sector. All other sectors use the same generic screen. The branch is invisible to the user — they just see a different screen after the modal.

**Scene-first naming for textile.** Textile templates use descriptive scenario names instead of abstract feature names ("Sokakta Yürüyen Kız" instead of "Lifestyle Sahne") because users need to visualize what they're selecting.

**Hover video preview for textile cards.** The video plays only on hover and resets to frame 0 on mouse-leave. This keeps the grid calm until the user actively explores.

**Non-clickable "AI Video" group label.** If it were a NavLink to `/videos`, it would show as active simultaneously with "Yeni video oluştur". Made non-clickable to avoid double active state.

**Advanced filter panel is hidden by default.** Only shown when the user clicks the toggle button. Active filter count badge on the button signals when filters are applied.

**Select-all respects the limit.** "Tümünü seç" only adds up to the remaining capacity (max 10 total). If the limit is already reached, the button becomes "Seçimi temizle".

**Notification opt-in on Confirm screen.** Browser notification permission is only requested when the user checks the box — not proactively. If denied, an inline message explains how to re-enable it.

**Skip export option.** The "Atla (taslak olarak kaydet)" link allows users to exit the export step without connecting channels. The campaign is saved as a draft.

**"Kampanyalarıma git" is the only post-success back-action.** Previously there were two CTAs pointing to the same destination ("Kampanyalarıma git" and "Kütüphaneye dön"). Consolidated to one secondary CTA.

---

## 5. Edge Cases & States

### Empty states

| Situation | What is shown |
|---|---|
| Library has no campaigns | "Henüz video kampanyanız yok" + "İlk kampanyanı oluştur" button |
| Product catalog is empty | "Ürün kataloğu boş" with no action |
| Product filters return no results | "Sonuç bulunamadı" + "Filtreyi sıfırla" (only when active filters exist) |
| No templates available (generic screen) | "Şablon bulunamadı" + "Geri dön" |

### Loading states

| Situation | Duration | What is shown |
|---|---|---|
| Product catalog mount | 300ms | 8 skeleton product cards |
| Template grid mount | 300ms | 4 skeleton template cards |
| Library mount | 300ms | Skeleton folder cards |
| Export send action | 1500ms | Spinner in Gönder button ("Gönderiliyor...") |
| Video generation (per product) | 1200ms per video | Spinner + "Üretiliyor..." label on each card |

### Insufficient token state

Shown on ConfirmStep when `tokenBalance < productCount × 8`:
- Balance card turns amber
- Warning with exact shortfall: "X token daha gerekiyor"
- "Token al" button shown (fires inline toast, no real action)
- "Üretimi başlat" is disabled

### Notification permission states

| Permission state | UI result |
|---|---|
| Granted | Checkbox activates silently |
| Denied | Inline warning: "Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz." |
| Not supported | Warning: "Tarayıcınız bildirimleri desteklemiyor." |

### Channel connection state (ExportStep)

| Channel state | Card behavior |
|---|---|
| Connected | Toggleable; sends when selected |
| Not connected | Click shows toast ("Bu adım yakında"); cannot be selected for send |

### First-time user state (Success)

Tracked via localStorage key `has_completed_first_campaign`. If not set, shows the "Bu senin ilk video kampanyan!" banner. Written on first Success screen mount; not shown again.

### Viewport too narrow

Below 1280px, a full-screen overlay blocks the entire app:
- "Bu özellik şu an sadece desktop'ta kullanılabilir."
- "En az 1280px ekran genişliği gerekiyor."
- No interaction available until viewport is widened.

---

## 6. Out of Scope

The following are explicitly excluded from this prototype:

**Backend and data persistence.** All data is static and in-memory. Nothing survives a page refresh. Product catalog, campaign history, and video records are all hardcoded or held in React state.

**Real video generation.** All "generated" videos are the same static MP4 URL. Generation is simulated with a 1200ms timeout per product.

**Real token balance.** Token balance is a hardcoded number (1240). No real purchase, deduction, or top-up happens.

**Real channel export.** Clicking "Gönder →" fires a setTimeout and shows a success screen. No data is sent anywhere. Meta, Google, and TikTok integrations are visual only.

**ZIP download.** Clicking "ZIP indir" shows a toast. No file is generated or downloaded.

**Authentication.** No login, no user accounts, no session management.

**Multi-user or team features.** Single-user prototype only.

**Dynamic Creative.** "Dynamic Creative" appears in the sidebar with a "Yakında" badge and links to `/templates`. That route is not built — clicking it navigates to a non-existent screen.

**Real product catalog.** 12 hardcoded products with Unsplash placeholder images. No feed import, no product sync.

**Text overlays on video.** Price, brand name, and campaign copy are explicitly not added by the AI. The spec states these are handled by Dynamic Creative (out of scope).

**Mobile / tablet layout.** The app blocks all viewports below 1280px. No responsive design work was done for smaller screens.

**Billing and subscription.** "Token al" is a placeholder button. No payment or plan management.

**Notifications (real).** Browser notification permission is requested but no actual background process sends a notification when generation completes — because generation is synchronous and in-browser.
