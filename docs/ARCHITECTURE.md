# Architecture

**Amaç:** Projenin teknik yapısını, sorumluluk sınırlarını ve doğrulanmış mimari kararları tek yerde tutmak. Bu belge gelecekteki codebase'i tahmin ederek doldurmak yerine yalnızca repo tarafından doğrulanabilen bilgileri ve açık tasarım sözleşmelerini kaydeder.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Frontend foundation ile Section 01–02 scroll architecture uygulandı  
**Kaynak gerçekliği:** Uygulama kodu eklendiğinde güncellenmesi zorunludur.

## Mevcut doğrulanmış teknik durum

Repo içinde çalışan bir frontend foundation bulunur:

- Next.js `16.3.4`,
- React ve React DOM `19.2.8`,
- TypeScript `6.0.3`,
- App Router,
- npm ve `package-lock.json`,
- global CSS token'ları ve ileride component düzeyinde CSS Modules,
- GSAP `3.15.0` ana scroll/motion katmanı,
- local display font loading,
- merkezi landing media config'i.

Henüz state management, backend/API sözleşmesi, deployment hedefi veya bağımsız test runner seçilmedi. Lenis eklenmedi; Section 01 native scroll ve ScrollTrigger ile çalışır.

## Frontend foundation

- `app/layout.tsx`, global metadata ve display font değişkenini bağlar.
- `app/page.tsx`, scroll kontrollü `OpeningScene` ve `EditorialStatement` bölümlerini sıralayan homepage entry point'idir.
- `app/globals.css`, kilitli renk paletini ve global spacing/typography token'larını tanımlar.
- `lib/fonts.ts`, geçici display font kaynağını tek noktadan yükler.
- `lib/landing/media-config.ts`, geçici hero videosunu ve posterini değiştirilebilir bir sözleşmeyle tanımlar.
- `components/landing/OpeningScene.tsx`, açılış sahnesinin bileşen sınırıdır; nav, medya, copy, CTA ve scroll cue burada birleşir.
- `components/landing/ScrollScrubVideo.tsx`, sticky track üzerindeki tek GSAP ScrollTrigger timeline'ında video seek, frame shrink ve yardımcı UI fade'lerini yönetir.
- `components/landing/OpeningScene.module.css`, açılış sahnesinin desktop-first oranlarını, responsive uyarlamasını ve reduced-motion geçişlerini tutar.
- `components/landing/EditorialStatement.tsx`, dört satırlı Section 02 kompozisyonunu desktopta 210svh, mobile'da 170svh etkin scroll mesafeli merkezi GSAP timeline'ı ve erişilebilir tek başlık adıyla yönetir.
- `components/landing/EditorialStatement.module.css`, scattered yerleşimi, responsive ölçekleri, mask sınırlarını ve reduced-motion statik fallback'ini tutar.
- `components/landing/WheelGlyph.tsx`, `SHOWS` içindeki tek `O` yerine geçen ve final asset'ten bağımsız tutulan hareket sınırıdır.
- `public/fonts/temporary/` ve `public/media/temporary/`, finalden önce değiştirilmesi gereken geliştirme asset'lerini tutar.

Section 01 autoplay yapmaz. Scroll progress runtime video duration'a requestAnimationFrame ile seek edilir; sticky track aynı progress üzerinden media shrink ile copy, CTA ve cue fade'lerini yönetir. Section 02 ayrı bir 210svh sticky track içinde dört satırı merkezi zamanlamalarla sırayla açar. Reduced-motion modunda iki JS scroll timeline'ı da kurulmaz, track'ler tek viewport yüksekliğine iner ve editorial metin bütünüyle görünür kalır. `FloatingNav` yerel React state'iyle fine-pointer hover, keyboard focus ve touch/click davranışlarını aynı açık/kapalı panel durumunda birleştirir.

Açılış geometrisi Daylight referansındaki viewport-fit ilkesini kullanır: dış sahne `100svh` yüksekliğinde viewport bazlı padding taşır; medya kalan content box'ı iki eksende tamamen doldurur. Copy ve CTA media frame içinde absolute inset ile sabitlenir. Böylece browser zoom veya geniş/kısa ekran oranı, alt köşe içeriğini viewport dışına itemez.

