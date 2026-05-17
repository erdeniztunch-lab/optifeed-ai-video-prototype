# AI Videos Feedback Implementation Plan

---

## 1. Source of Truth

`design.md` (v2) bu proje için ürün deneyimini tanımlayan tek doğruluk kaynağıdır. Mevcut codebase `design.md`'ye yaklaştırılacak; tasarımda yer almayan hiçbir özellik eklenmeyecek.

Gap analizi 26 eksiklik tespit etti: 6 Critical, 13 Medium, 7 Low. Bu doküman o gap'leri kapalı, güvenli ve doğrulanabilir aşamalara böler.

---

## 2. Target Flow

```
/videos (varsayılan giriş)
  → catalog          [Ürün Kataloğu — tablo, filtre, arama, seçim]
      ↓ "Şablon seç →"
  → campaign-setup   [Modal: isim + sektör + tema + ürün tipi]
      ↓ "Şablona geç →"
  → template         [2×2 şablon grid + ek not textarea]
      ↓ "Devam →"
  → confirm          [Maliyet özeti + bakiye + bildirim opt-in]
      ↓ "Üretimi başlat"
  → generate-review  [BİRLEŞİK — üretim + inceleme aynı ekran]
      └─ edit-prompt [Modal olarak açılır]
      ↓ "Dışa aktar →" (ilk onaylanan videodan sonra aktif)
  → export           [Kanal toggle kartları + ZIP]
      ↓ "Gönder →" / "Atla"
  → success          [Özet + ilk kampanya mesajı]

/videos?view=library [İkincil görünüm — Kampanyalarım]
```

---

## 3. Implementation Principles

1. **Frontend-only:** Gerçek API, backend, database, auth yok. Tüm veri mock veya local state.
2. **Mock/local state only:** Üretim simülasyonu `setTimeout` ile devam eder. Token işlemleri sabit sabitlere dayanır.
3. **Hiçbir özellik icat edilmez:** Yalnızca `design.md`'de açıkça tanımlanan özellikler uygulanır.
4. **Mevcut bileşenler mümkün olduğunca korunur:** Gerekmeyen yeniden yazım yapılmaz.
5. **Big-bang yok:** Her aşama bağımsız olarak build edilebilir ve test edilebilir. Bir önceki aşama bitmeden bir sonrakine geçilmez.
6. **Her aşama sonrası:** `npm run build` + `npm run lint` çalıştırılır. Hatalar düzeltilmeden bir sonraki aşamaya geçilmez.
7. **Her aşama sonrası onay beklenir.**

---

## 4. Phased Implementation Plan

---

### Phase 0 — Foundation & State Cleanup

**Goal:** UI değişikliği olmadan state yapısını, type'ları ve mock veriyi `design.md §13` ve `§14`'e hizala. Tüm sonraki aşamalar bu temele dayanır.

