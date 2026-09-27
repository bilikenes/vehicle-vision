# Codebase Map

**Amaç:** Bir dosyanın veya dizinin ne işe yaradığını anlamak için tüm repository'yi tarama ihtiyacını azaltmak; önemli entry point, component, config ve asset konumlarını yaşayan bir haritada toplamak.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Frontend foundation ve Section 01–02 scroll architecture haritası  
**Kaynak gerçekliği:** Mevcut filesystem yapısı.

## Mevcut repository ağacı

```text
vehicle-vision/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ landing/
│     ├─ EditorialStatement.module.css
│     ├─ EditorialStatement.tsx
│     ├─ FloatingNav.tsx
│     ├─ OpeningCopy.tsx
│     ├─ OpeningScene.module.css
│     ├─ OpeningScene.tsx
│     ├─ ScrollCue.tsx
│     ├─ ScrollScrubVideo.tsx
│     ├─ TryItNowLink.tsx
│     └─ WheelGlyph.tsx
├─ lib/
│  ├─ fonts.ts
│  └─ landing/
│     ├─ media-config.ts
│     └─ motion-config.ts
├─ public/
│  ├─ fonts/temporary/
│  │  └─ eclipse-space-display.woff2
│  └─ media/temporary/
│     ├─ hero-poster.jpg
│     └─ sample-video.mp4
├─ .gitignore
├─ DESIGN.md
├─ PRODUCT.md
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ README.md
└─ docs/
   ├─ README.md
   ├─ PROJECT_STATUS.md
   ├─ ROADMAP.md
   ├─ IMPLEMENTATION_PLAN.md
   ├─ ARCHITECTURE.md
   ├─ CODEBASE_MAP.md
   ├─ DECISIONS.md
   ├─ KNOWN_ISSUES.md
   ├─ WORKLOG.md
   └─ design/
      └─ landing/
         └─ opening-and-editorial-typography.md
```

`.git/` repository metadata'sıdır ve uygulama mimarisinin parçası olarak bu haritada ayrıntılandırılmaz.

## Dosya sorumlulukları

