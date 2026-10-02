"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnalysisEditor } from "./AnalysisEditor";
import styles from "./AnalysisConcepts.module.css";

type Concept = "stage" | "exploded" | "canvas";
type Focus = "vehicle" | "plate";
const source = "/media/samples/sample-sedan.png";
const concepts = [
  { id: "stage", letter: "A", name: "Inspection Stage", description: "Görselin etrafında keşif. Araca veya plakaya dokun; kanıtı yerinde incele." },
  { id: "exploded", letter: "B", name: "Exploded Evidence", description: "Bir görüntünün içindeki katmanlar. Kaynak, araç ve plaka aynı hikâyenin parçaları." },
  { id: "canvas", letter: "C", name: "Focus Canvas", description: "Görsele odaklanan bir çalışma alanı. Yaklaş, kutuları aç ve bulgular arasında geçiş yap." },
] as const;

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}
function Crop({ vehicle = false }: { vehicle?: boolean }) {
  return <div role="img" aria-label={vehicle ? "Kaynak görselden araç kırpımı" : "Kaynak görselden 06 DCC 821 plakasının kırpımı"} className={vehicle ? styles.vehicleCrop : styles.plateCrop} />;
}
function Readout({ focus }: { focus: Focus }) {
  return <div className={styles.readout} aria-live="polite">
    <span>{focus === "plate" ? "OKUNAN PLAKA" : "ARAÇ SINIFI"}</span>
    <strong>{focus === "plate" ? "06 DCC 821" : "SEDAN"}</strong>
    <p>{focus === "plate" ? "Görüntüdeki karakterler, kendi kanıtıyla birlikte." : "Dört kapı. Üç hacimli gövde. Görselden sınıflandırma."}</p>
    <dl><div><dt>Renk</dt><dd>Koyu gri</dd></div><div><dt>Kaynak</dt><dd>sample-sedan.png</dd></div><div><dt>Veri</dt><dd>Tasarım örneği</dd></div></dl>
  </div>;
}
function Photo({ focus, boxes = true, onFocus, zoom = 1 }: { focus: Focus; boxes?: boolean; onFocus: (focus: Focus) => void; zoom?: number }) {
  return <div className={styles.photo}>
    <div className={styles.photoPlane} style={{ "--zoom": zoom } as CSSProperties}>
      <img src={source} alt="Pembe ışıklı stüdyoda koyu gri sedan; plaka 06 DCC 821" draggable={false} />
      {boxes && <>
        <button className={`${styles.vehicleBox} ${focus === "vehicle" ? styles.selectedBox : ""}`} aria-label="Aracı incele" onClick={() => onFocus("vehicle")}><span>ARAÇ</span></button>
        <button className={`${styles.plateBox} ${focus === "plate" ? styles.selectedBox : ""}`} aria-label="Plakayı incele" onClick={() => onFocus("plate")}><span>PLAKA</span></button>
      </>}
    </div>
  </div>;
}

export function AnalysisConcepts() {
  const [concept, setConcept] = useState<Concept>("canvas");
  const [focus, setFocus] = useState<Focus>("plate");
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(3);
  const current = concepts.find((item) => item.id === concept)!;
  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setPhase((value) => {
        if (value >= 3) return value;
        return value + 1;
      });
    }, 850);
    const end = window.setTimeout(() => setPlaying(false), 3000);
    return () => { window.clearInterval(timer); window.clearTimeout(end); };
  }, [playing]);
  const replay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(3); return; }
    setPhase(0); setPlaying(true);
  };
  const select = (id: Concept) => { setConcept(id); setPlaying(false); setPhase(3); };

  return <main className={styles.root}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/">VEHICLE<br />VISION<span /></Link>
      <nav className={styles.switcher} aria-label="Tasarım konseptleri">
        {concepts.map((item) => <button key={item.id} aria-pressed={concept === item.id} onClick={() => select(item.id)}><b>{item.letter}</b><span>{item.name}</span></button>)}
      </nav>
      <span className={styles.demoBadge}>TASARIM PROTOTİPİ</span>
    </header>

    {concept === "canvas" ? <AnalysisEditor /> : <section className={`${styles.scene} ${styles[concept]}`} aria-label={current.name}>
      {concept === "stage" && <>
        <div className={styles.stageIntro}><h1>MORE<br />IN SIGHT.</h1><p>Bir fotoğraf.<br />Her bulgunun bir karşılığı.</p></div>
        <div className={styles.stagePhoto}><Photo focus={focus} onFocus={setFocus} /></div>
        <aside className={styles.stageAside}><div className={styles.focusLinks}><button aria-pressed={focus === "vehicle"} onClick={() => setFocus("vehicle")}>Araç</button><button aria-pressed={focus === "plate"} onClick={() => setFocus("plate")}>Plaka</button></div><Crop vehicle={focus === "vehicle"} /><Readout focus={focus} /></aside>
        <div className={styles.stageBottom}><span className={styles.accentDot} /> Görüntünün üzerinde bir bölge seç.</div>
      </>}

      {concept === "exploded" && <>
        <div className={styles.explodedTitle}><h1>ONE IMAGE.<br /><em>UNPACKED.</em></h1><button className={styles.action} onClick={replay} disabled={playing}>{playing ? "Analiz açılıyor…" : "Analizi oynat"}<Arrow /></button></div>
        <div className={styles.evidenceFlow} data-phase={phase}>
          <figure className={styles.sourceEvidence}><Photo focus={focus} boxes={false} onFocus={setFocus} /><figcaption>Kaynak görüntü <span>1122 × 1402</span></figcaption></figure>
          <div className={styles.extractedEvidence}><button className={styles.evidenceButton} onClick={() => setFocus("vehicle")} aria-pressed={focus === "vehicle"}><Crop vehicle /><span>Araç bölgesi <Arrow /></span></button><div className={styles.bodyWord}>SEDAN<span>Koyu gri / binek</span></div></div>
          <div className={styles.plateEvidence}><button className={styles.evidenceButton} onClick={() => setFocus("plate")} aria-pressed={focus === "plate"}><Crop /><span>Plaka bölgesi <Arrow /></span></button><strong className={styles.plateWord}>06 DCC 821</strong><p>Fotoğraftan bölgeye.<br />Bölgeden okunabilir sonuca.</p></div>
        </div>
        <div className={styles.sequenceStatus} aria-live="polite">{["Kaynak görüntü hazır.", "Araç bölgesi ayrıldı.", "Plaka bölgesi ayrıldı.", "Örnek analiz tamamlandı."][phase]}<span>Seçili bulgu: {focus === "plate" ? "06 DCC 821" : "Sedan"}</span></div>
      </>}

    </section>}
    <footer className={styles.footer}><div><b>{current.letter} / {current.name}</b><p>{current.description}</p></div><span>Örnek sonuçlar · Canlı analiz bağlantısı yok</span></footer>
  </main>;
}