**Gaps addressed:** G-02 (kısmi — type altyapısı), G-03 (kısmi — campaignContext type), G-05 (kısmi — template ID'leri), G-19 (mock veri)

**Files/components affected:**
- `src/types/video-flow.ts`
- `src/data/products.ts`
- `src/data/templates.ts`
- `src/data/tokens.ts`
- `src/data/folders.ts`
- `src/pages/Videos.tsx` (state değişkenleri, stage isimleri)
- Yeni: `src/data/channels.ts`
- Yeni: `src/data/taxonomy.ts`

**Exact changes:**

**`src/types/video-flow.ts`:**
```ts
// Stage isimleri design.md §13 ile hizalanır:
type Stage =
  | "catalog"         // Ürün kataloğu (eski: "select")
  | "library"         // Kampanyalarım (değişmez)
  | "campaign-setup"  // Modal açık (eski: modal Videos.tsx'te inline)
  | "template"        // Şablon seçimi (değişmez)
  | "confirm"         // YENİ — Maliyet onayı
  | "generate-review" // YENİ — Birleşik üretim+inceleme (eski: "progress"+"review")
  | "edit-prompt"     // Modal olarak açılır (değişmez)
  | "export"          // Dışa aktarma (değişmez)
  | "success"         // Başarı (değişmez)

// Video statüleri design.md §2.6 ile hizalanır:
type VideoStatus =
  | "generating"
  | "pending_review"
  | "approved"
  | "rejected"
  | "failed"
  | "draft"
  | "live"

// Video type genişletilir:
interface Video {
  id: string
  productId: string
  status: VideoStatus
  url: string | null
  previousVersions: { url: string | null; timestamp: number }[]
}

// CampaignContext type eklenir:
interface CampaignContext {
  sector: string
  theme: string
  themeCustom: string
  productType: string
}

const DEFAULT_CAMPAIGN_CONTEXT: CampaignContext = {
  sector: "",
  theme: "",
  themeCustom: "",
  productType: "",
}

// GuidedPrompt (template note için sadeleşir):
interface GuidedPrompt {
  templateNote: string  // Ekran 2'deki "Ek detay" alanı
}

const DEFAULT_GUIDED_PROMPT: GuidedPrompt = { templateNote: "" }

// TemplateId — yeni isimler:
type TemplateId = "vitrine-bakan-kadin" | "paris-yurüyen-kadin" | "bahce-bulusmasi" | "product-spotlight"
```

**`src/data/templates.ts`:**
```ts
// 4 şablon design.md §7.4 isimlerine güncellenir:
// "vitrine-bakan-kadin" — "Vitrine bakan kadın"
// "paris-yurüyen-kadin" — "Paris'te yürüyen kadın"
// "bahce-bulusmasi"     — "Bahçe buluşması"
// "product-spotlight"   — "Product spotlight"
// previewImage, scenario, recommendedSectors[] alanları eklenir
```

**`src/data/tokens.ts`:**
```ts
export const MOCK_TOKEN_BALANCE = 1240      // design.md örnek değeri
export const TOKEN_COST_PER_VIDEO = 8       // design.md §8.8: ~8 token
export const ESTIMATED_MINUTES_PER_VIDEO = 1
export const PRODUCT_SELECTION_LIMIT = 10
export const DEMO_VIDEO_GENERATION_DELAY_MS = 1200  // design.md §9.8
export const SAMPLE_VIDEO = "..."           // değişmez
// Harcama geçmişi mock'u (Wallet panel için):
export const MOCK_SPENDING = {
  thisWeek: 340,
  thisMonth: 1120,
  lastActionLabel: "2 saat önce",
}
```

**`src/data/channels.ts` (YENİ):**
```ts
export interface Channel {
  id: string
  name: string
  description: string
  connectionStatus: "connected" | "disconnected"
  accountName?: string
}

export const CHANNELS: Channel[] = [
  { id: "meta", name: "Meta Catalog", description: "Facebook & Instagram Reklamları",
    connectionStatus: "connected", accountName: "Anneler Günü Hesabı" },
  { id: "google", name: "Google Merchant Center", description: "Shopping & Performance Max",
    connectionStatus: "connected" },
  { id: "tiktok", name: "TikTok Catalog", description: "TikTok Shop & Catalog Ads",
    connectionStatus: "disconnected" },
]
```

**`src/data/taxonomy.ts` (YENİ):**
```ts
export const SECTOR_OPTIONS = ["Tekstil / Modest", "Moda & Giyim", "Ayakkabı",
  "Aksesuar", "Ev & Yaşam", "Elektronik", "Gıda", "Kozmetik", "Spor & Outdoor", "Diğer"]
export const THEME_OPTIONS = ["Anneler Günü", "Ramazan", "Yaz Koleksiyonu",
  "İndirim Sezonu", "Yeni Sezon", "Sevgililer Günü", "Okul Dönemi", "Gündelik", "Diğer"]
export const PRODUCT_TYPE_OPTIONS = ["Tekil ürün", "Ürün seti", "Görsel grubu"]
```

**`src/data/products.ts`:**
```ts
// Product interface'e videoHistory eklenir:
interface VideoHistory {
  campaignName: string
  date: string  // "2026-03-12"
}
interface Product {
  // mevcut alanlar korunur...
  images?: string[]     // çoklu görsel URL dizisi (additionalImageCount ile tutarlı)
  videoHistory?: VideoHistory[]  // geçmiş uyarısı için
}
// Mock ürün sayısı 12'den 30'a çıkarılır (Unsplash URL'leri)
// Her üründe farklı marka, kategori, additionalImageCount (0-5), bazılarında videoHistory
```

**`src/pages/Videos.tsx`:**
```ts
// Stage tipi güncellenir (eski "select" → "catalog", "progress"+"review" → "generate-review")
// Yeni state'ler eklenir:
const [campaignContext, setCampaignContext] = useState<CampaignContext>(DEFAULT_CAMPAIGN_CONTEXT)
const [templateNote, setTemplateNote] = useState("")
const [notifyOnComplete, setNotifyOnComplete] = useState(false)
const [videos, setVideos] = useState<Video[]>([])  // VideoJob yerine

// stageToStep güncellenir (5 adım):
// catalog→1, campaign-setup→1, template→2, confirm→3, generate-review→4, edit-prompt→4, export→5, success→5

// getPreviousStage güncellenir:
// catalog → null, template → catalog (modal bypass), confirm → template,
// generate-review → null (üretim başladı), edit-prompt → generate-review,
// export → generate-review, success → null
```

**Acceptance criteria:**
- [ ] `npm run build` hatasız geçer
- [ ] `npm run lint` hatasız geçer
- [ ] `/videos` açılır, mevcut akış (catalog→template→...) çalışır
- [ ] Console'da type hataları yok
- [ ] Stage isimleri yeni isimlerle çalışır
- [ ] 30 ürün ürün listesinde görünür

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] `/videos` render ediyor ✓
- [ ] Ürün listesinde 30 ürün görünüyor ✓
- [ ] Ürün seçip "Şablon seç" tıklanabilir ✓
- [ ] Template ekranı render ediyor ✓
- [ ] Export ekranı render ediyor ✓
- [ ] Success ekranı render ediyor ✓

**What not to touch:** UI bileşenleri, CSS, tailwind config, index.css

**Risk level:** Low — sadece tip ve veri değişikliği, UI dokunulmaz

---

### Phase 1 — Campaign Setup Modal + StepIndicator

**Goal:** Kampanya kurulum modalını 4 alanlı forma dönüştür. Step indicator'ı 5 adıma indir.

**Gaps addressed:** G-03 (Campaign setup modal eksik alanlar), G-04 (StepIndicator 6→5 adım)

**Files/components affected:**
- `src/components/videos/CampaignNameModal.tsx` → içerik genişletilir (dosya adı `CampaignSetupModal.tsx` olabilir)
- `src/components/videos/StepIndicator.tsx` — yeniden yazılır
- `src/pages/Videos.tsx` — modal prop'ları, stageToStep mapping

**Exact changes:**

**`CampaignNameModal.tsx` (veya yeni `CampaignSetupModal.tsx`):**
```tsx
// Mevcut: sadece text input (kampanya adı)
// Yeni form alanları (design.md §5.1):
// 1. Kampanya adı — text, required, 3-60 char
// 2. Sektör — Select dropdown (SECTOR_OPTIONS), required
// 3. Kampanya teması — Select dropdown (THEME_OPTIONS), optional
//    "Diğer" seçilince açıklama textarea (max 40 char)
// 4. Ürün tipi — Select dropdown (PRODUCT_TYPE_OPTIONS), optional

// Validation:
// - CTA "Şablona geç →" disabled: kampanya adı boş veya sektör seçilmedi
// - Kampanya adı < 3 char: inline "En az 3 karakter girin"
// - Kampanya adı > 60 char: bloklanır (maxLength)
// - Hint: "Şablon seçimine geçmeden önce kampanya bilgilerini girin."

// onConfirm(name, context: CampaignContext) imzası değişir
```

**`StepIndicator.tsx`:**
```tsx
// Mevcut 6 adım kaldırılır, 5 adım gelir:
const STEPS = [
  "Ürün seç",       // step 1
  "Şablon",         // step 2
  "Onayla",         // step 3
  "Üret & İncele",  // step 4
  "Gönder",         // step 5
]

// Props genişler:
interface Props {
  current: number           // aktif step (1-5)
  completedUpTo?: number    // tamamlanan son step
  onStepClick?: (step: number) => void  // tamamlanan adımlara tıklanabilirlik
}

// design.md §2.2 görsel kuralları:
// Aktif: mor dolu daire #7F77DD + bold etiket
// Tamamlanan: yeşil checkmark + normal etiket + cursor-pointer
// Bekleyen: gri daire + muted etiket + cursor-not-allowed

// Tıklama: sadece completedUpTo >= step olan adımlar tıklanabilir
```

