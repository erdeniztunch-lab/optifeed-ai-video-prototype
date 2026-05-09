# feedback-implementation.md

## Frontend-Only Implementation Plan
### Validated Prototype: Eski Prototip → product.md

> **Kapsam:** Frontend-only. Backend yok, gerçek API yok, auth değişikliği yok.
> **Kaynak:** product.md (V1 Validated Prototype)
> **Referans:** Gap analysis (conversation context)

---

## Genel Strateji

Akış şu sıraya göre inşa edilecek: önce temel (veri modeli + stage machine), ardından her ekran sırasıyla. Her faz kendi içinde test edilebilir ve bir öncekine bağımlıdır.

**Toplam faz: 7**

```
Faz 0 — Temel: Veri modeli, mock data, stage machine, layout
Faz 1 — Library / Folder ekranı
Faz 2 — Product Selection (rework)
Faz 3 — Template Selection (rework: full page + guided fields)
Faz 4 — Generation Progress (yeni)
Faz 5 — Preview / Review + Edit Prompt (rework + yeni)
Faz 6 — Export / Send to Feed (rework: Apply to Exports)
Faz 7 — Bütünleştirme, SuccessStep, temizlik
```

---

## Faz 0 — Temel Altyapı

### Goal
Sonraki tüm fazların bağlı olduğu veri modeli, mock data ve stage machine'i hazırlamak. Herhangi bir ekran değişmeden önce bu faz tamamlanmalıdır.

### Screens Affected
- `src/pages/Videos.tsx` (stage machine)
- `src/data/products.ts` (veri modeli)
- `src/components/AppShell.tsx` (header)

### Components Affected
- `Videos.tsx` — stage tipi ve başlangıç stage'i
- `AppShell.tsx` — token badge için slot hazırlanacak
- `StepIndicator.tsx` — yeni step listesi

### New Mock Data Needed

**`src/data/products.ts` güncellemesi:**
```ts
export interface Product {
  id: string             // mevcut
  name: string           // mevcut
  brand: string          // mevcut
  image: string          // mevcut
  status: ProductStatus  // mevcut
  tags: ProductTag[]     // mevcut — korunacak ama filtre UI'dan kaldırılacak
  productId: string      // YENİ: "PRD-001" gibi harici ID
  itemGroupId: string    // YENİ: "GRP-SHOES-01" gibi item group
  category: string       // YENİ: "Sneakers", "Accessories" vb.
  additionalImageCount: number  // YENİ: ek görsel sayısı (0-5 arası mock)
}
```
12 mevcut ürüne yukarıdaki 4 alan eklenecek.

**`src/data/folders.ts` — yeni dosya:**
```ts
export interface VideoFolder {
  id: string
  name: string
  createdAt: string   // "2025-04-15" gibi
  videoCount: number
  status: "active" | "draft"
}

export const FOLDERS: VideoFolder[] = [
  // 2-3 örnek klasör (mock) — Anneler Günü Kampanyası, Yaz Koleksiyonu vb.
]
```

**`src/data/feedExports.ts` — yeni dosya:**
```ts
export interface FeedExport {
  id: string
  name: string
  channel: "google" | "meta" | "criteo"
  source: string          // "Shopify Feed (all collections)"
  productCount: number    // mock: 147
  selectedCount: number   // mock: 26
  videoAttribute: string  // seçili attribute — başlangıç default'u
}

export const FEED_EXPORTS: FeedExport[] = [
  // "Google Merchant Export", "Meta Export", "Meta Export (Copy)" vb.
  // Apply to Exports görselinden türetilmiş ~5 mock kayıt
]

export const VIDEO_ATTRIBUTE_OPTIONS = [
  "video_url",
  "g:video_link",
  "g:custom_label_4",
  "internal_video",
  "custom_label_0",
]
```

**`src/data/tokens.ts` — yeni dosya:**
```ts
export const MOCK_TOKEN_BALANCE = 500
export const TOKEN_COST_PER_VIDEO = 10
// 1 video = 10 token; 10 video = 100 token
// Tahmini süre: 1 video = ~2 dakika
```

### UI States Needed
- Stage machine yeni stage listesini tanımalı
- Token balance `Videos.tsx`'te `useState` ile tutulacak, tüketime göre düşecek

### What Will Be Changed

**`Videos.tsx`:**
- `Stage` tipi yeniden tanımlanacak:
  ```ts
  type Stage =
    | "library"
    | "select"
    | "template"
    | "progress"
    | "review"
    | "edit-prompt"
    | "export"
    | "success"
  ```
