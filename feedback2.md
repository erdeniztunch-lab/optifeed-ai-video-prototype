# OptiVideo — Discovery Meeting Notları

---

## 1. Kısa Toplantı Özeti

OptiVideo platformunun UI/UX prototipi Erdeniz tarafından ekibe sunuldu. Gündem; kullanıcının platforma ilk girişte yönlendirilmesi, kampanya/klasör oluşturma akışının ürün seçimiyle entegrasyonu, tekstil sektörü için gerçekçi video şablonlarının kurgulanması, çoklu görsel girdisinin AI kalitesine etkisi ve video onay/export süreçlerinin sadeleştirilmesiydi. Toplantı yapıcı, detay odaklı ve çözüm odaklı geçti.

---

## 2. Ana Feedbackler

**Zafer — Kullanıcı Yönlendirmesi ve Giriş Akışı**
Ana sayfada kullanıcının yönlendirilmeye ihtiyacı var. Statik görselden videoya geçişi gösteren bir örnek ve "how to start" rehberi olmalı. Kullanıcı boş bir ekranda doğrudan "Klasör Oluştur" demek yerine, ilk ekranda ürün listesini görmeli; önce filtrelerle (ID, Kategori, Marka) ürünleri seçmeli, ardından kampanya/klasör oluşturmalı. Bu, e-ticaret kullanıcısının alışkın olduğu "önce ürünü bul, sonra işlem yap" mantığına uygundur.

**Zafer — Toplu Export ve Onay Mantığı**
Kullanıcılar videoları tek tek onaylamalı; "ben görmemiştim, yayına gitmiş" gibi şikayetler oluşmamalı. Her video için ayrı platform seçimi (Google, Meta vb.) kaldırılmalı; tüm klasördeki onaylı videolar bir bütün olarak seçilen kanallara gönderilmeli.

**Zeynep — Şablon Gerçekçiliği ve İsimlendirme**
Şablon isimleri "Ürün Odağı" gibi soyut olmak yerine "Alışveriş caddesinde yürüyen ve durup vitrine bakan bir kadın" gibi somut, senaryo bazlı olmalı. Videoda ürün farklı açılardan görünmeli ve duraklama anı (window shopping) olmalı; hareket halinde ürün net algılanamaz.

**Zeynep — Çoklu Görsel Girdisi**
Yapay zeka, görmediği kısımları (kıyafetin arkası, dekoltesi, fırfırı, uzunluğu) tahmin edemez ve hatalı üretim yapar. Platformun bir ürün için feed'deki tüm varyasyon/açı görsellerini aynı anda işleyebilmesi gerekiyor.

**Zeynep — Kredi/Token Koruması ve Draft Yönetimi**
Kullanıcı token harcıyor. Üretilen ama henüz onaylanmayan ya da reddedilmeyen videolar kaybolmamalı, "onay bekliyor" statüsünde klasörde saklanmalı.

**Zeynep — Menü Gruplandırması**
Dynamic Creative, OptiVideo gibi görsel ve AI odaklı tüm özellikler sol menüde "AI Studio" veya "Optif Visuals" gibi tek bir ana başlık altında toplanmalı. *(Şu an yalnızca Video olduğu için şimdilik park edildi.)*

---

## 3. Açık ve İma Edilen İstekler

**Açık istekler:**
- Sol menüde harcanan token ve video üretim dakika maliyetinin sürekli görünür olması.
- Tüm videoları (onaylı veya onaysız) tek tuşla indirebilen "Toplu İndir" butonu.
- Şablon seçimi öncesinde sektör/ürün tipi detaylarının (tekil ürün, set, görsel grubu vb.) dropdown ile seçilmesi.
- Şablonların hover'da hareketli önizleme (animasyon) oynatması.
- Video overlay'lerinin (marka, fiyat) AI ile değil, sonradan "Dynamic Creative" mantığıyla platform tarafından eklenmesi.
- Kampanya/Klasörler için Dynamic Creative'deki gibi "Aç / Kapa" (aktif/pasif) özelliği.

**İma edilen istekler:**
- Üretim beklenirken ekranın donuk kalmaması; tamamlanan ilk videolar diğerleri arka planda üretilirken izlenebilmeli.
- AI'ın kötü/bozuk sonuç üretme riskine karşı geniş ekran video player ile kalite kontrolü yapılabilmeli.
- Bir ürüne daha önce video yapılıp yapılmadığını gösteren geçmişe dönük uyarı/kütüphane görünümü; kullanıcı gereksiz yere tekrar token harcamasın.

---

## 4. Önceliklendirilmiş Aksiyon Maddeleri