**`Videos.tsx`:**
```tsx
// handleCampaignConfirm signature değişir:
const handleCampaignConfirm = (name: string, context: CampaignContext) => {
  setCampaignContext(context)
  // ... mevcut folder oluşturma mantığı korunur
}

// stageToStep (5 adım):
const stageToStep: Record<Stage, number> = {
  catalog: 1,
  library: 0,          // step bar gösterilmez
  "campaign-setup": 1,
  template: 2,
  confirm: 3,
  "generate-review": 4,
  "edit-prompt": 4,
  export: 5,
  success: 5,
}

// Step click handler eklenir (tamamlanan adımlara dönüş)
```

**Acceptance criteria:**
- [ ] Modal 4 alan içeriyor: kampanya adı, sektör, tema, ürün tipi
- [ ] "Şablona geç →" kampanya adı boşken disabled
- [ ] "Şablona geç →" sektör seçilmemişken disabled
- [ ] Tema "Diğer" seçilince text input açılıyor
- [ ] StepIndicator 5 adım gösteriyor
- [ ] Template ekranında step 2 active görünüyor
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] Modal açılıyor ✓
- [ ] 4 alan görünüyor ✓
- [ ] Kampanya adı validation çalışıyor ✓
- [ ] Sektör seçilmeden CTA disabled ✓
- [ ] "Diğer" theme → textarea açılıyor ✓
- [ ] StepIndicator'da 5 adım görünüyor ✓
- [ ] Template ekranında step 2 highlighted ✓

**What not to touch:** `SelectStep.tsx`, `TemplateSelectionStep.tsx`, `GenerationProgressStep.tsx`, `ReviewStep.tsx`

**Risk level:** Low-Medium — modal formu genişler, StepIndicator yeniden yazılır ama flow bozulmaz

---

### Phase 2 — Template Screen Alignment

**Goal:** Template ekranından guided prompt sidebar'ı kaldır. Şablon isimlerini güncelle. Ek detay textarea ekle.

**Gaps addressed:** G-05 (şablon isimleri), G-06 (template ekranı layout)

**Files/components affected:**
- `src/components/videos/TemplateSelectionStep.tsx` — layout güncellenir
- `src/components/videos/TemplateCard.tsx` — yeni isimler, önizleme modal
- `src/components/videos/GuidedPromptFields.tsx` — artık bu ekranda kullanılmaz
- `src/components/videos/TemplateActionBar.tsx` — kaldırılır, yeni bottom bar
- `src/data/templates.ts` — isimler ve alanlar güncellenir

**Exact changes:**

**`src/data/templates.ts`:**
```ts
export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "vitrine-bakan-kadin",
    label: "Vitrine bakan kadın",
    scenario: "Alışveriş caddesinde yürüyüp durur, vitrine bakar. Ürün duraklama anında net görünür.",
    description: "Duraklama anı — şıklık ve keşif hissi.",
    previewImage: "https://images.unsplash.com/...",
    recommendedSectors: ["Tekstil / Modest", "Moda & Giyim"],
  },
  {
    id: "paris-yurüyen-kadin",
    label: "Paris'te yürüyen kadın",
    scenario: "Haussmann tarzı caddede, café önünde yürüyor.",
    description: "Şıklık, Avrupa estetiği.",
    previewImage: "https://images.unsplash.com/...",
    recommendedSectors: ["Moda & Giyim", "Aksesuar"],
  },
  {
    id: "bahce-bulusmasi",
    label: "Bahçe buluşması",
    scenario: "Doğal ışık, çiçekli arka plan, öğleden sonra.",
    description: "Organik, sıcak ton.",
    previewImage: "https://images.unsplash.com/...",
    recommendedSectors: ["Tekstil / Modest", "Ev & Yaşam"],
  },
  {
    id: "product-spotlight",
    label: "Product spotlight",
    scenario: "Sade gradient arka plan, 360° yavaş döngü.",
    description: "Detay çekimi, en temiz format.",
    previewImage: "https://images.unsplash.com/...",
    recommendedSectors: [],  // herkese uygun
  },
]
```

**`TemplateSelectionStep.tsx`:**
```tsx
// Eski layout: left: template grid | right: GuidedPromptFields sidebar
// Yeni layout: tam genişlik, sadece template grid

// Props değişikliği:
// Eski: onGenerate(opts: { template: TemplateId; guidedPrompt: GuidedPrompt })
// Yeni: onContinue(opts: { template: TemplateId; templateNote: string })

// Üst kısım:
// - Başlık: "Şablon seçin"
// - Hint: "Ürünlerinize en uygun video senaryosunu seçin."
// - Kampanya özeti (muted): "[sektör] · [tema] · [ürün tipi]" — campaignContext'ten

// 2x2 grid: TemplateCard × 4
// recommendedSectors eşleşmesi varsa "⚹ [Sektör adı] için önerilen" amber badge

// Şablon grid'inin altında, opsiyonel textarea:
// Label: "Ek detay (opsiyonel)"
// Placeholder: "Örn: fırfırlı kollar öne çıksın, sırt dekoltesi net görünsün"
// Hint: "Preset seçeneklere sığmayan özel detaylar için. Bu not tüm ürünlere uygulanır."
// maxLength: 300, karakter sayacı: "0 / 300"

// Bilgi notu: "ℹ Videolar 8–10 saniye, 1:1 formatta üretilir."

// Bottom bar (TemplateActionBar kaldırılır, basit bar gelir):
// Sol: "N ürün · [şablon adı]"
// Sağ: [← Geri] [Devam →]
// Disabled hint: "Devam etmek için bir şablon seçin"
```

**`TemplateCard.tsx`:**
```tsx
// Mevcut: info popover butonu
// Değişiklik:
// - "recommended sector" badge eklenir
// - Hover → placeholder animasyon (CSS opacity/scale geçişi — gerçek video animasyonu opsiyonel)
// - Preview alanına tıklayınca basit detay modal açılır (design.md §7.3):
//   Modal: şablon adı, senaryo açıklaması, "[Bu şablonu seç →]" butonu
// - Mevcut info popover kaldırılır (yerine modal)
```

