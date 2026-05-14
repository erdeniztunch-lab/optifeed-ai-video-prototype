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

**Kullanıcı alışkanlığı:** Kampanya ve promo bazlı çalışır. Ürettiği içerikleri kampanyaya göre gruplar ve sonradan tekrar erişmek ister. <!-- updated: E-ticaret kullanıcısı "önce ürünü bul, sonra işlem yap" mantığıyla çalışır; klasör yaratmak giriş noktası olmamalı (Zafer feedback) -->

---

## Product Principles

1. **Template-first, guided:** Kullanıcıya boş prompt alanı gösterilmez. Akış şablon seçimiyle başlar.
2. **Kontrollü üretim:** Araç, sınırsız yaratıcı editör değildir. Performance marketing için amaca uygun, belirli şablonlar üzerinden çalışır.
3. **Şeffaflık:** Kullanıcı üretim başlamadan tahmini süreyi ve maliyeti görür.
4. **Kampanya bazlı organizasyon:** Üretilen videolar klasör/library yapısında saklanır; kullanıcı kampanya bazlı çalışabilir.
5. **İnsan onayı:** Hiçbir video otomatik olarak feed'e gönderilmez. Kullanıcı her videoyu inceleyip onaylar.
6. **Güvenli üretim:** Uygunsuz içerik üretimini engelleyen temel güvenlik katmanı bulunur.
7. **Ürün öncelikli giriş:** Kullanıcı platforma girişte önce ürün kataloğunu görür; önce ürün seçer, sonra kampanya adı verir. <!-- updated: Zafer feedback — kullanıcı neyi seçeceğini görmeden klasör yaratmak istemez -->

---

## MVP Scope

**Kapsam dahilindeki özellikler:**

