# Discovery / Feedback Notes

## 1. Kısa Özet

Toplantıda Optifeed içindeki AI video üretim aracının kullanıcı akışı, ekran yapısı, MVP kapsamı ve üretim sonrası deneyimi değerlendirildi. Ürünün yalnızca “video generate eden” bir araç değil, marketing ekiplerinin kampanya, promo veya ürün grubu bazlı video üretip yönetebileceği bir çalışma alanına dönüşmesi gerektiği netleşti. Açılışta Google Drive benzeri klasör/library yapısı ihtiyacı öne çıktı. Ürün seçim ekranında search, recently added, ürün metadata bilgileri ve ek görsel sayısı önemli bulundu. Template seçimi tarafında boş prompt yerine guided, template-first bir yapı tercih edildi. MVP kapsamında sadece 1:1 kare video üretimine odaklanılması, multi-dimension üretim ve text overlay özelliklerinin kapsam dışına alınması kararlaştırıldı. Üretim süresi, token maliyeti, generation progress, edit prompt, download/export ve feed’e gönderme akışı ayrıca netleştirilmesi gereken alanlar olarak ortaya çıktı. 

## 2. Ürünün Güncel Yönü

* Eski varsayım: Kullanıcı ürün seçer, prompt veya template ile video üretir, çıktı oluşur.

* Yeni öğrenme: Marketing kullanıcısı kampanya/promo mantığıyla çalışıyor. Ürün seçimi, klasörleme, template seçimi, yaklaşık maliyet/süre, progress takibi, revize ve export süreci bir bütün olarak tasarlanmalı.

* Ürün etkisi: Ürün artık basit bir AI video generator değil, **kampanya odaklı, template-first, kontrollü ve marketing workflow’una uygun video creation workspace** olarak ele alınmalı.

* Eski varsayım: Çoklu boyutlar aynı anda üretilebilir.

* Yeni öğrenme: Farklı boyutlarda tutarlı AI video üretimi teknik risk ve scope büyümesi yaratıyor.

* Ürün etkisi: MVP sadece **1:1 kare format** üretmeli. Dikey/yatay formatlar ve multi-dimension üretim kapsam dışına alınmalı.

* Eski varsayım: Video üzerine text overlay eklenebilir.

* Yeni öğrenme: Font, renk, metin, konum gibi detaylar ayrı bir editor karmaşıklığı yaratıyor.

* Ürün etkisi: Text overlay MVP dışında kalmalı, ileride Dynamic Creative veya ayrı bir feature olarak değerlendirilmeli.

## 3. Ana Feedbackler

### UX / User Flow

#### Feedback: Açılışta folder/library yapısı gerekli

Açıklama: İlk ekran empty state gibi olmamalı. Kullanıcı oluşturduğu videoları kampanya, promo, ürün grubu veya reklam amacı bazında daha sonra bulabilmeli. Google Drive benzeri klasör yapısı önerildi.

Neden önemli: Marketing çalışanı kampanya bazlı çalışır. Oluşturduğu asset’leri daha sonra tekrar bulmak ve organize etmek ister.

Ürün etkisi: Açılış ekranı “video oluştur” boş ekranı değil, **library/folder başlangıç ekranı** olarak tasarlanmalı.

---

#### Feedback: Product selection ekranı daha bilgi yoğun olmalı

Açıklama: Search ve recently added mutlaka kalmalı. Ürünlerde product name, status, ID, item group ID, category/product type, brand gibi bilgiler görünmeli. Ana görsel dışında ek görsel sayısı da gösterilmeli.

Neden önemli: Kullanıcı ürünleri master feed’den seçecek. Pazarlamacı ürün adı, ID veya kategoriyle arama yaparak doğru ürünü hızlı bulmak ister. Ek görseller özellikle tekstil gibi alanlarda video kalitesini besleyebilir.

Ürün etkisi: Product selection ekranı basit card grid değil, search ve metadata destekli seçim deneyimi olmalı.

---

#### Feedback: “Generate video” CTA’sı yanlış aşamada

Açıklama: Ürün seçimi sonrası video hemen üretilmiyor. Kullanıcı önce template seçmeli.