**Acceptance criteria:**
- [ ] Template ekranında sağ sidebar yok
- [ ] 4 şablon yeni isimlerle görünüyor
- [ ] Ek detay textarea var, 300 char sayacı çalışıyor
- [ ] Kampanya özeti (sektör/tema/ürün tipi) muted olarak gösteriliyor
- [ ] Bottom bar: "N ürün · [şablon adı]"
- [ ] Şablon seçilmeden "Devam →" disabled
- [ ] Template kartına tıklanınca seçiliyor
- [ ] Preview alanına tıklanınca detay modal açılıyor
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] 4 şablon yeni isimlerle görünüyor ✓
- [ ] Sidebar yok ✓
- [ ] Ek detay textarea çalışıyor ✓
- [ ] Şablon seçimi + devam → confirm ekranına geçiş ✓
- [ ] campaignContext özeti görünüyor ✓

**What not to touch:** `CampaignSetupModal.tsx`, `StepIndicator.tsx`, `SelectStep.tsx`, `ExportStep.tsx`

**Risk level:** Medium — TemplateActionBar kaldırılıyor, yeni bottom bar geliyor; `onGenerate` prop imzası değişiyor

---

### Phase 3 — Confirm Step

**Goal:** Üretim başlatmadan önce maliyet onayı ekranını ekle.

**Gaps addressed:** G-01 (maliyet onayı ekranı yok)

**Files/components affected:**
- Yeni: `src/components/videos/ConfirmStep.tsx`
- `src/pages/Videos.tsx` — yeni `confirm` stage, handler'lar

**Exact changes:**

**`ConfirmStep.tsx` (YENİ):**
```tsx
interface ConfirmStepProps {
  products: Product[]
  template: TemplateDefinition | null
  campaignContext: CampaignContext
  templateNote: string
  tokenBalance: number
  notifyOnComplete: boolean
  onNotifyChange: (v: boolean) => void
  onConfirm: () => void
  onBack: () => void
}

// Layout (design.md §8):
// Step göstergesi: ✓ Ürün seç → ✓ Şablon → ● Onayla → ...

// Başlık: "Üretimi onayla"
// Hint: "Üretim başladıktan sonra token bakiyenizden düşülecektir."

// 3'lü özet grid:
// [Ürün sayısı: N] [Tahmini süre: ~N dk] [Tahmini token: ~N token]
// Tüm değerler "~" ile başlar

// Şablon özeti:
// 🎬 [Şablon adı]  [Düzenle →]
// "N ürün için bu şablon kullanılacak."
// "Düzenle" → stage="template"'e döner

// Bakiye özet kartı:
// Mevcut bakiye: N,NNN token
// Bu üretim:   −N token
// ─────────────────────────
// Tahmini kalan: ≈ N,NNN token
// (yetersiz ise: kalan satırı kırmızı, "Eksik: N token")

// Insufficient balance state:
// CTA disabled
// Warning alert: "⚠ Bakiyeniz bu üretim için yetersiz. N token eksik."
// (MVP'de "Token al" → mock toast "Bu özellik yakında")

// Opsiyonel checkbox:
// ☐ Üretim bittiğinde bana bildir (tarayıcı bildirim izni)
// İlk işaretlemede Notification.requestPermission() (izin reddedilirse warning)

// Footer:
// [← Geri]    [Üretimi başlat →]
```

**`Videos.tsx`:**
```tsx
// confirm stage eklenir:
// handleTemplateNext(template, templateNote) → stage="confirm"
// handleConfirm() → token düşürülür, video'lar oluşturulur, stage="generate-review"
// handleBackFromConfirm() → stage="template"

// getPreviousStage güncellemesi:
// confirm → template
// generate-review → null  (geri butonu yok, üretim başladı)
```

**Acceptance criteria:**
- [ ] Template → "Devam" → Confirm ekranı açılıyor
- [ ] 3 özet kart: ürün sayısı, süre, token doğru
- [ ] Şablon adı gösteriliyor, "Düzenle" → template'e dönüyor
- [ ] Bakiye kart doğru hesaplıyor (bakiye - maliyet)
- [ ] Yetersiz bakiyede CTA disabled + kırmızı uyarı
- [ ] Bildirim checkbox çalışıyor
- [ ] "Üretimi başlat" → token düşüyor, generate-review açılıyor
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] Template → Confirm geçişi ✓
- [ ] Token hesaplamaları doğru ✓
- [ ] Yetersiz bakiye state'i görünüyor ✓
- [ ] Confirm → generate-review geçişi ✓
- [ ] Token balance düşüyor ✓

**What not to touch:** `GenerationProgressStep.tsx`, `ReviewStep.tsx`, `ExportStep.tsx`

**Risk level:** Low — yeni bileşen, mevcut akışa ekleniyor

---

### Phase 4 — Generate-Review Merge (Birleşik Ekran)

**Goal:** `progress` ve `review` stage'lerini tek `generate-review` ekranında birleştir. Videolar üretildikçe kart `generating → pending_review`'e geçer; kullanıcı hemen aksiyon alabilir.

**Gaps addressed:** G-02 (en büyük mimari değişim), G-13 (toplu aksiyon butonları)

**Files/components affected:**
- Yeni: `src/components/videos/GenerateReviewStep.tsx`
- `src/components/videos/ReviewVideoCard.tsx` — `generating` state eklenir
- `src/components/videos/VideoProgressCard.tsx` — gerekirse reuse
- `src/pages/Videos.tsx` — stage logic, video state
- `src/types/video-flow.ts` — Video type kullanılır

**Exact changes:**

