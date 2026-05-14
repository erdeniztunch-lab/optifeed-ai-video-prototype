# Todo — feedback2.md Delta Implementation

> Yalnızca feedback2.md'den gelen değişiklikler ve eklemeler listelendi.
> Halihazırda doğru çalışan özellikler tekrar edilmedi.
> Bağımlılık sırasına göre gruplanmıştır.

---

## Grup 1 — Akış Değişiklikleri (En Kritik)

### 1.1 — Giriş noktasını ürün listesine taşı
- **Dosyalar:** `src/pages/Videos.tsx`
- **Ne değişmeli:** `stage`'in başlangıç değeri `"library"`'den `"select"`'e çekilmeli. Library artık zorunlu ilk adım değil; kullanıcı doğrudan ürün listesini görür.
- **Kabul kriteri:** Uygulama açıldığında SelectStep görünür. Library'ye sidebar'daki "Video Kütüphanesi" linkiyle ulaşılabilir.
- **Not:** `handleOpenFolder` / `handleCreateFolder` akışları korunur; ancak bunlar zorunlu giriş yolu olmaktan çıkar.

---

### 1.2 — Kampanya adı modal'ı ekle (ürün seçimi sonrası)
- **Dosyalar:** `src/pages/Videos.tsx`, yeni `src/components/videos/CampaignNameModal.tsx`
- **Ne değişmeli:**
  - `CostEstimateBar`'daki "Şablon seç" CTA'sı tıklandığında şablon ekranına geçmek yerine `CampaignNameModal`'ı açar.
  - Modal içeriği: zorunlu text input (kampanya adı), mevcut klasörlerden seçim veya "Yeni klasör" seçeneği, "Devam et" butonu (input boşken disabled), iptal butonu.
  - "Devam et" tıklandığında `activeFolderName` set edilir, `stage` → `"template"`.
- **Kabul kriteri:** SelectStep'ten Template'e geçişte kampanya adı olmadan ilerlenemez. Modal, folder adını `Videos.tsx`'teki state'e yazar.

---

## Grup 2 — Ürün Listesi Geliştirmeleri

### 2.1 — Filtre dropdown'ları ekle (Kategori, Marka)
- **Dosyalar:** `src/components/videos/SelectStep.tsx`
- **Ne değişmeli:** Mevcut search input'a ek olarak iki dropdown filtre eklenmeli: Kategori (`category`) ve Marka (`brand`). Filtre seçimi `useMemo` içindeki ürün listesini günceller. ID zaten arama ile karşılanıyor.
- **Kabul kriteri:** Kategori ve marka dropdown'larından seçim yapıldığında ürün listesi filtrelenir. Arama ile birlikte çalışır.

---

### 2.2 — Ürün üretim geçmişi uyarısı
> ⚠️ **Blocker:** Open Questions #8 çözülmeden bu özelliğin V1'e alınıp alınmayacağı netleşmez. Blocker varsa bu maddeyi atla.
- **Dosyalar:** `src/components/videos/ProductCard.tsx`, `src/data/products.ts`
- **Ne değişmeli:** `Product` interface'indeki mevcut `status: "no-video" | "ready"` alanı yeterli değil — "daha önce video üretildi ama henüz onaylanmadı" durumu için yeni bir durum veya ek alan gerekmez; `"ready"` zaten bunu ifade ediyor. Ancak ProductCard'da `status === "ready"` olan ürünler için "Bu ürün için daha önce video oluşturuldu" uyarı badge'i veya tooltip gösterilmeli.
- **Kabul kriteri:** `status: "ready"` olan ürünlerin kartında görünür bir uyarı/badge gösterilir. Kullanıcı tekrar seçebilir ama bilinçli olarak.

---

## Grup 3 — Library Ekranı Değişiklikleri

### 3.1 — Klasör aktif/pasif toggle'ı ekle
- **Dosyalar:** `src/components/videos/FolderCard.tsx`, `src/data/folders.ts`
- **Ne değişmeli:**
  - `VideoFolder` interface'ine zaten `status: "active" | "draft"` var. Bu alan kullanılarak her `FolderCard`'a aktif/pasif toggle (Switch veya basit buton) eklenmeli.
  - Toggle durumu `folders` state'ini `Videos.tsx`'te günceller.
- **Kabul kriteri:** Klasör kartında toggle görünür; tıklandığında `status` "active" ↔ "draft" arasında geçiş yapar ve UI'da yansır.

---

### 3.2 — Draft video erişimi (klasör içinde "onay bekliyor" statüsü)
- **Dosyalar:** `src/pages/Videos.tsx`, `src/data/folders.ts`, `src/components/videos/LibraryStep.tsx`
- **Ne değişmeli:**
  - Üretim tamamlandığında `videoJobs` state'i klasörle ilişkilendirilmeli ve folder'a yazılmalı.
  - `LibraryStep`'te her klasör kartında "X video onay bekliyor" gibi bir gösterge eklenmeli.
  - Klasöre tıklandığında mevcut `videoJobs` yüklenip `stage → "review"` geçiş yapılabilmeli.
