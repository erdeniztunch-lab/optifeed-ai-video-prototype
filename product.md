# Optifeed AI Video — Product Document

> **Versiyon:** V1 Validated Prototype  
> **Son güncelleme:** Discovery meeting & internal feedback notları esas alınarak hazırlanmıştır.  
> **Durum:** Aktif geliştirme — prototip aşaması

---

## Product Definition

Optifeed AI Video, e-ticaret kataloglarındaki ürünlerden performans reklamlarında kullanılmak üzere kısa ürün videoları oluşturmayı sağlayan bir araçtır. Kullanıcı ürünleri seçer, bir video şablonu belirler, gerekli bağlamı girer, yaklaşık maliyet ve süreyi görür, videoları üretir, inceleyip gerekirse revize eder, onaylar ve indirir ya da feed'e gönderir.

Araç, sınırsız AI video editörü değildir. Amacı, performance marketing kullanıcısının reklam kreatifleri için ürün videosu üretmesini hızlı, kontrollü ve amaca uygun bir akışla mümkün kılmaktır.

---

## Problem

E-ticaret kataloglarındaki ürünlerin büyük çoğunluğunun video asset'i yoktur. Video olmayan ürünler, reklam kampanyalarında görsel içerik eksikliği nedeniyle performans kaybı yaşar. Mevcut durumda:

- Yönetici hangi ürünün videosu olmadığını manuel takip eder.
- Video prodüksiyon ekibine veya harici araca başvurulur.
- Her ürün için ayrı brief hazırlanır.
- Üretilen videolar ayrı bir süreçle kanallara yüklenir.
- Bu süreç Google, Meta ve TikTok için ayrı ayrı tekrarlanır.

Hedef deneyim, video üretimini feed yönetimi akışının içine entegre ederek bu manuel süreci ortadan kaldırmaktır.

---

## Target User

**Primer kullanıcı:** Performance marketing ve e-ticaret ekiplerinde reklam materyali ve feed yönetimi yapan kişiler. Ajans bünyesinde veya marka içinde çalışabilir.

**Kullanıcı ihtiyacı (JTBD):** "Yüzlerce ürünüm var. Hangisinin videosu yok biliyorum ama üretmek zahmetli ve pahalı. Bunu kampanya bazlı, kontrollü biçimde otomatize etmek istiyorum."

**Kullanıcı alışkanlığı:** Kampanya ve promo bazlı çalışır. Ürettiği içerikleri kampanyaya göre gruplar ve sonradan tekrar erişmek ister.

---

## Product Principles

1. **Template-first, guided:** Kullanıcıya boş prompt alanı gösterilmez. Akış şablon seçimiyle başlar.
2. **Kontrollü üretim:** Araç, sınırsız yaratıcı editör değildir. Performance marketing için amaca uygun, belirli şablonlar üzerinden çalışır.
3. **Şeffaflık:** Kullanıcı üretim başlamadan tahmini süreyi ve maliyeti görür.
4. **Kampanya bazlı organizasyon:** Üretilen videolar klasör/library yapısında saklanır; kullanıcı kampanya bazlı çalışabilir.
5. **İnsan onayı:** Hiçbir video otomatik olarak feed'e gönderilmez. Kullanıcı her videoyu inceleyip onaylar.
6. **Güvenli üretim:** Uygunsuz içerik üretimini engelleyen temel güvenlik katmanı bulunur.

---

## MVP Scope

**Kapsam dahilindeki özellikler:**

- Folder / library başlangıç yapısı (temel seviye — kampanya bazlı organizasyon)
- Ürün arama (ürün adı, ID, item group ID)
- "Recently added" sıralama seçeneği
- Ürün metadata gösterimi (ad, ID, item group ID, kategori, marka, ana görsel, ek görsel sayısı)
- Ek görsel sayısı göstergesi (stacked image indicator)
- Ürün seçim limiti ve bu limitin UI'da gösterimi
- Seçime bağlı tahmini maliyet ve süre göstergesi (anlık güncellenen)
- "Choose template" CTA'sı (ürün seçimi sonrası)
- Template seçim ekranı (açık grid yapısında)
- Guided template akışı (sektör, tema, kampanya bağlamı, background, ürün tipi gibi yönlendirmeli giriş alanları)
- 1:1 format (1080×1080) video üretimi
- Token / kredi bakiyesi görünürlüğü (sağ üstte sabit)
- Üretim sırasında progress ekranı (tamamlanan videolar belirirken gerisinin "pending/generating" olarak gösterimi)
- Output inceleme ekranı (liste veya grid)
- Her video için approve / edit / reject aksiyonları
- Edit Prompt akışı (dropdown preset seçenekleri + free text alanı + örnek promptlar)
- Tekil video indirme (MP4)
- ZIP toplu indirme (tüm onaylanan videolar)
- Temel güvenlik katmanı (safety guardrails)
- Feed'e gönderim (Send to Feed) adımı — kanalın seçimi ve gönderim; detay Open Questions'da