**1. Giriş ve Kampanya Oluşturma Akışının Yeniden Tasarlanması**
- **Açıklama:** İlk ekran ürün listesi olacak. Kullanıcı filtrelerle ürün seçtikten sonra bir pop-up ile kampanya/klasör ismini verecek; ardından sektörel dropdown'lar ve şablon seçimine geçecek. Akış: Ürün Seçimi → Kampanya İsmi (pop-up) → Sektörel Dropdownlar → Şablon Seçimi.
- **Gerekçe:** Kullanıcı neyi seçeceğini görmeden klasör yaratmak istemez.
- **Öncelik:** Kritik
- **Sahip:** Design (Erdeniz)
- **Sonraki adım:** Ürün kütüphanesi odaklı yeni giriş ekranı mockup'ını hazırlayıp Zafer'e sunmak.

**2. Tekstil Sektörü için İlk Şablonların Kesinleştirilmesi**
- **Açıklama:** "Alışveriş caddesinde vitrine bakan kadın" gibi spesifik 3–5 gerçek şablon/script belirlenmeli; promptları yazılıp 8–10 saniyelik test videoları üretilerek ekibe gösterilmeli.
- **Gerekçe:** Kullanıcının prompt yazma yükünü kaldırır ve beklentiyi netleştirir. MVP'nin ilk doğrulaması bu şablonlar üzerinden yapılacak.
- **Öncelik:** Yüksek
- **Sahip:** Product / AI Video Generation Team
- **Sonraki adım:** Manuka markası referans alınarak Tekstil dikeyi için ilk prompt setlerini yazmak ve test etmek.

**3. Onay ve Toplu Export Ekranının Sadeleştirilmesi**
- **Açıklama:** Videolar tek tek onaylandıktan sonra, alt kısımda "Tümüne Uygula" mantığıyla export platformları (Meta, Google vb.) seçilen tek sayfalık deneyim. Video bazında platform seçimi kaldırılıyor.
- **Gerekçe:** Operasyonel hataları ve arayüz karmaşıklığını önler.
- **Öncelik:** Yüksek
- **Sahip:** Design (Erdeniz)
- **Sonraki adım:** "Onaylananları Seç → Export Kanallarını Belirle → Toplu Gönder" arayüzünü revize etmek.

**4. Çoklu Görsel Girdisi (Multi-image Prompting) Altyapısının Test Edilmesi**
- **Açıklama:** Mevcut AI altyapısının (V2 vb.) bir ürün için birden fazla görsel kabul edip etmediğinin teknik olarak doğrulanması.
- **Gerekçe:** Kıyafetin arka detaylarının doğru üretilebilmesi için kritik; tek görselle AI hallucination riski yüksek.
- **Öncelik:** Yüksek
- **Sahip:** Engineering / Product
- **Sonraki adım:** Kullanılan video AI aracının çoklu görsel kapasitesini test etmek.

**5. Onay Bekleyen (Draft) Videolar Alanı**
- **Açıklama:** Üretilen ama henüz onaylanmayan/reddedilmeyen videolar "onay bekliyor" statüsünde klasörde saklanmalı.
- **Gerekçe:** Kullanıcı token harcadığı için tüm çıktılara sonradan ulaşabilmeli.
- **Öncelik:** Orta
- **Sahip:** Design / Engineering

**6. Klasör Aç/Kapa Özelliği**
- **Açıklama:** Kampanya/klasör listesinde aktif/pasif toggle'ı eklenmesi.
- **Gerekçe:** Dynamic Creative ile tutarlı bir deneyim için gerekli.
- **Öncelik:** Orta
- **Sahip:** Engineering

**7. Safety Guardrails — Teknik Yaklaşımın Belirlenmesi**
- **Açıklama:** Uygunsuz içerik üretimini engelleyecek base prompt veya moderasyon katmanının tanımlanması.
- **Gerekçe:** Marka güvenliği ve ürün güvenilirliği için zorunlu.
- **Öncelik:** Orta-Yüksek
- **Sahip:** Engineering / AI Team

---

## 5. Alınan Kararlar

