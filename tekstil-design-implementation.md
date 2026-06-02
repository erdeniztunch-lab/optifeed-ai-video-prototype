# tekstil-design-implementation.md

Spec: `tekstil-design.md`
Yaklaşım: Her phase bağımsız, build + lint sonrası durur. Bir sonraki phase için açık onay gerekir.

---

## Genel Kural

- Mevcut generic `TemplateSelectionStep` ve `TemplateCard` dokunulmaz
- `Videos.tsx` routing/state değişmez
- Her phase sonunda `npm run build` + `npm run lint` — 0 yeni issue
- Em dash (—) kullanıcıya görünen hiçbir copy'de yer almaz

---

## Phase TI-0 — Veri Katmanı

**Kapsam:** Tip tanımları ve tekstil şablon verileri. UI yok, görsel değişiklik yok.

### Değiştirilecek Dosya: `src/types/video-flow.ts`

`TemplateId` union'ına 4 tekstil ID'si eklenir:

```ts
export type TemplateId =
  | "vitrine-bakan-kadin"
  | "paris-yuruyen-kadin"
  | "bahce-bulusmasi"
  | "product-spotlight"
  | "sokakta-yuruyen-kiz"
  | "magaza-yazan-kiz"
  | "plajda-yuruyen-kiz"
  | "ziplayanKiz";
```

### Yeni Dosya: `src/data/textile-templates.ts`

```ts
import { type TemplateId } from "@/types/video-flow";

export interface TextileTemplateDefinition {
  id: TemplateId;
  label: string;
  sceneContext: string;      // kart body alt satırı
  sceneType: string;         // kart chip: "Sokak" | "Mağaza" | "Plaj" | "Dinamik"
  previewVideo: string;      // /templates/... MP4 yolu
  recommendedSectors: string[];
  details: {
    scenarioFlow: string;    // popover — senaryo akışı paragrafı
    suitableProducts: string[]; // popover — uygun ürün chip'leri
    accessories: string;     // popover — aksesuar notu
  };
}

export const TEXTILE_TEMPLATES: TextileTemplateDefinition[] = [
  {
    id: "sokakta-yuruyen-kiz",
    label: "Sokakta Yürüyen Kız",
    sceneContext: "Alışveriş sokağında yürüyüş, vitrin duraklama anı",
    sceneType: "Sokak",
    previewVideo: "/templates/A_stylish_young_woman_walking.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken alışveriş sokağının ucundan yürüyüşe başlar ve kameraya doğru ilerler. Bir vitrin önünde 1-2 saniye durarak kıyafeti ön ve arka açıdan gösterir. Kameraya dönerek bitiş karesini tamamlar.",
      suitableProducts: ["Elbise", "Üst Giyim", "Dış Giyim", "Takım"],
      accessories: "Opsiyonel: marka çantası, gözlük",
    },
  },
  {
    id: "magaza-yazan-kiz",
    label: "Mağaza Yazan Kız",
    sceneContext: "Mağaza cephesi önü, marka detay odağı",
    sceneType: "Mağaza",
    previewVideo: "/templates/A_fashionable_young_woman_stan.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken marka yazılı bir mağaza cephesi önünden yavaşça geçer. Elindeki küçük çanta kadraja belirginleşir ve kıyafet detayları öne çıkar. Durarak kameraya bakar.",
      suitableProducts: ["Elbise", "Kombin Set", "Üst Giyim"],
      accessories: "Marka çantası (zorunlu senaryo unsuru), gözlük",
    },
  },
  {
    id: "plajda-yuruyen-kiz",
    label: "Plajda Yürüyen Kız",
    sceneContext: "Sahil ortamı, kumaş hareketi ve doğal ışık",
    sceneType: "Plaj",
    previewVideo: "/templates/A_young_woman_walking_barefoot.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken sahil şeridinde yürür; hafif esinti kumaşı hareket ettirir. Durarak güneşe döner ve kıyafetin akışı ile rengi doğal ışıkta belirginleşir.",
      suitableProducts: ["Yazlık Elbise", "Pareo", "Plaj Giyim", "Hafif Kumaşlar"],
      accessories: "Opsiyonel: gözlük, şapka",
    },
  },
  {
    id: "ziplayanKiz",
    label: "Zıplayan Kız",
    sceneContext: "Dinamik hareket, kumaş dokusu ve enerji",
    sceneType: "Dinamik",
    previewVideo: "/templates/A_young_energetic_woman_captur.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken kameraya doğru koşup zıplar; kumaşın hareketi ve dokusu bu karedebel irginleşir. Yere inerek gülümser ve kameraya bakar.",
      suitableProducts: ["Casual", "Activewear", "Günlük Giyim", "Spor"],
      accessories: "Minimal aksesuar önerilir",
    },
  },
];
```

