# OptiVideo — Frontend Prototype Design Spec (v2)

> **Kapsam:** Validated, frontend-only prototip. Gerçek API yok; mock data ile çalışır.
> **Öncelik:** Desktop öncelikli (≥1280px). Mobil MVP dışı.
> **Kaynak:** 3 discovery meeting notu + 2 feedback iterasyonu. Çelişki durumunda en son toplantı geçerlidir.
> **Bu sürümün getirdikleri:**
> - First-time user onboarding (inline hint + "Nasıl çalışır?" modal)
> - Çoklu görsel (multi-image) UX'inin netleştirilmesi
> - Brand / category / ID seviyesinde filtre + arama
> - Sistematik **loading**, **error** ve **empty** state pattern'i
> - **Draft / yarım kalan kampanya** recovery akışı
> - Geniş ekran player için kalite kontrol kapasiteleri (zoom, full-screen, frame-step)
> - **Confirmation dialog** pattern'i (destructive aksiyonlar için)
> - **Wallet / Token panel** (insufficient-balance, top-up pathway)
> - Browser bildirimi (üretim bittiğinde)
> - Accessibility baseline + klavye kısayolları
> - Animasyon / transition token'leri

---

## 0. Doküman Kullanım Notu

Bu doküman iki amaca hizmet eder:

1. **product.md ile karşılaştırma:** Akış, terminoloji ve sistem davranışlarındaki farkları görünür kılmak.
2. **Implementation list'e çevirme:** Her ekran ve global pattern, codebase ile gap analizine sokulup atomik task'lara bölünebilecek şekilde yapılandırıldı. Her ekranın altındaki "Implementation Notes" bölümü bu amaçla eklendi.

---

## 1. Kritik Tasarım Kararı — Ürün-First Giriş

Varsayılan giriş ekranı **ürün kataloğudur**. Library ikincil görünümdür; sidebar'dan erişilir.

Kullanıcının zihinsel modeli: *"Önce ürünü bul, sonra işlem yap."* Ürünleri görmeden kampanya oluşturmak istemez.

> Discovery'den karar: Eski varsayım "Kullanıcı önce klasör açar" reddedildi. Yeni varsayım: Kullanıcı kütüphaneden ürün filtreleyip seçer, sonra bu seçime isim verir (kampanya).

---

## 2. Global Tasarım Kararları

### 2.1 Bilgi Mimarisi & Sol Menü

```
Optifeed
├─ AI Studio (grup başlığı)
│  ├─ Video                           ← aktif feature
│  │   ├─ Ürünler                     ← varsayılan görünüm
│  │   └─ Kampanyalarım               ← ikincil
│  └─ Dynamic Creative                ← mevcut, ayrı feature
├─ Feed Sources
├─ ...
└─ [Token bölümü — sabit altta]
```

> **Not:** Toplantıda "AI Studio" grup başlığı altında tüm AI özelliklerinin toplanması kararlaştırıldı. Şu an Video tek aktif feature olduğu için grup görsel olarak görünür ama içeride sadece Video var. Dynamic Creative ileride buraya taşınacak (park edildi).

### 2.2 Adım Göstergesi (Step Indicator)

Kampanya adı pop-up'ı onaylandıktan sonra her ekranın üstünde görünür. **5 adım:**

```
① Ürün seç  →  ② Şablon  →  ③ Onayla  →  ④ Üret & İncele  →  ⑤ Gönder
```

