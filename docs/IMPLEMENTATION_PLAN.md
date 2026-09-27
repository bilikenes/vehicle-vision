# Implementation Plan — Homepage Section 01 & 02

**Amaç:** Vehicle Vision ana sayfasının ilk iki section'ını, kilitli tasarım spesifikasyonuna ve yerel referans codebase'lere dayanarak kontrollü, doğrulanabilir ve sonradan asset değişimine dayanıklı biçimde uygulamak.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Phase 4 kodu uygulandı; Phase 5–6 kalite ve süreklilik doğrulaması bekliyor  
**Kapsam:** Homepage Section 01 — Cinematic Hero ve Section 02 — Editorial Typography  
**Kapsam dışı:** Upload section'ın gerçek implementasyonu, analiz sayfası, backend/API entegrasyonu ve homepage Section 03+

## 1. Başlangıç noktası

Repo şu anda çalışan frontend foundation'ı, Section 01 statik açılış kompozisyonunu ve ilk iki section'ın kilitli tasarım spesifikasyonunu içeriyor.

Ana tasarım kaynağı:

- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md)

Yerel referans codebase'ler:

- `D:\web-sites\waabi`
- `D:\web-sites\eclipse`
- `D:\web-sites\daylight`

Bu üç kaynak aynı amaçla kullanılmayacak. Her biri kendi güçlü olduğu davranış için incelenecek ve Vehicle Vision tasarımına uyarlanacak.

## 2. Referans kullanım sınırları

### Waabi

Ana kullanım alanları:

- compact floating navigation,
- hero içindeki UI yoğunluğu ve oranları,
- küçük kırmızı directional/interaction detayları,
- cinematic scene ile interface arasındaki denge.

Waabi'nin branding, metin veya final medya asset'leri Vehicle Vision'ın final çıktısında kullanılmayacak.

### Eclipse Space

Ana teknik referans:

- GSAP / ScrollTrigger yaklaşımı,
- pinned veya sticky scroll sahnesi,
- scroll progress → media progress eşlemesi,
- media frame shrink,
- uzun scroll pacing,
- typography reveal ve mask davranışı,
- Section 01 → Section 02 geçiş ritmi.

Eclipse implementasyonu önce kaynak koddan çözümlenecek. Davranışın hangi DOM yapısı, CSS ve timeline mantığıyla üretildiği anlaşılmadan bizim projede eşdeğer animasyon yazılmayacak.

### Daylight Computer

Ana kullanım alanları:

- centered dominant media composition,
- media container oranları,
- çevresel küçük UI yerleşimi,
- warm background ve boşluk dengesi,
- rounded media framing,
- responsive kompozisyon davranışı.

### Asset politikası

Kullanıcı izni doğrultusunda:

- referans sitelerdeki fontlar Vehicle Vision içinde kullanılabilir,
- referans sitelerdeki görsel ve videolar geliştirme sırasında geçici placeholder olarak kullanılabilir,
- final üründe referans sitelerden alınmış görsel/video bırakılmayacak,
- geçici medya dosyaları kodda tek noktadan değiştirilebilir tutulacak,
- final medya geldiğinde layout veya scroll architecture yeniden yazılmayacak.

## 3. Planlanan teknik temel

Uygulama kodu olmadığı için aşağıdaki yapı implementasyon başlangıç önerisidir ve Phase 1 sonunda referans incelemesiyle doğrulanacaktır:

- Next.js + React,
- TypeScript,
- App Router,
- global design tokens + component seviyesinde CSS Modules veya eşdeğer sade stil yapısı,
- local font loading,
- GSAP + ScrollTrigger ana scroll/motion katmanı,
- Lenis yalnızca gerçek scroll davranışı bunu gerektirirse.

### Neden GSAP + ScrollTrigger?

Kilitli spesifikasyon scroll-scrub, pinning, progress mapping ve birden fazla eşzamanlı property transition gerektiriyor. Eclipse referansında da GSAP ve ScrollTrigger kaynakları mevcut. Bu nedenle ilk tercih bu davranışı doğrudan ve merkezi bir timeline ile üretmek olacak.

### Başlangıçta kullanılmayacak yaklaşım

Lenis'i sırf Eclipse kullanıyor diye otomatik olarak eklemeyeceğiz. Önce native scroll + ScrollTrigger ile davranış ve performans doğrulanacak. Smooth-scroll katmanı ancak ölçülebilir bir ihtiyaç ortaya çıkarsa eklenecek.