Neden önemli: CTA, kullanıcıya bir sonraki gerçek adımı anlatmalı. “Generate video” erken ve yanıltıcı.

Ürün etkisi: Product selection ekranındaki CTA **“Choose template”** veya benzeri bir ifadeye değişmeli.

---

#### Feedback: Template seçimi açık ve yönlendirici olmalı

Açıklama: Boş prompt alanı kullanıcıyı zorlayabilir. Template’ler doğrudan görünmeli, 2x2 grid gibi açık bir yapı kullanılmalı. “Change” gibi belirsiz butonlar yerine açıklayıcı CTA kullanılmalı.

Neden önemli: Kullanıcı prompt mühendisliği yapmak istemez. Performans marketing için hızlı, amaca uygun ve kontrollü çıktı almak ister.

Ürün etkisi: Template-first, guided flow tasarlanmalı. Prompt alanı ana deneyim olmamalı.

---

### Product Scope

#### Feedback: MVP sadece 1:1 kare format üretmeli

Açıklama: Önceki çoklu boyut üretimi fikrinden vazgeçildi. İlk sürüm 1080x1080 veya 1:1 kare formata odaklanmalı.

Neden önemli: AI’ın farklı aspect ratio’larda aynı sonucu tutarlı üretmesi garanti değil. Çoklu boyut geliştirme süresini artırır.

Ürün etkisi: Multi-dimension generation MVP out of scope olmalı.

---

#### Feedback: Text overlay MVP dışına alınmalı

Açıklama: Video üzerine kampanya metni, font, renk veya konum eklemek ayrı bir editor karmaşıklığı yaratıyor.

Neden önemli: MVP’yi büyütür ve ayrı bir Dynamic Creative / overlay ürünü gibi ele alınması gerekir.

Ürün etkisi: Text overlay, font, kampanya metni editörü MVP dışı olmalı.

---

#### Feedback: Bulk generation ihtiyacı var ama kontrollü ele alınmalı

Açıklama: Kullanıcı elindeki hazır ürün listesini yükleyip toplu video üretmek isteyebilir. Ancak 1000 ürünlük üretim farklı backend ve frontend mantığı gerektirir.

Neden önemli: Küçük batch üretim ile büyük hacimli üretim aynı ürün akışı değildir.

Ürün etkisi: MVP’de limitli bulk akış olabilir. Büyük hacimli işler için request-based flow veya V2 düşünülmeli.

---

### Cost / Token Logic

#### Feedback: Yaklaşık süre ve maliyet kullanıcıya gösterilmeli

Açıklama: Ürün seçildikçe tahmini üretim süresi ve token/kredi maliyeti güncellenmeli. Bu bilgi CTA çevresinde gösterilebilir.

Neden önemli: Kullanıcı üretime başlamadan ne kadar bekleyeceğini ve ne kadar kredi harcayacağını bilmeli.

Ürün etkisi: Product selection, template selection ve generate öncesi cost/time preview gösterilmeli.

---

#### Feedback: Token bakiyesi sabit görünmeli

Açıklama: Kullanıcının mevcut token/kredi bakiyesi sağ üstte her zaman görünmeli.

Neden önemli: Maliyet şeffaflığı ve güven için önemli.

Ürün etkisi: Global header veya top bar içinde token balance component olmalı.

---

### Technical Constraints

#### Feedback: Video generation anlık değil, progress deneyimi gerekli

Açıklama: Her video yaklaşık 1 dakika sürebilir. 10 video, 10 dakikaya yakın bekleme anlamına gelebilir.

Neden önemli: Kullanıcı boş ekranda beklememeli. Her video tamamlandıkça ekranda belirmeli.

Ürün etkisi: Generation progress ekranı olmalı. Videolar pending/generating/completed durumlarıyla gösterilmeli.

---

### Output / Export

#### Feedback: Preview, review ve export akışı gerekli

Açıklama: Üretilen videolar listelenmeli veya grid olarak gösterilmeli. Kullanıcı approve, edit veya reject aksiyonları alabilmeli. Toplu indirme için ZIP düşünülebilir.