- Başlangıç stage: `"entry"` → `"library"`
- Token balance state ekleniyor: `const [tokenBalance, setTokenBalance] = useState(MOCK_TOKEN_BALANCE)`
- `editingProductId` state ekleniyor (hangi ürünün Edit Prompt'u açık)
- `folders` state ekleniyor (klasör listesi, mock)
- `approvedIds`, `rejectedIds` state'leri ekleniyor (review sonuçları)
- `getPreviousStage()` yeni stage listesine göre güncelleniyor
- `showStepBar` koşulu: `stage !== "library"` olacak

**`StepIndicator.tsx`:**
- Step dizisi güncelleniyor:
  ```ts
  const STEPS = ["Select", "Template", "Progress", "Review", "Export", "Done"]
  // 5 → 6 step (library entry point olduğu için sayılmaz)
  ```
- `current` prop değerleri yeni sıraya göre ayarlanacak

**`AppShell.tsx`:**
- Header'a sağ üste `{children}` slot veya `tokenBadge` prop ekleniyor — TokenBadge bileşeni Faz 1'de yazılacak

### What Will Not Be Changed
- `ui/` klasörü altındaki hiçbir bileşen
- `tailwind.config.ts`, `index.css`, `vite.config.ts`
- `cn()` utility, hooks
- Mevcut ürün verilerinin temel alanları (`id, name, brand, image, status`)
- `SAMPLE_VIDEO` URL sabit kalır

### Acceptance Criteria
- [ ] `Product` interface 4 yeni alan içeriyor, 12 ürünün tamamında dolu
- [ ] `FOLDERS` mock array en az 2 klasör içeriyor (biri boş state testi için yok sayılabilir)
- [ ] `FEED_EXPORTS` mock array en az 4 kayıt içeriyor
- [ ] `Videos.tsx` içinde stage `"library"` ile başlıyor, console'da hata yok
- [ ] `StepIndicator` yeni 6 step'i doğru render ediyor
- [ ] Uygulama çalışıyor (mevcut akış kırılmadı — geçici olarak `"library"` stage boş bir `<div>` render edebilir)

---

## Faz 1 — Library / Folder Ekranı

### Goal
Kullanıcının üretime kampanya bazlı organize edilmiş bir entry point'ten başlamasını sağlamak. EntryStep'in yerini alacak.

### Screens Affected
- **Library ekranı** — tamamen yeni (`LibraryStep.tsx`)
- AppShell header (TokenBadge ilk kez görünür)

### Components Affected
- `Videos.tsx` — `stage === "library"` artık `<LibraryStep>` render ediyor, `<EntryStep>` değil
- `EntryStep.tsx` — artık kullanılmıyor (silinmeyecek, import'tan çıkarılacak)

### New Mock Data Needed
- Faz 0'da oluşturulan `FOLDERS` array kullanılacak
- "Empty state" testi için `FOLDERS = []` durumu da çalışmalı

### UI States Needed

**Klasör listesi (dolu state):**
- 2 kolonlu kart grid (masaüstü), 1 kolon (mobil)
- Her FolderCard: klasör adı, oluşturma tarihi, video sayısı, "Aç" ikonu

**Empty state:**
- Merkezi ikon + başlık: "Henüz video klasörünüz yok"
- Alt metin: "İlk videonuzu üretmek için bir klasör oluşturun."
- CTA: "İlk klasörü oluştur" butonu

**Yeni klasör oluştur:**
- "Yeni klasör" butonu (sağ üst veya empty state CTA'sı)
- Tıklandığında: inline isim girişi veya küçük Dialog — kullanıcı klasör adı yazar, onaylar
- Yeni klasör `folders` state'ine eklenir (frontend-only, persist etmez)

**Klasör açıldığında:**
- `stage = "select"` geçişi yapılır
- `activeFolderId` state'e set edilir

### What Will Be Changed
- `Videos.tsx`: `stage === "library"` → `<LibraryStep>` çağrısı
- `Videos.tsx`: `stage === "entry"` satırı kaldırılıyor

**Yeni bileşenler:**
- `src/components/videos/LibraryStep.tsx`
  - Props: `folders`, `onOpenFolder(id)`, `onCreateFolder(name)`, `tokenBalance`
  - İçerik: FolderCard grid + "Yeni klasör" butonu + empty state
- `src/components/videos/FolderCard.tsx`
  - Props: `folder: VideoFolder`, `onOpen()`
  - İçerik: kampanya adı, tarih, video sayısı, ok ikonu
- `src/components/videos/TokenBadge.tsx`
  - Props: `balance: number`
  - Görünüm: "500 tokens" — küçük pill, mor/accent rengi
  - AppShell header'ına yerleştirilecek

### What Will Not Be Changed
- `SelectStep`, `GenerateDialog`, `PreviewStep`, `SendStep`, `SuccessStep` — bu fazda dokunulmaz
- `EntryStep.tsx` dosyası silinmez, sadece artık render edilmez
- Sidebar navigasyonu değişmez

### Acceptance Criteria
- [ ] Uygulama `"library"` stage ile açılıyor, EntryStep görünmüyor
- [ ] Dolu state: en az 2 klasör kartı görünüyor
- [ ] Empty state: `FOLDERS = []` iken yönlendirici mesaj ve CTA görünüyor
- [ ] "Yeni klasör oluştur" → isim girişi → klasör listeye ekleniyor
- [ ] Klasöre tıklandığında `stage = "select"` oluyor
- [ ] TokenBadge AppShell header'ında görünüyor, bakiye doğru
- [ ] Back butonu: SelectStep'ten "library"'e dönüyor

---

## Faz 2 — Product Selection Rework

### Goal
Ürün seçim ekranını product.md ile uyumlu hale getirmek: yeni metadata alanları, limit enforcement, maliyet/süre bar'ı, CTA etiketi değişikliği.

### Screens Affected
- Product Selection ekranı (`SelectStep.tsx`)

### Components Affected
- `SelectStep.tsx` — kapsamlı modifikasyon
- `ProductCard.tsx` — yeni alanlar + stacked indicator
- Yeni: `CostEstimateBar.tsx`
- Yeni: `StackedImageIndicator.tsx`

### New Mock Data Needed
- Faz 0'da eklenen `productId`, `itemGroupId`, `category`, `additionalImageCount` alanları kullanılacak
- `TOKEN_COST_PER_VIDEO` ve süre hesabı için `src/data/tokens.ts` kullanılacak

### UI States Needed

**Normal state (seçim yok):**
- Arama input'u aktif
- "Recently added" sort seçeneği görünür
- Sticky bar: "0 / 10 ürün seçildi" + CTA disabled

**Seçim yapılırken:**
- Her seçimde sticky bar anlık güncelleniyor:
  - `{n} / 10 ürün seçildi`
  - `Tahmini süre: ~{n × 2} dk`
  - `Tahmini maliyet: ~{n × 10} token`
- Bakiyeyle karşılaştırma: yeterli bakiye varsa yeşil, yetersizse amber uyarı

**Limit aşımı (10 ürün):**
- 10. ürün seçildikten sonra diğer kartlar disabled görünür (tıklanamaz)
- Sticky bar'da: "Maksimum seçime ulaştınız (10/10)"
- CTA aktif kalır

**0 seçim:**
- CTA "Choose template" disabled
- Sticky bar: seçim yapmaya yönlendiren mikrocopy

**Boş arama sonucu:**
- "Aramanızla eşleşen ürün bulunamadı" — boş state mesajı

### What Will Be Changed

**`SelectStep.tsx`:**
- Filtre tab'ları (`no-video / best-seller / recent`) **kaldırılıyor**
- Yerine: sağ üste "Sort: Recently added" dropdown (tek seçenek veya ileride genişletilebilir basit seçici)
- Grid/list view toggle **korunuyor** (product.md kapsam dışı yazmıyor)
- Seçim limiti: `selectedIds.length >= 10` iken yeni seçim engelleniyor; "Clear selection" ile sıfırlanabilir
- Sticky alt bar tamamen değişiyor → `<CostEstimateBar>` bileşenine çıkarılıyor
- CTA etiketi: `"Generate videos"` → `"Choose template"`
- CTA handler: `onContinue` prop adı → `onChooseTemplate` (anlamlı isim)
- "Select all" toggle: limit mantığıyla uyumlu hale getiriliyor (max 10 seçer)

**`ProductCard.tsx`:**
- Grid ve list view'da yeni alanlar ekleniyor:
  - `productId` (küçük, muted metin — "ID: PRD-001")
  - `itemGroupId` (küçük, muted metin — "Group: GRP-SHOES-01")
  - `category` (liste view'da sağ kolonda; grid'de tag olarak)
- `additionalImageCount > 0` ise `<StackedImageIndicator>` görselin üstüne overlay olarak ekleniyor

**Yeni: `CostEstimateBar.tsx`:**
- Props: `selectedCount`, `limit`, `tokenCostPerVideo`, `tokenBalance`
- Hesaplamalar:
  - `estimatedMinutes = selectedCount × 2`
  - `estimatedTokens = selectedCount × tokenCostPerVideo`
  - `hasEnoughBalance = tokenBalance >= estimatedTokens`
- Görünüm: `{n}/{limit} ürün | ~{dk} dk | ~{token} token`
- Token durumu: yeterli → yeşil badge, yetersiz → amber uyarı badge
- Sağ taraf: "Choose template" CTA butonu

**Yeni: `StackedImageIndicator.tsx`:**
- Props: `count: number`
- Görünüm: ürün görselinin sağ alt köşesinde küçük kart yığını ikonu + sayı
- Örnek: `⊞ +3` — iskambil kağıdı benzeri offset kart efekti
- `count === 0` ise render edilmez

### What Will Not Be Changed
- Arama input bileşeni ve arama mantığı (string match) korunuyor
- ProductCard'ın seçim/hover/aktif style mantığı korunuyor
- Grid/list view toggle korunuyor
- `useMemo` ile filtreleme yapısı korunuyor (filtre sadeleşiyor, silinmiyor)
- `PRODUCTS` array'inin 12 ürünü korunuyor

### Acceptance Criteria
- [ ] Filtre tab'ları görünmüyor
- [ ] Her ürün kartında `productId`, `itemGroupId`, `category` gösteriliyor
- [ ] `additionalImageCount > 0` olan ürünlerde StackedImageIndicator görünüyor
- [ ] 10 ürün seçilince 11. seçim engellenliyor, kullanıcıya mesaj gösteriliyor
- [ ] Sticky bar: seçim, süre, token maliyeti anlık güncelliyor
- [ ] Bakiye yetersizse amber uyarı görünüyor
- [ ] CTA "Choose template" yazıyor ve 0 seçimde disabled
- [ ] CTA tıklanınca `stage = "template"` oluyor

---

## Faz 3 — Template Selection Rework

### Goal
GenerateDialog'u dialog'dan full-page step'e dönüştürmek. 4 şablonu açık grid'de göstermek. Guided prompt alanları eklemek. Üretim öncesi maliyet teyidi sunmak.

### Screens Affected
- Template Selection ekranı — mevcut `GenerateDialog.tsx` yerini `TemplateSelectionStep.tsx` alıyor

### Components Affected
- `GenerateDialog.tsx` — artık kullanılmıyor (silinmez, sadece import'tan çıkarılır)
- `Videos.tsx` — `stage === "template"` yeni bileşeni render ediyor
- Yeni: `TemplateSelectionStep.tsx`
- Yeni: `TemplateCard.tsx`
- Yeni: `GuidedPromptFields.tsx`
- Yeni: `GenerateCostConfirm.tsx` (inline confirmation widget)

### New Mock Data Needed

**`src/data/templates.ts` — yeni dosya (GenerateDialog'daki sabit veriden türetilecek):**
```ts
export interface Template {
  id: TemplateId
  label: string
  description: string
  helperText: string
  previewImage: string
  // renderPreviewChrome kaldırılıyor — yeni TemplateCard bileşeni kendi chrome'unu yönetir
}

export type TemplateId = "product-spotlight" | "sale-promotion" | "new-arrival" | "social-story"

export const TEMPLATES: Template[] = [ /* mevcut 4 şablon */ ]
```

**`src/data/guidedPromptOptions.ts` — yeni dosya:**
```ts
export const SECTOR_OPTIONS = ["Moda & Giyim", "Ayakkabı", "Aksesuar", "Ev & Yaşam", "Elektronik", "Gıda", "Kozmetik"]
export const THEME_OPTIONS = ["Anneler Günü", "Ramazan", "Yaz Koleksiyonu", "İndirim Sezonu", "Yeni Sezon", "Özel Günler"]
export const BACKGROUND_OPTIONS = ["Beyaz fon", "Lifestyle", "Stüdyo", "Doğal ışık", "Gradient", "Şeffaf"]
export const PRODUCT_TYPE_OPTIONS = ["Tekil ürün", "Ürün grubu", "Kombine/Set", "Lifestyle kullanım"]
```

### UI States Needed

**Template grid (default):**
- 2×2 grid (masaüstü) / 1 kolon (mobil)
- Her TemplateCard: görsel preview + etiket + kısa açıklama + seçim indicator
- İlk açılışta `product-spotlight` seçili (varsayılan)
- Seçilen kart: `border-primary ring-2` gibi seçim state'i

**Guided prompt alanları (şablon kartının altında):**
- "Sektör" — dropdown (SECTOR_OPTIONS) — zorunlu değil
- "Tema / kampanya bağlamı" — dropdown (THEME_OPTIONS) + free text alanı
- "Background / concept" — dropdown (BACKGROUND_OPTIONS)
- "Ürün tipi" — dropdown (PRODUCT_TYPE_OPTIONS)
- Her alanda placeholder metin ve örnek değer gösterilecek
- Alanlar doldurulmadan da ilerlenilebilir (guided ama zorunlu değil)

**Maliyet teyidi (CTA öncesi, inline):**
- "Generate videos" butonunun üstünde:
  - `{n} video üretilecek`
  - `Tahmini süre: ~{n × 2} dk`
  - `Tahmini maliyet: {n × 10} token` — bakiyeden düşülecek
  - `Kalan bakiye: {balance - cost} token`
- CTA: "Generate videos →"

**Loading / transition state:**
- "Generate videos" tıklandığında buton disabled + spinner, ardından `stage = "progress"`

### What Will Be Changed

**`Videos.tsx`:**
- `stage === "generate"` satırı kaldırılıyor
- `stage === "template"` ekleniyor → `<TemplateSelectionStep>` render ediyor
- `handleGenerated(opts)` → `handleGenerate(opts: { template: TemplateId, guidedPrompt: GuidedPrompt })` olarak güncelleniyor
- `tokenBalance` üretim başlangıcında düşürülüyor: `setTokenBalance(b => b - selectedIds.length * TOKEN_COST_PER_VIDEO)`

**Yeni: `TemplateSelectionStep.tsx`:**
- Props: `products`, `tokenBalance`, `onGenerate(opts)`, `onBack()`
- State: `selectedTemplate: TemplateId`, `guidedPrompt: GuidedPrompt`
- Şablonları açık grid olarak render eder
- Guided prompt alanlarını render eder
- Maliyet teyidi widget'ı render eder
- "Generate videos" tıklandığında önce 300ms "başlatılıyor" efekti, ardından callback

**Yeni: `TemplateCard.tsx`:**
- Props: `template: Template`, `selected: boolean`, `onSelect()`
- Görünüm: görsel + label + description + seçim border'ı
- Seçili değilse hover efekti
- Gizli "Change" veya picker dialog yok — kart tıklandığında seçilir

**Yeni: `GuidedPromptFields.tsx`:**
- Props: `value: GuidedPrompt`, `onChange()`
- Sektör, tema, background, ürün tipi dropdown'larını render eder
- Tema alanında ek free text input (textarea, max 100 karakter)
- Preset seçildiğinde textarea'ya otomatik dolar (kullanıcı düzenleyebilir)

**Yeni: `GenerateCostConfirm.tsx`:**
- Props: `videoCount`, `tokenCostPerVideo`, `tokenBalance`
- Satır satır maliyet özeti gösterir
- Yetersiz bakiyede: kırmızı uyarı + CTA disabled

### What Will Not Be Changed
- 4 şablonun id'leri, label'ları, description'ları
- Şablon preview görsellerinin Unsplash URL'leri
- `SAMPLE_VIDEO` (progress ve preview'da hâlâ kullanılacak)
- `GenerateDialog.tsx` dosyası silinmez, sadece artık route edilmez

### Acceptance Criteria
- [ ] `stage === "template"` tam sayfa TemplateSelectionStep render ediyor
- [ ] 4 şablon açık grid'de görünüyor, dialog/picker yok
- [ ] Şablona tıklandığında seçili hale geliyor (ring efekti)
- [ ] Varsayılan seçili şablon: `product-spotlight`
- [ ] Guided prompt alanları render ediliyor, dropdown'lar çalışıyor
- [ ] Maliyet teyidi bölümü: video sayısı, süre, token, kalan bakiye doğru hesaplanıyor
- [ ] Yetersiz bakiyede CTA disabled ve uyarı görünüyor
- [ ] "Generate videos" → `tokenBalance` düşüyor, `stage = "progress"` oluyor
- [ ] Back butonu → `stage = "select"` oluyor

---

## Faz 4 — Generation Progress

### Goal
Sahte 1200ms delay'in yerine gerçekçi per-video async progress ekranı koymak. Her video sırasıyla "Pending → Generating → Ready" durumuna geçiyor. Kullanıcı tamamlanan videoları beklemeden izlemeye başlayabiliyor.

### Screens Affected
- Generation Progress ekranı — tamamen yeni (`GenerationProgressStep.tsx`)

### Components Affected
- `Videos.tsx` — `stage === "progress"` yeni bileşeni render ediyor
- Yeni: `GenerationProgressStep.tsx`
- Yeni: `VideoProgressCard.tsx`

### New Mock Data Needed
**Progress simulation sabitler (`src/data/tokens.ts` veya sabit olarak bileşen içinde):**
```ts
// Demo modunda gerçek 2dk beklenmez; her video 3 saniyede "tamamlanır"
export const DEMO_VIDEO_GENERATION_DELAY_MS = 3000
// İlk video 3s, ikinci video 6s, üçüncü video 9s (staggered)
```

Her tamamlanan video için `SAMPLE_VIDEO` URL atanır.

**Video progress state tipi:**
```ts
type VideoStatus = "pending" | "generating" | "ready"

interface VideoProgress {
  productId: string
  productName: string
  productImage: string
  status: VideoStatus
  videoUrl: string | null
}
```

### UI States Needed

**Genel ekran:**
- Başlık: "Videolar üretiliyor..."
- İlerleme: `{tamamlanan} / {toplam} video hazır`
- Tahmini kalan süre: `~{kalan × 2} dk` (demo'da anlık güncellenir)
- Alt bar: "Tamamlananları inceleyebilirsiniz"

**Pending kart:**
- Ürün görseli (sol, h-14 w-14)
- Ürün adı
- Durum: "Sırada bekliyor" — gri badge
- Sağ taraf: boş/placeholder alan

**Generating kart (aktif üretim):**
- Ürün görseli
- Ürün adı
- Durum: "Üretiliyor..." — mor badge + spinner/animasyon
- İlerleme bar animasyonu (CSS ile, gerçek % değil, sadece efekt)

**Ready kart:**
- Ürün görseli
- Ürün adı
- Durum: "Hazır ✓" — yeşil badge
- Sağ taraf: küçük video thumbnail (SAMPLE_VIDEO poster veya statik görsel)
- "İncele" butonu → ileride review ekranına scroll eder veya highlight yapar

**Tüm videolar hazır:**
- "Tüm videolar hazır!" banner'ı
- CTA: "Videoları incele →" — `stage = "review"` geçişi

**Erken geçiş (tümü bitmeden):**
- İlk video "ready" olur olmaz alt kısımda "İncelemeye başlayabilirsiniz" notu görünür
- Kullanıcı isterse beklemeden "Videoları incele" ye geçebilir
- Geçiş yapılınca kalan videolar arka planda (state'te) tamamlanmaya devam eder

### What Will Be Changed

**`Videos.tsx`:**
- `stage === "progress"` → `<GenerationProgressStep>` render ediyor
- `videoProgressList: VideoProgress[]` state ekleniyor
- `handleProgressComplete()` → tümü ready olunca veya kullanıcı geçiş yaparsa `stage = "review"`

**Yeni: `GenerationProgressStep.tsx`:**
- Props: `products`, `template`, `guidedPrompt`, `onComplete()`
- `useEffect` ile staggered setTimeout zinciri başlatılır:
  ```ts
  // Her ürün için sırasıyla: 0ms → "generating", 3000ms → "ready"
  // Sonraki ürün öncekinden 3000ms sonra başlar
  // Demo modu: gerçek 2dk değil, 3s/video
  ```
- Tüm videolar ready olunca veya kullanıcı tıklayınca `onComplete()` çağrılır
- Unmount'ta tüm timeout'lar temizlenir (`useRef` array)

**Yeni: `VideoProgressCard.tsx`:**
- Props: `progress: VideoProgress`
- Status'a göre farklı görünüm (pending/generating/ready)
- "Ready" durumunda "İncele" butonu aktif

### What Will Not Be Changed
- `TemplateSelectionStep`, `SelectStep`, `LibraryStep` — dokunulmaz
- `SAMPLE_VIDEO` URL — ready olan videolara atanır

### Acceptance Criteria
- [ ] `stage === "progress"` GenerationProgressStep render ediyor
- [ ] Videolar sırasıyla pending → generating → ready geçişi yapıyor (staggered, 3s/video demo)
- [ ] İlerleme sayacı ("2 / 5 video hazır") anlık güncelleniyor
- [ ] İlk video ready olunca "İncelemeye başlayabilirsiniz" notu görünüyor
- [ ] "Videoları incele" CTA tıklandığında `stage = "review"` oluyor
- [ ] Tüm videolar tamamlandıktan sonra otomatik olarak CTA beliriyor
- [ ] Back butonu yok (üretim başlandıktan sonra geri dönüş yok) veya uyarıyla soruluyor
- [ ] Unmount'ta timeout'lar temizleniyor, console'da hata yok

---

## Faz 5 — Preview / Review + Edit Prompt

### Goal
Tek video carousel'ın yerine tüm videoları liste/grid halinde gösteren, her video için Approve/Edit Prompt/Reject aksiyonları sunan ekranı inşa etmek. Reject ve Edit Prompt akışlarını işler hale getirmek.

### Screens Affected
- Review ekranı — `PreviewStep.tsx` köklü rework
- Edit Prompt ekranı — tamamen yeni (`EditPromptStep.tsx`)

### Components Affected
- `PreviewStep.tsx` — yapısal olarak yeniden yazılıyor
- `Videos.tsx` — `stage === "review"` ve `stage === "edit-prompt"` stage'leri
- Yeni: `EditPromptStep.tsx`
- Yeni: `ReviewVideoCard.tsx`

### New Mock Data Needed
- Faz 4'ten gelen `videoProgressList` (ready olanlar) kullanılacak
- Edit Prompt dropdown options `src/data/guidedPromptOptions.ts`'den gelecek
- Edit Prompt sonrası yeniden üretim: kısa 2s fake delay (tek video için)

### UI States Needed

**Review ekranı — liste görünümü (varsayılan):**
- Her video için `ReviewVideoCard` satırı
- Sol: ürün görseli + ürün adı + marka
- Orta: video player (kare, SAMPLE_VIDEO, muted autoplay loop)
- Sağ: Approve / Edit Prompt / Reject butonları
- Üst: "X / Y video onaylandı" sayacı
- Alt sticky bar: onay sayısı yeterliyse "Dışa Aktar →" CTA görünür

**Review ekranı — grid görünümü (opsiyonel toggle):**
- 2-3 kolonlu grid
- Her kart: video thumbnail + ürün adı + 3 aksiyon butonu

**Onaylanmış video:**
- Kart yeşil border veya "Onaylandı ✓" badge
- Approve butonu disabled (tekrar onaylanamaz)
- "Geri al" linki (opsiyonel)

**Reddedilmiş video:**
- Kart gri/muted görünüm, üstü çizili değil ama soluklaşmış
- "Reddedildi" badge
- Akış dışına çıkar (export'a gitmez)

**Edit Prompt açılışı:**
- `stage = "edit-prompt"` ile EditPromptStep açılıyor
- `editingProductId` state hangi ürünün düzenleneceğini belirliyor

**"Dışa Aktar" CTA:**
- En az 1 video onaylıysa görünür ve aktif
- Tüm videolar işlenmediyse: "Tüm videoları işlemeden devam edebilirsiniz" notu
- CTA tıklanınca `stage = "export"`

**EditPromptStep — tam ekran:**
- Üstte: hangi ürün için revize yapıldığı (görsel + ad)
- Mevcut şablon bilgisi
- Dropdown presetler (sektöre/şablona göre)
- Free text textarea (max 200 karakter, placeholder ile örnek prompt)
- Örnek prompt önerileri (tıklanınca textarea'ya dolar)
- Maliyet: "Bu revizyon {n} token kullanacak" — bakiye yeterli değilse uyarı
- CTA: "Yeniden üret" → kısa 2s fake delay → review'a döner, video "Ready" olarak güncellenir
- İptal: review'a döner, video durumu değişmez

### What Will Be Changed

**`Videos.tsx`:**
- `stage === "preview"` satırı kaldırılıyor
- `stage === "review"` → `<ReviewStep>` render ediyor
- `stage === "edit-prompt"` → `<EditPromptStep>` render ediyor
- `approvedIds: string[]` state'i — Approve tıklandığında eklenir
- `rejectedIds: string[]` state'i — Reject tıklandığında eklenir
- `editingProductId: string | null` state'i — Edit Prompt tıklandığında set edilir

**`PreviewStep.tsx` → yeniden yazılıyor:**
- Dosya adı: `ReviewStep.tsx` olarak rename edilebilir veya mevcut dosya yeniden yazılır
- Carousel yapısı tamamen kaldırılıyor
- Yerini liste/grid almaktadır
- "Approve + Regenerate" yerini "Approve / Edit Prompt / Reject" alıyor

**Yeni: `ReviewVideoCard.tsx`:**
- Props: `progress: VideoProgress`, `status: "pending" | "approved" | "rejected"`, `onApprove()`, `onEdit()`, `onReject()`
- Video player: `<video>` tag, `src={SAMPLE_VIDEO}`, muted, loop, autoPlay
- Approve → yeşil state, Edit → EditPromptStep açılır, Reject → gri state

**Yeni: `EditPromptStep.tsx`:**
- Props: `product`, `template`, `currentPrompt: GuidedPrompt`, `tokenBalance`, `tokenCostPerEdit`, `onRegenerate(newPrompt)`, `onCancel()`
- `tokenCostPerEdit = TOKEN_COST_PER_VIDEO` (aynı maliyet)
- "Yeniden üret" → 2s setTimeout → `onRegenerate()` çağrılır
- `tokenBalance` `Videos.tsx`'te düşürülür

### What Will Not Be Changed
- `GenerationProgressStep` — dokunulmaz
- `LibraryStep`, `SelectStep`, `TemplateSelectionStep` — dokunulmaz
- `SAMPLE_VIDEO` URL — video kaynağı değişmez

### Acceptance Criteria
- [ ] `stage === "review"` ReviewStep render ediyor
- [ ] Her video için Approve / Edit Prompt / Reject üç ayrı buton görünüyor
- [ ] Approve → video yeşil "Onaylandı" state'e geçiyor
- [ ] Reject → video "Reddedildi" state'e geçiyor, soluklaşıyor
- [ ] Edit Prompt tıklandığında `stage = "edit-prompt"` oluyor, doğru ürün gösteriliyor
- [ ] EditPromptStep: preset dropdown + free text çalışıyor
- [ ] EditPromptStep "Yeniden üret" → 2s delay → review'a dönüyor, video "hazır" görünüyor
- [ ] En az 1 onay varken "Dışa Aktar" CTA görünür ve aktif
- [ ] "Dışa Aktar" → `stage = "export"` oluyor
- [ ] Token balance Approve ve Edit Prompt sonrası doğru düşüyor

---

## Faz 6 — Export / Send to Feed

### Goal
SendStep'in toggle kartları yerine "Apply to Exports" pattern'ini uygulamak. Her feed kartı için video attribute dropdown + Apply butonu. ZIP indirme mock'u eklemek.

### Screens Affected
- Export ekranı — `SendStep.tsx` tamamen yeniden yazılıyor

### Components Affected
- `SendStep.tsx` → `ExportStep.tsx` olarak yeniden yazılıyor (veya dosya içi komple değiştirme)
- `Videos.tsx` — `stage === "send"` → `stage === "export"` olarak yeniden adlandırılıyor
- Yeni: `ExportFeedCard.tsx`
- `SuccessStep.tsx` — küçük güncelleme

### New Mock Data Needed
- Faz 0'da oluşturulan `FEED_EXPORTS` array kullanılacak
- `VIDEO_ATTRIBUTE_OPTIONS` dropdown seçenekleri
- Her `FeedExport` kaydında `appliedAt: string | null` state'i tutulacak (apply edildi mi)

### UI States Needed

**Export ekranı başlangıç:**
- Başlık: "Videoları feed'e uygula" veya "Apply to Exports"
- Alt başlık: `{n} onaylı video dışa aktarılmaya hazır`
- 2 kolonlu kart grid (masaüstü) / 1 kolon (mobil)
- Her feed kartı: pending/applied state

**Feed kartı (normal state):**
- Sol: kanal logosu (Google/Meta/Criteo ikonu veya emoji placeholder — gerçek logo SVG yoksa metin badge)
- Orta: export adı + feed kaynağı (alt metin) + ürün sayısı (mor badge)
- Sağ üst: "Video attribute" dropdown (başlangıç değeri feed'e özel default)
- Sağ alt: "Apply" butonu (mor, aktif)

**Feed kartı (applied state):**
- "Applied ✓" yeşil badge
- "Apply" butonu disabled veya "Tekrar uygula" linke dönüşür
- Dropdown hâlâ görünür (değiştirip tekrar apply edilebilir)

**"Apply All" butonu (opsiyonel — open question):**
- Tüm feed'lere tek tıkla uygula
- Tüm kartlar applied state'e geçer

**İndirme bölümü (kartların altında):**
- Başlık: "Videoları indir"
- "Tüm onaylı videoları indir (MP4, {n} dosya)" butonu — tekil MP4 indirme simülasyonu (SAMPLE_VIDEO)
- "ZIP olarak indir" butonu — mock: toast gösterir "ZIP hazırlanıyor... İndirme başladı" + tarayıcı SAMPLE_VIDEO indirme
- Her video için bireysel indirme linki (opsiyonel, liste halinde)

**Tamamlama durumu:**
- En az 1 feed'e apply yapıldıktan sonra "Tamamla" CTA görünür
- Hiç apply yapmadan "Atla ve tamamla" linki (mevcut "Skip for now" mantığı korunuyor)

### What Will Be Changed

**`Videos.tsx`:**
- `stage === "send"` → `stage === "export"` (rename)
- `handleSend(channels)` → `handleExport(appliedFeeds: string[])` (rename ve güncelleme)
- `sentTo` state → `exportedTo: string[]` (feed id'leri) olarak güncellenir

**`SendStep.tsx` → tamamen yeniden yazılıyor (dosya adı `ExportStep.tsx` yapılabilir):**
- Toggle kartlar kaldırılıyor
- Feed export kartları (ExportFeedCard) grid'i ekleniyor
- `feedStates: Record<string, { attribute: string, applied: boolean }>` local state
- "Apply All" opsiyonel toggle
- İndirme bölümü ekleniyor
- "Tamamla" + "Atla" CTA'ları

**Yeni: `ExportFeedCard.tsx`:**
- Props: `feed: FeedExport`, `applied: boolean`, `selectedAttribute: string`, `onAttributeChange(attr)`, `onApply()`
- Kanal ikonu: Google için `G` badge, Meta için `M`, Criteo için `C` — gerçek logo yoksa renkli text badge (mavi/mor/turuncu)
- Dropdown: `VIDEO_ATTRIBUTE_OPTIONS`
- Apply tıklandığında: kısa 500ms "uygulanıyor..." efekti → applied state

**`SuccessStep.tsx`:**
- `channels: SendChannel[]` prop → `exportedFeeds: string[]` (feed adları) olarak güncelleniyor
- `channelText` hesabı feed adlarından yapılacak
- "Create another video" → `stage = "library"` (mevcut: select'e gidiyordu)
- "View products" → `stage = "library"` (basit yönlendirme)
- "Go to feed" butonu: `stage = "library"` — placeholder

### What Will Not Be Changed
- ZIP ve indirme için `SAMPLE_VIDEO` URL kullanılmaya devam ediyor
- SuccessStep'in genel görünüm ve animasyonu korunuyor
- Token balance bu aşamada değişmez (export token gerektirmez)

### Acceptance Criteria
- [ ] `stage === "export"` ExportStep render ediyor
- [ ] Feed kartları grid halinde görünüyor (en az 4 mock feed)
- [ ] Her kartta kanal badge'i + isim + ürün sayısı + dropdown + Apply butonu var
- [ ] Dropdown değiştirilebiliyor
- [ ] Apply → 500ms efekti → "Applied ✓" state
- [ ] ZIP butonu tıklandığında toast gösteriliyor ve SAMPLE_VIDEO indiriyor
- [ ] En az 1 apply sonrası "Tamamla" CTA aktif
- [ ] "Atla ve tamamla" → `stage = "success"` oluyor
- [ ] "Tamamla" → `stage = "success"` oluyor
- [ ] SuccessStep'te "Create another video" → `stage = "library"` oluyor

---

## Faz 7 — Bütünleştirme & Temizlik

### Goal
Tüm fazların bir arada sorunsuz çalıştığını doğrulamak. Kalan küçük boşlukları kapatmak. Kullanılmayan kodları temizlemek.

### Screens Affected
- Tüm akış (library → select → template → progress → review → export → success → library)
- AppShell

### Components Affected
- `Videos.tsx` — son gözden geçirme
- `StepIndicator.tsx` — tüm stage → step mapping'i doğrulanacak
- `AppShell.tsx` — token badge son hali
- `EntryStep.tsx` — artık kullanılmıyor, dosya korunabilir veya arşivlenir
- `GenerateDialog.tsx` — artık kullanılmıyor, dosya korunabilir

### New Mock Data Needed
- Yok — tüm mock data önceki fazlarda oluşturuldu

### UI States Needed

**Tam akış testi — happy path:**
```
library (klasör seç veya oluştur)
  → select (5 ürün seç)
    → template (şablon seç, guided doldur)
      → progress (demo: 5 × 3s = 15s)
        → review (3 approve, 1 reject, 1 edit)
          → edit-prompt (revize → back to review)
        → export (2 feed'e apply, ZIP indir)
          → success
            → library (klasör güncellendi)
```

**Edge case'ler:**
- 1 ürün seçimi (minimum)
- 10 ürün seçimi (maksimum)
- Tüm videolar reddedildi → "Dışa Aktar" disabled
- Token yetersiz → template step CTA disabled
- Hiç feed'e apply yapılmadan "Atla ve tamamla"
- "Create another video" → library'e döndükten sonra akış yeniden başlatılabilmeli

### What Will Be Changed

**`Videos.tsx` son kontrol:**
- Tüm stage geçişleri ve handler'lar doğrulanacak
- Gereksiz kalan state'ler temizlenecek (örn. `sentTo` → `exportedTo`)
- Tüm prop geçişlerinin doğru olduğu kontrol edilecek

**`StepIndicator.tsx`:**
- `stage → step` mapping son kez doğrulanacak:
  ```ts
  const stageToStep: Record<Stage, number> = {
    library: 0,    // step bar gösterilmez
    select: 1,
    template: 2,
    progress: 3,
    review: 4,
    "edit-prompt": 4,  // review ile aynı step
    export: 5,
    success: 6,
  }
  ```

**Kullanılmayan bileşenler:**
- `EntryStep.tsx` — import'lardan çıkarılır, dosya korunur (git history)
- `GenerateDialog.tsx` — import'lardan çıkarılır, dosya korunur

**Back navigasyon son kontrol:**
```
library      → back yok (giriş noktası)
select       → library
template     → select
progress     → yok (veya "Üretim iptal edilsin mi?" dialog ile select)
review       → template (veya sadece akış ileriye gider)
edit-prompt  → review
export       → review
success      → library
```

**AppShell token badge:**
- `tokenBalance` prop olarak AppShell'e geçilecek veya context ile sarılacak
- Tüm akış boyunca güncel değer gösteriyor

### What Will Not Be Changed
- `ui/` klasörü
- CSS ve Tailwind konfigürasyonu
- Mock veri dosyaları (artık stabilize)

### Acceptance Criteria

**Happy path:**
- [ ] Library → Select → Template → Progress → Review → Export → Success → Library tam akışı hatasız tamamlanıyor
- [ ] Token bakiyesi üretimde ve edit'te doğru düşüyor
- [ ] StepIndicator her aşamada doğru step'i gösteriyor
- [ ] Back navigasyonu her aşamada çalışıyor

**Edge cases:**
- [ ] 10 ürün limiti doğru çalışıyor
- [ ] Tüm videolar reddedilince export CTA disabled
- [ ] Token yetersizse üretim başlamıyor
- [ ] 0 feed apply ile "Atla ve tamamla" çalışıyor
- [ ] "Create another video" library'e dönüyor ve yeni akış başlatılabiliyor

**Temizlik:**
- [ ] Console'da sıfır hata ve uyarı (tip hataları dahil)
- [ ] `EntryStep` ve `GenerateDialog` artık render edilmiyor
- [ ] Tüm `TODO`, hardcoded `"124 products"` gibi eski sabitler temizlendi veya dinamik mock ile değiştirildi

---

## Faz Özeti ve Bağımlılıklar

```
Faz 0 ──────────────────────────────────────────── (temel, tüm fazlar buna bağlı)
  │
  ├── Faz 1 (Library) ──────────────────────────── (Faz 0 gerekli)
  │     │
  │     └── Faz 2 (Product Selection) ──────────── (Faz 1 gerekli)
  │           │
  │           └── Faz 3 (Template Selection) ────── (Faz 2 gerekli)
  │                 │
  │                 └── Faz 4 (Progress) ──────────  (Faz 3 gerekli)
  │                       │
  │                       └── Faz 5 (Review/Edit) ── (Faz 4 gerekli)
  │                             │
  │                             └── Faz 6 (Export) ── (Faz 5 gerekli)
  │                                   │
  │                                   └── Faz 7 (Integration) ── (tümü gerekli)
```

## Bileşen Sayısı Özeti

| Kategori | Sayı |
|---|---|
| Yeni dosya / bileşen | 15 |
| Köklü rework (neredeyse yeniden yazılıyor) | 3 |
| Orta modifikasyon | 5 |
| Küçük güncelleme | 4 |
| Dokunulmayacak | ~35 |

## Kapsam Dışı Hatırlatması

Bu plan aşağıdakileri **içermez** (product.md Out of Scope):
- Gerçek AI video üretimi
- Backend / API entegrasyonu
- Auth değişikliği
- Aspect ratio seçimi (yalnızca 1:1)
- Text overlay editörü
- Scheduling
- Bulk upload
- E-posta / in-app bildirim
- Hover video preview (V2)
- Toplu video onaylama (tartışmalı, V1 sınırında — implement edilmeyecek)