**`GenerateReviewStep.tsx` (YENİ — GenerationProgressStep + ReviewStep birleşimi):**
```tsx
interface GenerateReviewStepProps {
  products: Product[]
  videos: Video[]
  onVideoStatusChange: (id: string, status: VideoStatus) => void
  onEditPrompt: (productId: string) => void
  onContinue: () => void          // "Dışa aktar →"
  onBulkApprove: () => void       // "Tümünü onayla" — confirmation ile
  notifyOnComplete: boolean
}

// Header (dinamik):
// Üretim sürüyorsa: "Videolar üretiliyor..."
// Tüm üretim bittiyse: "Videolar hazır — inceleme tamamlanınca gönderebilirsiniz"
// Hint: "Videolar hazır oldukça inceleyebilirsiniz. Onay vermeden hiçbir video kanala gönderilmez."
// Progress satırı: "N / M tamamlandı · ~N dk kaldı"
// Progress bar (4px yükseklik, primary color → tümü bitince success green)

// Toplu aksiyonlar (sağ üst) — design.md §9.5:
// [↻ Tümünü yeniden üret] — confirmation + token uyarısı
// [✓ Tümünü onayla] — confirmation dialog: "N videoyu onayla?"
// [▼ İndir dropdown]: "Onaylananları indir" / "Tümünü indir"

// Video kart listesi:
// Her kart: ReviewVideoCard ile (generating state desteği eklenerek)

// Footer (sticky):
// Sol: "N onaylandı / M toplam"
// Sağ: [← Geri (disabled)] [Dışa aktar →]
// "Dışa aktar" disabled hint: "Dışa aktarmak için en az 1 videoyu onaylayın"
// İlk onaylananın ardından aktifleşir

// Mock üretim logic (setTimeout chain):
// Her video sırayla: generating (0ms) → pending_review (1200ms × i)
// ~5% random failed rate (G-02 isteğe bağlı)
// Tüm üretim bitince progress bar yeşile döner, başlık değişir

// Browser notification (notifyOnComplete=true ise):
// Tüm üretim bitince: new Notification("Kampanyandaki N video hazır.")
```

**`ReviewVideoCard.tsx` güncellemesi:**
```tsx
// Mevcut: pending_review | approved | rejected
// Yeni: generating state eklenir

// generating state (design.md §9.4.1):
// - Thumbnail alanında spinner + soluk ürün görseli arka plan
// - Badge: "Üretiliyor" (amber, pulse animasyonu)
// - Aksiyon butonları görünmez
// - Sol kenar: 3px amber çizgi

// pending_review state (design.md §9.4.2):
// - Thumbnail fade-in (300ms)
// - Oynat ikonu overlay + süre
// - Badge: "İncele" (mor)
// - Aksiyon butonları: [▶ Önizle] [✓ Onayla] [✎ Düzenle] [✕ Reddet]

// approved (§9.4.3): yeşil checkmark overlay, [Değiştir] linki
// rejected (§9.4.4): kırmızı overlay, opacity 0.5, [Geri al] linki
// failed (§9.4.5): error ikon, "Token iade edildi" hint, [↻ Yeniden dene]
```

**`Videos.tsx`:**
```tsx
// Stage değişimi:
// "progress" ve "review" kaldırılır
// "generate-review" eklenir

// Video state: VideoJob[] yerine Video[] kullanılır
// Üretim Videos.tsx yerine GenerateReviewStep içinde yönetilir
// (veya Videos'ta useEffect ile — consistency için)

// Kalan handler'lar:
// handleApprove(videoId) — Video.status = "approved"
// handleReject(videoId) — Video.status = "rejected"
// handleBulkApprove() — window.confirm → tüm pending_review → approved
//   (Phase 7'de confirmation dialog component ile değiştirilir)
// handleOpenEditPrompt(productId) — stage = "edit-prompt"
```

**Acceptance criteria:**
- [ ] Üretim başlayınca kartlar sırayla generating → pending_review geçiyor
- [ ] İlk video hazır olunca hemen onayla/reddet/düzenle butonları görünüyor
- [ ] Üretim devam ederken kullanıcı hazır videolara aksiyon alabilir
- [ ] "Dışa aktar" ilk onaydan sonra aktifleşiyor
- [ ] "Tümünü onayla" confirmation soruyor
- [ ] İndir dropdown çalışıyor (ZIP mock)
- [ ] Ayrı progress ve review ekranları kaldırıldı
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] Confirm → generate-review geçişi ✓
- [ ] Sıralı video üretimi animasyonu ✓
- [ ] Hazır video → aksiyon butonları görünüyor ✓
- [ ] Approve → footer sayacı artıyor ✓
- [ ] "Dışa aktar" butonu aktifleşiyor ✓
- [ ] Edit prompt açılıyor ✓
- [ ] Old `GenerationProgressStep` ve `ReviewStep` artık route edilmiyor ✓

**What not to touch:** `ConfirmStep.tsx`, `ExportStep.tsx`, `SuccessStep.tsx`, `LibraryStep.tsx`

**Risk level:** High — en büyük yeniden yapılandırma. Mevcut progress+review akışı tamamen değişiyor. Dikkatli test edilmeli.

---

### Phase 5 — Export Update (Channel-Toggle Paradigması)

**Goal:** Feed-attribute kartlarını kanal-toggle kartlarıyla değiştir.

**Gaps addressed:** G-14 (export paradigması değişimi)

**Files/components affected:**
- `src/components/videos/ExportStep.tsx` — yeniden yazılır
- `src/components/videos/ExportFeedCard.tsx` — replace edilir
- Yeni: `src/components/videos/ChannelToggleCard.tsx`
- `src/data/feedExports.ts` → artık aktif kullanılmaz; `src/data/channels.ts` devreye girer
- `src/pages/Videos.tsx` — handleExportComplete imzası güncellenir

**Exact changes:**

**`ChannelToggleCard.tsx` (YENİ):**
```tsx
interface ChannelToggleCardProps {
  channel: Channel
  selected: boolean
  onToggle: () => void
}

// Bağlı + seçili: border 2px #7F77DD, toggle on
// Bağlı + seçilmedi: border 0.5px border-tertiary, toggle off
// Bağlı değil: toggle disabled, "[Kanal] hesabını bağla →" (mock toast)
// Her kartta: logo/badge (renkli metin), kanal adı, açıklama, bağlantı durumu
```

**`ExportStep.tsx` (yeniden yapılandırılır):**
```tsx
// Yeni layout (design.md §11):

// Başlık alanı:
// Yeşil checkmark + "N video onaylandı"
// Hint: "Videoları reklam kanallarınıza gönderin veya ZIP olarak indirin."

// Kanal listesi (3 kart: Meta, Google, TikTok):
// ChannelToggleCard × 3

// ZIP indirme kartı (dashed border):
// [⤓ ZIP indir] (N video)
// "Kanal seçmeden sadece indirmek istiyorsanız 'Atla'yı kullanın."

// Footer:
// [← Geri]  [Atla (taslak olarak kaydet)]  [Gönder →]
// "Gönder" — en az 1 bağlı kanal seçili olmalı
// Disabled hint: "Göndermek için en az bir kanal seçin"

// Gönder tıklandığında: 2 sn mock delay → success
// Atla: kampanya draft kalır → success (count=0 veya skip)
```