Birden fazla animation framework aynı anda kullanılmayacak.

## 4. Hedef uygulama yapısı

Kesin dosya isimleri scaffold sonrası repo kalıplarına göre doğrulanacak; planlanan sorumluluk sınırı aşağıdaki gibidir:

```text
app/
├─ layout.tsx
├─ page.tsx
└─ globals.css

components/
└─ landing/
   ├─ FloatingNav.tsx
   ├─ OpeningScene.tsx
   ├─ ScrollScrubVideo.tsx
   ├─ OpeningCopy.tsx
   ├─ TryItNowLink.tsx
   ├─ ScrollCue.tsx
   ├─ EditorialStatement.tsx
   └─ WheelGlyph.tsx

lib/
└─ landing/
   ├─ motion-config.ts
   └─ media-config.ts

public/
├─ fonts/
└─ media/
   └─ temporary/
```

Bu yapı bir hedef sorumluluk haritasıdır. Bir component yalnız birkaç satırlık markup olarak kalacaksa gereksiz dosya bölünmesi yapılmayabilir.

## 5. Phase 1 — Reference extraction ve teknik foundation

**Durum:** Tamamlandı — 2026-09-08

### Yapılacaklar

1. Waabi ana sayfasında floating nav ve hero çevresindeki interaction kodlarını bul.
2. Eclipse ana sayfasında ScrollTrigger timeline'larını, pinning alanlarını, progress mapping'i, media shrink ve typography reveal kodlarını kaynak dosyalar üzerinden izole et.
3. Daylight ana sayfasında media framing, spacing ve responsive layout kurallarını çıkar.
4. Referanslardan kullanılabilecek fontları karşılaştır.
5. İlk display font adayını gerçek glyph ve viewport davranışına göre seç.
6. `docs/research/REFERENCE_IMPLEMENTATION_NOTES.md` oluştur ve bulunan gerçek selector/function/file yollarını kaydet.
7. Next.js frontend foundation'ı kur.
8. Global renk, spacing ve typography token'larını tanımla.
9. Geçici medya ve font kaynaklarını merkezi config üzerinden bağla.

### Font için başlangıç adayı

Eclipse arşivinde şu font kaynakları doğrulandı:

- `EclipseSpace Display`
- `Gortonperfectedvf`
- `Gt Mechanik Poly`

Section 02 için önce `EclipseSpace Display` ve `Gt Mechanik Poly` gerçek metin üzerinde karşılaştırılacak. Seçim yalnız font adına göre yapılmayacak; `ONE IMAGE / MORE THAN IT SHOWS. / THE SYSTEM / SEES FURTHER.` kompozisyonunda harf oranları değerlendirilecek.

### Kabul kriteri

- uygulama çalışır durumda açılıyor,
- referans inceleme notları gerçek kaynak dosya yollarını içeriyor,
- display font seçimi belgelenmiş,
- media/font kaynakları merkezi ve değiştirilebilir,
- Section 01/02 için henüz karmaşık animation eklenmeden sağlam bir layout foundation mevcut.

## 6. Phase 2 — Section 01 static composition

Önce hero'nun scroll animasyonu olmadan doğru kompozisyonu kurulacak.

**Durum:** Tamamlandı — 2026-09-08

### Yapılacaklar

1. Warm off-white page background.
2. Top-center floating nav.
3. Centered, rounded hero media frame.
4. Geçici hero video.
5. Lower-left copy:

   `One image.`  
   `More than meets the eye.`

6. Lower-right `TRY IT NOW ↗`.
7. Lower-center tiny red scroll cue.
8. Desktop 1440–1920 px aralığında spacing ve proportions tuning.
9. Hover/focus davranışları.

### Kabul kriteri

Sayfa scroll edilmeden açılış viewport'u tek başına tasarım spesifikasyonundaki cinematic/editorial dengeyi sağlamalı. Video dışındaki hiçbir UI öğesi sahnenin ana odağı haline gelmemeli.

Gerçekleşen doğrulama: geçici video posteri, floating nav, kilitli copy, CTA ve red cue aynı viewport'ta tarayıcı üzerinden kontrol edildi. 1440 px desktop ve 500 px dar viewport çıktıları, lint, TypeScript, production build ve HTTP smoke testi geçti. Scroll davranışı bu faza eklenmedi.

## 7. Phase 3 — Section 01 scroll architecture

