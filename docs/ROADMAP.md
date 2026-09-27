# Roadmap

**Amaç:** Vehicle Vision projesini küçük, doğrulanabilir aşamalara bölmek ve her aşamanın bitiş kriterlerini görünür kılmak.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Yaşayan plan

## Phase 0 — Project foundation

**Durum:** Tamamlandı

- [x] Repo içinde dokümantasyon omurgasını kur.
- [x] Mevcut landing spesifikasyonunu kalıcı tasarım dizinine taşı.
- [x] Proje durumu, codebase, karar, hata ve çalışma günlüğü için tekil kaynaklar oluştur.

**Bitiş kriteri:** Proje hakkında temel bilgi edinmek için repo genelini taramak zorunlu olmamalı.

## Phase 1 — Homepage Section 01 ve Section 02 hazırlığı

**Durum:** Tamamlandı

- [x] Yerel referans root'u ve üç kaynak yolu doğrula: `D:\web-sites\waabi`, `D:\web-sites\eclipse`, `D:\web-sites\daylight`.
- [x] Waabi floating nav/opening composition implementasyonunu kaynak koddan ayrıştır.
- [x] Eclipse Space scroll-scrub/pinning/media-shrink ve typography reveal implementasyonunu kaynak koddan ayrıştır.
- [x] Daylight Computer media framing/spacing yaklaşımını kaynak koddan ayrıştır.
- [x] Section 01–02 için uygulanacak fazları ve kabul kriterlerini `IMPLEMENTATION_PLAN.md` içinde tanımla.
- [x] Frontend runtime, framework ve dependency durumunu repo üzerinden doğrula.
- [x] Animasyon sistemi için mevcut dependency varsa onu kullan; yoksa alternatifleri gerçek repo bağlamında değerlendir.

**Bitiş kriteri:** Implementation öncesinde mevcut mimari ve üç referans kaynağın gerekli davranışları anlaşılmış olmalı.

## Phase 2 — Homepage Section 01: Cinematic Hero

**Durum:** Devam ediyor — scroll architecture uygulandı, geniş desktop doğrulaması bekliyor

- [x] Floating nav.
- [x] Geçici, kolay değiştirilebilir hero video kaynağı.
- [x] Scroll kontrollü video timeline.
- [x] Scroll ile medya shrink dönüşümü.
- [x] Lower-left copy, `TRY IT NOW ↗` ve red scroll cue.
- [x] Statik sahne için reduced-motion uyumlu geçişler ve poster kaynağı.
- [x] Statik kompozisyon tarayıcı görsel doğrulaması.
- [ ] 1440–1920 px desktop doğrulaması.

**Bitiş kriteri:** Section 01, kilitli spesifikasyondaki açılış kompozisyonu ve scroll davranışını desktop üzerinde tutarlı biçimde üretmeli.

## Phase 3 — Homepage Section 02: Editorial Typography

**Durum:** Uygulandı — geniş desktop doğrulaması bekliyor

- [x] Dört satırlık sabit metin kompozisyonu.
- [x] Scattered editorial yerleşim.
- [x] Mask reveal + mild opacity/contrast settling.
- [x] Tek `O` içinde izole wheel placeholder/component.
- [x] Uzun scroll pacing.
- [x] Section 01 ile kesintisiz geçiş altyapısı.
- [ ] Desktop görsel doğrulama.

**Bitiş kriteri:** Section 01 ve 02 ayrı bloklar gibi değil, tek bir scroll anlatısının iki evresi gibi davranmalı.

## Phase 4 — Responsive ve kalite geçişi

**Durum:** Bekliyor

- [x] Tablet ve mobile layout adaptasyonu.
- [ ] Keyboard erişilebilirliği.
- [x] `prefers-reduced-motion` statik fallback implementasyonu.
- [ ] `prefers-reduced-motion` canlı tarayıcı doğrulaması.
- [ ] Scroll jank ve media seek davranışı kontrolü.
- [ ] Büyük viewport kontrolleri.

**Bitiş kriteri:** Tasarım karakteri korunurken ana etkileşimler desteklenen viewportlarda kullanılabilir olmalı.

## Phase 5 — Final media değişimi

**Durum:** Bekliyor

- [ ] Final hero videoyu placeholder kaynağın yerine geçir.
- [ ] Scroll zamanlamasını gerçek video süresine göre yeniden tune et.
- [ ] Final wheel asset'ini geçir.
- [ ] Görsel/performance regresyon kontrolü yap.

## Gelecek kapsam

Homepage'in Section 03 ve sonrası, upload deneyimi, analiz sayfası ve backend entegrasyonları bu roadmap'te henüz ayrıntılandırılmamıştır. Ürün kararı netleştiğinde yeni phase olarak eklenmelidir.

## Referanslar

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — mevcut durum ve blokajlar.
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — bu roadmap'in Section 01–02 için ayrıntılı uygulama prosedürü.
- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) — Phase 1–5 için tasarım kaynak belgesi.

**Codex**