| Yol | Sorumluluk | Ne zaman bakılmalı? |
|---|---|---|
| `/README.md` | Repo giriş noktası ve geliştirme komutları | Projeye ilk kez girildiğinde |
| `/DESIGN.md` | Uygulanan açılış görsel sistemi ve korunacak statik davranış sınırları | Section 01 görünümü veya interaction karakteri değiştiğinde |
| `/PRODUCT.md` | Kalıcı ürün gerçekliği ve açık sınırlar | Ürün amacı veya kapsam kararı gerektiğinde |
| `/app/layout.tsx` | Root layout, metadata ve font değişkeni | Uygulama kabuğu değiştiğinde |
| `/app/page.tsx` | Homepage entry point | Landing section'ları geliştirilirken |
| `/app/globals.css` | Reset ve global tasarım token'ları | Renk, spacing veya typography temeli değiştiğinde |
| `/components/landing/OpeningScene.tsx` | Section 01 sahne kompozisyonu ve alt bileşenlerin birleşimi | Hero yapısı veya medya davranışı değiştiğinde |
| `/components/landing/OpeningScene.module.css` | Hero, nav, copy, CTA ve cue yerleşimi ile responsive durumlar | Açılış sahnesi oranları veya etkileşim stilleri değiştiğinde |
| `/components/landing/ScrollScrubVideo.tsx` | Sticky scroll track, runtime video seek, media shrink ve yardımcı UI fade'lerinin merkezi GSAP timeline'ı | Scroll davranışı veya seek performansı değiştiğinde |
| `/components/landing/EditorialStatement.tsx` | Section 02 satırları, sıralı scroll reveal timeline'ı ve erişilebilir başlık sözleşmesi | Editorial copy veya reveal sırası değiştiğinde |
| `/components/landing/EditorialStatement.module.css` | Scattered typography yerleşimi, mask'ler, responsive ölçekler ve reduced-motion fallback | Section 02 kompozisyonu veya responsive davranışı değiştiğinde |
| `/components/landing/WheelGlyph.tsx` | `SHOWS` içindeki tek `O` placeholder'ı; görünürlük ve reduced-motion kontrollü dönüş | Final wheel asset'i veya hareket davranışı değiştiğinde |
| `/components/landing/FloatingNav.tsx` | Sabit marka/Home barı ve hover/focus/click ile açılan görsel menü state'i | Navigasyon içeriği veya davranışı değiştiğinde |
| `/components/landing/OpeningCopy.tsx` | Kilitli iki satırlık açılış metni | Hero destek metni değiştiğinde |
| `/components/landing/TryItNowLink.tsx` | Gelecekteki upload alanına CTA sınırı | Upload hedefi netleştiğinde |
| `/components/landing/ScrollCue.tsx` | Erişilebilir kırmızı yönlendirme kontrolü | Scroll anlatısı bağlandığında |
| `/lib/fonts.ts` | Merkezi local font yükleme | Display font kaynağı değiştirildiğinde |
| `/lib/landing/media-config.ts` | Landing medya sözleşmesi ve geçici hero kaynağı | Hero medya kaynağı değiştirildiğinde |
| `/lib/landing/motion-config.ts` | Hero ve editorial scroll mesafeleri, media scale, fade ve satır reveal aralıkları | Scroll pacing veya motion tuning değiştiğinde |
| `/public/fonts/temporary/` | Geçici geliştirme fontları | Final font geçişinde |
| `/public/media/temporary/` | Geçici geliştirme medyası | Final hero video geçişinde |
| `/package.json` | Runtime, dependency ve script tanımları | Komut veya dependency değiştiğinde |
| `/docs/README.md` | Dokümantasyon router/indeksi | Hangi bilginin nerede olduğunu bulmak için |
| `/docs/PROJECT_STATUS.md` | Güncel çalışma durumu | "Ne tamamlandı, ne kaldı?" sorusunda |
| `/docs/ROADMAP.md` | Aşamalar ve kabul kriterleri | Sıradaki işi seçerken |
| `/docs/IMPLEMENTATION_PLAN.md` | Section 01–02 ayrıntılı uygulama planı | İlk iki section'ı geliştirirken faz ve kabul kriterlerini takip etmek için |
| `/docs/ARCHITECTURE.md` | Teknik yapı ve sınırlar | Runtime/dependency/component architecture hakkında |
| `/docs/CODEBASE_MAP.md` | Dizin ve önemli dosya haritası | Bir dosyanın yerini/sorumluluğunu bulurken |
| `/docs/DECISIONS.md` | Karar günlüğü | Bir yaklaşımın neden seçildiğini anlamak için |
| `/docs/KNOWN_ISSUES.md` | Hata ve workaround kayıtları | Daha önce yaşanan bir problemi ararken |
| `/docs/WORKLOG.md` | Tarih bazlı çalışma geçmişi | Ne zaman ne yapıldığını anlamak için |
| `/docs/design/landing/opening-and-editorial-typography.md` | Homepage Section 01–02 tasarım sözleşmesi | İlk iki section implementasyonu veya review sırasında |

## Uygulama kodu durumu

2026-09-08 itibarıyla frontend foundation ile Section 01 ve Section 02 scroll kompozisyonları çalışır durumdadır. Final wheel asset'i, upload arayüzü ve API katmanı henüz oluşturulmadı.

Uygulama genişledikçe bu dosya şu bilgileri içerecek şekilde güncellenecektir:

- route → page/component eşleşmeleri,
- ana layout ve provider dosyaları,
- shared UI component dizinleri,
- animation/scroll controller dosyaları,
- media/config asset kaynakları,
- API client ve type sözleşmeleri,
- global style/theme/token kaynakları,
- test dosyalarının hedeflediği modüller.

## Harita güncelleme kuralı

Yeni önemli dosya veya dizin ekleyen, taşıyan veya silen bir değişiklik bu dokümanı aynı commit/çalışma içinde güncellemelidir. Tek kullanımlık build çıktıları, dependency cache'leri ve generated dosyalar yalnızca proje davranışını anlamak için gerekli olduklarında haritaya eklenmelidir.

## Referanslar

- [`README.md`](README.md) — dokümantasyon indeksi.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — dosyaların teknik ilişkileri için mimari bağlam.

**Codex**
