# Design — Vehicle Vision Opening

**Amaç:** Uygulanan açılış sahnesinin görsel sistemini ve korunması gereken davranış sınırlarını koddan bağımsız, kısa bir sözleşme olarak kaydetmek.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Section 01 ve Section 02 scroll kontrollü kompozisyonu uygulandı  
**Kaynak:** `docs/design/landing/opening-and-editorial-typography.md`

## Görsel tez

Açılış, araç görüntüsünü dekoratif bir hero arka planı yerine incelenmek üzere sunulan sinematik bir kanıt yüzeyi olarak ele alır. Warm off-white canvas ince bir çevre boşluğu bırakır; viewport genişliğinin `%95`ini kullanan medya küçük arayüz öğelerinden belirgin biçimde daha baskındır.

## Uygulanan sistem

- Canvas: `#F2F0EA`; ana ink: `#0B0B0B`; yüzey: `#FAF8F4`; vurgu: `#FF3B5C`.
- Hero media: viewport içinde `%95` genişlik ve `%95` yükseklik kullanan, yumuşatılmış köşeli ve düşük kontrastlı gölgeli frame.
- Navigation: viewport üstünde ortalanmış compact yüzey; marka, Home ve hover/focus/click ile açılan görsel menü paneli.
- Destek metni: medyanın sol altında beyaz `One image.` ve `More than meets the eye.`.
- CTA: medyanın sağ altında beyaz `TRY IT NOW ↗`.
- Scroll cue: alt merkezde görünür metinsiz, erişilebilir adı olan küçük kırmızı daire.
- Media: autoplay yapmayan gerçek video elementi; scroll progress runtime duration'a bağlanır ve frame 240svh boyunca küçülür. İlk yükleme ve reduced-motion zemini için representative poster kullanılır.
- Editorial statement: warm canvas üzerinde iki bölgeye dağılmış `ONE IMAGE / MORE THAN IT SHOWS.` ve `THE SYSTEM / SEES FURTHER.` kompozisyonu.
- Editorial motion: metin normal belge akışında viewport'tan geçerken karakterler belge sırasıyla `#EAEAEA` renginden `#000000` rengine döner. GSAP ScrollTrigger geçişi desktopta `top 85% → bottom top`, mobilde `top bottom → bottom 70%` aralığına bağlar; mevcut kısa sayfada bitiş noktası erişilebilir scroll sınırına clamp edilir. Scrub ileri ve geri yönde çalışır. Reduced-motion modunda metin doğrudan son halinde gösterilir.
- Wheel/O: `SHOWS` içindeki yalnız bir `O`, izole ve daha sonra değiştirilebilir geometrik placeholder'dır.

### Geçici raster provenance

`public/media/temporary/sample-video.mp4`, `D:\AI Projects\vehicle-analysis-hub\frontend\src\sample_video.mp4` kaynağından kopyalanmıştır. `public/media/temporary/hero-poster.jpg`, bu videonun ilk karesinden FFmpeg ile üretilmiştir. İki dosya da final medya tesliminde değiştirilebilir.

## Responsive davranış

Sahne `100svh` yüksekliğindedir ve dört yönde viewport bazlı `%2.5` boşluk bırakır. Medya kalan alanı `width: 100%; height: 100%` ile doldurur; 16:9 kaynak `object-fit: cover` ile farklı ekran oranlarına uyarlanır. Copy ve CTA medya içinde alt köşelere bağlıdır. Bu yapı zoom ve kısa ekran yüksekliklerinde alt içeriğin viewport dışına taşmasını önler.

## Etkileşim karakteri

Hover ve focus davranışları küçük opacity, translation ve kırmızı detaylarla sınırlıdır. Fine-pointer cihazlarda tüm nav alanına giriş paneli açar; pointer ayrıldığında kapatır. Menü butonu dokunmatik kullanımda aynı state'i tıkla açıp kapatır. Açılışta panel opacity, blur ve küçük scale geçişi kullanır; iki çizgili ikon Waabi'deki gibi tek eksi çizgisinde birleşir. Thumbnail alanları geçici görsel slotlarıdır.

## Açık sınırlar

Scroll kontrollü video seek, media shrink ve Section 02'nin doğal akışlı karakter reveal'i uygulandı. Geniş desktop ile mobile süreklilik tuning'i henüz tamamlanmadı. `#upload` gerçek bir upload arayüzü değil, sonraki section için geçici hedef sınırıdır. Geçici video, poster ve wheel final üründe değiştirilecektir.

**Codex**