**Acceptance criteria:**
- [ ] 3 kanal kartı görünüyor (Meta bağlı, Google bağlı, TikTok bağlı değil)
- [ ] Toggle çalışıyor, bağlı değil → disabled + mock toast
- [ ] ZIP indirme butonu mock download tetikliyor
- [ ] "Gönder" seçim olmadan disabled
- [ ] "Atla" → success ekranına gidiyor
- [ ] "Gönder" → 2 sn delay → success ekranına gidiyor
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] 3 kanal kartı görünüyor ✓
- [ ] Meta toggle → seçili state ✓
- [ ] TikTok → disabled, mock toast ✓
- [ ] Gönder → success ✓
- [ ] Atla → success ✓

**What not to touch:** `GenerateReviewStep.tsx`, `SuccessStep.tsx`, `LibraryStep.tsx`

**Risk level:** Medium — ExportStep yeniden yazılıyor ama ayrı bir ekran, flow bozulma riski düşük

---

### Phase 6 — Library Improvements

**Goal:** Library'ye kebab menü, `setup_in_progress` statüsü ve "Devam et" pathway'i ekle.

**Gaps addressed:** G-15 (kebab menü), G-16 (setup_in_progress)

**Files/components affected:**
- `src/components/videos/FolderCard.tsx` — kebab menü + setup_in_progress kart
- `src/components/videos/LibraryStep.tsx` — yeni tab eklenir (Üretim sürüyor)
- `src/data/folders.ts` — yeni status değeri
- `src/pages/Videos.tsx` — resume/delete handler'lar

**Exact changes:**

**`src/data/folders.ts`:**
```ts
type FolderStatus = "active" | "draft" | "archived" | "setup_in_progress"
// setup_in_progress: kampanya kurulumu yarım kaldı
```

**`FolderCard.tsx`:**
```tsx
// setup_in_progress kartı (design.md §6.3):
// Soluk thumbnails
// "⚠ Kurulum yarım kaldı" badge
// [Devam et →]  [Sil] butonları
// Normal toggle ve status buton yok

// Normal kartlara kebab menü (design.md §6.4):
// Hover'da ⋮ belirir
// Dropdown: Detay (mock toast), Yeniden adlandır (inline rename), Dışa aktar, Arşivle, Sil
// Arşivle/Sil → window.confirm (Phase 7'de styled dialog'a yükseltilir)
// Rename: inline text input kart başlığında

// Tab bar güncellemesi (LibraryStep):
// Tümü | Aktif | Taslak | Üretim sürüyor | Arşiv
```

**`Videos.tsx`:**
```tsx
// handleResumeFolder(folderId): setup_in_progress klasörünü açar
// handleDeleteFolder(folderId): klasörü listeden çıkarır (confirmation)
// handleRenameFolder(folderId, newName): isim güncellenir
```

**Acceptance criteria:**
- [ ] Kampanya kartında hover → ⋮ görünüyor
- [ ] Dropdown menü çalışıyor
- [ ] Arşivle/Sil confirmation soruyor (window.confirm)
- [ ] setup_in_progress kart "Devam et" ve "Sil" butonları gösteriyor
- [ ] "Devam et" → kullanıcıyı bıraktığı adıma götürüyor
- [ ] "Üretim sürüyor" tab eklendi
- [ ] `npm run build` hatasız

**Verification checklist:**
- [ ] `npm run build` ✓
- [ ] Kebab menü açılıyor ✓
- [ ] Dropdown aksiyon'ları çalışıyor ✓
- [ ] setup_in_progress kart görünümü ✓
- [ ] Devam et → doğru stage ✓

**What not to touch:** `GenerateReviewStep.tsx`, `ExportStep.tsx`, `ConfirmStep.tsx`

**Risk level:** Medium — FolderCard genişletiliyor; mevcut toggle mantığı korunuyor

---

### Phase 7 — Supporting UX Patterns

**Goal:** Cross-cutting UX pattern'lerini ve eksik UI elementleri ekle. Her sub-task bağımsız.

**Gaps addressed:** G-07 (onboarding), G-08 (wallet panel), G-17 (confirmation dialog), G-20 (skeleton), G-23 (empty states), G-24 (ilk kampanya mesajı), G-26 (min genişlik blocker)

**Sub-tasks (her biri bağımsız, sırayla yapılır):**

#### 7a — Confirmation Dialog Component
```tsx
// Yeni: src/components/ui/ConfirmDialog.tsx (shadcn Dialog üzerine)
// Props: open, title, description, confirmLabel, confirmVariant ("default"|"destructive"), onConfirm, onCancel
// Replaces: window.confirm() kullanımları
// Önce component yazılır, sonra Videos.tsx ve FolderCard'da window.confirm() değiştirilir
```

#### 7b — Wallet Panel
```tsx
// WalletPanel.tsx (popover/dropdown)
// TokenBadge tıklanınca açılır
// İçerik: bakiye, bu hafta/bu ay harcama, son işlem tarihi, "Geçmişi gör" + "Token al" (mock toast)
// MOCK_SPENDING sabiti kullanılır (Phase 0'da eklendi)
```

#### 7c — Onboarding Banner + How It Works Modal
```tsx
// OnboardingBanner.tsx:
// localStorage.getItem("has_seen_video_intro") yoksa catalog ekranı üstünde görünür
// Banner: başlık + "Nasıl çalışır?" + "Anladım, başlayalım" + ✕
// Kapatınca localStorage.setItem("has_seen_video_intro", "true")

// HowItWorksModal.tsx:
// 3 sekme: Önce/Sonra | 3 adımda | SSS
// "Nasıl çalışır?" → modal açar (banner'dan ve topbar'dan)
// SSS içeriği design.md §3.2'den
```

#### 7d — Skeleton Loading States
```tsx
// SelectStep'te mount sırasında 300ms sonra ürünler görünür — bu sürede 10 satır shimmer
// LibraryStep'te mount sırasında 300ms → 6 kart shimmer
// TemplateSelectionStep → 4 kart skeleton
// Renk: bg-muted animate-pulse
```

#### 7e — Empty State Pattern
```tsx
// Mevcut empty state'ler design.md §2.9 formatına getirilir:
// SelectStep: filtre sonucu boş + katalog boş (farklı)
// LibraryStep: mevcut empty state zaten var, gözden geçirilir
// Her state: 64px ikon + başlık + açıklama (max 2 satır) + opsiyonel CTA
```

