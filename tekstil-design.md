# tekstil-design.md — Tekstil Şablon Ekranı UI/UX Tasarım Spesifikasyonu

---

## 1. Tasarım Kararının Gerekçesi

Mevcut `TemplateSelectionStep` jenerik bir ekrandır: statik Unsplash görselleri, soyut şablon isimleri, serbest metin kutusu. Tekstil sektörü bu mantıkla çalışmaz. Kullanıcı şablonu seçerken zihninde somut bir sahne canlanmalıdır. Şablon seçimi aynı zamanda bir senaryo seçimidir.

Bu spec, sector = `tekstil` olduğunda devreye girecek ayrı şablon ekranı deneyimini tanımlar.

---

## 2. Genel Ekran Yapısı

```
[Header: "Sahneyi seçin"]
[Kampanya özeti chips]
[Tekstil bilgi bannerı]
[2×2 Şablon grid — textile cards]
[Sahne özelleştir — structured checkboxes]
[Sabit alt bar — değişmez]
```

Sabit alt bar (geri / devam), routing, state değişmez. Tek fark: serbest metin alanı kalkar, structured özelleştirme gelir.

---

## 3. Header

| | Mevcut | Tekstil |
|---|---|---|
| Başlık | "Şablon seçin" | "Sahneyi seçin" |
| Alt başlık | "Ürünlerinize en uygun video senaryosunu seçin." | "Her sahne 8-10 saniye olup kıyafeti farklı açılardan gösterir." |

---

## 4. Tekstil Bilgi Bannerı

Grid üstünde, genel info note'un yerini alır:

```
[ℹ] Bu şablonlar Moda & Giyim sektörüne özel hazırlanmıştır.
    En iyi sonuç için ürününüzün ön, arka ve yan fotoğraflarını yüklediğinizden emin olun.
```

Stil: `bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs`
İkon: `Info` (lucide), muted renk.

---

## 5. Şablon Kartı — Yeni Anatomisi

### 5.1 Görsel Alan

| Parametre | Generic | Tekstil |
|---|---|---|
| Oran | `aspect-video` (16:9) | `aspect-[3/4]` (portrait) |
| Idle | Statik ürün fotoğrafı | Lifestyle model fotoğrafı (statik) |
| Hover | Scale 1.02 | `<img>` opacity 0 → `<video>` SAMPLE_VIDEO fade-in (200ms), autoPlay muted loop |

**Sol alt köşe overlay — sahne metadata:**
- Mekan etiketi: "Alışveriş Sokağı", "Plaj" vb.
- Süre: "8-10 sn"
- Stil: `bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm`
- Flex row, gap-1, absolute bottom-2 left-2

**Hover overlay:**
Sol altta `▶ Önizle` pill belirir (`bg-white/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full`). Kullanıcıya videonun oynadığını sinyal eder.

**Sağ üst:** Seçim indikatörü — mevcut gibi, değişmez.

### 5.2 Kart Body

```
[Senaryo adı — font-semibold]        [Info popover butonu]
[Sahne bağlamı — text-xs text-muted-foreground]
[Önerilen chip] [Sahne tipi chip]
```

**Sahne bağlamı** tek satır, örnek: `"Alışveriş sokağında yürüyüş, vitrin duraklama anı"`

**Sahne tipi chip** (her şablona özel):
`"Sokak"` / `"Mağaza"` / `"Plaj"` / `"Dinamik"`
Stil: `bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full`

### 5.3 Info Popover — Tekstil'e Özel İçerik

Generic popover alanları: `whenToUse`, `strengths[]`, `avoid`

Tekstil popover alanları:
- **Senaryo akışı** — kısa paragraf: kamera açısı, manken hareketi, duraklama anları
- **Uygun ürün tipi** — chip dizisi (Elbise, Üst Giyim, Dış Giyim vb.)
- **Aksesuar** — "Marka çantası · Gözlük" gibi notlar

---

## 6. Şablonlar — 4 Adet (2×2 Grid)

### T1 — "Sokakta Yürüyen Kız"
- **Sahne:** Alışveriş sokağı (Shopping Street)
- **Sahne bağlamı chip'i:** "Sokak"
- **Akış:** Manken uzaktan yürür → kameraya yaklaşır → vitrine bakarak duraklar (window shopping, 1-2sn) → döner, kıyafet ön/arka açıdan görünür
- **Aksesuar:** Opsiyonel — marka çantası, gözlük
- **Uygun ürün:** Elbise, üst giyim, dış giyim
- **Preview görsel:** Şehir sokağında yürüyen model, portrait crop

### T2 — "Mağaza Yazan Kız"
- **Sahne:** Mağaza cephesi önü
- **Sahne bağlamı chip'i:** "Mağaza"
- **Akış:** Manken mağaza önünde yürür → marka çantası kadraja girer → durur, kıyafeti gösterir → kameraya bakar
- **Aksesuar:** Marka çantası (zorunlu element), gözlük
- **Uygun ürün:** Kombin setler, marka görünürlüğü yüksek ürünler
- **Preview görsel:** Mağaza vitrini önünde model, çanta belirgin