Neden önemli: Kullanıcı sadece video üretmez, çıktıyı değerlendirir, revize eder ve kullanıma hazır hale getirir.

Ürün etkisi: Output screen, review actions ve download/export mantığı product.md’ye eklenmeli.

---

#### Feedback: Send to Feed ihtiyacı var ama akış net değil

Açıklama: Onaylanan videoların Facebook, TikTok veya diğer feed/ad kanallarına gönderilmesi konuşuldu.

Neden önemli: Ürünün asıl değeri performans marketing kullanımına bağlanıyor.

Ürün etkisi: Send to Feed bir adım olarak not edilmeli, ama V1 kapsamı net değilse açık soru olarak kalmalı.

---

### Safety / Guardrails

#### Feedback: Uygunsuz video üretimi engellenmeli

Açıklama: Cinsellik, çıplaklık veya uygunsuz içerik base prompt / safety layer ile engellenmeli.

Neden önemli: AI video generation ürünlerinde güvenlik ve marka güvenilirliği kritik.

Ürün etkisi: Safety / guardrails bölümü product.md’ye eklenmeli.

## 4. Alınan Kararlar

### Karar 1: Açılışta folder/library yapısı kullanılacak

Karar: İlk ekran, Google Drive benzeri bir library/folder yapısı olarak kurgulanmalı. Kullanıcı mevcut klasörleri görebilmeli, yeni klasör oluşturabilmeli ve üretilecek videoları klasöre bağlayabilmeli.

Gerekçe: Marketing çalışanları kampanya, promo ve ürün grubu bazlı çalışır. Üretilen asset’leri organize etmeye ihtiyaç duyar.

Etkilenen bölümler:

* User flow
* Empty state
* Main screens
* Product.md
* Prototype

---

### Karar 2: Product selection ekranında search ve recently added korunacak

Karar: Search özelliği ve recently added sıralaması kalmalı.

Gerekçe: Kullanıcı ürün adı, ID veya diğer feed bilgileriyle hızlı arama yapabilmeli. Recently added, yeni ürün/kampanya akışlarında pratik bir sıralama sağlar.

Etkilenen bölümler:

* Product selection screen
* Product.md
* Prototype
* UX flow

---

### Karar 3: Product selection ekranında ürün metadata bilgileri gösterilecek

Karar: Product, status, ID, item group ID, category/product type, brand ve ek görsel sayısı gösterilmeli.

Gerekçe: Kullanıcı doğru ürünü seçebilmek için sadece görsele değil, ürün feed datasına da ihtiyaç duyar.

Etkilenen bölümler:

* Product selection logic
* Product card/table
* Prototype
* Product.md

---

### Karar 4: Product selection CTA’sı “Generate video” değil, “Choose template” olacak

Karar: Ürün seçim ekranındaki CTA, video üretimi yerine template seçimine yönlendirmeli.

Gerekçe: User flow’da ürün seçimi sonrası bir sonraki gerçek adım template seçimidir.

Etkilenen bölümler:

* Product selection screen
* CTA copy
* User flow
* Prototype

---

### Karar 5: MVP sadece 1:1 kare video üretimine odaklanacak

Karar: MVP’de dikey/yatay çoklu format üretimi yok. İlk sürüm sadece kare format üretmeli.

Gerekçe: Farklı boyutlarda tutarlı AI çıktısı üretmek teknik risk yaratıyor ve MVP scope’unu büyütüyor.

Etkilenen bölümler:

* MVP scope
* Out of scope
* Template selection
* Generation logic
* Technical implementation

---

### Karar 6: Text overlay MVP dışına alındı

Karar: Video üzerine yazı, font, renk, kampanya metni veya overlay editörü MVP’de olmayacak.

Gerekçe: Ayrı bir editör karmaşıklığı yaratır ve MVP’yi gereksiz büyütür.

Etkilenen bölümler:

* MVP scope
* Out of scope
* Product.md
* Prototype
* Technical implementation

---

### Karar 7: Üretim süreci progress ekranıyla gösterilecek