| State | Görsel |
|-------|--------|
| Aktif | Mor dolu daire (#7F77DD) + bold etiket |
| Tamamlanan | Yeşil checkmark + normal etiket (clickable — o ekrana döner) |
| Bekleyen | Gri daire + muted etiket |

**Geri dönüş davranışı:**
- Tamamlanan adımlara tıklanabilir → o ekrana döner, state korunur.
- Aktif adımdan ilerideki adıma tıklamak disabled.
- Adım 4 (Üretim & İnceleme) başlatıldıktan sonra adım 1-3'e dönüş, gerçek backend'de mümkün olmaz (token harcandığı için). Prototipte UI açısından geri dönüşe izin verilir ama warning gösterilir: *"Üretim başladı. Geri dönerseniz ilerleme korunmaz."*

> **Neden 5 adım?** Üretim ve inceleme ayrı adımlar değildir. Videolar üretildikçe anında incelenebilir; "İncelemeye geç" gibi ara bir geçiş butonu yoktur.

### 2.3 UX Affordance — Her Ekranda Yönlendirme

Her ekranda üç katman:

**1. Adım göstergesi** (yukarıda tanımlı)

**2. Bağlamsal hint metni** — başlığın hemen altında, muted (#6B6B6B), tek satır:

| Ekran | Hint |
|-------|------|
| Ürün kataloğu | "Video üretmek istediğiniz ürünleri seçin. Ek görseli olan ürünler daha iyi sonuç verir." |
| Kampanya kurulum pop-up'ı | "Kampanya bilgilerini girin. Şablonu bir sonraki adımda seçeceksiniz." |
| Şablon seçimi | "Ürünlerinize en uygun video senaryosunu seçin." |
| Maliyet onayı | "Üretim başladıktan sonra token bakiyenizden düşülecektir." |
| Üret & İncele | "Videolar hazır oldukça inceleyebilirsiniz. Onay vermeden hiçbir video kanala gönderilmez." |
| Dışa aktarma | "Onaylanan videoları reklam kanallarınıza gönderin veya indirin." |
| Başarı | "Kampanyanızı görüntüleyebilir veya yeni bir kampanya oluşturabilirsiniz." |

**3. Disabled CTA açıklaması** — buton disabled olduğunda hemen altında veya tooltip içinde:

| Durum | Metin |
|-------|-------|
| Ürün seçilmedi | "Devam etmek için en az 1 ürün seçin" |
| 10 üzerinde ürün | "Bir kampanyada en fazla 10 ürün seçebilirsiniz" |
| Şablon seçilmedi | "Devam etmek için bir şablon seçin" |
| Kampanya adı boş | "Devam etmek için kampanya adı girin" |
| Sektör seçilmedi | "Sektör seçimi zorunludur" |
| Token yetersiz | "Bakiyeniz bu üretim için yetersiz" |
| Onaylı video yok | "Dışa aktarmak için en az 1 videoyu onaylayın" |
| Kanal seçilmedi | "Göndermek için en az bir kanal seçin" |
| Kanal bağlı değil | "Önce [Kanal adı] hesabını bağlayın" |

### 2.4 Token Bakiyesi Gösterimi

**Sol menünün altında — sabit "Cüzdan" bölümü** (her zaman görünür):

```
┌─────────────────────────┐
│ ⚡ Bakiye               │
│ 1,240 token             │  ← büyük, okunaklı (24px, semi-bold)
│ ─────────────────────── │
│ Bu oturum: −60 token    │  ← muted, 12px
│ ~ 24 dk kapasite        │  ← muted, 12px
│ [Token al →]            │  ← ghost button (MVP'de mock, dışarı linklemiyor)
└─────────────────────────┘
```

**Topbar'da — kompakt pill:** Bakiye + bolt ikonu. Tıklanınca panel açılır (bkz. §2.13 Wallet Panel).

**Açıklama satırı (cüzdan altında, küçük ?):** Hover'da tooltip — *"1 token ≈ 30 saniye video üretimi"*

### 2.5 Video Standardı

**8–10 saniye · 1:1 · 1080×1080px · ses yok.**

Video üzerine metin / fiyat / marka overlay'i AI tarafından **değil**, sonradan **Dynamic Creative modülü** tarafından eklenir. (Bu prototipte sadece raw video oynar.)

### 2.6 Statü Sistemleri

**Video statüleri:**

| Statü | Renk | Badge | Açıklama |
|-------|------|-------|----------|
| `generating` | Amber (#BA7517) | "Üretiliyor" | Üretim sürüyor |
| `pending_review` | Mor (#7F77DD) | "İncele" | Hazır, henüz incelenmedi |
| `approved` | Yeşil (#3B6D11 / bg #EAF3DE) | "Onaylandı" | Onaylandı |
| `rejected` | Kırmızı (#A12222 / bg #FBE0E0) | "Reddedildi" | Reddedildi — silinmez |
| `failed` | Kırmızı | "Üretim başarısız" | Hata; yeniden dene |
| `draft` | Gri | "Taslak" | Onaylandı, kanala gönderilmedi |
| `live` | Yeşil (canlı, animasyonlu nokta) | "Yayında" | Kanala gönderildi |

> **Önemli karar (Feedback 2):** Onaylanmayan veya reddedilmeyen videolar **silinmez**. Üretim biten her video kampanyada kalır. Kullanıcı token harcadığı için her çıktıya sonradan erişim hakkı vardır.

**Kampanya statüleri:**

| Statü | Açıklama |
|-------|----------|
| `setup_in_progress` | Kampanya kurulumu yarım (pop-up girildi, akış tamamlanmadı) — Library'de "Devam et" pathway'i ile gösterilir |
| `active` | Toggle açık, feed'e gönderilmiş |
| `draft` | Video var, kanala gönderilmemiş |
| `pending` | Üretim sürüyor veya onay bekleyen video var |
| `archived` | Toggle kapalı, feed'den çekildi |

### 2.7 Global Error Pattern'leri

Tüm error'lar şu sırayla denenir:

1. **Inline alert (recoverable)** — etkilenen alanın yanında, kullanıcının düzeltebileceği hatalar
2. **Toast (transient)** — anlık geri bildirim, otomatik kapanır
3. **Full-screen blocker (critical)** — uygulama kullanılamaz hale geldiğinde

**Toast pattern:**

| Tip | İkon | Renk | Otomatik kapanma |
|-----|------|------|-------------------|
| Success | ✓ | Yeşil | 4 sn |
| Info | i | Mavi | 4 sn |
| Warning | ⚠ | Amber | 6 sn |
| Error | ✕ | Kırmızı | 8 sn (manuel kapatılabilir) |

**Mesaj örnekleri:**

| Durum | Mesaj | Aksiyon (varsa) |
|-------|-------|-----------------|
| Token yetersiz | "Bakiyeniz bu üretim için yetersiz." | "Token al" |
| Üretim başarısız (tek video) | "Bir video üretilemedi. Yeniden deneyin." | "Yeniden dene" |
| Üretim başarısız (tümü) | "Üretim başlatılamadı. Harcanan token iade edildi." | "Tekrar dene" |
| Kanal gönderimi başarısız | "Meta'ya gönderilemedi. Bağlantıyı kontrol edin." | "Tekrar dene" / "Detay" |
| Network kesintisi | "Bağlantı yok. Tekrar deneniyor..." | (otomatik retry) |
| Session timeout | "Oturumunuz sona erdi. Tekrar giriş yapın." | "Giriş yap" |
| Beklenmedik hata | "Bir şeyler ters gitti. Tekrar deneyin." | "Tekrar dene" |

### 2.8 Loading State'leri

**Page-level loading:** Tam sayfa skeleton (sayfa açılır açılmaz).
**Section-level loading:** İlgili bölüm shimmer skeleton ile.
**Action-level loading:** Butonun içinde spinner + buton disabled. CTA metni "Yükleniyor..." olur.
**Background work (üretim):** Progress bar + canlı sayaç (bkz. Ekran 4).

**Skeleton kuralları:**
- Renk: `#F3F2FE` (placeholder), `#E5E5F8` (highlight) — sol→sağ akan shimmer.
- Animasyon süresi: 1.4 sn döngü.
- Boş bölümlere placeholder içerik gösterme (boş card'lar yerine).

### 2.9 Empty State Pattern'i

Her empty state aşağıdaki yapıya sahiptir:

```
[Illustration veya ikon, 64×64px, soluk renk]
[Başlık, 18px medium]
[Açıklama, 14px muted, 2 satırı geçmeyen]
[CTA — opsiyonel, primary ya da ghost]
[İkincil link — opsiyonel, "Nasıl çalışır?" gibi]
```

Tüm empty state'ler aşağıda ekran bazında listelendi.

### 2.10 Confirmation Dialog Pattern'i

Destructive veya geri alınamaz aksiyonlar onay ister:

**Trigger eden aksiyonlar:**
- Reddet (tek video) — *opsiyonel*, ilk reddetmede gösterilir, sonra "Bir daha sorma" işaretlenebilir
- Tümünü onayla (Ekran 4)
- Akıştan çıkış (kampanya kurulumu sürerken)
- Kampanya silme (Library)
- Kampanya arşivleme
- Edit prompt → yeniden üret (token harcanacak)

**Dialog yapısı:**

```
[Başlık — net, soru veya bildirim formunda]
[Açıklama — ne olacağını anlatır, sayısal değer varsa içerir]
[İptal (ghost)]  [Devam (primary veya destructive)]
```

**Örnek metinler:**

| Aksiyon | Başlık | Açıklama | CTA |
|---------|--------|----------|-----|
| Akıştan çıkış | "Kampanyayı kaydetmeden çık?" | "Seçimleriniz Library'de taslak olarak kaydedilecek. Daha sonra devam edebilirsiniz." | "Çık" / "Devam et" |
| Tümünü onayla | "{N} videoyu onayla?" | "Bu işlemden sonra videolar dışa aktarmaya hazır olacak. Sonradan tek tek reddedebilirsiniz." | "Onayla" |
| Yeniden üret | "Yeniden üretelim mi?" | "Bu işlem ~{N} token harcayacak. Eski video taslak olarak kalacak." | "Üret" |
| Kampanya sil | "{Kampanya adı}'nı sil?" | "Bu kampanyadaki tüm videolar silinir. Bu işlem geri alınamaz." | "Sil" (destructive kırmızı) |

### 2.11 Filtreleme & Arama Pattern'i

Ürün kataloğu ve Library'de paylaşılan pattern:

- **Search input:** ⌘K / Ctrl+K ile global arama açılır (MVP'de tek bağlamda).
- **Filter bar:** Pill'ler — multi-select destekler, seçilenler renkli.
- **Sort dropdown:** Tek select.
- **Sıfırla:** En az 1 filtre aktifse "Filtreyi sıfırla" linki sağda görünür.
- **Sayım:** Filtre sonucu count görünür (ör. *"24 ürün gösteriliyor"*).

### 2.12 Animasyon & Transition Token'leri

| Token | Süre | Easing | Kullanım |
|-------|------|--------|----------|
| `--motion-instant` | 100ms | `ease-out` | Hover, focus |
| `--motion-fast` | 200ms | `ease-out` | Buton state, modal open |
| `--motion-normal` | 300ms | `ease-in-out` | Card transitions, fade-in |
| `--motion-slow` | 500ms | `ease-in-out` | Page transitions, progress bar fill |
| `--motion-celebration` | 700ms | `cubic-bezier(.22,1,.36,1)` | Success state, completion |

**Reduced motion:** `prefers-reduced-motion: reduce` set olduğunda tüm animasyonlar 0ms'ye düşer.

### 2.13 Wallet / Token Paneli (Yeni)

Topbar'daki token pill'e tıklayınca dropdown panel açılır:

```
┌────────────────────────────┐
│ Bakiye                     │
│ 1,240 token                │
│ ────────────────────────── │
│ Bu hafta:    −340          │
│ Bu ay:       −1,120        │
│ Son işlem:   2 saat önce   │
│ ────────────────────────── │
│ [Geçmişi gör →]            │
│ [Token al →]               │
└────────────────────────────┘
```

**MVP'de:** "Geçmişi gör" ve "Token al" mock — toast ile *"Bu özellik yakında"* gösterir.
**Insufficient balance flow:** Bkz. Ekran 3.

### 2.14 Bildirim Sistemi (Yeni)

**In-app:**
- Toast (bkz. §2.7) — anlık feedback
- Inline alert — alanın yanında, kullanıcı düzeltebilir

**Browser notification:**
- Trigger: Üretim tamamlandı (Ekran 4)
- Permission ilk kez Ekran 3'te (üretim başlat öncesi) opsiyonel checkbox ile istenir: *"Üretim bittiğinde bana bildir"*
- Mesaj: *"Kampanyandaki videolar hazır. İncele →"*
- Click → kampanyaya geri döner

### 2.15 Klavye Kısayolları & Accessibility Baseline

**Global kısayollar:**

| Kısayol | Aksiyon |
|---------|---------|
| `Esc` | Modal/popup kapat (confirmation ile) |
| `⌘/Ctrl + K` | Arama aç |
| `⌘/Ctrl + Enter` | Primary CTA tetikle |
| `Tab` | Focus ilerlet |
| `Shift + Tab` | Focus geri |

**Ekran 4'e özel:**

| Kısayol | Aksiyon |
|---------|---------|
| `Space` | Aktif video play/pause |
| `A` | Aktif videoyu onayla |
| `E` | Aktif videoyu düzenle |
| `R` | Aktif videoyu reddet (confirmation) |
| `↑/↓` | Listede gez |

**Accessibility baseline:**
- Tüm interactive elementler keyboard reachable.
- Focus ring: 2px solid `#7F77DD`, 2px offset.
- Color contrast: WCAG AA (4.5:1 metin, 3:1 büyük metin & UI).
- Form elementlerinde label ya da `aria-label`.
- Loading state'lerde `aria-busy="true"`.
- Modal'larda focus trap.
- Toast'larda `role="status"` veya `role="alert"`.

### 2.16 Responsive Notu

MVP **kapsam dışı**. Minimum desteklenen genişlik **1280px**. Daha küçükte: *"Bu özellik şu an sadece desktop'ta kullanılabilir."* Full-screen blocker.

---

## 3. Onboarding & First-Time User (Yeni Bölüm)

### 3.1 İlk Giriş — Inline Hint Banner

Kullanıcı platforma ilk kez girdiğinde (localStorage'da `has_seen_video_intro` yok), ürün kataloğunun **üstünde** bir dismissible banner görünür:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎬  Ürünlerinden saniyeler içinde video reklam üret.        │
│     Önce ürün seç, sonra şablona karar ver.                 │
│                                                             │
│     [▶ Nasıl çalışır?]    [Anladım, başlayalım]    ✕       │
└─────────────────────────────────────────────────────────────┘
```

**Davranış:**
- Banner background: `#F3F2FE`, border-left: 4px solid `#7F77DD`.
- "Anladım" veya ✕ → banner kapanır, `has_seen_video_intro=true` set edilir.
- "Nasıl çalışır?" → §3.2 modal açılır.
- Banner kapansa bile sağ üstte küçük "Nasıl çalışır?" linki kalır (her zaman erişilebilir).

### 3.2 "Nasıl Çalışır?" Modal

**Yapı:** 3 sekmeli modal, hafif (700px genişlik).

**Sekme 1 — Önce / Sonra:**
- Sol: Statik ürün fotoğrafı (mannequin önden)
- Sağ: Aynı ürünün animasyonlu video preview'u (loop, 8 sn)
- Caption: *"Statik kataloğunuz, performans odaklı video reklama dönüşür."*

**Sekme 2 — 3 adımda:**
1. **Ürün seç** — kataloğundan video üretmek istediğin ürünleri seç (en fazla 10)
2. **Şablon belirle** — senaryo seç (örn. "Vitrine bakan kadın"), ek detay ekle
3. **Üret ve incele** — videoları onayla, reklam kanallarına gönder

**Sekme 3 — SSS:**
- *"Token nedir?"* — *"1 token ≈ 30 sn video üretimi. Bakiyeniz cüzdandan görünür."*
- *"Beğenmezsem?"* — *"Her video tek tek onaylanır. Beğenmediğinizi yeniden ürettirebilir veya reddedebilirsiniz."*
- *"Hangi kanallara gönderebilirim?"* — *"MVP'de Meta, Google Merchant ve TikTok Catalog destekleniyor."*
- *"Tek görsel yeterli mi?"* — *"Mümkün, ama ürünün çoklu görselleri varsa (arka, yan, detay) video kalitesi belirgin şekilde artar. Kataloğunuzdaki ek görseller otomatik kullanılır."*

**Footer:** "Kapat" (ghost) — modal kapanır, banner görünüyorsa açık kalır.

### 3.3 Empty Catalog İlk Deneyim

Kullanıcının hiç ürünü yoksa (Feed Sources bağlı değilse):

```
[Plug ikonu, soluk]
"Henüz ürün kataloğunuz yok."
"Video üretmek için önce bir feed kaynağı bağlamanız gerekiyor."
[Feed Sources'a git →]
[Demo veriyle dene →]   ← (MVP için: mock data yükler, sandbox modu)
```

### 3.4 İlk Başarılı Kampanya Sonrası

Kullanıcının ilk kampanyası tamamlandığında (Ekran 7), success ekranında ek satır:

> *"Bu senin ilk video kampanyan! 🎉 Library'den her zaman tekrar gözden geçirebilirsin."*

`has_completed_first_campaign=true` set edilir, bir daha gösterilmez.

---

## 4. Ekran 1 — Ürün Kataloğu (Varsayılan Giriş)

### 4.1 Amaç

Kullanıcının platforma ilk girişinde karşılaştığı ekrandır. Katalogu görür, filtreler, ürün seçer; kampanya oluşturma buradan başlar.

### 4.2 Layout

**Sol menü:** (§2.1)
- AI Studio grup başlığı
- Video (aktif) — alt sekmeler: **Ürünler** (default) | **Kampanyalarım**
- Menü altı sabit token bölümü (§2.4)

**Topbar:**
- Breadcrumb: `Optifeed › AI Studio › Video`
- Sağda: Token pill + "Nasıl çalışır?" linki + kullanıcı avatarı

**Başlık alanı:**
- Başlık: "Ürünler" (24px semi-bold)
- Hint: *"Video üretmek istediğiniz ürünleri seçin. Ek görseli olan ürünler daha iyi sonuç verir."*
- Sağda: Arama input'u (genişleyen, default 240px, focus'ta 360px)

**Filtre bar:**
```
[Tümü] [Video yok] [Hazır video var] [En çok satan] [Son eklenenler]
       │
       Sağda: Sıralama [Son eklenen ▾]    [Filtreyi sıfırla]
```

**Gelişmiş filtre (yeni — Feedback 2):**

Search input'un yanında bir `[Filtre]` butonu — tıklanınca panel açılır:

| Filtre | Tip | Seçenekler |
|--------|-----|------------|
| Marka | multi-select | Feed'den çekilir |
| Kategori | multi-select | Feed'den çekilir |
| Item group ID | text input | Eşleşen değer girilebilir |
| Görsel sayısı | range | 1 / 2-3 / 4+ |
| Stok durumu | toggle | Stokta / Tükendi |
| Video geçmişi | toggle | Daha önce üretildi / Hiç üretilmedi |

Panel altında: "Uygula" + "Temizle"

### 4.3 Ürün Tablosu

| Sütun | İçerik | Genişlik |
|-------|--------|----------|
| Checkbox | Seçim | 40px |
| Görsel | Ana görsel 32×32px | 60px |
| Ek görsel | Stacked indicator (18×18px kutucuklar, −3px offset, "+N" ile) | 80px |
| Ürün adı | Ad (bold) + marka (muted, ikinci satır) | flex 2 |
| ID | Ürün ID (monospace, küçük) | 100px |
| Item group ID | Varyant grubu | 100px |
| Kategori | Ürün tipi | 120px |
| Video statüsü | "Video yok" (amber badge) / "Hazır" (yeşil badge) | 100px |
| Geçmiş uyarısı | `ti-history` amber ikon | 40px |

**Sıralama:** Sütun başlığına tıklamak o sütuna göre sıralar (clientside).

### 4.4 Çoklu Görsel (Multi-image) UX — Detay

> **Önemli (Feedback 2):** AI'ın ürünün arkasını, detayını, uzunluğunu doğru üretmesi için çoklu görsel kritiktir.

**Stacked görsel indicator:**
- 18×18px küçük kutucuklar, −3px offset ile yan yana dizilir
- Maksimum 3 thumbnail gösterilir, sonra "+N" badge
- Hover'da popover açılır → **görseller büyük thumbnail'larla listelenir**

**Görsel popover içeriği:**

```
Ek görseller (5)
[100×100 thumb] [100×100 thumb] [100×100 thumb]
[100×100 thumb] [100×100 thumb]

Her görselin altında küçük etiket:
"Ön", "Yan", "Arka", "Detay", "Model üzerinde" (feed'den varsa)

ⓘ Bu görseller video üretiminde otomatik kullanılır.
```

**Edge cases:**
- 1 görsel varsa: indicator sadece tek kutucuk, popover yok, hover'da küçük tooltip: *"Sadece 1 görsel — video kalitesi sınırlı olabilir"*
- 0 ek görsel ama ana görsel varsa: indicator "—"
- Görsel yüklenemezse: gri placeholder + ikon, *"Görsel yüklenemedi"* alt yazısı

### 4.5 Geçmiş Uyarısı

`ti-history` amber (#BA7517) ikon — daha önce bu ürün için video üretildiyse.

**Hover tooltip:**
```
Daha önce video üretildi
"Anneler Günü — Yazlık" kampanyasında, 12 Mart 2026
[Kampanyayı gör]
```

Kullanıcı yine de seçebilir; yalnızca bilgi amaçlı.

### 4.6 Seçim Davranışı

- **Tek tıklama:** Satıra tıklayarak seç/seçim kaldır.
- **Shift + click:** Aralık seçimi (ilk seçimden son tıklananaya kadar).
- **Ctrl/Cmd + A:** Görünür tüm ürünleri seç (10 limitine kadar).
- **Limit (10 ürün):** 10 dolduğunda sonraki satırların checkbox'ı disabled. Disabled satıra tıklamak inline alert: *"En fazla 10 ürün seçebilirsiniz."* Toast olarak gösterilir (4 sn).
- **Selected state:** Satır background `#EEEDFE`, sol border `3px solid #7F77DD`.

### 4.7 Sticky Bottom Bar

İlk seçimde slide-up ile belirir (200ms, `--motion-fast`):

```
┌────────────────────────────────────────────────────────────┐
│ 3 / 10 ürün seçildi                                        │
│ ~3 dk · ~24 token                                          │
│ ⓘ Bu aşamada ödeme alınmayacaktır                          │
│                                                            │
│ [Seçimi temizle]                       [Şablon seç →]      │
└────────────────────────────────────────────────────────────┘
```

- Sol: sayım + tahmini süre/maliyet (canlı güncellenir).
- Sağ: CTA "Şablon seç →"
- Disabled iken: hint görünür (*"Devam etmek için en az 1 ürün seçin"*).
- "Seçimi temizle" → confirmation, ardından tüm seçimleri kaldırır.

### 4.8 State'ler

**Loading (sayfa açılırken):**
- Tablo 10 satırlık shimmer skeleton.
- Filtre bar ve başlık görünür.

**Empty — Filtre sonucu boş:**
```
[Boş arama ikonu]
"Bu kriterlere uygun ürün bulunamadı."
"Filtreyi gevşetmeyi deneyin."
[Filtreyi sıfırla]
```

**Empty — Katalog tamamen boş:**
```
[Boş kutu ikonu]
"Henüz ürün kataloğunuz yok."
"Feed kaynağı bağlandıktan sonra ürünler burada görünecek."
[Feed Sources'a git →]    [Demo veriyle dene →]
```

**Error — Feed yüklenemedi:**
```
[Uyarı ikonu, kırmızı]
"Ürünler yüklenemedi."
"Bağlantınızı kontrol edin veya birkaç saniye sonra tekrar deneyin."
[Tekrar dene]
```

**Edge case — feed güncelleniyor (background sync):**
- Üstte ince ilerleme çubuğu (#7F77DD) + *"Yeni ürünler aranıyor..."* (5 sn).

### 4.9 Implementation Notes

- `localStorage`: `has_seen_video_intro`, `has_completed_first_campaign`, son kullanılan filtreler.
- Mock data: `src/data/products.ts` — en az 30 örnek ürün.
- Selection state: Context veya Zustand store (`selectedProductIds`).
- Filtre state: URL query params'a yansır (kalıcı paylaşılabilirlik).

---

## 5. Kampanya Kurulum Pop-up'ı (Modal)

"Şablon seç" tıklandığında açılır.

### 5.1 Yapı

**Modal başlığı:** "Kampanyanı tanımla"
**Hint:** *"Şablon seçimine geçmeden önce kampanya bilgilerini girin."*

**Form alanları:**

| Alan | Tip | Zorunlu | Validation |
|------|-----|---------|------------|
| Kampanya adı | Text input | ✓ | 3–60 karakter, unique değil ama benzer isim warning verir |
| Sektör | Dropdown | ✓ | Tekstil / Modest, Spor, Ev & Yaşam, Elektronik, Diğer |
| Kampanya teması | Dropdown | — | Anneler Günü, Ramazan, Yeni Sezon, İndirim, Gündelik, Diğer (text input açar) |
| Ürün tipi | Dropdown | — | Tekil ürün, Ürün seti, Görsel grubu |

**Footer:** "İptal" (ghost) + "Şablona geç →" (kampanya adı + sektör doluyken aktif)

### 5.2 Validation & Inline Errors

| Durum | Mesaj |
|-------|-------|
| Kampanya adı çok kısa | "En az 3 karakter girin" |
| Kampanya adı çok uzun | "En fazla 60 karakter olabilir" |
| Aynı adda kampanya var | "Bu adda bir kampanya zaten var — sorun değil, devam edebilirsin." (warning, blocker değil) |
| Sektör seçilmedi | (disabled CTA hint'i) |

### 5.3 Davranış

- **Açılış:** Modal background blur, focus ilk input'ta.
- **Kampanya adı placeholder:** *"Anneler Günü — Yazlık Koleksiyon"*
- **Tema "Diğer" seçilirse:** Açıklayıcı text input belirir (max 40 char).
- **Klavye:** `Enter` → CTA tetikler (form valid'se), `Esc` → confirmation ile çıkış.
- **Onay sonrası:** Modal kapanır, Ekran 2'ye geçilir. Adım göstergesi belirir.

### 5.4 Edge Cases

- **Kullanıcı modal'ı kapatırsa (Esc / ✕):** Confirmation dialog (§2.10) — seçimler ürün kataloğunda korunur, modal kapanır.
- **Browser back butonu:** Modal kapanır, ürün seçimine döner.
- **Tarayıcı kapanırsa:** Seçim state'i ve form değerleri localStorage'a otomatik save edilir (her input change'de debounced 500ms). Bir sonraki girişte Library'de "Devam et" pathway'i gösterilir.

> **Neden pop-up'ta?** Şablon seçimi öncesi bağlam bilgileri toplandığında, şablon önerisi daha anlamlı hale gelir ve şablon ekranı sade kalır (bağlam paneli gerekmez).

### 5.5 Implementation Notes

- Form state: React Hook Form veya benzeri.
- Persistence: `setup_in_progress` campaign objesi localStorage'a yazılır.
- Mock: dropdown seçenekleri `src/data/taxonomy.ts`.

---

## 6. Ekran 1b — Kampanyalarım (Library)

### 6.1 Nasıl Açılır

Sol menüdeki "Kampanyalarım" sekmesiyle. İçerik alanı değişir, topbar ve menü aynı kalır.

### 6.2 Layout

**Başlık:** "Kampanyalarım"
**Hint:** *"Oluşturduğunuz video kampanyalarını buradan yönetin."*
**Sağda:** "+ Yeni kampanya" (primary) → ürün kataloğuna döner

**Tab bar:** Tümü | Aktif | Taslak | Üretim sürüyor | Arşiv
**Arama:** Sağ üst — kampanya adına göre

**Kampanya kartı (3 sütunlu grid, kart genişliği 320px):**

```
┌──────────────────────────────────┐
│  [Stacked thumbnails 3 görsel]   │
│  ┌──┐┌──┐┌──┐                    │
│  └──┘└──┘└──┘                    │
│                                  │
│  Anneler Günü — Yazlık           │
│  ⓘ 8 video · Aktif               │
│                                  │
│  [Toggle: Aktif ●]   [⋮]         │
└──────────────────────────────────┘
```

- **Thumbnail:** 3 ürün görseli üst üste, 3px offset.
- **Statü badge:** Aktif (yeşil), Taslak (gri), Üretim sürüyor (amber, pulse animasyon), Arşiv (muted).
- **Toggle:** Aç/Kapa (Dynamic Creative pattern'i). Kapama → "archived"; Açma → "active" veya "draft".
- **Kebab menü (⋮):** Detay, Yeniden adlandır, Dışa aktar (mevcut videolar), Sil, Arşivle.

**Grid'in son öğesi:** Dashed "+" kart → ürün kataloğuna döner.

### 6.3 Resume / Devam Et (Yeni)

Bir kampanya `setup_in_progress` statüsünde ise kartı farklı görünür:

```
┌──────────────────────────────────┐
│  [Soluk thumbnails]              │
│                                  │
│  Anneler Günü — Yazlık           │
│  ⚠ Kurulum yarım kaldı           │
│                                  │
│  [Devam et →]    [Sil]           │
└──────────────────────────────────┘
```

- **Devam et:** Kullanıcıyı bıraktığı adıma götürür (ürün seçimi veya pop-up).
- **Sil:** Confirmation → kart kaldırılır.

### 6.4 Kart Quick Actions

Kart hover'da `[⋮]` belirir, tıklayınca dropdown:

| Aksiyon | Davranış |
|---------|----------|
| Detayı gör | Kampanya detay ekranına gider (Ekran 4 read-only versiyonu) |
| Yeniden adlandır | Inline edit modal |
| Dışa aktar | Ekran 6'ya gider (mevcut onaylı videolarla) |
| Arşivle | Confirmation → archived'a alınır |
| Sil | Destructive confirmation → kalıcı silinir |

### 6.5 Empty States

**Hiç kampanya yok:**
```
[Klasör ikonu]
"Henüz video kampanyanız yok."

3 adımda başlayın:
① Ürün seç   ② Şablon belirle   ③ Video üret

[İlk kampanyayı oluştur]    [Nasıl çalışır? →]
```

**Tab filtresi sonucu boş (örn. "Arşiv" boş):**
```
[Ufak ikon]
"Arşivde kampanya yok."
```

### 6.6 Loading & Error

- **Loading:** 6 kart shimmer skeleton.
- **Error:** Sayfa-level error (bkz. §2.7) — "Tekrar dene" CTA.

### 6.7 Implementation Notes

- Mock data: `src/data/campaigns.ts` — en az 4 farklı statüde örnek.
- Detay görünümü: Ekran 4'ün read-only versiyonu (aksiyonlar yok, sadece videolar listelenir).

---

## 7. Ekran 2 — Şablon Seçimi

### 7.1 Amaç

Sade ve odaklı. Bağlam bilgileri kampanya pop-up'ında toplandığı için bu ekran yalnızca şablon seçimine odaklanır.

### 7.2 Layout

**Adım göstergesi:**
```
✓ Ürün seç  →  ● Şablon  →  ○ Onayla  →  ○ Üret & İncele  →  ○ Gönder
```

**Topbar:**
- Breadcrumb: `... › [Kampanya adı] › Şablon seç`
- Sağda: "✕ Çıkış" (onay sorulur, seçimler korunur)

**Başlık alanı:**
- Başlık: "Şablon seçin"
- Hint: *"Ürünlerinize en uygun video senaryosunu seçin."*
- Kampanya özeti (küçük, muted): "[Sektör] · [Tema] · [Ürün tipi]"

### 7.3 Şablon Kartları (2×2 Grid)

Her kart:

```
┌────────────────────────────┐
│ [Preview alanı, 16:9]      │
│  (hover'da animasyon       │
│   oynar, 8 sn loop)        │
│                            │
│ Vitrine bakan kadın        │
│ Şıklık, duraklama anı      │
│                            │
│ ⚹ Tekstil için önerilen    │  ← rozet (opsiyonel)
└────────────────────────────┘
```

**State'ler:**
- **Default:** Border `0.5px solid var(--color-border-tertiary)`.
- **Hover:** Animasyon oynamaya başlar (CSS keyframes, döngü). Cursor pointer.
- **Selected:** Border `2px solid #7F77DD`, background `#EEEDFE`, hover'da animasyon durmaz.
- **Recommended badge:** Sektör eşleşmesiyle gelen "⚹ Tekstil için önerilen" — amber pill (sadece eşleşen şablonlarda).

**Click on preview alanı:** Genişletilmiş önizleme modal'ı açılır (yeni — Feedback 2'deki "fancy" preview talebine yanıt):

```
┌────────────────────────────────────────┐
│ Vitrine bakan kadın             ✕      │
│                                        │
│ [Büyük video preview, 600×600]         │
│ ▶ ⏸  ━━━●━━━  0:04 / 0:08              │
│                                        │
│ "Alışveriş caddesinde yürüyor,         │
│  vitrine bakıp duruyor. Ürün           │
│  duraklama anında net görünür."        │
│                                        │
│ [Bu şablonu seç →]                     │
└────────────────────────────────────────┘
```

### 7.4 MVP Şablon Listesi (Tekstil Odaklı)

| Şablon adı | Senaryo | Kilit özellik |
|------------|---------|---------------|
| Vitrine bakan kadın | Alışveriş caddesinde yürüyüp durur, vitrine bakar | **Duraklama anı** — ürün sabit ve net görünür |
| Paris'te yürüyen kadın | Haussmann tarzı caddede, café önünde | Şıklık, Avrupa estetiği |
| Bahçe buluşması | Doğal ışık, çiçekli arka plan, öğleden sonra | Organik, sıcak ton |
| Product spotlight | Sade gradient arka plan, 360° yavaş döngü | Detay çekimi, en temiz format |

> Şablon isimleri kasıtlı olarak somut ve hayal ettiricidir. "Ürün odağı" veya "Sale promotion" gibi soyut isimler kullanılmaz.

### 7.5 Ek Not Alanı

Şablon grid'inin altında, tam genişlik, opsiyonel:

- **Label:** "Ek detay (opsiyonel)"
- **Placeholder:** *"Örn: fırfırlı kollar öne çıksın, sırt dekoltesi net görünsün, 90'lar estetiği"*
- **Hint:** *"Preset seçeneklere sığmayan özel detaylar için. Bu not seçtiğiniz tüm ürünlere uygulanır."*
- **Karakter sayacı:** 0 / 300 (300 karakter limit).
- **Validation:** 300 üzerinde input bloklanır + warning.

### 7.6 Bilgi Notu

Muted, 11px, ek not'un altında:

> `ti-info-circle` *"Videolar 8–10 saniye, 1:1 formatta üretilir. Fiyat/marka bilgisi sonradan Dynamic Creative ile eklenebilir."*

### 7.7 Bottom Bar

```
┌──────────────────────────────────────────────────────┐
│ 3 ürün · Vitrine bakan kadın                         │
│                          [← Geri]  [Devam →]         │
└──────────────────────────────────────────────────────┘
```

Disabled iken: *"Devam etmek için bir şablon seçin"*

### 7.8 State'ler

**Loading (şablonlar yüklenirken):** 4 kart skeleton, 2×2 grid.
**Preview load fail:** Kart üzerinde gri placeholder + ikon, *"Önizleme yüklenemedi"*. Kart yine seçilebilir.
**Empty:** Şablon listesi boş gelmez (mock'tan gelir). Server-side hata varsa error state.

### 7.9 Implementation Notes

- Şablon datası: `src/data/templates.ts` — preview asset path, scenario, defaultPresets, recommendedSectors[].
- Recommendation logic: `recommendedSectors` array'inde campaign.sector varsa rozet gösterilir.
- Hover animasyonu: CSS-only (transform translate + opacity keyframes) ya da kısa loop video (autoplay muted).

---

## 8. Ekran 3 — Maliyet Onayı

### 8.1 Amaç

Kullanıcı üretime bilinçli başlamalıdır.

### 8.2 Layout

**Adım göstergesi:**
```
✓ Ürün seç  →  ✓ Şablon  →  ● Onayla  →  ○ Üret & İncele  →  ○ Gönder
```

**Başlık:** "Üretimi onayla"
**Hint:** *"Üretim başladıktan sonra token bakiyenizden düşülecektir."*

### 8.3 Özet Bölümü

**Üst — 3'lü grid (özet kartları):**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Ürün sayısı  │  │ Tahmini süre │  │ Tahmini token│
│      3       │  │   ~3 dk      │  │  ~24 token   │
└──────────────┘  └──────────────┘  └──────────────┘
```

> Tüm tahmini değerler "~" ile başlar.

**Şablon özeti satırı:**

```
🎬 Vitrine bakan kadın        [Düzenle]
3 ürün için bu şablon kullanılacak.
```

"Düzenle" → Ekran 2'ye döner, seçim korunur.

**Bakiye özet kartı:**

```
┌────────────────────────────────────┐
│ Mevcut bakiye           1,240 token│
│ Bu üretim                  −24 tok │
│ ────────────────────────────────── │
│ Tahmini kalan          ≈ 1,216 tok │
└────────────────────────────────────┘
```

### 8.4 Opsiyonel Checkbox — Browser Notification

```
☐ Üretim bittiğinde bana bildir
   (Tarayıcı bildirim izni istenecek)
```

İlk işaretlemede `Notification.requestPermission()` tetiklenir. Reddedilirse: *"İzin verilmedi. Tarayıcı ayarlarından açabilirsiniz."* warning.

### 8.5 Footer

```
[← Geri]                              [Üretimi başlat]
```

### 8.6 Insufficient Balance Flow

Eğer `mevcut_bakiye < tahmini_token`:

- CTA disabled.
- Bakiye kartında "Tahmini kalan" satırı **kırmızı** olur ve "Eksik: 80 token" yazar.
- Alt satırda warning alert:

```
⚠ Bakiyeniz bu üretim için yetersiz.
80 token eksik. [Token al →]
```

"Token al" → Wallet panel'ini açar (MVP'de mock toast).

### 8.7 State'ler

**Bakiye API hatası:** Bakiye kartında *"Bakiye yüklenemedi. [Tekrar dene]"*.
**Token değeri değişti (background sync):** Inline info alert: *"Bakiyeniz güncellendi: 1,180 token. Onayı tekrar gözden geçirin."*

### 8.8 Implementation Notes

- Mock fiyatlandırma: 1 ürün = ~8 token (prototip için sabit).
- Browser notification permission: `Notification.permission === 'default'` ise checkbox işaretli iken request.

---

## 9. Ekran 4 — Üretim & İnceleme (Birleşik Ekran)

### 9.1 Amaç

**Üretim ve inceleme tek ekranda gerçekleşir.** Videolar üretildikçe anında incelenebilir; ayrı bir "İncelemeye geç" adımı yoktur.

### 9.2 Tasarım Kararının Gerekçesi

Discovery notlarından (Açık soru → karar):

> *"Hazır hale gelen ilk videolar, diğerleri arka planda üretilirken anında izlenebilecek mi?"*

Cevap: Evet — ve sadece izlemekle kalmaz, hemen onaylayabilir, düzenleyebilir ya da reddedebilir. Bu, "boş bekleme" sorununu çözer ve ayrı bir inceleme adımının yarattığı gereksiz adımı ortadan kaldırır.

### 9.3 Layout

**Adım göstergesi:**
```
✓ Ürün seç  →  ✓ Şablon  →  ✓ Onayla  →  ● Üret & İncele  →  ○ Gönder
```

**Topbar:**
- Token pill: güncel bakiye (üretim başladığında düşülmüş halde, animasyonlu sayım).

**Başlık alanı:**
- Başlık (dinamik):
  - Üretim sürüyorsa: "Videolar üretiliyor..."
  - Tüm üretim bittiyse: "Videolar hazır — inceleme tamamlanınca gönderebilirsiniz"
- Hint: *"Videolar hazır oldukça inceleyebilirsiniz. Onay vermeden hiçbir video kanala gönderilmez."*
- Progress satırı: "N / M tamamlandı · ~N dk kaldı" (üretim bitince bu satır kaybolur)
- Progress bar (height: 4px, `#7F77DD` → tümü bitince `#639922`)

### 9.4 Video Kartları — Her Ürün İçin Bir Kart

**Kart yapısı (genel):**

```
┌──────────────────────────────────────────────────────────┐
│  [Thumbnail 120×120 veya spinner]                        │
│                                                          │
│  Ürün adı                                                │
│  Vitrine bakan kadın · 1:1 · 1080×1080 · 0:09            │
│                                                          │
│  [Badge: Statü]                                          │
│                                                          │
│  [Aksiyon butonları statüye göre]                        │
└──────────────────────────────────────────────────────────┘
```

#### 9.4.1 `generating` State

- Thumbnail alanında **spinner animasyonu** + soluk ürün ana görseli arka planda.
- Badge: "Üretiliyor" (amber, pulse).
- Aksiyon butonları: **görünmez**.
- Sol kenar: 3px dikey amber çizgi.

#### 9.4.2 `pending_review` State (Üretim Tamamlandığında Otomatik Geçiş)

- Thumbnail belirir (fade-in + scale, 300ms).
- Sol üstte oynat ikonu overlay + süre ("0:09").
- Badge: "İncele" (mor).
- Sol kenar: 3px dikey mor çizgi.
- **Aksiyon butonları belirir:** `[▶ Önizle] · [✓ Onayla] · [✎ Düzenle] · [✕ Reddet]`

#### 9.4.3 `approved` State

- Thumbnail üzerinde yeşil checkmark overlay (büyük).
- Badge: "Onaylandı" (yeşil).
- Sol kenar çizgisi kalkar.
- Aksiyon butonları gizlenir; sadece küçük `[Değiştir]` linki görünür (`pending_review`'e geri alır).

#### 9.4.4 `rejected` State

- Thumbnail üzerinde kırmızı overlay + X ikonu.
- Badge: "Reddedildi" (kırmızı).
- Satır opacity: 0.5.
- Aksiyon butonları gizlenir; sadece `[Geri al]` linki → `pending_review`'e döner.
- Hover'da tooltip: *"Bu video silinmedi. Geri alabilir veya yeniden ürettirebilirsiniz."*

#### 9.4.5 `failed` State

- Badge: "Üretim başarısız" (kırmızı).
- Thumbnail yerine error ikonu.
- Hint satırı: *"Bu video için harcanan token iade edildi."*
- Buton: `[↻ Yeniden dene]` (yeni token harcamaz, ilk başarısız üretim sayılır).

### 9.5 Sağ Üst — Toplu Aksiyonlar

```
[↻ Tümünü yeniden üret]  [✓ Tümünü onayla]  [▼ İndir]
```

- **Tümünü onayla:** Confirmation dialog (§2.10) — *"{N} videoyu onayla?"* Sadece `pending_review` olanları etkiler.
- **Tümünü yeniden üret:** Confirmation (token harcayacak) — *"{N} video için ~{token} harcanacak."* Mevcutlar `draft` olur, yeniler `generating`'e geçer.
- **İndir dropdown:**
  - "Onaylananları indir" (ZIP)
  - "Tümünü indir" (ZIP — rejected dahil)

  Prototipte her iki seçenek de sample MP4 indirir. İndirme başlarken inline progress: *"ZIP hazırlanıyor... 2/3"*

### 9.6 Footer (Sticky)

```
┌──────────────────────────────────────────────────────────┐
│ 2 onaylandı / 3 toplam     [← Geri]   [Dışa aktar →]     │
└──────────────────────────────────────────────────────────┘
```

> **Not:** "Dışa aktar" için tüm videoların bitmesi veya onaylanması beklenmez. Üretim hâlâ sürüyor olsa bile, onaylanan ilk video sonrasında buton aktifleşir. Kullanıcı erken gönderim yapabilir.

Disabled iken: *"Dışa aktarmak için en az 1 videoyu onaylayın"*

### 9.7 Genişletilmiş Video Player (Modal)

Thumbnail'a veya `[▶ Önizle]` butonuna tıklandığında overlay açılır.

**Layout (1000×700px modal):**

```
┌──────────────────────────────────────────────────────────┐
│ Ürün adı · Vitrine bakan kadın                    ✕      │
│ ────────────────────────────────────────────────────────│
│                                                          │
│   ┌──────────────────────────────────────────────┐       │
│   │                                              │       │
│   │         [Video, 600×600, 1:1]                │       │
│   │                                              │       │
│   └──────────────────────────────────────────────┘       │
│                                                          │
│   ▶ ⏸  ━━━━━●━━━━━━━━  0:04 / 0:09     [🔊] [⛶] [⤓]      │
│                                                          │
│   [◁ Önceki frame]  [Frame ▷]  Hız: [1x ▾]              │
│                                                          │
│ ────────────────────────────────────────────────────────│
│ ⓘ Beğendiyseniz onaylayın, düzenlemek istiyorsanız       │
│   Düzenle'ye tıklayın.                                   │
│                                                          │
│ [✕ Reddet]   [✎ Düzenle]              [✓ Onayla]         │
└──────────────────────────────────────────────────────────┘
```

**Kalite kontrol kapasiteleri (yeni — Feedback 2):**

- **▶ / ⏸:** Play/Pause (Space tuşu)
- **Progress bar:** Click + drag ile seek
- **🔊:** Ses açma/kapama (video ses içermese de UI tutarlılığı için)
- **⛶ Full-screen:** Tam ekran modu
- **⤓ İndir:** Bu tek videoyu indir
- **Frame step:** Yavaş yavaş tek tek frame ilerlet (◁ / ▷ butonlar — kalite incelemesi için)
- **Hız:** 0.5x, 1x, 1.5x, 2x oynatma hızı

**Klavye:**
- `Space` — play/pause
- `←/→` — 1 sn geri/ileri
- `Shift + ←/→` — frame-by-frame
- `A` — onayla, `R` — reddet (confirmation), `E` — düzenle
- `Esc` — kapat

**Navigation:** Player içinden bir sonraki / önceki `pending_review` videoya geçiş için `[↑ Önceki video]` `[Sonraki video ↓]` butonları (üst sağda).

### 9.8 Davranışlar

**Üretim ilerleyişi (mock):**
- Her video sırayla `generating` → `pending_review` (1.2 sn / video, prototipte).
- Kart transition: `opacity 0 → 1`, `scale 0.96 → 1` (300ms).
- Progress bar canlı güncellenir.
- Üretim bitince başlık güncellenir, progress bar yeşile döner.

**Onay sonrası:**
- Footer sayacı animasyonla artar.
- "Dışa aktar" buton state'i kontrol edilir.

**Reddetme:**
- İlk reddetmede confirmation: *"Videoyu reddet?"* (*"Reddetmek videoyu silmez, taslak olarak kalır."*) + "Bir daha sorma" checkbox.

**Tab close / refresh:**
- Üretim sürüyorsa: `beforeunload` listener → *"Üretim sürüyor. Çıkarsanız ilerleme kaybolmaz, ama bildirim alamazsınız."* (Standart browser dialog tetikler.)

**Browser notification (izin verilmişse):**
- Tüm videolar bittiğinde tek bir notif: *"Kampanyandaki {N} video hazır."*

### 9.9 Empty / Error State'leri

**Tüm üretim başarısız:**
- Tüm kartlar `failed` state.
- Üstte alert: *"Üretim başarısız oldu. Tüm token iade edildi."*
- CTA: "Tekrar dene"

**Tek video stuck (>2 dk hâlâ generating):**
- Otomatik `failed` state'e alınır.
- Kullanıcıya toast: *"Bir video uzun sürüyor. Yeniden denemek ister misiniz?"*

**Network kesintisi sırasında:**
- Üst alert: *"Bağlantı yok. Üretim sürüyor; sonuçlar bağlantı dönünce yüklenecek."*
- Polling otomatik retry (5 sn).

### 9.10 UI Notları

- Kart transition: `opacity 0.3s ease, transform 0.3s ease`
- "Onayla" butonu: `background: #EAF3DE; color: #3B6D11; border: none`
- Rejected satır: `opacity: 0.5; pointer-events: auto`
- Progress bar: `height: 4px; border-radius: 2px; transition: background 0.5s`

### 9.11 Implementation Notes

- Mock üretim: setTimeout chain — her video belirlenmiş gecikmeyle `pending_review`'e geçer. Random ~5% `failed` oranı simulation.
- Video state'leri: store'da (Zustand) tutulur. URL ile o kampanyaya dönüş mümkün olmalı.
- Browser notification: Service Worker gerekmiyor — basit `new Notification(...)` yeterli.
- Klavye event listener: modal açıkken aktif.

---

## 10. Ekran 5 — Prompt Düzenleme (Modal)

### 10.1 Nasıl Açılır

- Ekran 4'te kart üzerindeki `[✎ Düzenle]` butonu.
- Genişletilmiş player içinden `[✎ Düzenle]` butonu.

### 10.2 Layout

**Modal başlık:**
- Ürün adı (bold) + mevcut şablon adı (muted)
- Sağda token uyarısı: `⚡ ~8 token düşülecek` (amber pill)
- Hint: *"Değiştirmek istediğiniz parametreleri seçin. Aynı ayarlarla da yeniden üretebilirsiniz."*

**Preset kategoriler (pill grid):**

| Kategori | Seçenekler |
|----------|------------|
| Ortam | Alışveriş caddesi · Park · Kafe · Sahil · Stüdyo · Ev içi · Bahçe · Sokak |
| Hareket | Vitrine bakıp dur · Yürü · Dön · Otur · Koş · Dur ve poz ver · Eğil ve bak |
| Işık | Doğal gün ışığı · Altın saat · İç mekan · Dramatik · Bulutlu |
| Kıyafet vurgusu (yeni) | Ön · Arka · Yan · Detay · Tam boy · Yakın çekim |

*Mevcut şablondan değerler varsayılan seçili gelir.*

**Free text alanı:**
- Placeholder: *"Örn: fırfırlı kollar öne çıksın, sırt dekoltesi net görünsün, 90'lar estetiği"*
- Hint: *"Preset seçeneklere sığmayan özel detaylar için."*
- Karakter sayacı: 0 / 300.

**Örnek promptlar** (collapsible, default kapalı, başlık: "İlham almak için örnekler ↓"):

- "Süet tokalı babet, modern ofis ortamı"
- "Dantel detay ön planda, beyaz arka plan"
- "Uzun kollu, yüksek bel, tam boy çekim"
- "Sırt dekoltesi vurgulansın, yarı dönüş hareketi"
- "Fırfırlı kol, doğal ışık, profil çekim"

Tıklanınca free text alanına eklenir (append).

**Footer:** "İptal" (ghost) + "Yeniden üret" (primary)

### 10.3 Confirmation

`[Yeniden üret]` tıklandığında confirmation dialog:

```
Yeniden üretelim mi?
Bu işlem ~8 token harcayacak. Eski video taslak olarak kalacak,
silinmeyecek.
[İptal]  [Üret]
```

### 10.4 Sistem Davranışı

1. Confirmation onaylanır → modal kapanır.
2. Ekran 4'te o ürünün kartı `generating` state'e döner (diğer kartlar değişmez).
3. Eski video aynı kartta küçük "Önceki versiyon" linki olarak kalır (tıklayınca player'da gösterir).
4. Mini yeniden üretim tamamlandığında kart `pending_review` state'ine geçer.

### 10.5 Edge Cases

- **Token yetersizse:** Yeniden üret butonu disabled + warning *"Bakiyeniz yetersiz."* + [Token al →].
- **Boş prompt + boş presets (tüm değerler default'ta):** Kullanıcı uyarılır: *"Hiçbir şey değiştirmediniz. Yine de üretelim mi?"* — aynı promptla baştan üretir.
- **Modal kapanırsa (Esc / ✕):** Sessizce kapanır, değişiklik yapılmaz.

### 10.6 Implementation Notes

- Edit history: Her video için son N versiyonun prompt'u saklanır (mock: localStorage).
- "Önceki versiyon" UI'da küçük dropdown — *"Versiyon 1 (orijinal)", "Versiyon 2 (düzenlenmiş)"*.

---

## 11. Ekran 6 — Dışa Aktarma

### 11.1 Amaç

Onaylanan videoları kanallara göndermek veya indirmek.

### 11.2 Layout

**Adım göstergesi:**
```
✓ Ürün seç  →  ✓ Şablon  →  ✓ Onayla  →  ✓ Üret & İncele  →  ● Gönder
```

**Başlık alanı:**
- Yeşil checkmark + "N video onaylandı"
- Hint: *"Videoları reklam kanallarınıza gönderin veya ZIP olarak indirin. Sonra da gönderebilirsiniz."*

### 11.3 Kanal Seçim Listesi (Toggle Kartlar)

```
┌──────────────────────────────────────────────────────┐
│ [Meta logosu] Meta Catalog                           │
│ Facebook & Instagram Reklamları                      │
│ ● Bağlı  ·  Anneler Günü Hesabı                      │
│                                          [Toggle ●]  │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│ [Google logosu] Google Merchant Center               │
│ Shopping & Performance Max                           │
│ ● Bağlı                                              │
│                                          [Toggle ○]  │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│ [TikTok logosu] TikTok Catalog                       │
│ ⚠ Bağlı değil                                        │
│ [TikTok hesabını bağla →]                            │
└──────────────────────────────────────────────────────┘
```

**State'ler:**
- **Bağlı + seçili:** Border `2px solid #7F77DD`, toggle on.
- **Bağlı + seçilmedi:** Border `0.5px solid var(--color-border-tertiary)`, toggle off.
- **Bağlı değil:** Toggle disabled, "Hesabı bağla" linki → MVP'de mock toast *"Bu adım yakında"*.

### 11.4 İndirme Kartı (Dashed Border)

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                                                    │
│  [⤓ ZIP indir]  (3 video)                          │
│                                                    │
│  Kanal seçmeden sadece indirmek istiyorsanız       │
│  "Atla"yı kullanın.                                │
│                                                    │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

İndirme tetiklendiğinde:
- İndirme başlar, ZIP boyutu inline gösterilir.
- Toast: *"İndirme başladı."*
- Hata: Toast *"İndirme başarısız. Tekrar deneyin."*

### 11.5 Footer

```
[← Geri]  [Atla (taslak olarak kaydet)]            [Gönder →]
```

- **Atla:** Underline text link. Kampanya `draft` kalır. → Başarı ekranına gider.
- **Gönder →:** Primary. En az 1 kanal seçili olmalı.
- Disabled iken: *"Göndermek için en az bir kanal seçin"*

### 11.6 Sistem Davranışı

- **Gönder:** Mock API simulation (2 sn delay) → Success ekranına. Kampanya `active` olur.
- **Atla:** Kampanya `draft` kalır.
- **Library'de:** Kampanya toggle'ı gönderim sonrası otomatik açık görünür.

### 11.7 Edge Cases & Error States

**Gönderim sırasında hata (Meta):**
- Inline alert sayfanın üstünde:
  ```
  ⚠ Meta'ya gönderilemedi: Token süresi dolmuş.
  [Tekrar dene]   [Detay]
  ```
- Diğer kanallara gönderim devam eder (paralel).

**Tüm kanallar başarısız:**
- Kampanya `draft` olur, success ekranına gitmez.
- Modal: *"Gönderim başarısız. Tüm videolar taslak olarak kaydedildi. Library'den tekrar deneyebilirsiniz."*

**Hiçbir kanal seçilmedi + kullanıcı X tuşuna basarsa:**
- Confirmation: *"Hiç gönderim yapmadan çıkmak istediğinden emin misin?"* — *"Onaylı videolar Library'de taslak olarak kalacak."*

### 11.8 Kampanya Aç/Kapa Notu

Toggle bu ekranda yoktur; Library'deki kampanya kartında kontrol edilir.

### 11.9 Implementation Notes

- Mock channels: `src/data/channels.ts` — her birinin connectionStatus alanı.
- Gönderim simulation: 2 sn delay + random %10 hata oranı.
- ZIP indirme: prototipte sabit sample.zip indirir.

---

## 12. Ekran 7 — Başarı

### 12.1 Amaç

Akışın tamamlandığını teyitlemek ve sonraki adıma geçişi kolaylaştırmak.

### 12.2 Layout

**Adım göstergesi:** Tüm adımlar yeşil checkmark.

**Centred layout:**

```
                  [✓ Daire, 64×64, #EAF3DE]


              "3 video Meta'ya gönderildi"
                          veya
            "3 video taslak olarak kaydedildi"


  "Kampanyanızı görüntüleyebilir veya yeni bir kampanya
                    oluşturabilirsiniz."


  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │     3     │   │   Meta    │   │  24 tok   │
  │ Gönderilen│   │   Kanal   │   │ Harcanan  │
  └───────────┘   └───────────┘   └───────────┘


    [Kampanyayı görüntüle]      [+ Yeni video oluştur]
```

### 12.3 İlk Kampanya İçin Ek Satır

```
🎉 Bu senin ilk video kampanyan!
   Library'den her zaman tekrar gözden geçirebilirsin.
```

`localStorage.has_completed_first_campaign = true` set edilir.

### 12.4 CTA'lar

- **Kampanyayı görüntüle:** Library'de ilgili kampanya vurgulanmış açılır (kart highlight pulse animasyonu 1.5 sn).
- **Yeni video oluştur:** Tüm flow state'i sıfırlanır, ürün kataloğuna döner.

### 12.5 UI Notları

- "Geri" navigasyonu yoktur — akış tamamlandı.
- Step indicator hâlâ görünür (tüm yeşil), referans için.
- Confetti animasyonu (reduced-motion respect) — sadece ilk kampanyada.

### 12.6 Implementation Notes

- Flow state reset: Zustand store'da `reset()` action.
- Library highlight: query param `?highlight=campaign_id` ile gidilir.

---

## 13. Prototip State Yönetimi

```typescript
type FlowState = {
  currentStage:
    | 'catalog'        // Ürün kataloğu — varsayılan giriş
    | 'library'        // Kampanya listesi — ikincil
    | 'campaign-setup' // Pop-up modal (isim + sektör + tema + ürün tipi)
    | 'template'       // Şablon seçimi
    | 'confirm'        // Maliyet onayı
    | 'generate-review' // Üretim & İnceleme — BİRLEŞİK
    | 'edit-prompt'    // Modal (Ekran 5)
    | 'export'         // Dışa aktarma
    | 'success'        // Tamamlama
  selectedProductIds: string[]
  campaignId: string | null
  campaignName: string
  campaignContext: {
    sector: string
    theme: string
    productType: string
  }
  selectedTemplate: Template | null
  templateNote: string
  videos: Video[]
  selectedChannels: Channel[]
  notifyOnComplete: boolean   // Browser notification opt-in
  hasSeenIntro: boolean        // First-time onboarding flag (localStorage)
  hasCompletedFirstCampaign: boolean
}

type Video = {
  id: string
  productId: string
  campaignId: string
  status: 'generating' | 'pending_review' | 'approved' | 'rejected' | 'failed' | 'draft' | 'live'
  url: string | null
  duration: number             // seconds
  prompt: string               // current prompt
  previousVersions: {          // edit history
    prompt: string
    url: string
    timestamp: number
  }[]
  generatedAt: number | null
  approvedAt: number | null
  rejectedAt: number | null
}

type Campaign = {
  id: string
  name: string
  status: 'setup_in_progress' | 'active' | 'draft' | 'pending' | 'archived'
  context: { sector: string; theme: string; productType: string }
  templateId: string | null
  templateNote: string
  productIds: string[]
  videoIds: string[]
  channels: { id: string; status: 'pending' | 'sent' | 'failed' }[]
  createdAt: number
  lastModifiedAt: number
}
```

## 14. Mock Data Yapısı

```
src/data/
  campaigns.ts     — id, name, status, videoCount, productThumbnails, toggle
  products.ts      — id, name, brand, images[], tags[], videoHistory[],
                     itemGroupId, category, sku
  templates.ts     — id, name, scenario, previewAsset, defaultPresets,
                     recommendedSectors[]
  tokens.ts        — mock bakiye, harcama geçmişi
  videos.ts        — id, productId, campaignId, status, url, duration,
                     prompt, previousVersions[]
  channels.ts      — id, name, logo, connectionStatus, accountName
  taxonomy.ts      — sectors[], themes[], productTypes[]
```

**Örnek veri minimumları:**
- 30+ ürün (farklı markalar, kategoriler, görsel sayıları, video geçmişi)
- 4 şablon (mevcut MVP listesi)
- 4 örnek kampanya (her statüden en az 1)
- 3 kanal (Meta bağlı, Google bağlı, TikTok bağlı değil)

---

## 15. MVP Kapsam Dışı

- Gerçek API ve video üretimi
- Gerçek kanal gönderimi (Meta/Google/TikTok)
- Kullanıcı kimlik doğrulama
- Mobil breakpoint
- Text overlay / Dynamic Creative editörü
- 1000+ ürün bulk generation
- Statik fotoğraftan manken giydirme (parked)
- Token satın alma flow (sadece mock pathway)
- Kanal hesabı bağlama flow (sadece mock pathway)
- Çok dilli destek (Türkçe only)
- Telemetri / analytics
- Kampanya paylaşma / ekip işbirliği
- A/B test mode
- Şablon kullanıcı tarafından oluşturma (önceden tanımlı 4 şablon)

---

## 16. Açık Sorular (Discovery'den)

| Soru | Durum | Etki |
|------|-------|------|
| Mevcut AI altyapısı çoklu görsel destekliyor mu? | **Engineering doğrulayacak** | Eğer hayır ise, ek görsel UI'ı kalır ama promptta kullanılmaz — kullanıcıya yanlış beklenti vermemek için copy revize edilir. |
| Şablon promptlarını kim yazacak? | **Product / Design** | UI tamamlanmadan önce 4 şablon promptu hazır olmalı. |
| Token-iadesi politikası `failed` videolar için kesin mi? | **Product** | Mevcut tasarım iade ediyor — onaylanacak. |
| "Tümünü onayla" sonrası reddetme nasıl çalışır? | **Tasarımda kararlaştırıldı** | `approved` → tıklanırsa `[Değiştir]` ile `pending_review`'e geri alınabilir. |

---

## 17. Ekran Akışı Özeti

```
[Varsayılan giriş — onboarding banner görünür ise]
        ↓
Ekran 1    · Ürün Kataloğu         →  Filtrele, seç, maliyeti tahmin et
                                      (Filtre, arama, multi-image preview)
        ↓ "Şablon seç"
           [Kampanya Kurulum Pop-up: isim + sektör + tema + ürün tipi]
        ↓ "Şablona geç"
Ekran 2    · Şablon Seçimi         →  Senaryo seç, ek not ekle
                                      (Hover animasyon, click ile büyük önizleme)
        ↓ "Devam"
Ekran 3    · Maliyet Onayı         →  Ne harcayacağını bil, onayla
                                      (Insufficient → token al; notification opt-in)
        ↓ "Üretimi başlat"
Ekran 4    · Üret & İncele         →  Hazır olanı anında incele, onayla / düzenle / reddet
                                      (Player'da frame-step, full-screen, klavye)
        ↓  ←── Ekran 5 · Edit Prompt Modal (döngü, tek video için)
        ↓ "Dışa aktar" (en az 1 approved sonrası aktif)
Ekran 6    · Dışa Aktarma          →  Kanala gönder veya indir
                                      (Per-channel error handling)
        ↓ "Gönder" / "Atla"
Ekran 7    · Başarı                →  Özetle, yeni akış başlat

[Sidebar: Kampanyalarım — Ekran 1b]  →  Aç/Kapa, mevcut kampanyaları yönet
                                       (Setup_in_progress → Devam et pathway)
```

---

## 18. İki Değişmez İlke

1. **Kullanıcı hiçbir aşamada ne yapacağını bilmeden bırakılmaz** — her ekranda bağlamsal hint ve disabled CTA açıklaması vardır. İlk girişte onboarding banner ek bir güvence katmanıdır.
2. **Hiçbir video insan onayı olmadan kanala gönderilmez** — her video tek tek onaylanır; "Tümünü onayla" bile confirmation ister.

---

## 19. Versiyon Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| v1 | İlk taslak | 5 ekranlı flow, kampanya pop-up'ı, üretim+inceleme birleşik |
| **v2** | **Bu doküman** | Onboarding (banner + modal), multi-image UX detay, brand/category/ID filtre, sistematik loading/error/empty pattern, draft recovery, geniş player + frame-step + full-screen, confirmation pattern, Wallet panel, browser notification, accessibility & klavye, animasyon token'leri, Library quick actions, açık sorular tablosu, implementation notes her ekranda |

---

## 20. Implementation List'e Geçiş İçin Not

Bu doküman, codebase ile gap analizine sokulurken aşağıdaki sırayla okunması önerilir:

1. **Global pattern'ler (§2)** — Önce tasarım sistemi temelleri (color tokens, animation tokens, error/loading/empty patterns, confirmation pattern, accessibility baseline).
2. **Layout shell** — Sol menü + topbar + breadcrumb + token bölümü.
3. **State yönetimi (§13)** — Store yapısı, mock data (§14) ile birlikte.
4. **Ekran 1 → Ekran 7** — Sırayla ekran-bazlı implementation.
5. **Cross-cutting** — Onboarding (§3), Wallet (§2.13), Notification (§2.14).

Her ekranın altındaki "Implementation Notes" bölümleri spesifik teknik kararları (storage, mock veri, edge case handling) belirtir.