- **Kabul kriteri:** Sayfayı yenilemeden Library'ye gidildiğinde üretilen videolar klasörde "onay bekliyor" olarak görünür. Klasöre tıklayınca ReviewStep açılır.
- **Not:** Bu prototipte gerçek persistence yok; `Videos.tsx` state'inde tutmak yeterli.

---

## Grup 4 — Export / İndirme Değişiklikleri

### 4.1 — "Tüm videolar" ZIP indirme seçeneği ekle
- **Dosyalar:** `src/components/videos/ExportStep.tsx`
- **Ne değişmeli:** Mevcut ZIP butonu yalnızca onaylananları indiriyor. "Tüm videoları indir" seçeneği eklenmeli — onaylı, reddedilmiş ve bekleyenler dahil tüm `videoJobs` tek ZIP'e eklenir.
- **Kabul kriteri:** ExportStep'te iki ayrı indirme aksiyonu: "Onaylananları indir (ZIP)" ve "Tüm videoları indir (ZIP)".

---

### 4.2 — Export granülasyonunu klasör seviyesine taşı
- **Dosyalar:** `src/components/videos/ExportStep.tsx`
- **Ne değişmeli:** Mevcut akışta her feed kartı bağımsız — "Apply" her feed için ayrı çalışıyor. Bu aslında istenilen klasör-bazlı davranışı karşılıyor. Ancak "Tümüne Uygula" butonu şu an confirmation dialog'unu tetikliyor ama mesaj "video bazlı" değil "klasör bazlı" dili kullanmalı. Metinler güncellenmeli: "X onaylı video tüm seçili feed'lere uygulandı" gibi.
- **Kabul kriteri:** "Tümüne Uygula" ve tekil "Uygula" metinleri klasör/kampanya seviyesinde dili kullanır.

---

## Grup 5 — Sidebar Token Görünürlüğü

### 5.1 — Sol sidebar'da harcanan token gösterimi
- **Dosyalar:** `src/components/AppShell.tsx`, `src/components/videos/TokenBadge.tsx`
- **Ne değişmeli:**
  - `AppShell` şu an `tokenBalance` prop'u alıyor ve `TokenBadge`'e geçiyor. `TokenBadge` yalnızca bakiyeyi gösteriyor.
  - `Videos.tsx`'te mevcut `tokenBalance`'dan `MOCK_TOKEN_BALANCE - tokenBalance` hesaplanarak "harcanan" miktar türetilir ve `AppShell`'e prop olarak geçilir.
  - `AppShell` ve `TokenBadge` "X token harcandı" satırını da gösterecek şekilde güncellenir.
- **Kabul kriteri:** Sidebar'da her zaman hem mevcut bakiye hem de bu oturumda harcanan token miktarı görünür.

---

## Grup 6 — Şablon İsimlendirmesi

### 6.1 — Şablon isimlerini senaryo bazlı yap
> ⚠️ **Blocker:** Open Questions #6 çözülmeden gerçek isimler yazılamaz. Senaryo isimler ve promptları Product / Design tarafından belirlenmeli.
- **Dosyalar:** `src/data/templates.ts`
- **Ne değişmeli:** `label`, `description`, `helperText` ve `details` alanları soyut isimlerden somut senaryo tanımlarına güncellenir. Örnek: `"Ürün Odağı"` → `"Vitrin önünde duran kadın"` gibi.
- **Kabul kriteri:** 4 şablonun tamamında senaryo bazlı isim ve açıklama bulunur. Open Question #6 çözüldükten sonra implemente edilir.

---

## Kapsam Dışı — Geri Alınacak / Eklenmeyecekler

- **Video bazında platform seçimi**: Her `ReviewVideoCard`'a platform seçimi özelliği eklenmemeli. Export yalnızca klasör düzeyinde çalışmalı. (Mevcut kodda bu yok — dikkat et, ekleme.)
- **Statik fotoğraf → manken giydirme**: Hiçbir ekranda fotoğraf yükleme + AI giydirme akışı başlatılmamalı.
- **İnteraktif canlı demo**: Public-facing, tüm müşterilerin erişebileceği demo modu eklenmemeli.
- **Menü gruplandırması (AI Studio)**: Sidebar nav'a "AI Studio" başlığı eklenmemeli — deferred.

---

## Özet Tablo

| # | Görev | Bağımlılık | Blocker? |
|---|-------|-----------|---------|
| 1.1 | Giriş noktası → ürün listesi | — | Hayır |
| 1.2 | Kampanya adı modal'ı | 1.1 sonrası | Hayır |
| 2.1 | Filtre dropdown'ları | — | Hayır |
| 2.2 | Üretim geçmişi uyarısı | — | ⚠️ OQ #8 |
| 3.1 | Klasör aktif/pasif toggle | — | Hayır |
| 3.2 | Draft video erişimi (Library) | 1.2 sonrası | Hayır |
| 4.1 | "Tüm videolar" ZIP | — | Hayır |
| 4.2 | Export dili → klasör bazlı | — | Hayır |
| 5.1 | Sidebar harcanan token | — | Hayır |
| 6.1 | Şablon senaryo isimleri | — | ⚠️ OQ #6 |