### Kabul Kriterleri

- `npm run build` geçer
- `npm run lint` 0 yeni issue
- Mevcut generic TEMPLATES verisi dokunulmamış
- 4 yeni TemplateId union'da tanımlı

---

## Phase TI-1 — TextileTemplateCard Bileşeni

**Kapsam:** Yeni kart bileşeni. `TextileTemplateSelectionStep` henüz yok — bu phase sadece bileşeni oluşturur.

### Yeni Dosya: `src/components/videos/TextileTemplateCard.tsx`

**Props:**
```ts
interface Props {
  template: TextileTemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}
```

**Görsel alan (3:4 portrait, video hover):**
- `useRef<HTMLVideoElement>` ile video kontrolü
- `onMouseEnter`: `videoRef.current?.play()`
- `onMouseLeave`: `videoRef.current?.pause(); videoRef.current.currentTime = 0`
- Video her zaman DOM'da, `muted loop playsInline`, `preload="metadata"`
- Aspect ratio: `aspect-[3/4]`

**Kart yapısı:**

```tsx
<div role="button" tabIndex={0} onClick={onSelect} onKeyDown={...}
  className={cn(
    "group flex flex-col overflow-hidden rounded-2xl border text-left transition-all cursor-pointer",
    selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-foreground/20 hover:shadow-sm"
  )}
  onMouseEnter={() => videoRef.current?.play()}
  onMouseLeave={() => { videoRef.current?.pause(); if (videoRef.current) videoRef.current.currentTime = 0; }}
>
  {/* Görsel alan */}
  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
    <video
      ref={videoRef}
      src={template.previewVideo}
      muted loop playsInline preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Seçim indikatörü — sağ üst */}
    <div className={cn(
      "absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
      selected ? "border-primary bg-primary text-primary-foreground" : "border-white/80 bg-white/90 text-transparent"
    )}>
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </div>

    {/* Sol alt — sahne metadata + hover pill */}
    <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1 items-start">
      {/* Metadata chips — her zaman görünür */}
      <div className="flex items-center gap-1">
        <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
          {template.sceneType}
        </span>
        <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
          8-10 sn
        </span>
      </div>
      {/* Önizle pill — sadece hover'da */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
        ▶ Önizle
      </span>
    </div>

    {selected && <div className="absolute inset-0 bg-primary/8" />}
  </div>

  {/* Kart body */}
  <div className={cn("flex flex-col gap-1 p-3", selected && "bg-accent/30")}>
    <div className="flex items-start justify-between gap-2">
      <p className="font-semibold text-foreground">{template.label}</p>
      {/* Info popover — Phase TI-1'de placeholder, TI-4'te doldurulur */}
      <TextileInfoPopover template={template} />
    </div>
    <p className="text-xs text-muted-foreground">{template.sceneContext}</p>
    <div className="mt-1 flex flex-wrap gap-1">
      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
        Önerilen
      </span>
      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        {template.sceneType}
      </span>
    </div>
  </div>
</div>
```