**Durum:** Uygulandı — sticky scroll track, runtime video duration, requestAnimationFrame seek kuyruğu, media shrink ve yardımcı UI fade'leri merkezi GSAP ScrollTrigger timeline'ında bağlıdır. Dar viewport canlı kontrolü tamamlandı; geniş desktop doğrulaması hâlâ gereklidir.

### Merkezi progress modeli

Hero scroll sistemi tek normalized progress üretmeli:

```text
0.0 → opening state
1.0 → final framed media state
```

Bu progress aynı timeline içinde şu davranışları yönetecek:

- video `currentTime`,
- media scale/width/height,
- border-radius tuning,
- opening copy opacity,
- CTA prominence,
- scroll cue disappearance,
- Section 02 başlangıcına hazırlık.

### Video scrub

Video süresi runtime'da okunacak. Scroll controller placeholder videonun belirli bir duration değerine sabitlenmeyecek.

Seek güncellemeleri requestAnimationFrame veya GSAP update lifecycle üzerinden yapılacak. Raw scroll event içinde sürekli layout okuma/yazma yapılmayacak.

### Test sırası

1. Chrome desktop gerçek scroll.
2. Hızlı scroll ileri/geri.
3. Scroll ortasında durma.
4. Sayfayı refresh edip orta scroll konumunda açma.
5. Video metadata gecikmesi.
6. Seek sırasında frame jump kontrolü.

### Fallback kararı

Video seeking gerçek browser testinde yetersizse önce codec/keyframe yapısı ve preload davranışı incelenecek. Frame sequence ancak ölçülmüş problem devam ederse değerlendirilecek.

### Kabul kriteri

Scroll ile video ve media shrink aynı fiziksel hareketin parçaları gibi hissedilmeli; belirgin seek jump veya scroll jank olmamalı.

## 8. Phase 4 — Section 02 editorial typography

**Durum:** Uygulandı — 2026-09-08. Geniş desktop ve mobile canlı doğrulaması Phase 5–6 içinde sürecek.

### Sabit copy

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
```

### Yapılacaklar

1. Desktop scattered composition.
2. Responsive display type scale.
3. Line wrapper / clipping structure.
4. Karakter bazlı renk reveal'i.
5. Scroll yönünü izleyen tersine çevrilebilir scrub.
6. Belge sırasını koruyan reveal zamanlaması.
7. Tek bir merkezi `O` için `WheelGlyph` boundary.
8. Geçici wheel visual.
9. Section 01 media'nın son framed hali ile typography girişini aynı scroll anlatısında bağlama.

### Wheel boundary

Wheel asset'i typography markup'ına gömülü ve değiştirilemez hale getirilmeyecek. `WheelGlyph` yalnız O'nun footprint'ini temsil edecek; final wheel geldiğinde yalnız asset/implementation değiştirilebilecek.

### Kabul kriteri

Typography bir SaaS headline bloğu gibi görünmemeli. İki metin grubu farklı bölgeleri kullanmalı, whitespace kompozisyonun aktif parçası olmalı ve wheel yalnız bir kez kullanılmalı.

Gerçekleşen uygulama: `EditorialStatement`, merkezi `editorialMotion` zamanlamalarını kullanarak metni normal belge akışında tutar. Karakterler Eclipse referansındaki mekanikle `#EAEAEA` renginden `#000000` rengine döner; desktopta `top 85% → bottom top`, mobilde `top bottom → bottom 70%` aralığı `scrub: 0.1` ile ileri ve geri yönde izlenir. Section 03 henüz bulunmadığı için iki bitiş değeri erişilebilir belge sonuna clamp edilir; sonraki içerik eklendiğinde özgün geometrik hedefler değişmeden devreye girer. `WheelGlyph`, `SHOWS` kelimesindeki tek `O` footprint'ini temsil eder; görünürlük ve sayfa durumu dışında dönmez, reduced-motion modunda tamamen statiktir.

## 9. Phase 5 — Section 01 → 02 continuity tuning

Bu fazda iki bölüm ayrı ayrı doğru olmaktan çıkarılıp tek deneyim olarak tune edilecek.

### Kontrol edilecekler

- hero supporting UI'nın ne zaman kaybolduğu,
- media shrink'in typography reveal ile overlap miktarı,
- final framed media'nın boyutu,
- typography ilk satırının giriş zamanı,
- total scroll distance,
- uzun scroll sırasında boş bekleme hissi,
- scroll yönü tersine çevrildiğinde timeline tutarlılığı.

### Kabul kriteri

Kullanıcı section sınırını sert bir blok değişimi olarak hissetmemeli. Algılanan akış:

```text
cinematic observation
→ controlled media transformation
→ editorial statement
```

olmalı.

## 10. Phase 6 — Responsive ve accessibility

Desktop kabul edildikten sonra sırayla tablet ve mobile adaptasyonu yapılacak.

### Tablet

- media oranlarını küçült,
- scattered typography separation'ı azalt,
- nav ve supporting UI overlap kontrolü yap.

### Mobile

- desktop koordinatlarını zorla koruma,
- typography bloklarını daha dikey bir kompozisyona taşı,
- video scrub performansını test et,
- gerekirse mobile motion'ı sadeleştir.

### Accessibility

- gerçek button/link semantiği,
- keyboard focus,
- hamburger için accessible label,
- scroll cue için görünmeyen erişilebilir label,
- `prefers-reduced-motion` fallback,
- wheel'in kelimeyi screen reader'da parçalamaması.

### Kabul kriteri

Desktop tasarım karakteri daha küçük viewportlarda korunmalı; metin clipping, media overflow veya erişilemeyen interaction olmamalı.

## 11. Phase 7 — Performance ve regression pass

### Kontroller

- scroll sırasında layout thrashing,
- long task ve belirgin frame drop,
- video preload/seek davranışı,
- font loading sırasında layout shift,
- media dosya boyutları,
- reduced-motion,
- 1440, 1920 ve representative tablet/mobile viewportları.

Animation property'lerinde mümkün olduğunca `transform` ve `opacity` kullanılacak.

### Kabul kriteri

Görsel kaliteyi bozan belirgin scroll jank, frame jump, clipping veya font layout shift kalmamalı.

## 12. Phase 8 — Final asset swap

Final Vehicle Vision asset'leri hazır olduğunda:

1. geçici hero video değiştirilir,
2. gerçek video duration/seek karakterine göre scroll timing yeniden tune edilir,
3. geçici wheel asset'i değiştirilir,
4. varsa geçici referans görsel/video dosyaları projeden kaldırılır,
5. final responsive ve performance regression yapılır.

Fontlar kullanıcı izni kapsamında kalabilir.

### Kabul kriteri

Final build içinde referans sitelerden alınmış geçici görsel/video kalmamalı ve asset değişimi component architecture'ı değiştirmemeli.

## 13. Her fazda güncellenecek dokümanlar

Her implementation fazının sonunda yalnız kod değil ilgili yaşayan dokümanlar da güncellenecek:

| Değişiklik | Güncellenecek belge |
|---|---|
| Yeni component/dizin | `CODEBASE_MAP.md` |
| Dependency veya runtime kararı | `ARCHITECTURE.md` |
| Kalıcı tasarım/teknik karar | `DECISIONS.md` |
| Hata/workaround | `KNOWN_ISSUES.md` |
| Faz durumu | `PROJECT_STATUS.md`, `ROADMAP.md` |
| Anlamlı tamamlanan çalışma | `WORKLOG.md` |

Bu sayede sonraki görevlerde repo genelini tekrar taramadan mevcut durum anlaşılabilir olacak.

## 14. Uygulama sırası

Planın uygulanma sırası değiştirilmedikçe şöyledir:

```text
Reference extraction
→ frontend foundation
→ Section 01 static composition
→ Section 01 scroll behavior
→ Section 02 typography
→ cross-section continuity
→ responsive/accessibility
→ performance pass
→ final asset swap
```

Bir fazın kabul kriteri sağlanmadan sonraki büyük faza geçilmeyecek. Görsel tuning sırasında küçük geri dönüşler yapılabilir; ancak yeni bir architecture kararı gerekiyorsa önce `DECISIONS.md` içinde kayda alınacak.

## 15. Referanslar

- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) — Section 01 ve 02 için kilitli tasarım ve interaction sözleşmesi.
- `D:\web-sites\waabi\README.md` — Waabi yerel arşiv yapısı ve kaynak konumları.
- `D:\web-sites\waabi\formatted_code\` — Waabi prettified JS/CSS kaynakları.
- `D:\web-sites\eclipse\README.md` — Eclipse Space yerel arşiv yapısı ve kullanılan GSAP/ScrollTrigger/Lenis kaynakları.
- `D:\web-sites\eclipse\formatted_code\` — Eclipse prettified CSS/JS kaynakları.
- `D:\web-sites\daylight\README.md` — Daylight yerel arşiv yapısı ve Next.js kaynak konumları.
- `D:\web-sites\daylight\formatted_code\` — Daylight prettified JS/CSS kaynakları.

**Codex**