#### 7f — First Campaign Success Message
```tsx
// SuccessStep.tsx:
// localStorage.getItem("has_completed_first_campaign") yoksa:
// "🎉 Bu senin ilk video kampanyan! Library'den her zaman tekrar gözden geçirebilirsin."
// localStorage.setItem("has_completed_first_campaign", "true")
// Confetti animasyonu: CSS keyframes, prefers-reduced-motion respect
```

#### 7g — Minimum Desktop Width Blocker
```tsx
// AppShell.tsx'e eklenir:
// useWindowSize hook veya CSS media query
// <1280px → full-screen overlay:
// "Bu özellik şu an sadece desktop'ta kullanılabilir."
// "En az 1280px ekran genişliği gerekiyor."
// Zaman değil responsive fix — sadece blocker
```

**Acceptance criteria (toplu):**
- [ ] Confirmation dialog styled, window.confirm() kaldırıldı
- [ ] Wallet panel açılıp kapanıyor, mock data gösteriyor
- [ ] Onboarding banner ilk girişte görünüyor, localStorage'a yazıyor
- [ ] How it works modal 3 sekme çalışıyor
- [ ] Skeleton animasyonları görünüyor (300ms delay)
- [ ] Empty state'ler tek tip görünümde
- [ ] İlk kampanya sonrası 🎉 mesajı görünüyor
- [ ] <1280px → blocker görünüyor
- [ ] `npm run build` hatasız

**Risk level:** Low — her sub-task bağımsız, mevcut ekranları bozmaz

---

### Phase 8 — Optional Polish

**Goal:** Öncelik sırasında en sona bırakılan iyileştirmeler. Design.md'de tanımlı ama akış için kritik değil.

**Gaps addressed:** G-09 (filtre paneli), G-10 (history warning), G-12 (video player modal), G-18 (edit prompt presets), G-19 (kalan mock veri), G-21 (klavye kısayolları), G-22 (browser notification), G-25 (accessibility)

**Sub-tasks:**

#### 8a — Gelişmiş Filtre Paneli (G-09)
```tsx
// FilterPanel.tsx: Marka multi-select, Kategori multi-select, Item group ID text,
// Görsel sayısı range, Video geçmişi toggle. SelectStep'te "[Filtre]" butonu.
```

#### 8b — Geçmiş Uyarısı (G-10)
```tsx
// ProductCard list view'da son sütun: videoHistory varsa amber history ikon
// Hover tooltip: kampanya adı, tarih, "Kampanyayı gör"
// products.ts'de videoHistory[] alanı (Phase 0'da eklendi)
```

#### 8c — Video Player Modal (G-12)
```tsx
// VideoPlayerModal.tsx: 1000×700px modal
// Progress bar, full-screen, frame-step (◁/▷), hız seçimi, ses toggle
// Aksiyon butonları: onayla/reddet/düzenle
// Önceki/sonraki video navigasyonu
```

#### 8d — Edit Prompt Preset Kategoriler (G-18)
```tsx
// EditPromptStep.tsx: 4 kategori pill grid
// Ortam (8), Hareket (7), Işık (5), Kıyafet vurgusu (6)
// "Önceki versiyon" dropdown — previousVersions[] array kullanılır
```

#### 8e — Browser Notification (G-22)
```tsx
// ConfirmStep'te notifyOnComplete checkbox (Phase 3'te eklendi)
// GenerateReviewStep'te: tüm üretim bitince new Notification(...)
```

#### 8f — Klavye Kısayolları (G-21)
```tsx
// useKeyboardShortcuts hook: A (approve), R (reject), E (edit), Space (play/pause)
// GenerateReviewStep'te aktif, modal açıkken devre dışı
```

#### 8g — Accessibility Pass (G-25)
```tsx
// Focus ring: 2px solid #7F77DD tüm interactive element'lerde
// aria-label, aria-busy, role="alert" toast'larda
// Modal focus trap
// WCAG AA contrast kontrol
```

**Risk level:** Low — hepsi bağımsız, mevcut akışı değiştirmiyor

---

## 5. Phase Detail Summary

| Phase | Goal | Gaps | Risk | Complexity |
|-------|------|------|------|------------|
| 0 | State + veri temeli | G-02,03,05,19 (kısmi) | Low | Small |
| 1 | Modal + StepIndicator | G-03, G-04 | Low-Med | Small |
| 2 | Template ekranı | G-05, G-06 | Medium | Medium |
| 3 | Confirm step | G-01 | Low | Medium |
| 4 | Generate-Review birleşik | G-02, G-13 | High | Large |
| 5 | Export kanal-toggle | G-14 | Medium | Medium |
| 6 | Library iyileştirmeleri | G-15, G-16 | Medium | Medium |
| 7 | UX pattern'ler | G-07,08,17,20,23,24,26 | Low | Small×7 |
| 8 | Opsiyonel polish | G-09,10,12,18,21,22,25 | Low | Varied |

---

## 6. Component Map