- Folder / library yapısı (temel seviye — kampanya bazlı organizasyon; sidebar/nav üzerinden erişilir) <!-- updated: Library artık zorunlu giriş noktası değil; sidebar'dan erişilir (Zafer feedback) -->
- Ürün arama (ürün adı, ID, item group ID)
- Ürün filtreleme: ID, Kategori, Marka <!-- updated: Zafer feedback — filtrelerle ürün arama giriş deneyiminin çekirdeği -->
- "Recently added" sıralama seçeneği
- Ürün metadata gösterimi (ad, ID, item group ID, kategori, marka, ana görsel, ek görsel sayısı)
- Ek görsel sayısı göstergesi (stacked image indicator)
- Ürün üretim geçmişi uyarısı ("bu ürün için daha önce video üretildi" göstergesi) <!-- updated: Zeynep/Zafer feedback — gereksiz token harcamasını önler -->
- Ürün seçim limiti ve bu limitin UI'da gösterimi
- Seçime bağlı tahmini maliyet ve süre göstergesi (anlık güncellenen)
- **Kampanya adı modal'ı** — ürün seçimi sonrası, şablon seçimine geçmeden önce bir pop-up ile kampanya/klasör ismi alınır <!-- updated: Zafer feedback — yeni akış gerekliliği -->
- "Choose template" CTA'sı (kampanya adı modal'ından sonra)
- Template seçim ekranı (açık grid yapısında)
- **Senaryo bazlı şablon isimlendirmesi** — soyut isimler yerine somut, kullanım senaryosu tanımlayan isimler <!-- updated: Zeynep feedback — "Ürün Odağı" gibi soyut isimler yerine "Alışveriş caddesinde durup vitrine bakan kadın" tarzı somut isimler -->
- Guided template akışı (sektör, tema, kampanya bağlamı, background, ürün tipi gibi yönlendirmeli giriş alanları)
- 1:1 format (1080×1080) video üretimi
- Token / kredi bakiyesi görünürlüğü (sol sidebar'da sabit) <!-- updated: feedback2 — sol menüde sürekli görünür olmalı -->
- **Harcanan token ve dakika maliyeti gösterimi** (sol sidebar'da, bakiyenin yanında) <!-- updated: Zafer feedback — harcamanın sürekli görünür olması -->
- Üretim sırasında progress ekranı (tamamlanan videolar belirirken gerisinin "pending/generating" olarak gösterimi)
- **Üretilen videolar klasörde "onay bekliyor" statüsünde saklanır** — onaylanmayan/reddedilmeyen videolar kaybolmaz <!-- updated: Zeynep feedback — kullanıcı token harcadığı için tüm çıktılara sonradan ulaşabilmeli -->
- Output inceleme ekranı (liste veya grid)
- Her video için approve / edit / reject aksiyonları
- Edit Prompt akışı (dropdown preset seçenekleri + free text alanı + örnek promptlar)
- Tekil video indirme (MP4)
- **Toplu indirme — tüm videolar** (onaylı veya onaysız, tek tuşla ZIP) <!-- updated: Zeynep/Zafer feedback — "ben görmemiştim, yayına gitmiş" şikayetini önler; tüm çıktılara erişim sağlanmalı -->
- Temel güvenlik katmanı (safety guardrails)
- Feed'e gönderim (Send to Feed) adımı — klasör bazlı, seçilen kanalların tamamına tek seferde gönderim <!-- updated: Zafer feedback — her video için ayrı platform seçimi kaldırıldı; klasördeki onaylı videolar bütün olarak gönderilir -->
- **Klasör aktif/pasif toggle'ı** — Dynamic Creative ile tutarlı deneyim için <!-- updated: Zafer feedback -->

---

## Out of Scope (MVP)

- Çoklu boyut eşzamanlı üretimi (dikey, yatay vb.) — V2
- 1:1 dışındaki aspect ratio'lar — V2
- Text overlay / font / kampanya metni editörü — ayrı feature veya Dynamic Creative ürününün parçası olarak değerlendirilecek
- Gelişmiş video editörü
- 1000 ürün ölçeğinde bulk generation — farklı mimari gerektirir; request-based flow olarak ayrıca değerlendirilecek
- Scheduling (start / end date) — V1 dışı
- Bulk upload (kullanıcı hazır liste yükler) — V1 dışı
- Hover preview (şablon kartlarında animasyonlu önizleme) — nice-to-have, V2 <!-- updated: feedback2 — Zeynep istek olarak dile getirdi; V2'de değerlendirilecek -->
- Otomatik feed yayını (insan onayı olmadan)
- E-posta ve in-app bildirim — V1 dışı
- **Statik fotoğraftan manken giydirme** — fotoğrafı yüklenen kıyafetin AI ile bir mankene giydirilmesi bu MVP'nin kapsamı dışında <!-- updated: feedback2 kapsam dışı kararı -->
- **Video bazında özel export** — aynı klasördeki videoların farklı mecralara bölünerek gönderilmesi kapsam dışı <!-- updated: feedback2 kapsam dışı kararı — klasör seviyesinde tek export -->
- **İnteraktif canlı demo** — tüm müşterilerin görebileceği simüle edilebilir genel demo kapsam dışı; MVP aşamasında yalnızca dahili demo hesabıyla test edilecek <!-- updated: feedback2 kapsam dışı kararı -->
- **Menü gruplandırması (AI Studio / Optif Visuals)** — Dynamic Creative, OptiVideo vb. özelliklerin tek başlık altında toplanması; şu an yalnızca Video olduğu için park edildi <!-- updated: Zeynep feedback — deferred -->

---

## Main User Flow

<!-- updated: Zafer feedback — akış sırası değişti; ürün listesi giriş noktası oldu, klasör ikinci plana alındı -->

```
1. PRODUCT SELECTION (giriş noktası)
   → Kullanıcı platforma girdiğinde ürün kataloğu görünür
   → Filtreler (ID, Kategori, Marka) + arama ile ürünler bulunur
   → Ürün seçilir (limit dahilinde)
   → Seçime bağlı tahmini maliyet ve süre anlık gösterilir
   → Daha önce video üretilmiş ürünler uyarı ile işaretlenir
   → CTA: "Şablon seç" (kampanya adı modal'ını açar)

2. CAMPAIGN NAME MODAL (pop-up)
   → Kullanıcı kampanya / klasör adı girer
   → Mevcut klasöre ekleme veya yeni klasör seçeneği
   → Onaylayınca şablon seçimine geçilir

3. TEMPLATE SELECTION
   → Senaryo bazlı şablonlar açık grid yapısında gösterilir
   → Kullanıcı guided alanları doldurur (sektör, ürün tipi, tema, background)
   → Üretim başlamadan son maliyet ve süre teyidi gösterilir
   → CTA: "Videoları üret"

4. GENERATION PROGRESS
   → Üretim başlar, progress ekranı açılır
   → Tamamlanan videolar ekrana belirir
   → Bekleyenler "pending / generating" olarak gösterilir
   → Üretilen videolar otomatik olarak klasörde "onay bekliyor" statüsünde saklanır

5. PREVIEW / REVIEW
   → Tamamlanan videolar liste veya grid halinde incelenir
   → Her video için: Approve / Edit / Reject

6. EDIT PROMPT (gerekirse)
   → Dropdown preset seçenekleri + free text alanı + örnek prompt guidance
   → Yeniden üretim başlar (maliyet teyidi gösterilir)
   → Yeni çıktı preview'a döner

7. EXPORT / SEND
   → Onaylanan tüm videolar bir bütün olarak seçilen kanallara gönderilir (klasör bazlı)
   → Toplu indirme: tüm videolar (onaylı veya değil) tek ZIP'te indirilebilir
   → Videolar ilgili klasöre kaydedilir

8. LIBRARY / FOLDER (sidebar üzerinden her an erişilebilir)
   → Mevcut kampanya klasörleri görüntülenir
   → Klasör aktif/pasif toggle'ı ile durum yönetimi
   → "Onay bekliyor" statüsündeki video'lar geçmişe dönük izlenebilir
```

---

## Screens

### 1. Product Selection Ekranı (Giriş Noktası) <!-- updated: Zafer feedback — ilk ekran ürün listesi -->

**Amaç:** Kullanıcının katalogdan video üretilecek ürünleri seçmesi. Platform açıldığında bu ekran gösterilir.

**Görüntülenecek ürün bilgileri:**
- Ana görsel
- Ek görsel sayısı göstergesi (stacked / iskambil kağıdı benzeri indicator)
- Ürün adı
- Status (video var / yok)
- **Üretim geçmişi uyarısı** — bu ürün için daha önce video üretilmişse görsel işaret <!-- updated: Zeynep/Zafer feedback — gereksiz token harcamasını önler -->
- ID
- Item group ID
- Kategori / product type
- Marka

**Arama:** Ürün adı, ID ve item group ID üzerinden arama yapılabilir.

**Filtreler:** <!-- updated: Zafer feedback — giriş deneyiminin çekirdeği -->
- ID ile filtre
- Kategori ile filtre
- Marka ile filtre

**Sıralama:** "Recently added" seçeneği mutlaka bulunur.

**Seçim limiti:** 10 ürün.

**Sticky alt bar — anlık güncellenen bilgiler:**
- Seçilen ürün sayısı / limit
- Tahmini üretim süresi (yaklaşık)
- Tahmini maliyet / token kullanımı (yaklaşık)
- "Bu aşamada ödeme alınmayacaktır" veya benzeri güven veren mikrocopy (değerlendirmeye alınmalı)

**CTA:** "Şablon seç" — tıklandığında kampanya adı modal'ı açılır.

---

### 2. Kampanya Adı Modal'ı <!-- updated: Zafer feedback — yeni ekran; ürün seçimi sonrası, şablon öncesi -->

**Amaç:** Kullanıcının üretim akışını bir kampanya / klasör adıyla etiketlemesi.

**İçerik:**
- Text input: "Kampanya adı" (zorunlu)
- Mevcut klasörlerden seçim veya yeni klasör oluşturma seçeneği
- Onay CTA'sı: "Devam et" → şablon seçimine geçer
- İptal: modal kapanır, ürün seçiminde kalınır

**Kural:** Klasör adı boşken "Devam et" disabled.

---

### 3. Template Selection Ekranı

**Amaç:** Kullanıcının video formatını ve üretim bağlamını belirlemesi.

**Template listesi:** Açık grid yapısında (2×2 veya benzeri) gösterilir. Gizli "Change" butonu kullanılmaz.

**Mevcut şablonlar:** <!-- updated: Zeynep feedback — isimler senaryo bazlı ve somut olmalı; örnek: "Alışveriş caddesinde yürüyen ve durup vitrine bakan bir kadın" -->
| id | Etiket | Kullanım amacı |
|----|--------|---------------|
| `product-spotlight` | *(senaryo bazlı isim — bkz. Open Questions #6)* | Tek ürün odaklı, temiz format |
| `sale-promotion` | *(senaryo bazlı isim — bkz. Open Questions #6)* | İndirim ve fiyat vurgulu |
| `new-arrival` | *(senaryo bazlı isim — bkz. Open Questions #6)* | Yeni ürün lansmanı |
| `social-story` | *(senaryo bazlı isim — bkz. Open Questions #6)* | Dikey, mobil-öncelikli (Not: MVP'de 1:1 üretim yapılıyor; bu şablon V1'de 1:1 boyutunda üretilir) |

**Not:** Tekstil sektörü için ilk 3–5 şablonun somut senaryo isim ve promptlarının belirlenmesi Open Questions'dadır. Öncelik: Yüksek.

**Guided prompt alanları (şablon seçiminin altında):**
- Sektör
- Tema / kampanya bağlamı (Anneler Günü, Ramazan, Dubai, Paris vb.)
- Background / concept
- Ürün tipi

Kullanıcı sıfırdan prompt yazmak zorunda değildir; preset seçenekler ve örnek girdiler gösterilir. Gerektiğinde kontrollü free text alanı sunulur.

**CTA:** "Videoları üret" — üretim başlamadan tahmini maliyet ve süre teyidi gösterilir.

**Format:** Tüm üretimler **1:1, 1080×1080** formatında yapılır. Diğer boyutlar MVP dışındadır.

---

### 4. Generation Progress Ekranı

**Amaç:** Kullanıcıyı üretim sürecinde aktif tutmak; boş bekleme deneyimini ortadan kaldırmak.

**Davranış:**
- Üretim başladığında progress ekranı açılır.
- Her video tamamlandıkça ekranda belirir ve izlenebilir hale gelir.
- Henüz tamamlanmayan videolar "Generating..." veya "Pending" durumunda görünür.
- Toplam video sayısı, tamamlanan sayısı ve kalan tahmini süre gösterilir.
- **Tamamlanan her video otomatik olarak klasörde "onay bekliyor" statüsüyle kaydedilir.** <!-- updated: Zeynep feedback — token harcandığı için üretilen videolar kaybolmamalı -->

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
- **Toplu indirme — tüm videolar** (onaylı veya onaysız): tek ZIP paketi <!-- updated: Zeynep feedback — kullanıcı token harcadığı için tüm çıktılara ulaşabilmeli -->
- Feed'e gönderim: **klasördeki onaylı videolar bütün olarak** seçilen kanallara gönderilir <!-- updated: Zafer feedback — video bazında platform seçimi kaldırıldı -->

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

**Karar:** "Apply All" seçeneği V1'de eklenecek. <!-- updated: feedback2 kararı — toplu export netleşti -->

---

### 8. Library / Folder Ekranı (Sidebar Üzerinden Erişilir) <!-- updated: Zafer feedback — Library artık zorunlu giriş noktası değil -->

**Amaç:** Kullanıcının kampanya bazlı organize çalışmasını sağlar. Daha önce üretilen videolar klasör yapısında bulunur.

**İçerik:**
- Mevcut klasör listesi (kampanya adı, oluşturma tarihi, video sayısı)
- **Aktif / pasif toggle'ı** her klasör için <!-- updated: Zafer feedback — Dynamic Creative ile tutarlı deneyim -->
- "Yeni klasör oluştur" aksiyonu
- Her klasöre tıklayarak içeriğe erişim
- Klasör içinde "onay bekliyor" statüsündeki videolara erişim <!-- updated: Zeynep feedback — draft video persistence -->

**Empty State:**
- Henüz hiç klasör ve video yoksa kullanıcıyı yönlendiren başlangıç mesajı ve "İlk videoyu oluştur" CTA'sı gösterilir.

**Karar:** Library yapısı en az temel seviyede MVP'de yer alır; ancak giriş noktası değildir.

---

## Product Selection Logic

```
Görüntülenen ürünler:
  - Tüm katalog (varsayılan sıralama: "Recently added")
  - Arama: ürün adı, ID veya item group ID üzerinden
  - Filtreler: ID, Kategori, Marka  ← updated: Zafer feedback

Üretim geçmişi:
  - Daha önce video üretilmiş ürünler işaretlenir  ← updated: feedback2

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

**Şablon isimlendirmesi senaryo bazlı olacak.** Soyut isimler (örn. "Ürün Odağı") yerine somut senaryo açıklamaları kullanılacak (örn. "Vitrin önünde yürüyüp duran kadın"). Tekstil için 3–5 şablonun somut isimleri ve promptları belirlenmesi gerekmektedir — bkz. Open Questions #6. <!-- updated: Zeynep feedback -->

Gelecekte dinamik öneri hedeflenmektedir: ürünün indirim durumu, yayın tarihi, satış verisi gibi sinyallere göre sistem şablon önerebilir. Bu V2 kapsamındadır.

Şablon seçim ekranı açık bir grid yapısında sunulur; kullanıcı şablonları doğrudan görür. Gizli "Change" butonu kullanılmaz.

---

## Cost / Token Logic

**Sabit görünüm:**
- Kullanıcının mevcut token / kredi bakiyesi **sol sidebar'da** her zaman görünür. <!-- updated: feedback2 — sol menüde sabit gösterim -->
- **Harcanan token miktarı ve dakika bazlı maliyet** de sol sidebar'da gösterilir. <!-- updated: Zafer feedback — harcama şeffaflığı -->

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
  - Video klasörde "onay bekliyor" statüsüyle kaydedilir  ← updated: Zeynep feedback
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
  - Reject → video akıştan çıkar; klasörde "reddedildi" statüsünde saklanır  ← updated: Zeynep feedback

Tüm videolar işlendiğinde:
  - Export / Send to Feed adımına geçilir
```

---

## Export / Feed Logic

**Tekil indirme:** Her video için MP4 indirme seçeneği.

**Toplu indirme:** <!-- updated: Zeynep feedback — tüm videolar indirilebilmeli, yalnızca onaylananlar değil -->
- Onaylanan videolar ZIP olarak indirilebilir.
- **Tüm videolar** (onaylı veya değil) da ayrı bir ZIP ile indirilebilir.

**Send to Feed:** <!-- updated: Zafer feedback — klasör bazlı export -->
- Klasördeki **onaylanan videolar bir bütün olarak** seçilen kanallara gönderilir.
- Video bazında ayrı platform seçimi yoktur.
- Kanal seçenekleri: Google Merchant Center, Meta Catalog, TikTok Catalog.
- Gönderim kullanıcı aksiyonuyla tetiklenir; otomatik yayın yoktur.

**Klasöre kayıt:** Onaylanan ve gönderilen videolar ilgili library klasöründe saklanır.

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
| 1 | "Apply to Exports" ekranında her feed için ayrı "Apply" mı kalacak, yoksa "Apply All" tek aksiyon mı olacak? | Orta |
| 2 | Kanal gönderimi başarısız olursa kullanıcı nasıl bilgilendirilecek? Webhook / polling yapısı planlanıyor mu? | Yüksek |
| 3 | Gerçek AI video üretim servisi hangisi olacak? (Runway, Pika, Kling vb.) | Teknik |
| 4 | Aynı ürün için birden fazla video versiyonu saklanabilir mi? Versiyon yönetimi var mı? | Düşük |
| 5 | Hover preview V2'de mi kesin olarak? | Düşük |
| 6 | Tekstil sektörü için 3–5 senaryo bazlı şablon isim ve promptları kim yazacak ve ne zaman hazır olacak? | Yüksek — bkz. feedback2 aksiyon #2 <!-- updated: Zeynep feedback + feedback2 aksiyon #2 --> |
| 7 | Mevcut AI altyapısı bir ürün için birden fazla görsel (kıyafetin ön/arka/detay açıları) aynı anda işleyebiliyor mu? | Kritik — bkz. feedback2 teknik risk <!-- updated: Zeynep feedback — çoklu görsel girdisi; teknik doğrulama gerekmez UI'ı blocklıyor --> |
| 8 | Ürün üretim geçmişi uyarısı ("bu ürün için daha önce video üretildi") V1'de eklenecek mi, yoksa V2'ye mi bırakılacak? | Orta <!-- updated: feedback2 — gereksiz token harcamasını önler --> |

---

### Çözümlenen Kararlar

| Karar | Sonuç |
|-------|-------|
| Ürün seçim limiti | **10 ürün** |
| Token iadesi | **Yok** — üretim başlatıldıktan ve Edit Prompt sonrası iade edilmez |
| Safety guardrails | **Prompt seviyesi** — bkz. Safety bölümü |
| ZIP toplu indirme | **V1 kapsamında — tüm videolar (onaylı veya değil)** <!-- updated: Zeynep feedback --> |
| Scheduling | **V1 dışı** |
| Bulk upload | **V1 dışı** |
| E-posta / in-app bildirim | **V1 dışı** |
| Per video üretim süresi | **~2 dakika** |
| Asset depolama detayı | **Kapsam dışı bırakıldı** |
| Giriş noktası | **Ürün listesi (product-first)** — Library zorunlu giriş noktası değil <!-- updated: Zafer feedback --> |
| Export granülasyonu | **Klasör seviyesi** — video bazında platform seçimi yok <!-- updated: Zafer feedback --> |
| Draft video persistence | **Üretilen videolar "onay bekliyor" statüsünde klasörde saklanır** <!-- updated: Zeynep feedback --> |
| Klasör aktif/pasif toggle | **V1 kapsamında** <!-- updated: Zafer feedback --> |
| Statik foto → manken giydirme | **Kapsam dışı** <!-- updated: feedback2 --> |
| İnteraktif canlı demo | **Kapsam dışı** — yalnızca dahili demo hesabı <!-- updated: feedback2 --> |

---

## Success Criteria

### Güçlü sinyaller (akışın çalıştığını gösterir)
- Kullanıcı akışı baştan sona tamamlıyor (ürün seçimi → kampanya adı → şablon → üretim → inceleme → export). <!-- updated: akış sırası güncellendi -->
- Kullanıcı "Yeni video oluştur" ile akışı birden fazla kez döngüye alıyor.
- Onaylanan videolar seçilen kanallarda feed'e başarıyla ekleniyor.
- Feed kampanya performansı, video asset eklenen ürünlerde artıyor.

### Zayıf sinyaller (kullanıcı deneyiminde sorun olduğunu gösterir)
- Kullanıcı ürün seçim ekranında ilerlemiyor.
- "Generate" başlatıyor ama review ekranından çıkıyor veya reddediyor.
- Videoları indiriyor ancak kanallara göndermiyor.
- Edit Prompt'u kullanmayıp tüm videoları reddediyor.

### Metrikler
| Metrik | Açıklama |
|--------|----------|
| Akış tamamlama oranı | Ürün seçiminden SuccessStep'e kadar tamamlayan kullanıcı yüzdesi |
| Ürün başına üretim süresi | Seçimden onaya kadar geçen ortalama süre |
| Edit Prompt kullanım oranı | Approve'a karşı Edit oranı |
| Kanal dağıtım oranı | "Skip" vs "Send to Feed" tercihi |
| Döngüsel kullanım | "Yeni video oluştur" oranı, tek seferde işlenen ortalama ürün sayısı |
| Şablon dağılımı | Hangi şablon en çok seçiliyor |
| Token iade oranı | Kaçta kaçı üretim sonrası beğenmeyip revize istiyor |
| Draft video erişim oranı | Kaç kullanıcı klasörden "onay bekliyor" videoya geri dönüyor <!-- updated: Zeynep feedback metriği --> |

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

### Discovery Meeting & feedback2.md (3. revizyon) <!-- updated: feedback2.md kararları eklendi -->
- **Giriş akışı değişti:** Kullanıcı platforma girince ilk ekran ürün listesidir; Library zorunlu giriş noktası olmaktan çıktı.
- **Kampanya adı modal'ı eklendi:** Ürün seçimi sonrası, şablon öncesi kullanıcıdan kampanya/klasör adı alınıyor.
- **Şablon isimlendirmesi senaryo bazlı olacak:** Soyut isimler somut senaryo açıklamalarına dönüştürülecek; tekstil için 3–5 şablon belirlenmesi aksiyon.
- **Export granülasyonu klasör seviyesine taşındı:** Video bazlı platform seçimi kaldırıldı.
- **Draft video persistence eklendi:** Üretilen videolar "onay bekliyor" statüsünde saklanıyor.
- **Klasör aktif/pasif toggle eklendi.**
- **Toplu indirme genişletildi:** Yalnızca onaylananlar değil, tüm videolar indirilebilir.
- **Üç yeni kapsam dışı karar:** Manken giydirme, video bazlı platform dağıtımı, interaktif genel demo.
- **Çoklu görsel girdisi teknik risk olarak işaretlendi** — mevcut AI altyapısının kapasitesi doğrulanmadan UI tasarımı blocklıyor.