### T3 — "Plajda Yürüyen Kız"
- **Sahne:** Sahil / açık hava doğal ortam
- **Sahne bağlamı chip'i:** "Plaj"
- **Akış:** Manken sahil yolunda yürür → hafif rüzgar etkisi, kumaş hareketi → durur, kıyafetin hareketi görünür
- **Aksesuar:** Opsiyonel — gözlük, şapka
- **Uygun ürün:** Yazlık, elbise, hafif kumaşlar, mayo/plaj giyim
- **Preview görsel:** Sahil ortamında model, doğal ışık

### T4 — "Zıplayan Kız"
- **Sahne:** Açık alan, kentsel arka plan
- **Sahne bağlamı chip'i:** "Dinamik"
- **Akış:** Manken zıplar → kıyafetin hareketi ve kumaş dokusu belirginleşir → iner → gülümser, kameraya bakar
- **Aksesuar:** Minimal
- **Uygun ürün:** Casual, activewear, spor, genç kitle
- **Preview görsel:** Dinamik poz, hareket hissi veren crop

**Tümü:** `recommendedSectors: ["tekstil"]` — sector = `tekstil` olduğunda 4 kart da "Önerilen" rozeti alır. Bu "bu ekran sana özel" hissini verir.

---

## 7. "Sahne Özelleştir" Bölümü

Mevcut serbest `<textarea>` kaldırılır. Yerine structured checkboxes:

```
Sahne özelleştir  (opsiyonel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Marka çantası ekle
[ ] Aksesuar (gözlük) ekle
```

- Stil: `rounded-xl border border-border bg-card p-4`
- Her checkbox: `flex items-center gap-2 text-sm text-foreground`, `<label htmlFor>` bağlantılı
- Seçimler `templateNote`'a structured string olarak append edilir: `"Marka çantası eklendi. Gözlük eklendi."` gibi
- `onContinue` prop imzası değişmez

---

## 8. Ekran Dallanması (Branching)

`TemplateSelectionStep.tsx` içinde sector kontrolü:

```tsx
if (campaignContext.sector === "tekstil") {
  return <TextileTemplateSelectionStep
    products={products}
    campaignContext={campaignContext}
    onContinue={onContinue}
    onBack={onBack}
  />;
}
// mevcut generic rendering devam eder
```

`Videos.tsx` routing ve state değişmez. Dallanma tamamen bileşen içinde kalır.

---

## 9. Hover Video — Prototip Uygulaması

Gerçek şablon videoları olmadığından prototipte tüm kartlar `SAMPLE_VIDEO` kullanır. Kullanıcı hover'da looping video görür — prototip için yeterli.

**Teknik:**
- Kart: `group` class (mevcut gibi)
- `<img>`: `opacity-100 group-hover:opacity-0 transition-opacity duration-200`
- `<video autoPlay muted loop playsInline>`: `opacity-0 group-hover:opacity-100 transition-opacity duration-200`, `absolute inset-0 w-full h-full object-cover`

---

## 10. Responsive

- Desktop (≥1280px): 2×2 grid, portrait cards — ana hedef
- Sidebar zaten 1280px min-width zorunlu kıldığından tekstil şablon ekranı pratikte yalnızca desktop'ta görülür
- 768-1279px arası: 2 sütun, portrait card yükseklikleri uzar — kabul edilebilir

---

## 11. Erişilebilirlik

- `<video>` elementi `aria-hidden="true"` — dekoratif, içerik taşımaz
- Kart: `role="button"` + `tabIndex={0}` + `onKeyDown` (mevcut gibi)
- Aksesuar checkboxları: `<label htmlFor>` zorunlu
- Hover-only video: klavye kullanıcısı focus aldığında da video oynayabilir (`group-focus-within:opacity-100`)

---

## 12. Tasarım Prensipleri Özeti

| | Generic Ekran | Tekstil Ekranı |
|---|---|---|
| İsimlendirme | Soyut ("Ürün odak sahnesi") | Hayal canlandıran ("Sokakta Yürüyen Kız") |
| Görsel format | 16:9, statik ürün | 3:4, lifestyle model, hover video |
| Kişiselleştirme | Serbest metin (300 karakter) | Structured checkboxes |
| Öneri mantığı | Sektöre göre 1-2 kart | Tüm kartlar önerilen |
| Bilgi katmanı (popover) | Teknik detay | Senaryo akışı |
| Info banner | "1:1 formatta üretilir" | Multi-image uyarısı |
| Header | "Şablon seçin" | "Sahneyi seçin" |
| Kart metadata | helperText chip | Mekan + süre overlay (video içinde) |
