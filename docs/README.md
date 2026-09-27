# Dokümantasyon İndeksi

**Amaç:** Projede bir bilgiye ulaşmak için tüm codebase'i yeniden tarama ihtiyacını azaltmak ve proje durumu, mimari, dosya sorumlulukları, kararlar, hatalar ve çalışma geçmişi için tekil kaynaklar sağlamaktır.

**Son gözden geçirme:** 2026-09-08  
**Durum:** Aktif  
**Kaynak gerçekliği:** Bu indeks repo yapısı değiştikçe güncellenmelidir.

## Hangi bilgi nerede?

| İhtiyaç | Doküman | Ne içerir? |
|---|---|---|
| Şu anda proje ne durumda? | [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | Tamamlanan, aktif, bekleyen ve bloklanmış işler |
| Sırada ne var? | [`ROADMAP.md`](ROADMAP.md) | Aşamalar, hedefler ve kabul kriterleri |
| İlk iki section nasıl uygulanacak? | [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) | Referans incelemesinden final asset swap'e kadar uygulama sırası ve kabul kriterleri |
| Sistem nasıl organize edilecek? | [`ARCHITECTURE.md`](ARCHITECTURE.md) | Mimari sınırlar, runtime ve teknik kararların güncel özeti |
| Hangi dosya ne işe yarıyor? | [`CODEBASE_MAP.md`](CODEBASE_MAP.md) | Dizin, dosya, component ve entry point haritası |
| Neden böyle yaptık? | [`DECISIONS.md`](DECISIONS.md) | Kalıcı kararlar ve gerekçeleri |
| Hangi hatalar yaşandı? | [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) | Hata belirtileri, kök neden, çözüm ve durum |
| Bugüne kadar ne yapıldı? | [`WORKLOG.md`](WORKLOG.md) | Tarih bazlı çalışma günlüğü |
| Landing ilk iki section nasıl olmalı? | [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) | Kilitli görsel, motion, scroll ve responsive spesifikasyonu |

## Dokümanların bakım kuralı

Dokümantasyon, koddan bağımsız ikinci bir gerçeklik oluşturmamalıdır. Bir değişiklik aşağıdaki alanlardan birini etkiliyorsa ilgili belge aynı çalışmada güncellenmelidir:

- yeni veya taşınan önemli dosya/dizin → `CODEBASE_MAP.md`,
- mimari veya dependency değişikliği → `ARCHITECTURE.md`,
- ürün/tasarım/teknik karar → `DECISIONS.md`,
- yeni hata, blokaj veya workaround → `KNOWN_ISSUES.md`,
- tamamlanan veya başlanan iş → `PROJECT_STATUS.md` ve gerekiyorsa `ROADMAP.md`,
- anlamlı çalışma sonucu → `WORKLOG.md`.

Bir bilgi henüz doğrulanmadıysa gerçekmiş gibi yazılmamalıdır. `Bekliyor`, `Doğrulanmadı`, `TODO` veya benzeri açık durum ifadeleri kullanılmalıdır.

## Kaynak önceliği

Birbiriyle çelişen bilgiler olduğunda şu sıra izlenir:

1. Çalışan ve doğrulanmış mevcut kod/config.
2. Kullanıcının son açık kararı.
3. Kilitli spesifikasyon veya karar kaydı.
4. `PROJECT_STATUS.md`, `ARCHITECTURE.md` ve diğer yaşayan dokümanlar.
5. Eski `WORKLOG.md` kayıtları.

`WORKLOG.md` geçmiş kaydıdır; mevcut gerçekliğin tek kaynağı olarak kullanılmamalıdır.

## Referanslar

- [`../README.md`](../README.md) — proje ana giriş noktası.
- [`design/landing/opening-and-editorial-typography.md`](design/landing/opening-and-editorial-typography.md) — mevcut ilk ürün/tasarım spesifikasyonu.

**Codex**