**TextileInfoPopover içeriği:**

```tsx
<Popover>
  <PopoverTrigger asChild>
    <button type="button" onClick={(e) => e.stopPropagation()}
      className="shrink-0 rounded-md p-1 text-primary/60 transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none"
      aria-label={`${template.label} hakkında daha fazla bilgi`}
    >
      <Info className="h-4 w-4" />
    </button>
  </PopoverTrigger>
  <PopoverContent side="right" align="start" className="w-72 p-4">
    <p className="mb-3 text-sm font-semibold text-foreground">{template.label}</p>

    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
      Senaryo akışı
    </p>
    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
      {template.details.scenarioFlow}
    </p>

    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
      Uygun ürün tipi
    </p>
    <div className="mb-3 flex flex-wrap gap-1">
      {template.details.suitableProducts.map((p) => (
        <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          {p}
        </span>
      ))}
    </div>

    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        Aksesuar
      </p>
      <p className="text-xs text-muted-foreground">{template.details.accessories}</p>
    </div>
  </PopoverContent>
</Popover>
```

### Kabul Kriterleri

- Kart 3:4 portrait oranında render edilir
- Hover'da video oynar, mouse-leave'de durur ve başa döner
- Sol altta scene chip'leri ve "▶ Önizle" pill görünür (pill sadece hover'da)
- Sağ üstte selection indicator çalışır
- "Önerilen" rozeti her kartta görünür
- Info popover açılır, senaryo akışı + ürün tipleri + aksesuar gösterir
- `npm run build` + `npm run lint` geçer

---

## Phase TI-2 — TextileTemplateSelectionStep Bileşeni

**Kapsam:** Tam tekstil şablon seçim ekranı. Henüz ana akışa bağlanmaz.

### Yeni Dosya: `src/components/videos/TextileTemplateSelectionStep.tsx`

**Props:** Generic `TemplateSelectionStep` ile aynı imza:
```ts
interface Props {
  products: Product[];
  campaignContext: CampaignContext;
  onContinue: (opts: { template: TemplateId; templateNote: string }) => void;
  onBack: () => void;
}
```

**State:**
```ts
const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
const [addBag, setAddBag] = useState(false);
const [addGlasses, setAddGlasses] = useState(false);
```

**templateNote hesaplama:**
```ts
const templateNote = [
  addBag ? "Marka çantası eklendi." : "",
  addGlasses ? "Aksesuar (gözlük) eklendi." : "",
].filter(Boolean).join(" ");
```

**Ekran yapısı:**

```tsx
<div className="mx-auto max-w-4xl px-6 py-8 pb-28 md:px-10">

  {/* Header */}
  <header className="mb-2">
    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sahneyi seçin</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Her sahne 8-10 saniye olup kıyafeti farklı açılardan gösterir.
    </p>
  </header>

  {/* Kampanya özeti */}
  <div className="mb-6">
    {summaryParts.length > 0 ? (
      <p className="text-xs text-muted-foreground/70">{summaryParts.join(" · ")}</p>
    ) : <div className="h-4" />}
  </div>

  {/* Tekstil bilgi bannerı */}
  <div className="mb-6 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
    <div>
      <p className="text-xs font-medium text-foreground">
        Bu şablonlar Moda &amp; Giyim sektörüne özel hazırlanmıştır.
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        En iyi sonuç için ürününüzün ön, arka ve yan fotoğraflarını yüklediğinizden emin olun.
      </p>
    </div>
  </div>

  {/* 2x2 Grid */}
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
    {TEXTILE_TEMPLATES.map((t) => (
      <TextileTemplateCard
        key={t.id}
        template={t}
        selected={selectedTemplate === t.id}
        onSelect={() => setSelectedTemplate(t.id)}
      />
    ))}
  </div>

  {/* Sahne özelleştir */}
  <div className="mb-6 rounded-xl border border-border bg-card p-4">
    <p className="mb-3 text-sm font-medium text-foreground">
      Sahne özelleştir{" "}
      <span className="ml-1 text-xs font-normal text-muted-foreground">(opsiyonel)</span>
    </p>
    <div className="space-y-2.5">
      <label htmlFor="add-bag" className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
        <input
          id="add-bag"
          type="checkbox"
          checked={addBag}
          onChange={(e) => setAddBag(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Marka çantası ekle
      </label>
      <label htmlFor="add-glasses" className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
        <input
          id="add-glasses"
          type="checkbox"
          checked={addGlasses}
          onChange={(e) => setAddGlasses(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Aksesuar (gözlük) ekle
      </label>
    </div>
  </div>

  {/* Sabit alt bar */}
  <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{products.length} ürün</span>
        {selectedDef && <> · {selectedDef.label}</>}
      </p>
      <div className="flex items-center gap-2">
        {!selectedTemplate && (
          <p className="hidden text-xs text-muted-foreground/60 sm:block">
            Devam etmek için bir sahne seçin
          </p>
        )}
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Geri
        </Button>
        <Button disabled={!selectedTemplate} onClick={handleContinue}>
          Devam →
        </Button>
      </div>
    </div>
  </div>
</div>
```