## Yerel implementation referansları

2026-09-08 itibarıyla aşağıdaki harici yerel codebase yolları doğrulanmıştır:

- `D:\web-sites\waabi`
- `D:\web-sites\eclipse`
- `D:\web-sites\daylight`

Eclipse arşivinde GSAP, ScrollTrigger ve Lenis kaynakları; Waabi ve Daylight arşivlerinde Next.js tabanlı kaynaklar ve prettified JS/CSS dosyaları bulunur. Bunlar Vehicle Vision architecture'ının doğrudan parçası değildir; implementation araştırma kaynaklarıdır.

Fontların kullanımına izin verilmiştir. Referans görsel/video asset'leri yalnız geçici geliştirme placeholder'ı olarak kullanılabilir ve final üründe kaldırılmalıdır.

## Section 01–02 için tasarımdan gelen teknik sınırlar

Kilitli tasarım spesifikasyonu şu mimari özellikleri gerektirir:

### Hero media kaynağı

Hero video kaynağı tek bir config/constant/component prop üzerinden değiştirilebilir olmalıdır. Scroll mantığı placeholder asset'e sıkı biçimde bağlanmamalıdır.

Video controller en az şu bilgileri runtime'da ele almalıdır:

- gerçek `duration`,
- normalize scroll progress,
- hedef `currentTime`,
- media frame scale/size progress.

### Scroll orchestration

Section 01 scroll davranışı merkezi bir controller/timeline üzerinden yönetilmelidir. Aynı scroll olayına dağınık ve bağımsız handler'lar bağlamak yerine video scrub, frame shrink ve yardımcı UI fade aralıkları aynı progress modelinden türetilmelidir.

### Motion constants

Aşağıdaki değerler merkezi olarak tune edilebilir tutulmalıdır:

- hero scroll uzunluğu,
- media başlangıç ve bitiş boyutu,
- copy/CTA fade aralıkları,
- editorial satırlarının reveal aralıkları.

### Component sınırları

Spesifikasyonun önerdiği kavramsal sınırlar:

```text
HomePage
├─ FloatingNav
├─ OpeningScene
│  ├─ ScrollScrubVideo
│  ├─ OpeningCopy
│  ├─ TryItNowLink
│  └─ ScrollCue
└─ EditorialStatement
   ├─ Four masked statement lines
   └─ WheelGlyph
```

Bu ağaç mevcut ana sorumluluk sınırını gösterir; satırlar ayrı component'lere bölünmeden `EditorialStatement` içinde tutulur.

### Asset sınırları

- Final hero video hazır değil; geçici kaynak kullanılacak.
- Wheel/O asset'i daha sonra değiştirilebilecek izole bir birim olmalı.
- Reduced-motion için statik poster veya representative frame desteği düşünülmeli.

## Performance ilkeleri

- Scroll sırasında layout thrashing yapılmamalı.
- Mümkün olduğunda `transform` ve `opacity` animasyonu tercih edilmeli.
- Video seek davranışı gerçek tarayıcıda test edilmeli.
- Frame-sequence yaklaşımına ancak video seek profillemesi yetersiz kalırsa geçilmeli.
- Aynı proje içinde birden fazla animation framework ancak somut gerekçeyle kullanılmalı.

## Güncelleme tetikleyicileri

Aşağıdakilerden biri gerçekleştiğinde bu belge güncellenmelidir:

- frontend scaffold kurulması,
- package/dependency eklenmesi,
- yeni route veya uygulama katmanı,
- backend/API entegrasyonu,
- state management kararı,
- deployment/runtime değişimi,
- scroll/video architecture değişikliği.

## Referanslar

- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) — Section 01–02 için teknik implementation beklentileri.
- [`CODEBASE_MAP.md`](CODEBASE_MAP.md) — gerçek dosya/dizin haritası.
- [`DECISIONS.md`](DECISIONS.md) — kalıcı teknik ve ürün kararları.
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — planlanan Section 01–02 implementation sırası.

**Codex**