| Bileşen | Mevcut Durum | Phase 0 Sonrası | Final Rol |
|---------|-------------|-----------------|-----------|
| `CampaignNameModal.tsx` | Sadece isim | — | Phase 1'de 4 alanlı forma dönüşür |
| `StepIndicator.tsx` | 6 adım, static | — | Phase 1'de 5 adım, clickable |
| `SelectStep.tsx` | Grid/list toggle | Stage: "catalog" | Tablo formatına (Phase 8a) |
| `ProductCard.tsx` | Grid + list | — | History warning (Phase 8b) |
| `TemplateSelectionStep.tsx` | Grid + sidebar | — | Phase 2'de sadece grid + ek not |
| `TemplateCard.tsx` | Info popover | — | Phase 2'de preview modal |
| `TemplateActionBar.tsx` | Bottom bar | — | Phase 2'de kaldırılır |
| `GuidedPromptFields.tsx` | Template sidebar | — | Phase 2'de Campaign Modal'a taşınır |
| `GenerationProgressStep.tsx` | Ayrı ekran | — | Phase 4'te GenerateReviewStep'e birleşir |
| `ReviewStep.tsx` | Ayrı ekran | — | Phase 4'te GenerateReviewStep'e birleşir |
| `ReviewVideoCard.tsx` | 3 state | — | Phase 4'te generating state eklenir |
| `VideoProgressCard.tsx` | Progress kart | — | Phase 4'te GenerateReviewStep içinde reuse |
| `EditPromptStep.tsx` | Full-page | — | Phase 8d'de preset kategoriler |
| `ExportStep.tsx` | Feed-attribute | — | Phase 5'te kanal-toggle |
| `ExportFeedCard.tsx` | Feed kart | — | Phase 5'te yerini ChannelToggleCard alır |
| `SuccessStep.tsx` | Sabit mesaj | — | Phase 7f'de ilk kampanya mesajı |
| `LibraryStep.tsx` | 4 tab | — | Phase 6'da 5 tab |
| `FolderCard.tsx` | Toggle button | — | Phase 6'da kebab menü + setup_in_progress |
| `TokenBadge.tsx` | Balance + spent | — | Phase 7b'de WalletPanel tetikler |
| `AppShell.tsx` | Sidebar | — | Phase 7g'de min-width blocker |
| `CostEstimateBar.tsx` | Sticky bar | — | Korunur (catalog sticky bar) |
| `StackedImageIndicator.tsx` | Image count | — | Korunur |
| Yeni: `ConfirmStep.tsx` | — | — | Phase 3 |
| Yeni: `GenerateReviewStep.tsx` | — | — | Phase 4 |
| Yeni: `ChannelToggleCard.tsx` | — | — | Phase 5 |
| Yeni: `ConfirmDialog.tsx` | — | — | Phase 7a |
| Yeni: `WalletPanel.tsx` | — | — | Phase 7b |
| Yeni: `OnboardingBanner.tsx` | — | — | Phase 7c |
| Yeni: `HowItWorksModal.tsx` | — | — | Phase 7c |
| Yeni: `VideoPlayerModal.tsx` | — | — | Phase 8c |
| Yeni: `FilterPanel.tsx` | — | — | Phase 8a |
| `EntryStep.tsx` | Unused | — | Korunur, import'tan çıkarılmış zaten |
| `SendStep.tsx` | Unused | — | Korunur |
| `PreviewStep.tsx` | Unused | — | Korunur |
| `GenerateDialog.tsx` | Unused | — | Korunur |

---

## 7. Scope Boundaries

Aşağıdakiler **kesinlikle kapsam dışıdır:**

- Gerçek AI video üretimi
- Gerçek API veya backend servisi
- Database veya kalıcı storage (localStorage dışında)
- Kullanıcı kimlik doğrulama (auth)
- Gerçek Meta/Google/TikTok kanal gönderimi
- Gerçek token satın alma (sadece mock toast)
- Gerçek kanal hesabı bağlama (sadece mock toast)
- Mobil breakpoint desteği
- Text overlay editörü / Dynamic Creative
- 1000+ ürün bulk generation
- Multi-language support
- Telemetri/analytics
- Ekip işbirliği/paylaşma
- A/B test modu
- Kullanıcı tarafından şablon oluşturma
- `design.md` dışında tanımlanmayan herhangi bir özellik

---

## 8. Open Questions

Aşağıdaki konular `design.md`'de belirsiz kalmış veya prototip implementasyonunda netleştirilmesi gereken seçimler:

| # | Soru | Etki | Varsayım (bloke etmez) |
|---|------|------|------------------------|
| OQ-1 | Phase 4'te video state (generating/pending_review/...) `Videos.tsx`'te mi yoksa `GenerateReviewStep`'te local mi tutulmalı? | State yönetimi mimarisi | `Videos.tsx`'te tutulur — diğer ekranlar (export, success) video sayısına ihtiyaç duyar |
| OQ-2 | Template screen'den Guided prompts tamamen kaldırılıyor — Campaign modal'a taşınan sektör/tema bilgisi şablon seçimine etki ediyor mu (recommended badge dışında)? | Phase 2 UI | Sadece recommended badge — kullanıcı sektöre bakılmaksızın istediği şablonu seçebilir |
| OQ-3 | `setup_in_progress` kampanya localStorage'da nasıl saklanır? Her field mi yoksa stage mi? | Phase 6 persistence | `{ stage, selectedProductIds, campaignName, campaignContext }` JSON olarak saklanır |
| OQ-4 | Phase 4'te "Tümünü yeniden üret" token maliyeti: sadece pending_review olanlar mı, yoksa tüm videolar mı yeniden üretilir? | Token hesaplama | Sadece pending_review ve failed olanlar |
| OQ-5 | Export'ta "Atla" ile gidilen success ekranında kaç video "gönderildi" sayılır? | Success screen copy | 0 — "N video taslak olarak kaydedildi" |

---

## 9. Prototype Acceptance Criteria (End-to-End)

Tüm fazlar tamamlandığında şu happy path hatasız çalışmalı:

1. `/videos` açılır → ürün kataloğu (30 ürün) görünür
2. Onboarding banner görünür (ilk giriş)
3. 3 ürün seçilir → sticky bar güncellenir
4. "Şablon seç →" → Campaign Setup Modal açılır
5. Kampanya adı + sektör girilir → "Şablona geç →"
6. Template ekranı açılır → 4 şablon yeni isimlerle görünür
7. Şablon seçilir → ek not girilir → "Devam →"
8. Confirm ekranı: özet kartlar + bakiye doğru
9. "Üretimi başlat" → generate-review ekranı
10. Kartlar sırayla generating → pending_review geçiyor
11. İlk hazır videoya onayla tıklanıyor → footer güncelleniyor
12. "Dışa aktar →" aktifleşiyor → export ekranı
13. Meta toggle → seçili, "Gönder →" → 2 sn delay → success
14. Success ekranında kampanya özeti görünüyor
15. "Kampanyalarım" → library açılır → yeni kampanya kartı görünür

---

## 10. Notes on Existing Unused Components

Aşağıdaki bileşenler mevcut codebase'de var ama artık route edilmiyor. Bu implementasyon boyunca **silinmeyecekler** — git history korunur:

- `EntryStep.tsx` — eski giriş ekranı
- `PreviewStep.tsx` — eski review (carousel)
- `GenerateDialog.tsx` — eski template dialog
- `SendStep.tsx` — eski export (channel toggle, Phase 5'te referans alınabilir!)
- `GenerateCostConfirm.tsx` — eski maliyet widget (Phase 3'te referans alınabilir!)

> **Not:** `SendStep.tsx` ve `GenerateCostConfirm.tsx` Phase 5 ve Phase 3 için iyi referans noktalarıdır. Sıfırdan yazmak yerine mevcut kod incelenmeli.