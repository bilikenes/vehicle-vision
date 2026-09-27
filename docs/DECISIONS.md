# Decision Log

**Amaç:** Ürün, tasarım ve teknik kararların yalnızca sonucunu değil, gerekçesini ve authoritative kaynağını da kaydetmek. Böylece aynı kararların ileride tekrar tartışılması veya yanlış varsayımla değiştirilmesi önlenir.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Aktif

## Kayıt formatı

Her yeni karar aşağıdaki bilgileri içermelidir:

- tarih,
- durum (`Proposed`, `Accepted`, `Superseded`),
- karar,
- gerekçe,
- etkilediği alanlar,
- kaynak/ilgili dosya,
- değiştirildiyse yerine geçen karar.

## D-001 — Homepage açılışında upload UI gösterilmemesi

**Tarih:** 2026-09-08  
**Durum:** Accepted

İlk viewport bir upload formu veya standart SaaS hero yerine cinematic bir sahne olarak tasarlanacak. Kullanıcı önce ürünün karakteriyle karşılaşacak.

**Etkilediği alanlar:** Homepage Section 01, future upload navigation.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Locked Decisions Checklist.

## D-002 — Hero medya centered ve scroll-controlled olacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

Hero video yatayda merkezlenecek. Ana cinematic progression endless autoplay yerine scroll progress ile video timeline'a bağlanacak; aynı progress medya frame'inin küçülmesini de yönetecek.

**Etkilediği alanlar:** Section 01 layout, scroll controller, hero video component.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Sections 5–7.

## D-003 — İlk iki section tek bir devamlı anlatı olacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

Section 01'den Section 02'ye hard-cut yapılmayacak. Medya küçülürken warm whitespace artacak ve editorial typography kompozisyonu sahneyi devralacak.

**Etkilediği alanlar:** Section geçişi, scroll pacing, typography reveal.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Sections 7, 9, 10 ve 16.

## D-004 — Tek bir O wheel intervention kullanılacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

Editorial typography içinde yalnızca bir merkezi `O`, rotating vehicle wheel ile değiştirilecek/entegre edilecek. Efekt tekrarlanmayacak.

**Etkilediği alanlar:** Section 02 typography component architecture ve media asset.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Section 8.5–8.7.

## D-005 — Distinctive condensed display typography kullanılacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

Büyük editorial statement için sıradan web fontları kullanılmayacak. Lisans durumu doğrulanmış, güçlü ve dar bir display family seçilecek. Kesin font mevcut proje asset/lisans durumuna göre implementation aşamasında doğrulanacak.

**Etkilediği alanlar:** Typography, font loading, licensing.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Section 4.

## D-006 — Accent red mikro detay olarak kullanılacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

`#FF3B5C` başlangıç referansına sahip kırmızı, geniş yüzeylerde ana tema rengi olmayacak; scroll cue ve küçük interaction detaylarında imza niteliğinde kullanılacak.

**Etkilediği alanlar:** Global visual tokens, hover/focus micro-interactions.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Section 3.1.

## D-007 — Geçici medya kaynakları izole tutulacak

**Tarih:** 2026-09-08  
**Durum:** Accepted

Final hero video ve wheel asset'i hazır olmadığı için placeholder kullanılabilir; kaynak değişimi layout/scroll sistemini yeniden yazmayı gerektirmemeli.

**Etkilediği alanlar:** Media config, hero video, wheel component.  
**Kaynak:** [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md), Sections 5.5 ve 8.6.

## D-008 — Referans asset kullanım sınırı

**Tarih:** 2026-09-08  
**Durum:** Accepted

`D:\web-sites` altındaki Waabi, Eclipse Space ve Daylight kaynaklarından fontlar projede kullanılabilir. Görsel ve videolar yalnız geliştirme sırasında geçici placeholder olarak kullanılabilir; final üründe bu referans sitelerden alınmış görsel/video bırakılmayacaktır.

Geçici medya kaynakları merkezi ve kolay değiştirilebilir tutulacaktır.

**Etkilediği alanlar:** Font loading, temporary media, final asset replacement, implementation plan.  
**Kaynak:** Kullanıcının 2026-09-08 tarihli açık asset kullanım kararı; [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md), Section 2.

## D-009 — Frontend foundation stack'i

**Tarih:** 2026-09-08  
**Durum:** Accepted

Frontend foundation; Next.js, React, TypeScript, App Router ve npm ile kurulacak. Global token'lar sade CSS değişkenleriyle tanımlanacak; component stilleri gerektiğinde CSS Modules ile eklenecek. GSAP ana scroll/motion katmanı olarak kurulacak, Lenis ise ölçülmüş bir ihtiyaç oluşmadan eklenmeyecek.

Geçici display font `lib/fonts.ts`, hero video ise `lib/landing/media-config.ts` üzerinden tek noktadan değiştirilebilir tutulacaktır.

**Etkilediği alanlar:** Frontend runtime, styling, font loading, landing media ve ileriki scroll architecture.  
**Kaynak:** [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md), Sections 3–5; 2026-09-08 tarihli kullanıcı onayı.

## Referanslar

- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) — mevcut accepted tasarım kararlarının ana kaynağı.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — kararların teknik sisteme yansıdığı alan.

**Codex**