**summaryParts** generic ekranla aynı mantıkta: `SECTORS`, `THEMES`, `PRODUCT_TYPES`'tan label çek, `filter(Boolean).join(" · ")`.

**selectedDef:** `TEXTILE_TEMPLATES.find((t) => t.id === selectedTemplate)`

### Kabul Kriterleri

- Header "Sahneyi seçin" gösteriyor
- Tekstil bilgi bannerı görünür
- 2×2 grid 4 TextileTemplateCard render eder
- Sahne özelleştir checkbox'ları çalışır
- Devam butonu template seçilmeden disabled
- Geri butonu çalışır
- `onContinue` doğru `{ template, templateNote }` ile çağrılır
- `npm run build` + `npm run lint` geçer

---

## Phase TI-3 — Dallanma (Ana Akışa Entegrasyon)

**Kapsam:** `TemplateSelectionStep.tsx`'e sector branch eklenir. Bu phase tamamlandığında Moda & Giyim seçen kullanıcı yeni ekranı görür.

### Değiştirilecek Dosya: `src/components/videos/TemplateSelectionStep.tsx`

Dosyanın başına import ekle:
```tsx
import { TextileTemplateSelectionStep } from "./TextileTemplateSelectionStep";
```

`TemplateSelectionStep` fonksiyonunun ilk return'ünden önce:
```tsx
if (campaignContext.sector === "tekstil") {
  return (
    <TextileTemplateSelectionStep
      products={products}
      campaignContext={campaignContext}
      onContinue={onContinue}
      onBack={onBack}
    />
  );
}
```

Bu iki satır dışında `TemplateSelectionStep.tsx`'e dokunulmaz.

### Kabul Kriterleri

- CampaignModal'da "Moda & Giyim" seçilip devam edildiğinde TextileTemplateSelectionStep açılır
- Diğer sektörlerde generic ekran değişmeden çalışır
- Happy path (generic flow) bozulmamış
- `npm run build` + `npm run lint` geçer

---

## Dosya Özeti

| Phase | Yeni dosya | Değiştirilen dosya |
|---|---|---|
| TI-0 | `src/data/textile-templates.ts` | `src/types/video-flow.ts` |
| TI-1 | `src/components/videos/TextileTemplateCard.tsx` | — |
| TI-2 | `src/components/videos/TextileTemplateSelectionStep.tsx` | — |
| TI-3 | — | `src/components/videos/TemplateSelectionStep.tsx` |

---

## Uygulama Sırası ve Onay Kuralı

Tek seferde yalnızca bir phase implement edilir. Sonraki phase için açık onay gerekir.

```
TI-0 → onay → TI-1 → onay → TI-2 → onay → TI-3
```