---

## Out of Scope (MVP)

- Çoklu boyut eşzamanlı üretimi (dikey, yatay vb.) — V2
- 1:1 dışındaki aspect ratio'lar — V2
- Text overlay / font / kampanya metni editörü — ayrı feature veya Dynamic Creative ürününün parçası olarak değerlendirilecek
- Gelişmiş video editörü
- 1000 ürün ölçeğinde bulk generation — farklı mimari gerektirir; request-based flow olarak ayrıca değerlendirilecek
- Scheduling (start / end date) — V1 dışı
- Bulk upload (kullanıcı hazır liste yükler) — V1 dışı
- Hover preview — nice-to-have, V2 olabilir
- Otomatik feed yayını (insan onayı olmadan)
- E-posta ve in-app bildirim — V1 dışı

---

## Main User Flow

```
1. LIBRARY / FOLDER
   → Mevcut klasörler görüntülenir
   → Yeni klasör oluşturulur veya mevcut klasör açılır
   → Video üretim akışı başlatılır

2. PRODUCT SELECTION
   → Ürünler listelenir (arama + recently added sıralama)
   → Kullanıcı ürün(leri) seçer (limit dahilinde)
   → Seçime bağlı tahmini maliyet ve süre anlık gösterilir
   → CTA: "Choose template"

3. TEMPLATE SELECTION
   → Şablonlar açık grid yapısında gösterilir
   → Kullanıcı guided alanları doldurur (sektör, tema, kampanya bağlamı vb.)
   → Üretim başlamadan son maliyet ve süre teyidi gösterilir
   → CTA: "Generate videos"

4. GENERATION PROGRESS
   → Üretim başlar, progress ekranı açılır
   → Tamamlanan videolar ekrana belirir
   → Bekleyenler "pending / generating" olarak gösterilir

5. PREVIEW / REVIEW
   → Tamamlanan videolar liste veya grid halinde incelenir
   → Her video için: Approve / Edit / Reject

6. EDIT PROMPT (gerekirse)
   → Dropdown preset seçenekleri + free text alanı + örnek prompt guidance
   → Yeniden üretim başlar (maliyet teyidi gösterilir)
   → Yeni çıktı preview'a döner

7. EXPORT / SEND
   → Onaylanan videolar indirilir (tekil)
   → Seçilen feed kanallarına gönderilir (Google, Meta, TikTok)
   → Videolar ilgili klasöre kaydedilir
```

---

## Screens

### 1. Library / Folder Ekranı

**Amaç:** Kullanıcının kampanya bazlı organize çalışmasını sağlar. Daha önce üretilen videolar klasör yapısında bulunur.

**İçerik:**
- Mevcut klasör listesi (kampanya adı, oluşturma tarihi, video sayısı)
- "Yeni klasör oluştur" aksiyonu
- Her klasöre tıklayarak içeriğe erişim

**Empty State:**
- Henüz hiç klasör ve video yoksa kullanıcıyı yönlendiren başlangıç mesajı ve "İlk videoyu oluştur" CTA'sı gösterilir.
- Sıfırdan başlayan kullanıcıya boş bir generation ekranı yerine bağlamsal yönlendirme yapılır.

**Karar:** Library yapısı en az temel seviyede MVP'de yer alır.

---

### 2. Product Selection Ekranı

**Amaç:** Kullanıcının katalogdan video üretilecek ürünleri seçmesi.

**Görüntülenecek ürün bilgileri:**
- Ana görsel
- Ek görsel sayısı göstergesi (stacked / iskambil kağıdı benzeri indicator)
- Ürün adı
- Status (video var / yok)
- ID
- Item group ID
- Kategori / product type
- Marka