- **İlk sektör odağı:** Şablonlar ve testler için başlangıç noktası tekstil sektörü (Manuka tarzı modest giyim referans alındı).
- **Video uzunluğu:** 8–10 saniye, salt görüntü odaklı. Overlay (marka, fiyat) video oluştuktan sonra Dynamic Creative mantığıyla platform tarafından eklenecek.
- **Zorunlu onay:** Export öncesi her video kullanıcı tarafından mutlaka "Onaylandı" statüsüne geçirilmeli.
- **Klasör bazlı export:** Videolar ayrı ayrı platformlara gönderilmeyecek; klasördeki onaylı tüm videolar bütün olarak seçilen kanallara gönderilecek.
- **Token ve bakiye gösterimi:** Sol menüde sürekli olarak harcanan token ve dakika maliyeti görünecek.
- **[KAPSAM DIŞI] Statik fotoğraftan manken giydirme:** Fotoğrafı yüklenen kıyafetin AI ile bir mankene giydirilmesi bu MVP'nin kapsamı dışında.
- **[KAPSAM DIŞI] Video bazlı özel export:** Aynı klasördeki videoların farklı mecralara bölünerek gönderilmesi kapsam dışı.
- **[KAPSAM DIŞI] İnteraktif canlı demo:** Tüm müşterilerin görebileceği simüle edilebilir genel demo kapsam dışı; MVP aşamasında yalnızca dahili demo hesabıyla test edilecek.

---

## 6. Değişen Varsayımlar / Öğrenmeler

**Giriş akışı:**
Eski varsayım: Kullanıcı platforma girince ilk işi klasör oluşturmak.
Yeni öğrenme: Kullanıcı neyi seçeceğini görmeden klasör yaratmak istemez; önce filtreleyip ürün seçmeli, ardından kampanya adı vermeli.
Ürün etkisi: Dashboard açılış arayüzü ve "Create Campaign" akışı tamamen ürün odaklı hale getirildi.

**Export granülaritesi:**
Eski varsayım: Her üretilen video ayrı ayrı istenilen platforma gönderilebilir.
Yeni öğrenme: Kullanıcıların aynı klasördeki videoları farklı mecralara bölme gibi bir ihtiyacı pratikte yok.
Ürün etkisi: Export ayarları video seviyesinden klasör/kampanya seviyesine taşındı; arayüz ciddi ölçüde sadeleşti.

**Görsel girdi yeterliliği:**
Eski varsayım: Video üretimi için ürünün tek ana görseli yeterli.
Yeni öğrenme: AI, görmediği kısımları (kıyafetin arkası, detayları) tahmin edemez; hatalı üretim yapar.
Ürün etkisi: Platformun ürüne ait tüm açı/varyasyon görsellerini aynı anda işleyebilmesi gerekiyor.

---

## 7. Açık Sorular

| # | Soru | Neden Önemli | Kimin Netleştirmesi Gerekiyor | Risk |
|---|------|-------------|-------------------------------|------|
| 1 | Mevcut AI altyapısı çoklu görsel destekliyor mu? | Tekstil ürünlerinde arka/detay görsellerinin doğru üretimi için kritik | Engineering / Product | Desteklemiyorsa kıyafet detayları yanlış üretilir; müşteri şikayeti ve token iade talebi oluşur |
| 2 | Şablon prompt içeriklerini kim yazacak? | UI hazır olsa bile arka planda kaliteli video üretecek promptlar olmadan şablonlar işlemez | Product / Design | Gecikme yaşanır; içerik hazır olmadan UI tamamlanmış olur |
| 3 | Üretim beklenirken tamamlanan videolar anında izlenebilecek mi? | Video üretimi uzun sürebilir; donuk bekleme ekranı kullanıcıyı platformdan koparır | Engineering / Product | Kullanıcı retention kaybı |
| 4 | Bir ürüne daha önce video yapılıp yapılmadığını gösteren geçmiş uyarısı V1'de var mı? | Gereksiz token harcamasını ve kullanıcı hayal kırıklığını önler | Product | Kullanıcı aynı ürün için tekrar token harcar |

---

## 8. Product Manager Yorumu

Toplantı, ürünün "soyut bir AI aracı" olmaktan çıkıp e-ticaret ekipleri için kampanya odaklı bir iş akışı ürününe dönüştüğünü net şekilde gösteriyor. Klasör yapısından ürün odaklı açılışa geçiş, video bazlı export'un klasör seviyesine taşınması ve statik manken giydirme gibi farklı AI kollarının doğrudan kesilmesi güçlü MVP disiplini örnekleri.

En kritik teknik risk çoklu görsel girdisidir. Kullanıcının token harcadığı bir sistemde AI'ın kıyafetin arkasını yanlış tahmin etmesi doğrudan churn sebebi olabilir — bu konu mümkün olan en kısa sürede teknik olarak doğrulanmalı.

Şu anki net odak: ilk 3 tekstil şablonunun prompt mimarisinin kusursuzlaştırılması ve onay/toplu export arayüzünün netleştirilmesi.