Karar: Videolar üretildikçe ekranda tek tek belirmeli. Kullanıcı tüm videolar bitene kadar boş beklememeli.

Gerekçe: Video üretimi anlık değil. Yaklaşık 1 dakika/video bekleme süresi var.

Etkilenen bölümler:

* Generation flow
* Result screen
* Prototype
* Technical implementation

---

### Karar 8: Edit Prompt hibrit yapıda olacak

Karar: Kullanıcı videoyu revize ederken hem dropdown/preset seçeneklerden yararlanabilmeli hem de free text prompt yazabilmeli.

Gerekçe: Moda ve tekstil gibi alanlarda varyasyonlar sınırsızdır. Sadece dropdown yeterli olmaz.

Etkilenen bölümler:

* Preview/review/edit flow
* Edit Prompt screen
* Product.md
* Prototype

## 5. Öneriler / Henüz Karar Olmayan Fikirler

### Öneri: Bulk upload / bulk generation

Açıklama: Kullanıcı hazır ürün listesi yükleyip batch video üretmek isteyebilir.

Neden düşünüldü: Marketing ekiplerinin kampanya veya ürün grubu bazlı toplu üretim ihtiyacı olabilir.

Karar durumu: V1 kapsamı net değil. Küçük limitli akış düşünülebilir, büyük hacimli üretim V2 veya request-based flow olabilir.

---

### Öneri: ZIP export

Açıklama: Kullanıcı üretilen videoları toplu olarak indirebilmek isteyebilir.

Neden düşünüldü: Çoklu video üretiminde tek tek indirme yorucu olur.

Karar durumu: V1’e dahil olup olmadığı net değil.

---

### Öneri: Send to Feed

Açıklama: Onaylanan videolar ilgili reklam/feed kanallarına gönderilebilir.

Neden düşünüldü: Ürünün asıl kullanım senaryosu performance marketing çıktısı üretmek.

Karar durumu: Akış netleşmedi. Mevcut “AI suggested segments apply” ekranı referans alınabilir mi incelenmeli.

---

### Öneri: Scheduling / start-end date

Açıklama: Kampanya bazlı videolara başlangıç ve bitiş tarihi verilebilir.

Neden düşünüldü: Anneler Günü gibi dönemsel kampanyalar sonsuza kadar feed’de kalmamalı.

Karar durumu: Video generator özelinde değil, sistem geneli bir ihtiyaç olabilir. V1 kapsamı net değil.

---

### Öneri: Hover preview

Açıklama: Template üzerine gelince ön izleme oynatılabilir.

Neden düşünüldü: Template seçimini kolaylaştırabilir.

Karar durumu: V1 mi, V2 mi net değil.


## 6. Önceliklendirilmiş Aksiyon Maddeleri

### Aksiyon 1: MVP scope’u 1:1 kare format ve no-text-overlay kararına göre güncelle

Açıklama: Product.md, prototype ve teknik brief’te multi-dimension generation ve text overlay kapsam dışı olarak işaretlenmeli.

Gerekçe: Bu iki konu MVP’yi gereksiz büyütüyor ve geliştirme süresini artırıyor.

Öncelik: Kritik

Sahip: Product

Sonraki adım: Product.md ve prototype flow’da tüm multi-dimension/text overlay referanslarını temizle.

---

### Aksiyon 2: Product selection ekranını feed metadata destekli hale getir

Açıklama: Search, recently added, product/status/ID/item group ID/category/brand ve ek görsel sayısı gösterilmeli.

Gerekçe: Kullanıcı doğru ürünü hızlı seçmeli ve video üretimini besleyecek görsel zenginliği anlayabilmeli.

Öncelik: Yüksek

Sahip: Product + Design

Sonraki adım: Product selection ekranı için yeni wireframe veya component spec çıkar.

---

### Aksiyon 3: Product selection CTA’sını “Choose template” olarak değiştir

Açıklama: “Generate video” CTA’sı kaldırılıp template seçimine yönlendiren CTA kullanılmalı.

Gerekçe: Akışta video üretiminden önce template seçimi var.

Öncelik: Yüksek

Sahip: Design