**Arama:** Ürün adı, ID ve item group ID üzerinden arama yapılabilir.

**Sıralama:** "Recently added" seçeneği mutlaka bulunur.

**Seçim limiti:** 10 ürün.

**Sticky alt bar — anlık güncellenen bilgiler:**
- Seçilen ürün sayısı / limit
- Tahmini üretim süresi (yaklaşık)
- Tahmini maliyet / token kullanımı (yaklaşık)
- "Bu aşamada ödeme alınmayacaktır" veya benzeri güven veren mikrocopy (değerlendirmeye alınmalı)

**CTA:** "Choose template" — "Generate video" değil. Kullanıcı ürün seçtikten sonra doğrudan üretime geçmez; önce şablon seçer.

---

### 3. Template Selection Ekranı

**Amaç:** Kullanıcının video formatını ve üretim bağlamını belirlemesi.

**Template listesi:** Açık grid yapısında (2×2 veya benzeri) gösterilir. Gizli "Change" butonu kullanılmaz.

**Mevcut şablonlar:**
| id | Etiket | Kullanım amacı |
|----|--------|---------------|
| `product-spotlight` | Product Spotlight | Tek ürün odaklı, temiz format |
| `sale-promotion` | Sale Promotion | İndirim ve fiyat vurgulu |
| `new-arrival` | New Arrival | Yeni ürün lansmanı |
| `social-story` | Social Story | Dikey, mobil-öncelikli (Not: MVP'de 1:1 üretim yapılıyor; bu şablon V1'de 1:1 boyutunda üretilir) |

**Guided prompt alanları (şablon seçiminin altında):**
- Sektör
- Tema / kampanya bağlamı (Anneler Günü, Ramazan, Dubai, Paris vb.)
- Background / concept
- Ürün tipi

Kullanıcı sıfırdan prompt yazmak zorunda değildir; preset seçenekler ve örnek girdiler gösterilir. Gerektiğinde kontrollü free text alanı sunulur.

**CTA:** "Generate videos" — üretim başlamadan tahmini maliyet ve süre teyidi gösterilir.

**Format:** Tüm üretimler **1:1, 1080×1080** formatında yapılır. Diğer boyutlar MVP dışındadır.

---

### 4. Generation Progress Ekranı

**Amaç:** Kullanıcıyı üretim sürecinde aktif tutmak; boş bekleme deneyimini ortadan kaldırmak.

**Davranış:**
- Üretim başladığında progress ekranı açılır.
- Her video tamamlandıkça ekranda belirir ve izlenebilir hale gelir.
- Henüz tamamlanmayan videolar "Generating..." veya "Pending" durumunda görünür.
- Toplam video sayısı, tamamlanan sayısı ve kalan tahmini süre gösterilir.

**Önemli:** Her video yaklaşık 2 dakika sürebilir. 10 video seçildiyse kullanıcı bu süre zarfında tamamlanan videoları görmeye başlar; tümünün bitmesini beklemek zorunda kalmaz.

---

### 5. Preview / Review Ekranı

**Amaç:** Üretilen videoların incelenmesi ve onaylanması.

**Görünüm:** Liste veya grid halinde, ürün adı ve video yan yana.

**Her video için aksiyonlar:**
- **Approve:** Video onaylanır, export/send adımına taşınır.
- **Edit Prompt:** Edit akışı açılır; kullanıcı revize eder.
- **Reject:** Video reddedilir, akıştan çıkar.

