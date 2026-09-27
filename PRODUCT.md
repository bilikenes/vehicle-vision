# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js, React, TypeScript, App Router ve npm. Stack, `docs/IMPLEMENTATION_PLAN.md` içinde seçildi ve 2026-09-08 tarihinde frontend foundation için onaylandı.

## Users

Birincil kullanıcı profili, araç görüntüsü analiz deneyimini değerlendiren veya kullanan kişilerden daha dar biçimde henüz tanımlanmadı. Gelecekte workflow iddiaları eklenmeden önce daha belirgin kullanıcı ve kullanım bağlamı kaydedilmelidir.

## Product Purpose

Vehicle Vision, araç görüntüsü analizini açıklanabilir bir web deneyimi olarak sunar. Mevcut onaylı kapsam landing sayfasının açılış sekansıdır; upload, analiz ve backend workflow'ları bu implementation fazının dışındadır.

## Capabilities and Constraints

- İlk iki homepage section tek bir devamlı sekans oluşturur.
- İlk viewport upload formu içermez.
- Hero media ve wheel asset geçicidir; sayfa yeniden yapılandırılmadan değiştirilebilir kalmalıdır.
- Upload davranışı, analiz API'leri ve Section 02 sonrasındaki homepage section'ları henüz kararlaştırılmadı.
- İlgili etkileşimler uygulandığında reduced-motion davranışı ve keyboard erişilebilir kontroller zorunludur.

## Brand Commitments

- Ürün adı: Vehicle Vision.
- Onaylı landing metinleri ve interaction sınırları `docs/design/landing/opening-and-editorial-typography.md` içinde tanımlıdır.
- Referans projeler mekanik ve craft bilgisini destekler; bu projelerin branding'i ve final görsel asset'leri Vehicle Vision ürün asset'i değildir.

## Evidence on Hand

- Kilitli Section 01–02 tasarım sözleşmesi: `docs/design/landing/opening-and-editorial-typography.md`.
- Implementation sırası ve kabul kriterleri: `docs/IMPLEMENTATION_PLAN.md`.
- Kaynak seviyesindeki referans bulguları: `docs/research/REFERENCE_IMPLEMENTATION_NOTES.md`.
- Final hero video, final wheel asset, ürün benchmark'ları, müşteri kanıtları ve production API sözleşmeleri henüz mevcut değildir.

## Product Principles

1. Araç görüntüsünü birincil kanıt olarak koru.
2. Görsel gösteri eklemeden önce analizi anlaşılır kıl.
3. Geçici medyayı ve gelecek entegrasyonları değiştirilebilir tut.
4. Açılış section'ları boyunca tek ve tutarlı bir anlatı koru.

## Accessibility & Inclusion

Etkileşimli öğeler keyboard ile erişilebilir ve açık biçimde etiketlenmiş olmalıdır. Yoğun motion davranışları `prefers-reduced-motion` alternatifi sunmalıdır.

## References

- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/design/landing/opening-and-editorial-typography.md`
- `docs/research/REFERENCE_IMPLEMENTATION_NOTES.md`

**Codex**