Sonraki adım: Prototype copy ve user flow güncelle.

---

### Aksiyon 4: Folder/library başlangıç deneyimini tasarla

Açıklama: Kullanıcı mevcut klasörleri görebilmeli, yeni klasör oluşturabilmeli ve videoları kampanya/promo/ürün grubu bazlı organize edebilmeli.

Gerekçe: Marketing kullanıcılarının asset yönetimi alışkanlığı buna ihtiyaç duyuyor.

Öncelik: Yüksek

Sahip: Product + Design

Sonraki adım: Empty state ve library ekranı için UX flow çiz.

---

### Aksiyon 5: Cost/time preview ve token balance UI ekle

Açıklama: Seçilen ürün sayısına göre yaklaşık süre ve maliyet dinamik gösterilmeli. Token bakiyesi sağ üstte sabit görünmeli.

Gerekçe: Kullanıcı bekleme süresini ve harcayacağı krediyi üretim öncesi bilmek ister.

Öncelik: Yüksek

Sahip: Product + Engineering

Sonraki adım: Cost/time calculation logic ve UI placement netleştir.

---

### Aksiyon 6: Generation progress ekranını tasarla

Açıklama: Videolar tamamlandıkça ekranda görünmeli, kalanlar pending/generating olarak gösterilmeli.

Gerekçe: 10 video üretimi yaklaşık 10 dakika sürebilir. Kullanıcı boş beklememeli.

Öncelik: Yüksek

Sahip: Design + Engineering

Sonraki adım: Progress state ve result screen wireframe hazırla.

---

### Aksiyon 7: Edit Prompt akışını hibrit modele göre tasarla

Açıklama: Revize ekranında preset/dropdown seçenekler, free text prompt ve örnek promptlar birlikte kullanılmalı.

Gerekçe: Sadece dropdown, ürün varyasyonlarını karşılamaz. Sadece prompt ise kullanıcıyı zorlayabilir.

Öncelik: Yüksek

Sahip: Product + Design

Sonraki adım: Edit Prompt modal/screen spec çıkar.

---

### Aksiyon 8: Safety guardrails ihtiyacını teknik ekiple netleştir

Açıklama: Uygunsuz üretim riskleri base prompt veya safety layer ile engellenmeli.

Gerekçe: Marka güvenliği ve ürün güvenilirliği için gerekli.

Öncelik: Orta-Yüksek

Sahip: Engineering + AI team

Sonraki adım: Safety prompt / moderation layer yaklaşımı belirlenmeli.

---

### Aksiyon 9: Feed export, scheduling ve ZIP export kapsamını netleştir

Açıklama: Bu alanlar değerli ama V1 kapsamı net değil. Karar verilmesi gerekiyor.

Gerekçe: Scope creep yaratabilirler.

Öncelik: Orta

Sahip: Product

Sonraki adım: V1/V2 ayrımı için decision list oluştur.

## 7. Product.md İçin Güncelleme Notları

### Güncellenecek Bölüm: Product Definition

Ne değişmeli: Ürün, sadece video generator olarak değil, marketing ekipleri için campaign-based AI video creation workspace olarak tanımlanmalı.

Neden: Folder/library, product selection, template, generation progress, review ve export birlikte düşünülüyor.

Yeni karar / feedback: Ürün kampanya/promo/ürün grubu bazlı çalışma alışkanlığına uygun olmalı.

---

### Güncellenecek Bölüm: Product Principles

Ne değişmeli: “Guided, template-first, low cognitive load, cost transparent, campaign-organized, MVP scope disciplined” prensipleri eklenmeli.

Neden: Feedbackler ürünün kullanıcıyı boş promptla baş başa bırakmaması gerektiğini gösteriyor.

Yeni karar / feedback: Kullanıcı prompt mühendisliği yapmamalı, yönlendirilmiş seçimlerle ilerlemeli.

---

### Güncellenecek Bölüm: MVP Scope

Ne değişmeli: 1:1 generation, product metadata, folder/library, cost/time preview, progress, edit prompt, token display ve safety eklenmeli.

Neden: Bunlar validated prototype için kritik.

