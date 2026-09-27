# Known Issues

**Amaç:** Projede karşılaşılan hataları, belirtileri, kök nedenleri, çözümleri ve açık workaround'ları kayıt altında tutmak; aynı problemin tekrar baştan araştırılmasını önlemek.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Aktif kayıt

## Açık sorunlar

Şu anda uygulama runtime'ı bulunmadığından doğrulanmış bir runtime/build hatası kaydı yoktur.

## Bilinen eksikler

Eksik bir asset veya henüz alınmamış ürün kararı teknik hata sayılmaz; yine de implementasyonu etkileyebilecek mevcut eksikler aşağıdadır.

| ID | Durum | Konu | Etki |
|---|---|---|---|
| KI-001 | Bekliyor | Final hero video mevcut değil | Placeholder ile geliştirme yapılacak, final asset sonrası timing retune gerekecek |
| KI-002 | Bekliyor | Final rotating wheel asset mevcut değil | İzole placeholder/component kullanılacak |
| KI-003 | Resolved | Referans codebase filesystem yolları tanımlı değildi | 2026-09-08 tarihinde `D:\web-sites\waabi`, `D:\web-sites\eclipse`, `D:\web-sites\daylight` yolları doğrulandı |
| KI-004 | Bekliyor | Upload section anchor/route henüz tanımlı değil | `TRY IT NOW ↗` hedefi implementation sırasında geçici boundary gerektirebilir |

## Yeni hata kayıt formatı

Yeni bir hata eklendiğinde en az şu bilgiler tutulmalıdır:

```text
ID:
Tarih:
Durum: Open | Investigating | Workaround | Resolved
Alan:
Belirti:
Hata mesajı / log:
Tekrarlama adımları:
Kök neden:
Çözüm / workaround:
Doğrulama:
İlgili dosyalar:
İlgili karar:
```

Bir sorun çözüldüğünde kayıt silinmemelidir. `Resolved` durumuna alınmalı ve çözümün hangi doğrulamayla teyit edildiği yazılmalıdır.

## Referanslar

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — aktif blokajların kısa özeti.
- [`WORKLOG.md`](WORKLOG.md) — hata veya çözümün gerçekleştiği çalışma bağlamı.
- [`DECISIONS.md`](DECISIONS.md) — workaround kalıcı karara dönüştüyse gerekçesi.

**Codex**