**Toplu aksiyon:** Tüm videoları aynı anda onaylama seçeneği değerlendirilebilir (bkz. Out of Scope — "toplu onaylama" V1'de MVP sınırında).

---

### 6. Edit Prompt Ekranı

**Amaç:** Kullanıcının beğenmediği videoyu revize etmesi.

**Yapı (hibrit):**
- Dropdown / preset seçenekleri (sektöre ve şablona göre değişen öneriler)
- Free text prompt alanı (örnek: "süet, tokalı, babet" gibi spesifik istekler yazılabilir)
- Örnek promptlar / guidance (kullanıcıya ilham vermek için)

**Neden free text:** Moda/tekstil gibi sektörlerde sınırsız varyasyon gerekebilir. Yalnızca dropdown ile bu ihtiyaç karşılanamaz.

**Maliyet:** Yeniden üretim başlamadan token maliyeti gösterilir. Token iadesi konusu Open Questions'da.

---

### 7. Export / Send to Feed Ekranı

**Amaç:** Onaylanan videoların indirilmesi veya feed kanallarına gönderilmesi.

**Aksiyonlar:**
- Tekil video indirme (MP4)
- ZIP toplu indirme (tüm onaylanan videolar)
- Feed'e gönderim: konfigüre edilmiş export'lara video asset URL'sini yaz

**Karar:** Hiçbir video insan onayı olmadan otomatik olarak feed'e gönderilmez.

---

#### "Apply to Exports" UX Referansı

Mevcut Optifeed'in feed dağıtım ekranı ("Apply to exports") bu adım için doğrudan referans alınabilir.

**Mevcut ekran yapısı:**

- Başlık: "Apply to exports"
- 2 kolonlu kart grid'i
- Her kart şunları içerir:
  - Kanal logosu (Google, Meta, Criteo vb.)
  - Export adı (örn. "Google Merchant Export", "Meta Export", "Meta export with dynamic creati...")
  - Feed kaynağı alt başlığı (örn. "Shopify Feed (all collections)")
  - Etkilenen ürün sayısı — mor/vurgulu (örn. "26 of 147 products")
  - **"Custom attribute" dropdown** — hangi feed alanına yazılacağını seçer (örn. `g:custom_label_4`, `internal_label`, `custom_label_0`)
  - **"Apply" butonu** — o feed'e tekil uygulama

Görünür kanallar: Google Ads Page Feed, Google Export, Google Merchant Export, Meta Export, Meta Export (Copy), Meta export with dynamic creative, Wefood Criteo XML

**Video Send to Feed adaptasyonu:**

Aynı kart yapısı korunur. Tek fark: "Custom attribute" dropdown yerine **"Video attribute"** dropdown gelir — kullanıcı üretilen video URL'sinin feed'de hangi alana yazılacağını seçer (örn. `video_url`, `g:video_link` veya mevcut bir custom label alanı). "Apply" ile ilgili export feed'ine uygulanır.

```
Her feed kartı için:
  → Kanal logosu + export adı + ürün sayısı
  → "Video attribute" dropdown (hangi alana video URL yazılacak)
  → "Apply" butonu
```

**Açık tasarım kararı:** Mevcut ekranda her feed için ayrı "Apply" var. Video akışında "Apply All" seçeneği de değerlendirilebilir.

---

## Product Selection Logic

```
Görüntülenen ürünler:
  - Tüm katalog (varsayılan sıralama: "Recently added")
  - Arama: ürün adı, ID veya item group ID üzerinden

Seçim limiti:
  - Minimum: 1
  - Maximum: 10 ürün

Limit aşılırsa:
  - CTA disabled
  - Bilgilendirici hata mesajı gösterilir

Maliyet/süre güncelleme:
  - Her ürün eklendiğinde veya çıkarıldığında anlık hesaplanır
  - "Yaklaşık" ifadesi kullanılır
```

---

## Template Selection Logic

**MVP'de şablon önerisi statiktir.** Varsayılan şablon: `product-spotlight`.

Gelecekte dinamik öneri hedeflenmektedir: ürünün indirim durumu, yayın tarihi, satış verisi gibi sinyallere göre sistem şablon önerebilir. Bu V2 kapsamındadır.

Şablon seçim ekranı açık bir grid yapısında sunulur; kullanıcı şablonları doğrudan görür. Gizli "Change" butonu kullanılmaz.

---

## Cost / Token Logic

**Sabit görünüm:**
- Kullanıcının mevcut token / kredi bakiyesi sağ üstte her zaman görünür.

**Üretim öncesi:**
- Seçilen ürün sayısı
- Üretilecek video sayısı
- Tahmini toplam süre (yaklaşık)
- Tahmini token / kredi maliyeti (yaklaşık)
- Mevcut bakiye ile karşılaştırma

**Üretim başladığında:**
- Token bakiyeden düşülür.
- Kullanıcıya önceden bilgi verilmiş olduğu kabul edilir.

**Edit Prompt akışında:**
- Yeniden üretim başlamadan token maliyeti gösterilir.
- Token iadesi: Yok. Üretim başlatıldıktan ve Edit Prompt sonrası yeniden üretimde token iade edilmez.

---

## Generation Progress Logic

```
Üretim başladığında:
  - Progress ekranı açılır
  - Her video için ayrı durum kartı gösterilir:
    - "Generating..." → tamamlandığında video belirir
    - Sonraki videolar "Pending" olarak sırada gösterilir
  - Tamamlanan video hemen izlenebilir ve incelenebilir
  - Kalan tahmini süre gösterilir (yaklaşık)

Her video tamamlandığında:
  - Kart "Ready" durumuna geçer
  - Kullanıcı o videoyu beklemeye gerek kalmadan incelemeye başlayabilir
```

---

## Preview / Review / Edit Logic

```
Her video için:
  - Approve → video onay listesine eklenir
  - Edit Prompt → edit ekranı açılır
    - Kullanıcı revize eder
    - Maliyet gösterilir, onay alınır
    - Yeniden üretim başlar
    - Yeni çıktı preview'a döner
  - Reject → video akıştan çıkar

Tüm videolar işlendiğinde:
  - Export / Send to Feed adımına geçilir
```

---

## Export / Feed Logic

**Tekil indirme:** Her video için MP4 indirme seçeneği.

**Send to Feed:**
- Onaylanan videolar seçilen kanallara gönderilir.
- Kanal seçenekleri: Google Merchant Center, Meta Catalog, TikTok Catalog.
- Gönderim kullanıcı aksiyonuyla tetiklenir; otomatik yayın yoktur.

**Klasöre kayıt:** Onaylanan ve gönderilen videolar ilgili library klasöründe saklanır.

**ZIP toplu indirme:** V1 kapsamına dahildir. Onaylanan tüm videolar tek ZIP paketi olarak indirilebilir.

**Scheduling:** V1 dışıdır. Kampanya bazlı başlangıç/bitiş tarihi otomasyonu V2'ye bırakılmıştır.

---

## Safety / Guardrails

Sistem, uygunsuz video üretimini önlemek amacıyla temel bir güvenlik katmanı içerir.

**Engellenmesi hedeflenen içerik:**
- Cinsel veya müstehcen içerik
- Çıplaklık
- Şiddet
- Kullanım koşullarına aykırı diğer içerikler

**Uygulama yöntemi:** Prompt seviyesi (base / sistem prompt'una yasaklı içerik kategorileri açıkça eklenir).

**Önerilen yaklaşım:**

1. **Prompt seviyesi (birincil):** Sistem prompt'una yasaklı içerik listesi eklenir. Kullanıcı girdileri (guided alanlar + free text) üretim öncesinde temizleme katmanından geçirilir. En düşük maliyet, en hızlı uygulama.
2. **Model seviyesi (ikincil — ücretsiz):** Runway, Pika, Kling gibi servislerin büyük çoğunluğu kendi içerik politikalarını model düzeyinde zaten uygular. Bu katmana ek bir çalışma gerekmez; ancak güvenilemeyecek kadar tek başına yeterli değildir.
3. **Post-processing (V2):** Output analizi maliyet ve gecikme yaratır; V1 için öncelikli değil. Kötüye kullanım vakalarında devreye alınabilir.

**Karar:** V1 için prompt seviyesi + AI servisinin kendi model guardrail'larına güven yeterlidir.

---

## Open Questions

| # | Soru | Öncelik |
|---|------|---------|
| 1 | "Apply to Exports" ekranı referans alındı (bkz. Export/Send to Feed bölümü). Açık kalan: her feed için ayrı "Apply" mı kalacak, yoksa "Apply All" seçeneği de eklenecek mi? | Orta |
| 2 | Kanal gönderimi başarısız olursa kullanıcı nasıl bilgilendirilecek? Webhook / polling yapısı planlanıyor mu? | Yüksek |
| 3 | Gerçek AI video üretim servisi hangisi olacak? (Runway, Pika, Kling vb.) | Teknik |
| 4 | Aynı ürün için birden fazla video versiyonu saklanabilir mi? Versiyon yönetimi var mı? | Düşük |
| 5 | Hover preview V2'de mi kesin olarak? | Düşük |

---

### Çözümlenen Kararlar

| Karar | Sonuç |
|-------|-------|
| Ürün seçim limiti | **10 ürün** |
| Token iadesi | **Yok** — üretim başlatıldıktan ve Edit Prompt sonrası iade edilmez |
| Safety guardrails | **Prompt seviyesi** — bkz. Safety bölümü |
| ZIP toplu indirme | **V1 kapsamında** |
| Scheduling | **V1 dışı** |
| Bulk upload | **V1 dışı** |
| E-posta / in-app bildirim | **V1 dışı** |
| Per video üretim süresi | **~2 dakika** |
| Asset depolama detayı | **Kapsam dışı bırakıldı** |

---

## Success Criteria

### Güçlü sinyaller (akışın çalıştığını gösterir)
- Kullanıcı akışı baştan sona tamamlıyor (library → product selection → template → generate → review → export).
- Kullanıcı "Create another video" ile akışı birden fazla kez döngüye alıyor.
- Onaylanan videolar seçilen kanallarda feed'e başarıyla ekleniyor.
- Feed kampanya performansı, video asset eklenen ürünlerde artıyor.

### Zayıf sinyaller (kullanıcı deneyiminde sorun olduğunu gösterir)
- Kullanıcı ürün seçim ekranında ilerlemiyor.
- "Generate" başlatıyor ama review ekranından çıkıyor veya redediyor.
- Videoları indiriyor ancak kanallara göndermiyor.
- Edit Prompt'u kullanmayıp tüm videoları reddediyor.

### Metrikler
| Metrik | Açıklama |
|--------|----------|
| Akış tamamlama oranı | Library girişinden SuccessStep'e kadar tamamlayan kullanıcı yüzdesi |
| Ürün başına üretim süresi | Seçimden onaya kadar geçen ortalama süre |
| Edit Prompt kullanım oranı | Approve'a karşı Edit oranı |
| Kanal dağıtım oranı | "Skip" vs "Send to Feed" tercihi |
| Döngüsel kullanım | "Create another" oranı, tek seferde işlenen ortalama ürün sayısı |
| Şablon dağılımı | Hangi şablon en çok seçiliyor |
| Token iade oranı | Kaçta kaçı üretim sonrası beğenmeyip revize istiyor |

---

## Revision Notes

Bu doküman discovery meeting ve internal feedback notları temel alınarak hazırlanmıştır.

### V1 → V1 Validated Prototype (ilk revizyon)
- **Library / folder yapısı eklendi** — önceki versiyonda yoktu.
- **Product Selection CTA "Generate video" → "Choose template" olarak değiştirildi.**
- **Multi-dimension / multi-aspect ratio üretimi MVP dışına çıkarıldı; yalnızca 1:1 kalıyor.**
- **Text overlay / dynamic creative overlay MVP dışına çıkarıldı.**
- **Generation progress ekranı eklendi** — önceki versiyonda 1,2 saniyelik simülasyon vardı; gerçek akışa geçiliyor.
- **Edit Prompt akışı tanımlandı** — önceki "Regenerate" butonu yerini hibrit düzenleme ekranına bıraktı.
- **Cost / token şeffaflığı yeni bölüm olarak eklendi.**
- **Safety / guardrails bölümü eklendi.**
- **Template seçim ekranı açık grid yapısına taşındı** — gizli "Change" butonu kaldırıldı.
- **"Send to Feed" adımı korundu** ama UX detayı Open Questions'a taşındı.
- **Bulk generation (1000 ürün ölçeği) MVP dışına çıkarıldı.**

### Open Questions çözüm turu (2. revizyon)
- **Seçim limiti 10 ürün** olarak netleşti.
- **Token iadesi yok** olarak netleşti.
- **Safety guardrails: prompt seviyesi** kararlaştırıldı; öneri ve gerekçe Safety bölümüne eklendi.
- **ZIP toplu indirme V1 kapsamına alındı.**
- **Scheduling, bulk upload, e-posta/in-app bildirim V1 dışı** olarak netleşti.
- **Per video üretim süresi ~2 dakika** olarak netleşti.
- **Send to Feed UX** "Apply to Exports" ekranından türetildi: her feed için kanal kartı + "Video attribute" dropdown + "Apply" butonu pattern'i benimsendi. Detay Export/Send to Feed bölümünde.