Yeni karar / feedback: Multi-dimension ve text overlay çıkarılmalı.

---

### Güncellenecek Bölüm: Out of Scope

Ne değişmeli: Multi-dimension generation, simultaneous aspect ratio generation, text overlay, advanced editor, 1000 ürünlük bulk generation, system-wide scheduling, fully automated feed publishing out of scope yazılmalı.

Neden: MVP scope kontrolü için gerekli.

Yeni karar / feedback: İlk sürüm daha yalın olmalı.

---

### Güncellenecek Bölüm: Main User Flow

Ne değişmeli: Akış şu şekilde güncellenmeli:

Library / folder
→ Product selection
→ Choose template
→ Configure guided context
→ Review cost/time
→ Generate
→ Progress
→ Preview/review
→ Edit prompt or approve
→ Download/export or send to feed

Neden: Toplantı notları uçtan uca akışı bu hale getiriyor.

Yeni karar / feedback: Ürün seçimi sonrası CTA template seçimine gitmeli, generation hemen başlamamalı.

---

### Güncellenecek Bölüm: Product Selection Logic

Ne değişmeli: Search, recently added, product metadata, ek görsel sayısı, selection limit, cost/time preview eklenmeli.

Neden: Doğru ürün seçimi video kalitesi ve kullanıcı güveni için kritik.

Yeni karar / feedback: “Generate video” CTA’sı “Choose template” olmalı.

---

### Güncellenecek Bölüm: Template Selection Logic

Ne değişmeli: Template-first, guided prompt, 2x2 template grid, sektör/tema/concept seçimi eklenmeli.

Neden: Boş prompt alanı kullanıcıyı zorlayabilir.

Yeni karar / feedback: Change butonu belirsizse açıklayıcı CTA kullanılmalı.

---

### Güncellenecek Bölüm: Cost / Token Logic

Ne değişmeli: Sağ üstte token balance, generate/edit öncesi yaklaşık cost, üretim başladığında token düşümü, refund açık sorusu eklenmeli.

Neden: Maliyet şeffaflığı kullanıcı güveni için kritik.

Yeni karar / feedback: Maliyet ve süre seçimlere göre dinamik güncellenmeli.

---

### Güncellenecek Bölüm: Generation Progress Logic

Ne değişmeli: Video başına yaklaşık 1 dakika, progressive completion, pending/generating/completed states eklenmeli.

Neden: Kullanıcı 10 dakika boyunca boş beklememeli.

Yeni karar / feedback: Her video oluştukça ekranda belirmeli.

---

### Güncellenecek Bölüm: Preview / Review / Edit Logic

Ne değişmeli: Approve/edit/reject, hybrid Edit Prompt, guidance examples eklenmeli.

Neden: Kullanıcı ilk sonucu beğenmeyebilir ve kontrollü revize yapmak ister.

Yeni karar / feedback: Edit Prompt dropdown + free text şeklinde olmalı.

---

### Güncellenecek Bölüm: Export / Feed Logic

Ne değişmeli: Download, ZIP export, Send to Feed ve scheduling belirsizliği yazılmalı.

Neden: Üretilen video marketing kullanımına bağlanmalı.

Yeni karar / feedback: Feed export ve scheduling V1 kapsamı net değil.

---

### Güncellenecek Bölüm: Safety / Guardrails

Ne değişmeli: Uygunsuz içerik engelleme için base prompt / moderation layer gereksinimi eklenmeli.

Neden: AI video üretiminde güvenlik zorunlu.

Yeni karar / feedback: Cinsellik/çıplaklık gibi riskler engellenmeli.

## 8. Prototype İçin UX Değişiklikleri

### Ekran: Library / Empty State

Değişiklik: Google Drive benzeri folder yapısı eklenmeli. Mevcut klasörler, yeni klasör oluşturma ve “hangi klasöre koyulsun?” akışı düşünülmeli.

Kullanıcı etkisi: Kullanıcı videoları kampanya veya ürün grubu bazında düzenleyebilir.

Not: Bu ekran marketing alışkanlıklarına uygun olmalı.

---

### Ekran: Product Selection

Değişiklik: Search, recently added, metadata, ek görsel sayısı, selection limit, yaklaşık süre/maliyet ve “Choose template” CTA eklenmeli.

Kullanıcı etkisi: Kullanıcı doğru ürünü daha hızlı ve güvenle seçer.

Not: Ek görsel sayısı stacked image indicator ile gösterilebilir.

---

### Ekran: Template Selection

Değişiklik: Template’ler açık görünmeli, 2x2 grid olabilir. Guided seçimler eklenmeli.

Kullanıcı etkisi: Boş prompt korkusu azalır, kullanıcı daha hızlı karar verir.

Not: Template’ler performance marketing ve product spotlight odaklı olmalı.

---

### Ekran: Generate / Confirmation

Değişiklik: Yaklaşık süre, yaklaşık token maliyeti, seçilen ürün sayısı ve ödeme mikrocopy’si gösterilmeli.

Kullanıcı etkisi: Kullanıcı üretime başlamadan beklentisini yönetir.

Not: “Bu aşamada ödeme alınmayacaktır” gibi mikrocopy üretim öncesi güven sağlayabilir.

---

### Ekran: Generation Progress

Değişiklik: Her video pending/generating/completed state ile gösterilmeli. Video tamamlandıkça görünmeli.

Kullanıcı etkisi: Bekleme deneyimi daha anlaşılır ve güven verici olur.

Not: 10 video yaklaşık 10 dakika sürebilir.

---

### Ekran: Preview / Review

Değişiklik: Videolar grid/list şeklinde gösterilmeli. Approve, Edit Prompt, Reject, Download aksiyonları olmalı.

Kullanıcı etkisi: Kullanıcı çıktıları tek tek değerlendirebilir.

Not: ZIP export kapsamı netleştirilmeli.

---

### Ekran: Edit Prompt

Değişiklik: Dropdown + free text + örnek promptlardan oluşan hibrit revize yapısı olmalı.

Kullanıcı etkisi: Hem yönlendirme alır hem de spesifik ihtiyacını yazabilir.

Not: Moda/tekstil varyasyonları için free text gerekli.

## 9. Scope Değişiklikleri

### MVP In Scope

* Folder / library başlangıç yapısı
* Product selection
* Search
* Recently added
* Product metadata gösterimi
* Additional image count göstergesi
* Product selection limit göstergesi
* Yaklaşık maliyet ve süre gösterimi
* Choose template CTA
* Template-first guided flow
* 1:1 kare video generation
* Token balance visibility
* Generation progress
* Output preview
* Review actions
* Hybrid Edit Prompt
* Basic safety guardrails
* Basic download/export

### MVP Out of Scope

* Multi-dimension generation
* Simultaneous aspect ratio generation
* Text overlay / font / campaign text editor
* Advanced video editor
* 1000 ürünlük bulk generation
* Fully automated feed publishing, netleşene kadar
* System-wide scheduling, netleşene kadar
* Hover preview, netleşene kadar
* Büyük ölçekli request-based production flow

### V2 / Later

* Multi-format generation
* Text overlay / Dynamic Creative integration
* Advanced bulk generation
* Feed mapping / Send to Feed
* Campaign scheduling
* ZIP export, eğer V1’e alınmazsa
* Hover preview
* Request-based enterprise/bulk generation

## 10. Final PM Yorumu

Bu meeting sonrası ürün, “tek tıkla AI video üret” fikrinden çıkarak daha gerçekçi bir marketing workflow ürününe dönüşüyor. Asıl değer, kullanıcıya sınırsız AI özgürlüğü vermek değil; ürün feed’inden doğru ürünü seçtirip, template-first ve guided bir akışla, maliyet/süre şeffaflığı içinde, kampanya odaklı video asset üretmesini sağlamak. Kaçınılması gereken en büyük hata, ürünü Canva benzeri büyük bir video editöre çevirmek. MVP’nin güçlü kalması için 1:1 video üretimi, no-text-overlay, kontrollü ürün limiti, progress visibility ve human review/edit akışı net tutulmalı.
